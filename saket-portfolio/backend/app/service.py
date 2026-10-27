"""The chat pipeline, independent of HTTP so it can be tested directly.

    question -> small talk? -> BM25 retrieval -> relevance gate (refuse; the model is never called)
             -> DeepSeek, told to answer only from the retrieved chunks -> citation check -> answer
"""

from __future__ import annotations

import time
from dataclasses import dataclass

from .llm import Completer, UpstreamError, verify_answer
from .retrieval import REFUSAL, Hit, Retriever, is_grounded, small_talk
from .schemas import ChatResponse, Outcome, QuestionEvent, Source


@dataclass
class ChatResult:
    event: QuestionEvent
    response: ChatResponse | None = None
    error_status: int | None = None
    error_message: str = ""


class ChatService:
    def __init__(self, retriever: Retriever, completer: Completer | None, top_k: int = 6):
        self.retriever = retriever
        self.completer = completer  # None when no API key is configured
        self.top_k = top_k

    @staticmethod
    def _sources(hits: list[Hit]) -> list[Source]:
        return [
            Source(id=h.chunk.id, title=h.chunk.title, source=h.chunk.source, score=round(h.score, 2)) for h in hits
        ]

    async def answer(self, question: str) -> ChatResult:
        started = time.perf_counter()

        def event(outcome: Outcome, hits: list[Hit] | None = None) -> QuestionEvent:
            return QuestionEvent(
                question=question,
                outcome=outcome,
                top_score=round(hits[0].score, 2) if hits else None,
                top_ids=[h.chunk.id for h in (hits or [])[:3]],
                latency_ms=int((time.perf_counter() - started) * 1000),
            )

        chat = small_talk(question)
        if chat:
            return ChatResult(event(Outcome.SMALLTALK), ChatResponse(answer=chat, grounded=False))

        hits = self.retriever.search(question, self.top_k)
        if not is_grounded(question, hits):
            return ChatResult(event(Outcome.REFUSED_RETRIEVAL, hits), ChatResponse(answer=REFUSAL, grounded=False))

        if self.completer is None:
            return ChatResult(event(Outcome.ERROR, hits), error_status=503, error_message="chat backend not configured")

        sources = self._sources(hits)
        try:
            raw = await self.completer(question, hits)
        except UpstreamError as e:
            return ChatResult(event(Outcome.ERROR, hits), error_status=e.status, error_message=str(e))

        answer = verify_answer(raw, {h.chunk.id for h in hits})
        if answer is None:
            return ChatResult(
                event(Outcome.REFUSED_MODEL, hits), ChatResponse(answer=REFUSAL, sources=sources, grounded=False)
            )
        return ChatResult(event(Outcome.ANSWERED, hits), ChatResponse(answer=answer, sources=sources, grounded=True))
