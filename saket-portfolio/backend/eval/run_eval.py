"""Retrieval evaluation: does the right chunk come back, and are off-topic questions refused?

    python -m backend.eval.run_eval

Each case in cases.json is either
    {"q": ..., "source": <optional file name>, "contains": <text the right chunk must contain>}
or  {"q": ..., "refuse": true}
A chunk is "relevant" when it matches every field given. Reported with pandas:
    hit@k  - share of answerable questions with a relevant chunk in the top k
    MRR    - mean reciprocal rank of the first relevant chunk
    refusal accuracy - share of off-topic questions that were refused without calling the model
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pandas as pd

from ..app.knowledge import load_chunks
from ..app.retrieval import Hit, Retriever, is_grounded, small_talk

CASES = Path(__file__).with_name("cases.json")
K = 6


def _relevant(hit: Hit, case: dict) -> bool:
    c = hit.chunk
    if "source" in case and c.source != case["source"]:
        return False
    return case.get("contains", "").lower() in c.text.lower()


def evaluate(retriever: Retriever, cases: list[dict], k: int = K) -> pd.DataFrame:
    rows = []
    for case in cases:
        q = case["q"]
        hits = retriever.search(q, k)
        grounded = is_grounded(q, hits)
        if case.get("refuse"):
            rows.append({"q": q, "kind": "refuse", "ok": not grounded and small_talk(q) is None, "rank": None})
            continue
        rank = next((i + 1 for i, h in enumerate(hits) if _relevant(h, case)), None)
        rows.append({"q": q, "kind": "answer", "ok": rank is not None and grounded, "rank": rank})
    return pd.DataFrame(rows)


def summarise(df: pd.DataFrame, k: int = K) -> dict[str, float]:
    ans = df[df["kind"] == "answer"]
    ref = df[df["kind"] == "refuse"]
    rr = ans["rank"].map(lambda r: 0.0 if pd.isna(r) else 1.0 / r)
    return {
        f"hit@{k}": float(ans["ok"].mean()) if len(ans) else 1.0,
        "hit@1": float((ans["rank"] == 1).mean()) if len(ans) else 1.0,
        "mrr": float(rr.mean()) if len(ans) else 1.0,
        "refusal_accuracy": float(ref["ok"].mean()) if len(ref) else 1.0,
    }


def main() -> int:
    retriever = Retriever(load_chunks())
    df = evaluate(retriever, json.loads(CASES.read_text(encoding="utf-8")))
    scores = summarise(df)
    print(pd.Series(scores).round(3).to_string())
    failed = df[~df["ok"]]
    if len(failed):
        print("\nfailing cases:")
        print(failed.to_string(index=False))
    return 0 if len(failed) == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
