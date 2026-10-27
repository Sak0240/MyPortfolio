"""Typed contracts for everything that crosses a boundary: the HTTP API, the knowledge base file,
the LLM answer and the analytics log."""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator

MAX_QUESTION = 300
DOC_ID = r"^DOC-\d{1,3}$"


# ---------- knowledge base ----------
class KnowledgeChunk(BaseModel):
    """One retrievable passage. `id` is what the model cites, e.g. [DOC-7]."""

    model_config = ConfigDict(frozen=True)

    id: Annotated[str, StringConstraints(pattern=DOC_ID)]
    source: Annotated[str, StringConstraints(min_length=1, max_length=120)]
    title: Annotated[str, StringConstraints(min_length=1, max_length=120)]
    text: Annotated[str, StringConstraints(min_length=20, max_length=3000)]


# ---------- HTTP API ----------
class ChatRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")  # the client may send a question and nothing else

    question: str = Field(min_length=1, max_length=MAX_QUESTION)
    # the visitor's previous question, so "tell me more" / "and his education?" can be understood
    previous: str | None = Field(default=None, max_length=MAX_QUESTION)

    @staticmethod
    def _clean(v: str) -> str:
        v = "".join(ch if ch.isprintable() or ch in "\n\t" else " " for ch in v)  # no control characters
        return " ".join(v.split())

    @field_validator("question")
    @classmethod
    def clean_question(cls, v: str) -> str:
        v = cls._clean(v)
        if not v:
            raise ValueError("question is empty")
        return v

    @field_validator("previous")
    @classmethod
    def clean_previous(cls, v: str | None) -> str | None:
        return (cls._clean(v) or None) if v is not None else None


class Source(BaseModel):
    id: str
    title: str
    source: str
    score: float


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source] = Field(default_factory=list)
    grounded: bool
    suggestions: list[str] = Field(default_factory=list)  # questions the documents can answer, as next steps
    # which path the question took: answered | smalltalk | refused_retrieval | refused_model (shown in the "how it works" panel)
    route: str = ""


# ---------- analytics ----------
class Outcome(str, Enum):
    ANSWERED = "answered"  # model answered from the retrieved context, citations verified
    SMALLTALK = "smalltalk"  # greeting / thanks, canned reply
    REFUSED_RETRIEVAL = "refused_retrieval"  # nothing relevant in the documents; the model was never called
    REFUSED_MODEL = "refused_model"  # model said NOT_IN_DOCS, or its answer failed citation checks
    ERROR = "error"  # upstream failure or timeout


class QuestionEvent(BaseModel):
    """One logged question. No IP address, no user agent: only what is needed to improve the documents."""

    ts: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    question: str
    outcome: Outcome
    top_score: float | None = None
    top_ids: list[str] = Field(default_factory=list)
    latency_ms: int = 0
