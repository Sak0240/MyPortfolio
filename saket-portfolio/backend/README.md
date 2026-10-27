# Backend (Python)

FastAPI service behind the portfolio terminal. It answers questions **only** from Saket's own documents
(`public/resume.pdf` + `knowledge/`) and refuses everything else.

```
browser terminal ──POST {question}──▶ /api/chat   (Vercel Python function: api/index.py → backend/app)
                                         │
              Pydantic validation  ◀─────┤  1-300 chars, no extra fields, control characters stripped
              origin check + rate limit  │  allowlist (+ any localhost port), 10 requests / minute / IP
              small talk?  ──────────────┤  "hi", "thanks" → canned reply, no model call
              BM25 retrieval ────────────┤  backend/data/knowledge.json (chunks DOC-1…DOC-n)
              relevance gate ────────────┤  off-topic → refusal, the model is never called
              DeepSeek (answer ONLY from │  retrieved chunks, cite [DOC-n], else NOT_IN_DOCS)
              citation check  ───────────┤  NOT_IN_DOCS / no citation / invented [DOC-n] → refusal
              answer + sources  ◀────────┘  question + outcome logged (no IP, no user agent)
```

## Layout

| Path | Purpose |
|---|---|
| `app/main.py` | FastAPI app factory (`create_app`), routes `/api/chat`, `/api/health` |
| `app/schemas.py` | Pydantic models: request, response, knowledge chunk, analytics event |
| `app/retrieval.py` | BM25 index, synonyms, relevance gate, small talk, "tell me about Saket" handling |
| `app/llm.py` | System prompt, DeepSeek client (httpx), citation verification |
| `app/service.py` | The pipeline above, independent of HTTP |
| `app/analytics.py` | Question logging: stdout JSON lines (always) + Postgres (if `DATABASE_URL`) |
| `app/security.py`, `app/config.py` | Rate limiter; settings from environment variables |
| `ingest.py` | pandas pipeline that builds `data/knowledge.json` |
| `analytics_report.py` | pandas report of logged questions |
| `eval/` | Retrieval quality cases + runner (hit@k, MRR, refusal accuracy) |
| `tests/` | pytest suite |

## Everyday commands (from `saket-portfolio/`)

```bash
python -m venv .venv && .venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt

python -m backend.ingest            # after editing knowledge/ or public/resume.pdf: rebuild knowledge.json
python -m backend.ingest --check    # CI: fails if knowledge.json is stale
python -m pytest                    # unit + API + retrieval-quality tests (no network, no API key)
python -m backend.eval.run_eval     # retrieval scores and any failing cases

uvicorn backend.app.main:app --reload --port 8000     # run locally (needs DEEPSEEK_API_KEY to call the model)
```

To use the local backend from the dev site, put `VITE_CHAT_API=http://localhost:8000/api/chat` in `.env.local`.

**Commit `backend/data/knowledge.json` after re-running ingest** — the deployed function reads it.
`knowledge/` and the resume text are public (the repository is public); the ingest step replaces phone
numbers with `[phone omitted]`.

## Question analytics

Every question is logged as `{"event": "chat_question", "question", "outcome", "top_score", "top_ids", "latency_ms", "ts"}`.
It shows which questions your documents could not answer, so you know what to write next.

```bash
# from the Vercel function logs: export the log lines to a file, then
python -m backend.analytics_report vercel-logs.txt

# or, with a Postgres database (set DATABASE_URL on Vercel; the table is created automatically)
python -m backend.analytics_report --database-url "postgresql://..."
```

## Deploy

Vercel (Root Directory `saket-portfolio`) builds the Vite site and the Python function from `vercel.json`.
Set `DEEPSEEK_API_KEY` in the Vercel dashboard. `pandas`, `pypdf` and `python-docx` are build-time tools only
(`requirements-dev.txt`); the function installs just `requirements.txt`.
