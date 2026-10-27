"""FastAPI app for the portfolio chatbot.

Deployed as a Vercel Python function (see api/index.py); run locally with
    uvicorn backend.app.main:app --reload --port 8000
"""

from __future__ import annotations

from fastapi import BackgroundTasks, FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .analytics import EventLog, build_event_log
from .config import LOCAL_ORIGIN, Settings, get_settings
from .knowledge import get_chunks
from .llm import Completer, make_deepseek_completer
from .retrieval import Retriever
from .schemas import ChatRequest, ChatResponse
from .security import RateLimiter
from .service import ChatService


def create_app(
    settings: Settings | None = None,
    completer: Completer | None = None,
    event_log: EventLog | None = None,
    retriever: Retriever | None = None,
) -> FastAPI:
    """Build the app. Every collaborator can be injected, which is how the tests run it offline."""
    settings = settings or get_settings()
    retriever = retriever or Retriever(list(get_chunks()))
    if completer is None and settings.deepseek_api_key:
        completer = make_deepseek_completer(settings)
    service = ChatService(retriever, completer, settings.top_k)
    events = event_log or build_event_log(settings)
    limiter = RateLimiter(settings.rate_limit_per_minute)

    app = FastAPI(title="Saket portfolio chat API", docs_url=None, redoc_url=None, openapi_url=None)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.allowed_origins),
        allow_origin_regex=LOCAL_ORIGIN.pattern,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type"],
    )

    @app.exception_handler(RequestValidationError)
    async def invalid_request(_: Request, __: RequestValidationError) -> JSONResponse:
        return JSONResponse({"error": "invalid request"}, status_code=400)

    @app.get("/api/health")
    async def health() -> dict[str, object]:
        return {"status": "ok", "chunks": len(retriever.chunks), "llm_configured": completer is not None}

    @app.post("/api/chat", response_model=ChatResponse)
    async def chat(body: ChatRequest, request: Request, background: BackgroundTasks) -> ChatResponse | JSONResponse:
        origin = request.headers.get("origin", "")
        if origin and not settings.origin_allowed(origin):
            return JSONResponse({"error": "origin not allowed"}, status_code=403)

        forwarded = request.headers.get("x-forwarded-for", "")
        ip = forwarded.split(",")[0].strip() or (request.client.host if request.client else "unknown")
        if not limiter.allow(ip):
            return JSONResponse({"error": "too many requests"}, status_code=429)

        result = await service.answer(body.question)
        background.add_task(events.record, result.event)
        if result.response is None:
            return JSONResponse({"error": result.error_message}, status_code=result.error_status or 502)
        return result.response

    return app


app = create_app()
