from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from backend.app.analytics import EventLog
from backend.app.config import Settings
from backend.app.llm import UpstreamError
from backend.app.main import create_app
from backend.app.retrieval import Hit, Retriever
from backend.app.schemas import KnowledgeChunk, QuestionEvent

CHUNKS = [
    KnowledgeChunk(
        id="DOC-1",
        source="Resume",
        title="Summary",
        text="Summary\nAI engineer in Pune building retrieval augmented generation systems with LangGraph and FastAPI.",
    ),
    KnowledgeChunk(
        id="DOC-2",
        source="catalogsage.md",
        title="CatalogSage - product catalog assistant",
        text="CatalogSage answers natural language questions about a catalog of 300 SKUs using BM25 and embeddings.",
    ),
    KnowledgeChunk(
        id="DOC-3",
        source="Resume",
        title="Education",
        text="Education\nBachelor of Engineering in Computer Engineering, Savitribai Phule Pune University, 2023.",
    ),
]


class RecordingSink:
    def __init__(self) -> None:
        self.events: list[QuestionEvent] = []

    def write(self, event: QuestionEvent) -> None:
        self.events.append(event)


class FakeLLM:
    """Stands in for DeepSeek: returns a canned reply (or raises) and remembers what it was asked."""

    def __init__(self, reply: str = "Saket built CatalogSage [DOC-2].", error: UpstreamError | None = None):
        self.reply = reply
        self.error = error
        self.calls: list[tuple[str, list[Hit]]] = []

    async def __call__(self, question: str, hits: list[Hit]) -> str:
        self.calls.append((question, hits))
        if self.error:
            raise self.error
        return self.reply


@pytest.fixture
def chunks() -> list[KnowledgeChunk]:
    return list(CHUNKS)


@pytest.fixture
def retriever(chunks) -> Retriever:
    return Retriever(chunks)


@pytest.fixture
def sink() -> RecordingSink:
    return RecordingSink()


@pytest.fixture
def llm() -> FakeLLM:
    return FakeLLM()


@pytest.fixture
def make_client(retriever, sink):
    def _make(llm: FakeLLM | None, rate: int = 100) -> TestClient:
        settings = Settings(rate_limit_per_minute=rate)
        app = create_app(settings=settings, completer=llm, event_log=EventLog([sink]), retriever=retriever)
        return TestClient(app)

    return _make


@pytest.fixture
def client(make_client, llm) -> TestClient:
    return make_client(llm)
