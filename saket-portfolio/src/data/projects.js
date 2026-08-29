export const PROJECTS = [
  {
    id: 1,
    name: "Product Assistant RAG",
    org: "Briowin — CatalogSage",
    tagline: "Natural-language product search across a 300+ SKU catalog.",
    description:
      "A RAG assistant for CatalogSage, Briowin's AI-powered product catalog tool, built with Python, FastAPI, LangGraph, and OpenAI. It combines FAISS semantic search with BM25 keyword search, merged via Reciprocal Rank Fusion, to power natural-language search and recommendations across a 300+ SKU catalog. The LangGraph workflow handles conditional routing, retrieval, generation, output validation, and graceful fallback end-to-end.",
    flow: ["QUERY", "VALIDATION", "HYBRID SEARCH — FAISS + BM25", "RRF", "LLM", "VALIDATION", "ANSWER"],
    tech: ["Python", "FastAPI", "LangGraph", "FAISS", "BM25", "OpenAI"],
  },
  {
    id: 2,
    name: "Agentic Compliance Copilot",
    org: "KWAD Corporation",
    tagline: "Multi-step agentic RAG for B2B transaction and compliance investigation.",
    description:
      "An agentic RAG system built with LangChain and LangGraph for natural-language investigation of B2B transaction and compliance data at KWAD Corporation. Multi-step workflows handle conditional routing, tenant-isolated retrieval, grounded generation with source citations, and human-in-the-loop escalation on high-risk queries. It's deployed on Kubernetes with Docker and Helm, GitHub Actions CI/CD, and LangSmith for tracing.",
    flow: ["INPUT", "CONDITIONAL ROUTING", "TENANT-ISOLATED RETRIEVAL", "GENERATION + CITATIONS", "GUARDRAILS", "HUMAN ESCALATION"],
    tech: ["LangChain", "LangGraph", "Kubernetes", "Helm", "LangSmith"],
  },
  {
    id: 3,
    name: "Self-Hosted LLM Inference Platform",
    org: "Personal project",
    tagline: "GPU-accelerated model serving on AWS EKS.",
    description:
      "A self-hosted LLM inference platform on AWS EKS, using vLLM for GPU-accelerated model serving behind a load balancer. Terraform provisions the underlying VPC, IAM, and Kubernetes infrastructure, with Docker packaging the serving layer. Built for cases where routing to a third-party API isn't the right call on cost, latency, or data residency.",
    flow: ["REQUEST", "LOAD BALANCER", "vLLM WORKER — GPU", "RESPONSE"],
    tech: ["AWS EKS", "Kubernetes", "Terraform", "Docker", "vLLM"],
  },
  {
    id: 4,
    name: "Review Summarizer & Sentiment",
    org: "University project",
    tagline: "NLP pipeline processing 10,000+ product reviews.",
    description:
      "An NLP pipeline that automatically summarizes customer product reviews and classifies sentiment, built using Python. It processes 10,000+ reviews with text preprocessing, TF-IDF vectorization, and a Random Forest classifier reaching roughly 90% accuracy, with MySQL storing the data — cutting manual review analysis effort by about 60%.",
    flow: ["REVIEWS INPUT", "TEXT PREPROCESSING", "TF-IDF VECTORIZATION", "RANDOM FOREST CLASSIFICATION", "SUMMARY OUTPUT"],
    tech: ["Python", "NLP", "TF-IDF", "Random Forest", "MySQL"],
  },
  {
    id: 5,
    name: "Cloud SQL Performance Analyzer",
    org: "Personal project",
    tagline: "Full-stack platform to analyze and optimize SQL queries.",
    description:
      "A full-stack platform built with Java, Spring Boot, React, and MySQL to analyze and optimize SQL queries across large datasets. It exposes RESTful APIs for query execution, execution plan analysis, and optimization recommendations covering indexing, joins, normalization, and query restructuring — delivering roughly a 30% improvement in query execution performance.",
    flow: ["QUERY INPUT", "EXECUTION PLAN ANALYSIS", "INDEX / JOIN OPTIMIZATION", "RECOMMENDATION OUTPUT"],
    tech: ["Java", "Spring Boot", "React", "MySQL"],
  },
];
