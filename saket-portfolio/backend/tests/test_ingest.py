import json

import pandas as pd
import pytest

from backend import ingest
from backend.app.knowledge import load_chunks
from backend.app.schemas import KnowledgeChunk

MD = """# Demo Project

## Overview
Demo is a document assistant for clinical records, built with Python and FastAPI for a hospital team.

## Architecture
### 1. Upload
The user uploads a PDF and the backend stores it safely in object storage with a checksum.

### 2. Extract
Text is extracted and validated against a schema before anything is saved to the database.
"""

RESUME_LIKE = """Saket Deshmukh
Phone +91-7666114965 heyiamsaket@gmail.com
SUMMARY
Software engineer building GenAI systems with retrieval and agents in production.
EXPERIENCE
Acme Corp – Platform Engineer
Jan 2022 – Present
• Built an agentic RAG assistant on LangGraph
that answers compliance questions with citations.
• Reduced review time by 40% for operations teams.
"""


def test_generic_chunking_merges_sections_and_keeps_headings():
    chunks = ingest.generic_chunks(MD, "demo.md")
    assert all(c["source"] == "demo.md" for c in chunks)
    assert chunks[0]["title"].startswith("Demo Project")
    text = "\n".join(c["text"] for c in chunks)
    assert "## Architecture › 1. Upload" in text  # an H3 keeps its H2 parent
    assert max(len(c["text"]) for c in chunks) <= ingest.MAX_CHUNK + 200


def test_long_sections_are_split_below_the_limit():
    long = "# Doc\n\n## Big\n" + " ".join(f"Sentence number {i} says something useful." for i in range(200))
    chunks = ingest.generic_chunks(long, "big.md")
    assert len(chunks) > 1
    assert all(len(c["text"]) <= ingest.MAX_CHUNK + 200 for c in chunks)


def test_structured_chunking_follows_resume_sections():
    chunks = ingest.structured_chunks(RESUME_LIKE, "Resume")
    titles = [c["title"] for c in chunks]
    assert any("Summary" in t for t in titles)
    exp = next(c for c in chunks if "Reduced review time" in c["text"])
    assert "LangGraph that answers compliance questions" in exp["text"]  # wrapped bullet re-joined
    assert exp["text"].startswith("Experience")


def test_pdf_cleanup_repairs_spaced_small_caps_headings_and_glued_dates():
    assert ingest.clean_pdf_text("A W ARDS\n• Prize") == "AWARDS\n• Prize"
    assert ingest.clean_pdf_text("S KILLS") == "SKILLS"
    assert ingest.clean_pdf_text("PROFESSIONAL EXPERIENCE") == "PROFESSIONAL EXPERIENCE"
    assert "Engineer Apr 2025" in ingest.clean_pdf_text("EngineerApr 2025")


def test_pdf_pieces_are_joined_like_text_not_glued_or_over_split():
    needs = ingest._needs_space
    assert needs("AI Engineer with", "2.5+ years")  # separate style runs on one line -> a space
    assert not needs("52%", ".")  # punctuation hugs the previous word
    assert not needs("A", "W")  # kerned single-letter pieces stay inside one word
    assert not needs("production-", "ready")
    assert not needs("ends with space ", "next")


def test_the_real_resume_has_clean_spacing():
    text = ingest.clean_pdf_text(ingest.read_pdf(ingest.RESUME))
    assert "with 2.5+ years" in text
    assert "production agentic RAG system" in text
    assert "AWARDS" in text
    assert "52% ." not in text and "A W" not in text


def test_phone_numbers_are_redacted_and_ids_assigned():
    df = pd.DataFrame(
        [
            {"source": "Resume", "title": "Header", "text": "Pune, India — +91-7666114965 — heyiamsaket@gmail.com"},
            {"source": "a.md", "title": "Skills", "text": "Python, FastAPI and pandas for the data pipeline."},
        ]
    )
    out = ingest.clean_and_validate(df)
    assert list(out["id"]) == ["DOC-1", "DOC-2"]
    assert "7666114965" not in out["text"].iloc[0]
    assert "[phone omitted]" in out["text"].iloc[0]
    assert "heyiamsaket@gmail.com" in out["text"].iloc[0]  # email is public on the site


def test_duplicate_passages_are_dropped():
    same = "Python, FastAPI and pandas for the data pipeline."
    df = pd.DataFrame(
        [
            {"source": "a.md", "title": "Skills", "text": same},
            {"source": "b.md", "title": "Skills copy", "text": same.upper()},
        ]
    )
    assert len(ingest.clean_and_validate(df)) == 1


def test_invalid_chunks_fail_loudly():
    df = pd.DataFrame([{"source": "a.md", "title": "T", "text": "too short"}])
    with pytest.raises(ValueError, match="invalid chunk DOC-1"):
        ingest.clean_and_validate(df)


def test_instruction_and_question_only_files_are_skipped(tmp_path):
    (tmp_path / "knowledge").mkdir()
    k = tmp_path / "knowledge"
    for name in ("profile.md", "portfolio_chatbot_system_prompt.txt", "portfolio_faq.md", "_draft.md", "README.md"):
        (k / name).write_text("# T\n\nsome text that is long enough to count", encoding="utf-8")
    assert list(ingest.discover_sources(tmp_path)["label"]) == ["profile.md"]


def test_the_committed_knowledge_file_is_valid_and_current():
    chunks = load_chunks()
    assert len(chunks) > 10
    assert all(isinstance(c, KnowledgeChunk) for c in chunks)
    payload = ingest.to_json(ingest.build_knowledge())
    assert json.loads(payload) == json.loads(ingest.OUT.read_text(encoding="utf-8")), (
        "backend/data/knowledge.json is stale: run `python -m backend.ingest`"
    )


def test_no_phone_number_ships_in_the_knowledge_base():
    assert "7666114965" not in ingest.OUT.read_text(encoding="utf-8")
