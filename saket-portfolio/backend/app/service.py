"""The chat pipeline, independent of HTTP so it can be tested directly.

    question -> small talk? -> BM25 retrieval (understanding follow-ups) -> relevance gate
             (refuse; the model is never called) -> DeepSeek, told to answer only from the
             retrieved chunks -> citation check -> clean answer + sources + next-question ideas
"""

from __future__ import annotations

import time
from dataclasses import dataclass

from .llm import Completer, UpstreamError, strip_citations, verify_answer
from .retrieval import REFUSAL, Hit, Retriever, asks_about_organization, is_follow_up, is_grounded, refers_back, small_talk
from .schemas import ChatResponse, Outcome, QuestionEvent, Source
from .suggestions import STARTERS, suggestions_for


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

    def _retrieve(self, question: str, previous: str | None) -> tuple[list[Hit], str, bool]:
        """Returns (hits, query used, whether the previous question was needed to understand this one)."""
        if previous and is_follow_up(question):
            # "tell me more" says nothing by itself: search for what the visitor asked about before
            hits = self.retriever.search(f"{previous} {question}", self.top_k)
            return hits, previous, True
        hits = self.retriever.search(question, self.top_k)
        if previous and refers_back(question) and not is_grounded(question, hits):
            # "why did he choose it?" / "and the second one?" only make sense with the earlier question.
            # Relevance is judged by the earlier question, which was already answerable on its own.
            retry = self.retriever.search(f"{previous} {question}", self.top_k)
            if is_grounded(previous, retry):
                return retry, previous, True
        return hits, question, False

    async def answer(self, question: str, previous: str | None = None) -> ChatResult:
        started = time.perf_counter()

        def event(outcome: Outcome, hits: list[Hit] | None = None) -> QuestionEvent:
            return QuestionEvent(
                question=question,
                outcome=outcome,
                top_score=round(hits[0].score, 2) if hits else None,
                top_ids=[h.chunk.id for h in (hits or [])[:3]],
                latency_ms=int((time.perf_counter() - started) * 1000),
            )

        def reply(text: str, outcome: Outcome, hits: list[Hit] | None = None, **fields) -> ChatResult:
            suggestions = suggestions_for(hits, question) if hits else STARTERS
            return ChatResult(event(outcome, hits), ChatResponse(answer=text, suggestions=suggestions, **fields))

        chat = small_talk(question)
        if chat:
            return reply(chat, Outcome.SMALLTALK, grounded=False)

        hits, query, used_previous = self._retrieve(question, previous)
        if not is_grounded(query, hits):
            return reply(REFUSAL, Outcome.REFUSED_RETRIEVAL, grounded=False)

        if self.completer is None:
            return ChatResult(event(Outcome.ERROR, hits), error_status=503, error_message="chat backend not configured")

        sources = self._sources(hits)
        asked = f"(The visitor's earlier question was: {previous})\n{question}" if used_previous else question
        if asks_about_organization(question):
            asked += (
                "\n(The visitor is asking about the organization itself, not about Saket's role there. Use only what "
                "the CONTEXT says about the organization itself; if it only describes Saket's work there, say the "
                "documents do not describe the organization.)"
            )
        try:
            raw = await self.completer(asked, hits)
        except UpstreamError as e:
            return ChatResult(event(Outcome.ERROR, hits), error_status=e.status, error_message=str(e))

        answer = verify_answer(raw, {h.chunk.id for h in hits})
        if answer is None:
            return reply(REFUSAL, Outcome.REFUSED_MODEL, grounded=False, sources=sources)
        # citations were needed to prove the answer is grounded; visitors see clean prose (sources are separate)
        return reply(strip_citations(answer), Outcome.ANSWERED, hits, grounded=True, sources=sources)
