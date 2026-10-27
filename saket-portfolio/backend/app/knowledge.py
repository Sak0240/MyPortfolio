"""Loads and validates the knowledge base written by `python -m backend.ingest`."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from pydantic import TypeAdapter

from .config import KNOWLEDGE_FILE
from .schemas import KnowledgeChunk

_chunks = TypeAdapter(list[KnowledgeChunk])


def load_chunks(path: Path = KNOWLEDGE_FILE) -> list[KnowledgeChunk]:
    chunks = _chunks.validate_python(json.loads(path.read_text(encoding="utf-8")))
    ids = [c.id for c in chunks]
    if len(set(ids)) != len(ids):
        raise ValueError(f"duplicate chunk ids in {path.name}")
    return chunks


@lru_cache(maxsize=1)
def get_chunks() -> tuple[KnowledgeChunk, ...]:
    return tuple(load_chunks())
