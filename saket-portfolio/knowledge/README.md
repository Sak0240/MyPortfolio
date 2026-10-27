# Knowledge base for the portfolio chatbot (RAG)

Everything the terminal chatbot is allowed to know comes from:

1. `public/resume.pdf` (your resume — updating it updates the bot), and
2. any `.pdf`, `.md`, `.txt`, or `.docx` file you drop into this `knowledge/` folder
   (project write-ups, case studies, notes, interview answers...).

After changing either, rebuild and commit the knowledge base:

```bash
python -m backend.ingest      # writes backend/data/knowledge.json
python -m pytest              # checks retrieval quality still holds
```

The bot answers **only** from these chunks and cites them (`[DOC-n]`); if the answer isn't in
your files it says so instead of guessing.

Tips
- Markdown with `#` headings chunks best; one topic per section.
- Files starting with `_`, this README, `*system_prompt*` files and `portfolio_faq.md` are ignored
  (instructions and question-only lists are not facts; the model's rules live in `backend/app/llm.py`).
- Phone numbers are replaced with `[phone omitted]` during ingestion.
- To see which questions visitors asked that your files couldn't answer, run
  `python -m backend.analytics_report` (see `backend/README.md`).
- **This repo is public** — only add things you are happy to publish.
