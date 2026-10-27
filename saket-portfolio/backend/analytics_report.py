"""Summarises logged questions with pandas: what visitors ask, what the documents cannot answer yet.

    python -m backend.analytics_report events.jsonl      # lines exported from the Vercel function logs
    python -m backend.analytics_report --database-url "$DATABASE_URL"

The export may contain other log lines; only `{"event": "chat_question", ...}` lines are read.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import pandas as pd

from .app.knowledge import load_chunks

REFUSED = ("refused_retrieval", "refused_model")
COLUMNS = ["ts", "question", "outcome", "top_score", "top_ids", "latency_ms"]


def parse_lines(lines: list[str]) -> pd.DataFrame:
    rows = []
    for line in lines:
        start = line.find("{")
        if start < 0 or "chat_question" not in line:
            continue
        try:
            obj = json.loads(line[start:])
        except json.JSONDecodeError:
            continue
        if obj.get("event") == "chat_question":
            rows.append({c: obj.get(c) for c in COLUMNS})
    df = pd.DataFrame(rows, columns=COLUMNS)
    return _typed(df)


def load_from_database(dsn: str) -> pd.DataFrame:
    import psycopg

    with psycopg.connect(dsn, connect_timeout=10) as conn:
        cur = conn.execute("SELECT ts, question, outcome, top_score, top_ids, latency_ms FROM question_events")
        df = pd.DataFrame(cur.fetchall(), columns=COLUMNS)
    return _typed(df)


def _typed(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["ts"] = pd.to_datetime(df["ts"], utc=True, errors="coerce")
    df["top_score"] = pd.to_numeric(df["top_score"], errors="coerce")
    df["latency_ms"] = pd.to_numeric(df["latency_ms"], errors="coerce")
    df["top_ids"] = df["top_ids"].map(lambda v: v if isinstance(v, list) else [])
    return df


def summarise(df: pd.DataFrame, chunk_ids: list[str] | None = None) -> dict[str, pd.DataFrame | pd.Series]:
    """Returns the report tables; `render` prints them. Kept separate so tests can assert on the numbers."""
    out: dict[str, pd.DataFrame | pd.Series] = {}
    out["outcomes"] = df["outcome"].value_counts()
    content = df[df["outcome"] != "smalltalk"]
    out["answer_rate"] = pd.Series({"answered": (content["outcome"] == "answered").mean() if len(content) else 0.0})

    answered = df[df["outcome"] == "answered"]
    out["latency_ms"] = (
        answered["latency_ms"].quantile([0.5, 0.95]).rename({0.5: "p50", 0.95: "p95"})
        if len(answered)
        else pd.Series(dtype=float)
    )

    unanswered = df[df["outcome"].isin(REFUSED)].copy()
    unanswered["q"] = unanswered["question"].str.lower().str.strip(" ?!.")
    out["unanswered"] = (
        unanswered.groupby("q")
        .agg(times=("q", "size"), outcome=("outcome", "first"), best_score=("top_score", "max"))
        .sort_values(["times", "best_score"], ascending=False)
    )

    cited = df.explode("top_ids")["top_ids"].dropna()
    out["top_chunks"] = cited.value_counts().rename("times_top3")
    if chunk_ids is not None:
        out["never_retrieved"] = pd.Series(sorted(set(chunk_ids) - set(cited), key=lambda s: int(s.split("-")[1])))
    out["per_day"] = df.dropna(subset=["ts"]).groupby(df["ts"].dt.date).size().rename("questions")
    return out


def render(tables: dict[str, pd.DataFrame | pd.Series], limit: int = 15) -> str:
    parts = []
    titles = {
        "outcomes": "Outcomes",
        "answer_rate": "Answer rate (excluding greetings)",
        "latency_ms": "Latency of answered questions (ms)",
        "unanswered": "Questions the documents could not answer (add these to knowledge/)",
        "top_chunks": "Chunks most often in the top 3",
        "never_retrieved": "Chunks never in a top 3 (candidates to improve or remove)",
        "per_day": "Questions per day",
    }
    for key, title in titles.items():
        if key in tables:
            t = tables[key]
            parts.append(f"== {title}\n{t.head(limit).to_string() if len(t) else '(none)'}")
    return "\n\n".join(parts)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("file", nargs="?", help="JSON-lines export of the function logs")
    p.add_argument("--database-url", help="read from the question_events table instead")
    args = p.parse_args(argv)
    if args.database_url:
        df = load_from_database(args.database_url)
    elif args.file:
        df = parse_lines(Path(args.file).read_text(encoding="utf-8").splitlines())
    else:
        p.error("give a log file or --database-url")
    if df.empty:
        print("no chat_question events found")
        return 0
    try:
        ids = [c.id for c in load_chunks()]
    except FileNotFoundError:
        ids = None
    print(f"{len(df)} questions\n")
    print(render(summarise(df, ids)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
