"""Suggested next questions, so visitors always have something useful to click.

Every question here is checked by the test suite: it must be answerable from the knowledge base.
"""

from __future__ import annotations

from .retrieval import Hit

STARTERS = [
    "What did Saket build at KWAD?",
    "Tell me about CatalogSage",
    "Which cloud tools does he use?",
    "Where did he study?",
]

_BY_SOURCE: dict[str, list[str]] = {
    "catalogsage_project.md": [
        "Why use hybrid retrieval in CatalogSage?",
        "What is the architecture of CatalogSage?",
        "What did Saket build at KWAD?",
    ],
    "clinical_ai_project.md": [
        "How does the clinical project handle handwriting?",
        "Why is human review important in the clinical project?",
        "Tell me about CatalogSage",
    ],
    "financial_ai_project.md": [
        "Explain the financial operations project architecture",
        "Why did he use LangGraph?",
        "How does the clinical project handle handwriting?",
    ],
    "Resume": [
        "What did Saket build at KWAD?",
        "Which cloud tools does he use?",
        "What awards has he won?",
    ],
    "experience.md": [
        "Tell me about CatalogSage",
        "Explain the financial operations project architecture",
        "Where did he study?",
    ],
    "profile.md": [
        "Which LLM platforms does he use?",
        "What did Saket build at KWAD?",
        "Where did he study?",
    ],
    "technical_skills.md": [
        "What is MCP?",
        "Why use hybrid retrieval?",
        "Which cloud tools does he use?",
    ],
    "interview_qa.md": [
        "How does he reduce hallucinations?",
        "What is prompt injection?",
        "What did Saket build at KWAD?",
    ],
    "project_decisions.md": [
        "Why use hybrid retrieval?",
        "How does he handle missing information?",
        "Tell me about CatalogSage",
    ],
}

ALL_SUGGESTIONS = sorted({q for qs in _BY_SOURCE.values() for q in qs} | set(STARTERS))


def suggestions_for(hits: list[Hit], asked: str, limit: int = 3) -> list[str]:
    """Follow-up ideas based on where the answer came from, never repeating the question just asked."""
    pool = list(_BY_SOURCE.get(hits[0].chunk.source, [])) if hits else []
    pool += STARTERS
    seen = {asked.strip().lower().rstrip("?!. ")}
    out: list[str] = []
    for q in pool:
        key = q.lower().rstrip("?!. ")
        if key not in seen:
            seen.add(key)
            out.append(q)
        if len(out) == limit:
            break
    return out
