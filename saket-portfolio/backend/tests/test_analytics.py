import json

from backend.analytics_report import parse_lines, summarise
from backend.app.analytics import EventLog, StdoutSink
from backend.app.schemas import Outcome, QuestionEvent


def event(q, outcome, score=3.0, ids=("DOC-1",), ms=900):
    return QuestionEvent(question=q, outcome=outcome, top_score=score, top_ids=list(ids), latency_ms=ms)


def test_stdout_sink_writes_one_parseable_json_line(capsys):
    EventLog([StdoutSink()]).record(event("what is catalogsage", Outcome.ANSWERED))
    line = capsys.readouterr().out.strip()
    obj = json.loads(line)
    assert obj["event"] == "chat_question"
    assert obj["question"] == "what is catalogsage"
    assert obj["outcome"] == "answered"
    assert "ip" not in obj  # no visitor identifiers are logged


def test_report_ranks_unanswered_questions_and_finds_dead_chunks(capsys):
    sink = StdoutSink()
    for e in [
        event("What is Terraform?", Outcome.REFUSED_RETRIEVAL, 0.0, ()),
        event("what is terraform", Outcome.REFUSED_RETRIEVAL, 0.0, ()),
        event("salary?", Outcome.REFUSED_MODEL, 1.2, ("DOC-3",)),
        event("what is catalogsage", Outcome.ANSWERED, 4.6, ("DOC-2", "DOC-1"), 1200),
        event("what is catalogsage", Outcome.ANSWERED, 4.6, ("DOC-2",), 2000),
        event("hi", Outcome.SMALLTALK, None, ()),
    ]:
        sink.write(e)
    lines = ["2026-10-27 12:00:01 INFO unrelated log line", *capsys.readouterr().out.splitlines()]
    df = parse_lines(lines)
    assert len(df) == 6

    t = summarise(df, ["DOC-1", "DOC-2", "DOC-3", "DOC-4"])
    assert t["outcomes"]["answered"] == 2
    assert round(t["answer_rate"]["answered"], 2) == 0.4  # 2 of 5 non-greeting questions
    assert t["unanswered"].index[0] == "what is terraform"
    assert t["unanswered"]["times"].iloc[0] == 2
    assert t["top_chunks"].index[0] == "DOC-2"
    assert list(t["never_retrieved"]) == ["DOC-4"]
    assert t["latency_ms"]["p50"] == 1600


def test_parse_ignores_garbage_lines():
    assert parse_lines(["", "not json {", '{"event": "other"}', 'x {"event": "chat_question", bad']).empty


def test_postgres_sink_creates_the_table_once_and_inserts_each_event(monkeypatch):
    """The SQL is exercised against a fake driver (no database is available in CI)."""
    import sys
    import types

    from backend.app.analytics import INSERT, PostgresSink

    calls = []

    class Conn:
        def __enter__(self):
            return self

        def __exit__(self, *exc):
            return False

        def execute(self, sql, params=None):
            calls.append((sql.split()[0], params))

    monkeypatch.setitem(sys.modules, "psycopg", types.SimpleNamespace(connect=lambda dsn, connect_timeout: Conn()))
    sink = PostgresSink("postgresql://example")
    sink.write(event("what is catalogsage", Outcome.ANSWERED))
    sink.write(event("hi", Outcome.SMALLTALK, None, ()))

    assert [c[0] for c in calls] == ["CREATE", "INSERT", "INSERT"]
    assert INSERT.count("%s") == len(calls[1][1]) == 6
    assert calls[1][1][1:3] == ("what is catalogsage", "answered")
