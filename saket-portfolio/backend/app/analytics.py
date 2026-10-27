"""Question logging, so you can see which questions your documents cannot answer yet.

Two sinks, chosen by configuration:
  - always: one JSON line per question on stdout (`{"event": "chat_question", ...}`), which shows up in
    the Vercel function logs and can be exported to a file for `backend.analytics_report`;
  - optionally: a Postgres table, when DATABASE_URL is set.

Logging must never break or slow a chat answer, so every sink swallows its own errors and the API
calls `record` from a background task.
"""

from __future__ import annotations

import json
import logging
import sys
from typing import Protocol

from .config import Settings
from .schemas import QuestionEvent

log = logging.getLogger("portfolio.analytics")

CREATE_TABLE = """
CREATE TABLE IF NOT EXISTS question_events (
    id          BIGSERIAL PRIMARY KEY,
    ts          TIMESTAMPTZ NOT NULL,
    question    TEXT NOT NULL,
    outcome     TEXT NOT NULL,
    top_score   DOUBLE PRECISION,
    top_ids     TEXT[] NOT NULL DEFAULT '{}',
    latency_ms  INTEGER NOT NULL
)
"""
INSERT = "INSERT INTO question_events (ts, question, outcome, top_score, top_ids, latency_ms) VALUES (%s,%s,%s,%s,%s,%s)"


class Sink(Protocol):
    def write(self, event: QuestionEvent) -> None: ...


class StdoutSink:
    def write(self, event: QuestionEvent) -> None:
        line = {"event": "chat_question", **json.loads(event.model_dump_json())}
        print(json.dumps(line, ensure_ascii=False), file=sys.stdout, flush=True)


class PostgresSink:
    """Optional. Needs `psycopg` (in requirements.txt) and DATABASE_URL."""

    def __init__(self, dsn: str):
        self.dsn = dsn
        self._ready = False

    def write(self, event: QuestionEvent) -> None:
        import psycopg  # imported lazily: only needed when a database is configured

        with psycopg.connect(self.dsn, connect_timeout=5) as conn:
            if not self._ready:
                conn.execute(CREATE_TABLE)
                self._ready = True
            conn.execute(
                INSERT,
                (event.ts, event.question, event.outcome.value, event.top_score, event.top_ids, event.latency_ms),
            )


class EventLog:
    def __init__(self, sinks: list[Sink]):
        self.sinks = sinks

    def record(self, event: QuestionEvent) -> None:
        for sink in self.sinks:
            try:
                sink.write(event)
            except Exception:  # noqa: BLE001 - analytics must never affect the user
                log.warning("analytics sink %s failed", type(sink).__name__, exc_info=True)


def build_event_log(settings: Settings) -> EventLog:
    sinks: list[Sink] = [StdoutSink()]
    if settings.database_url:
        sinks.append(PostgresSink(settings.database_url))
    return EventLog(sinks)
