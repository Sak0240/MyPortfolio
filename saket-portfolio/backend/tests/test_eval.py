"""Quality gate for retrieval over the real knowledge base: a change that hurts retrieval fails CI."""

import json

import pytest

from backend.app.knowledge import load_chunks
from backend.app.retrieval import Retriever
from backend.eval.run_eval import CASES, evaluate, summarise


@pytest.fixture(scope="module")
def results():
    df = evaluate(Retriever(load_chunks()), json.loads(CASES.read_text(encoding="utf-8")))
    return df, summarise(df)


def test_every_expected_chunk_is_retrieved(results):
    df, scores = results
    failed = df[(df["kind"] == "answer") & ~df["ok"]]
    assert failed.empty, f"retrieval misses: {list(failed['q'])}"
    assert scores["hit@6"] == 1.0


def test_the_right_chunk_is_usually_first(results):
    _, scores = results
    assert scores["mrr"] >= 0.7


def test_off_topic_questions_are_all_refused(results):
    df, scores = results
    assert scores["refusal_accuracy"] == 1.0, list(df[(df["kind"] == "refuse") & ~df["ok"]]["q"])
