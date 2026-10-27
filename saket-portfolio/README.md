# saket-portfolio

## About

I'm Saket, a Software Engineer based in Pune, India. I enjoy building software that doesn't just work on my machine, but can actually be deployed, scaled, and maintained in the real world.

My background is in cloud infrastructure and DevOps, and over time I've moved deeper into AI and GenAI engineering. I work across the stack — from writing code and building CI/CD pipelines to deploying applications on Kubernetes and experimenting with LLMs, RAG, and AI-powered systems.

This portfolio is a little different from a traditional resume. The terminal above is a small interactive demo built from my actual experience and projects. Try asking it something about me — it retrieves relevant parts of my resume and uses them to answer your question.

### What I like building

* Cloud-native applications and infrastructure
* CI/CD and DevOps automation
* Kubernetes and containerized workloads
* LLM and RAG applications
* AI-powered developer tools
* Systems that are simple, scalable, and easy to operate

Most of the things you'll find here are projects I've built, technologies I've worked with, or problems I've enjoyed solving.


## How it's built

- **Frontend:** React 18 + Vite (`src/`), deployed to GitHub Pages and Vercel.
- **Backend:** Python / FastAPI (`backend/`), deployed as a Vercel Python function (`api/index.py`). It
  powers the terminal chatbot: BM25 retrieval over my resume and notes, a relevance gate that refuses
  off-topic questions, DeepSeek constrained to the retrieved passages, and citation verification.
- **Data pipeline:** `python -m backend.ingest` (pandas) turns `public/resume.pdf` and `knowledge/` into
  `backend/data/knowledge.json`, validated with Pydantic.
- **Quality:** a pytest suite plus a retrieval evaluation (hit@k, MRR, refusal accuracy) run in CI.

See [`backend/README.md`](backend/README.md) for the architecture, commands and deployment notes.
