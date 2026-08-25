export const CORPUS = [
  {
    id: "DOC-1",
    tag: "role",
    title: "Current role — KWAD Corporation",
    keywords: ["kwad", "compliance", "financial", "agentic", "rag", "b2b", "transaction", "tenant", "guardrails", "escalation", "current", "job", "work"],
    text:
      "At KWAD Corporation (Apr 2025–Present) Saket works as an AI Engineer building an AI Compliance & Financial Operations Copilot. He designed an agentic RAG system with LangChain and LangGraph for natural-language investigation of B2B transaction and compliance data, with multi-step workflows for conditional routing, retrieval, response generation, and human-in-the-loop escalation on complex queries. He implemented tenant-isolated retrieval, grounded responses with source citations, and input/output guardrails to prevent unsupported or unsafe requests from reaching downstream components. Deployed on Kubernetes with Docker and Helm, GitHub Actions CI/CD, and LangSmith for tracing and evaluation.",
  },
  {
    id: "DOC-2",
    tag: "role",
    title: "Previous role — Briowin Private Limited",
    keywords: ["briowin", "catalogsage", "catalog", "product", "recommendation", "software engineer", "previous", "history"],
    text:
      "At Briowin Private Limited (Feb 2024–Apr 2025) Saket worked as a Software Engineer building CatalogSage, an AI-powered product catalog assistant. He built a RAG assistant enabling natural-language search and recommendations across a 300+ SKU catalog using Python, FastAPI, LangGraph, and OpenAI, with a LangGraph workflow covering conditional routing, hybrid retrieval, response generation, output validation, and graceful fallback.",
  },
  {
    id: "DOC-3",
    tag: "skill",
    title: "Retrieval systems — hybrid search and RRF",
    keywords: ["retrieval", "rag", "faiss", "bm25", "hybrid", "rrf", "reciprocal", "rank", "fusion", "embeddings", "vector", "search", "semantic"],
    text:
      "Saket's retrieval work centers on hybrid search: combining OpenAI embeddings with FAISS for semantic search and BM25 for keyword search, then merging the two ranked lists with Reciprocal Rank Fusion (RRF) to improve result quality over either method alone. This hybrid retrieval powered CatalogSage's product search at Briowin.",
  },
  {
    id: "DOC-4",
    tag: "skill",
    title: "Agentic workflows and LangGraph",
    keywords: ["agentic", "agent", "langgraph", "langchain", "workflow", "routing", "multi-step", "orchestration"],
    text:
      "Saket builds agentic systems with LangChain and LangGraph — multi-step graphs with conditional routing, retrieval, generation, validation, fallback paths, and human-in-the-loop escalation for complex or high-risk queries. He treats routing logic as the difference between a demo and something safe to run against real compliance and financial data.",
  },
  {
    id: "DOC-5",
    tag: "skill",
    title: "Evaluation, guardrails and grounding",
    keywords: ["evaluation", "eval", "trulens", "langsmith", "guardrails", "grounding", "groundedness", "citation", "safety", "hallucination", "reliability"],
    text:
      "Saket builds evaluation into every RAG system he ships: TruLens for measuring groundedness, context relevance, and answer relevance; LangSmith for tracing and debugging. He pairs this with input/output guardrails and source citations so answers are traceable and unsupported responses get caught before reaching a user.",
  },
  {
    id: "DOC-6",
    tag: "project",
    title: "Self-hosted LLM inference platform",
    keywords: ["inference", "vllm", "eks", "kubernetes", "terraform", "gpu", "self-hosted", "infrastructure", "deploy", "serving"],
    text:
      "Saket built and deployed a self-hosted LLM inference platform on AWS EKS, using Docker and vLLM for GPU-accelerated model serving, with Terraform provisioning the underlying VPC, IAM, and Kubernetes infrastructure — used for cases where routing to a third-party API isn't the right call on cost, latency, or data residency.",
  },
  {
    id: "DOC-7",
    tag: "skill",
    title: "Cloud, containers and CI/CD",
    keywords: ["aws", "azure", "docker", "kubernetes", "helm", "terraform", "ansible", "cicd", "github actions", "jenkins", "gitlab", "devops", "cloud", "infrastructure"],
    text:
      "Saket works across the full deployment stack for AI applications: AWS and Azure, Docker and Kubernetes with Helm charts, Terraform and Ansible for infrastructure as code, and CI/CD through GitHub Actions, Jenkins, and GitLab CI. Observability comes from LangSmith, Prometheus, Grafana, and AWS CloudWatch.",
  },
  {
    id: "DOC-8",
    tag: "profile",
    title: "Background and education",
    keywords: ["education", "degree", "university", "pune", "background", "who", "about", "experience years", "location"],
    text:
      "Saket Deshmukh is a GenAI Engineer based in Pune, Maharashtra, India, with 2.5+ years of experience shipping production-grade LLM applications. He holds a B.E. in Computer Engineering from Savitribai Phule Pune University (2019–2023). He specializes in RAG pipelines, agentic workflows, and LLM evaluation, and works across the full stack from prompt to production infrastructure.",
  },
  {
    id: "DOC-9",
    tag: "project",
    title: "Real-time product review summarizer & sentiment analysis",
    keywords: ["nlp", "sentiment", "review", "summarization", "tfidf", "tf-idf", "random forest", "classification", "mysql", "university", "student", "early"],
    text:
      "During his time at Savitribai Phule Pune University (Aug 2022–Feb 2023), Saket built an NLP-based system to automatically summarize customer product reviews and classify sentiment. He processed 10,000+ product reviews in Python, using text preprocessing, TF-IDF vectorization, automated summarization, and a Random Forest classifier that reached roughly 90% classification accuracy, with MySQL storing and managing review data. The system cut manual review analysis effort by about 60%.",
  },
  {
    id: "DOC-10",
    tag: "project",
    title: "Cloud SQL performance analyzer",
    keywords: ["sql", "java", "spring boot", "react", "mysql", "performance", "optimization", "indexing", "query", "database", "fullstack", "full-stack"],
    text:
      "Saket built a full-stack SQL performance analysis platform using Java, Spring Boot, React, and MySQL to analyze and optimize SQL queries across large datasets. He designed RESTful APIs for query execution, execution plan analysis, and optimization recommendations using indexing, joins, normalization, and query restructuring. The result was roughly a 30% improvement in query execution performance through indexing strategies and execution plan analysis, built on clean architecture principles.",
  },
];

