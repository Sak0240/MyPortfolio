# Knowledge base for the portfolio chatbot (RAG)

Everything the terminal chatbot is allowed to know comes from:

1. `public/resume.pdf` (your resume — updating it updates the bot), and
2. any `.pdf`, `.md`, `.txt`, or `.docx` file you drop into this `knowledge/` folder
   (project write-ups, case studies, FAQs, notes, interview answers...).

On every build (`npm run build`, Vercel, GitHub Actions) `scripts/ingest.mjs` splits these files
into chunks and writes `src/data/knowledge.js`. Run `npm run ingest` to refresh it locally.

The bot answers **only** from these chunks and cites them (`[DOC-n]`); if the answer isn't in
your files it says so instead of guessing.

Tips
- Markdown with `#` headings chunks best; one topic per section.
- Files starting with `_`, this README, `*system_prompt*` files and `portfolio_faq.md` are ignored
  (instructions and question-only lists are not facts; the model's rules live in `api/chat.js`).
- Phone numbers are replaced with `[phone omitted]` during ingestion.
- **This repo is public and the chunks ship inside the site** — only add things you are happy to publish.
