export const PROJECTS = [
  {
    id: 6,
    name: "AI Platform for Clinical Record Processing",
    org: "KWAD Corporation",
    tagline: "Extracts structured clinical data from 5K+ scanned, handwritten, and spreadsheet IVF records.",
    description:
      "A Python/FastAPI AI platform that extracts structured clinical data from 5K+ scanned, handwritten, and spreadsheet IVF records, reducing manual data-processing effort. A multimodal pipeline handles API, S3, and SFTP ingestion, document classification, OCR, vision-model transcription, Pandas-based parsing, and multilingual records. AWS Bedrock LLM orchestration routes by document type with Pydantic structured outputs and validation retries, reaching 99% schema compliance. A deterministic grounding layer verifies each extracted field against its original source span — automatically validating 75% of fields and routing the rest to human review — alongside RAG on Bedrock Knowledge Bases.",
    flow: ["INGESTION — API / S3 / SFTP", "CLASSIFICATION + OCR / VISION", "BEDROCK LLM EXTRACTION", "GROUNDING VERIFICATION", "HUMAN REVIEW — EXCEPTIONS"],
    tech: ["Python", "FastAPI", "AWS Bedrock", "Pydantic", "OCR", "Pandas", "S3", "SFTP", "Titan V2 Embeddings", "Nova 2 Lite", "OpenSearch Serverless"],
  },
  {
    id: 2,
    name: "Agentic Compliance Copilot",
    org: "KWAD Corporation",
    tagline: "Agentic RAG for investigating B2B transaction data across 12 tenants in natural language.",
    description:
      "A production-grade agentic RAG system that lets operations and compliance teams investigate B2B transaction data across 12 tenants in natural language. A LangGraph orchestration layer handles multi-step workflows, intent and risk classification, conditional routing, tool calling, state management, retries, and human escalation, on top of PostgreSQL, pgvector, GPT-4o, and LiteLLM with SQL tools and deterministic compliance rules. FastAPI authentication with tenant-aware RBAC is enforced across SQL queries and vector searches, with evidence aggregation, source citations, and human review for high-risk cases. Nine optimization iterations cut hallucinated responses by 38% and regression detection time by 45%, shipped through GitHub Actions CI/CD to AWS EKS.",
    flow: ["INPUT", "INTENT + RISK CLASSIFICATION", "CONDITIONAL ROUTING + TOOL CALLS", "TENANT-AWARE RETRIEVAL — SQL + pgvector", "EVIDENCE + CITATIONS", "HUMAN REVIEW"],
    tech: ["LangGraph", "LangChain", "FastAPI", "PostgreSQL", "pgvector", "OpenAI GPT-4o", "LiteLLM", "RBAC", "GitHub Actions", "Docker", "AWS EKS"],
  },
  {
    id: 1,
    name: "Product Assistant RAG",
    org: "Briowin — CatalogSage",
    tagline: "AI product information assistant that cut query resolution time by 52% across a 300+ SKU catalog.",
    description:
      "An AI-powered product information assistant for a 300+ SKU catalog that reduced product query resolution time by 52%. A LangGraph agent workflow handles conditional routing, input validation, hybrid retrieval, and fallback handling, achieving a 94% end-to-end request success rate. Hybrid retrieval combines OpenAI text-embedding-3-small, BM25, and Reciprocal Rank Fusion, improving top-k retrieval accuracy by 27%, with MCP providing standardized tool-based communication to the catalog services. Input/output guardrails and a TruLens evaluation pipeline measure groundedness, context relevance, and answer relevance, with Jenkins, Docker, Ansible, and Kubernetes behind the deployments.",
    flow: ["QUERY", "VALIDATION", "HYBRID SEARCH — EMBEDDINGS + BM25", "RRF", "LLM", "VALIDATION", "ANSWER"],
    tech: ["Python", "FastAPI", "LangGraph", "MCP", "OpenAI Embeddings", "BM25", "RRF", "TruLens", "Jenkins", "Ansible", "Kubernetes"],
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
    id: 3,
    name: "Self-Hosted LLM Inference Platform",
    org: "Personal project",
    tagline: "Controlled, scalable model serving with vLLM on AWS EKS.",
    description:
      "A self-hosted LLM inference platform designed with vLLM, Docker, Kubernetes, and AWS EKS to support controlled, scalable model serving. Terraform provisions the underlying VPC, IAM, and Kubernetes infrastructure behind a load balancer. Built for cases where routing to a third-party API isn't the right call on cost, latency, or data residency.",
    flow: ["REQUEST", "LOAD BALANCER", "vLLM WORKER — GPU", "RESPONSE"],
    tech: ["vLLM", "AWS EKS", "Kubernetes", "Terraform", "Docker"],
  },
  {
    id: 7,
    name: "AI SQL Query Optimizer",
    org: "Personal project",
    tagline: "LLM-powered SQL optimization with 99.8% faster lookups and 54% faster aggregations.",
    description:
      "A SQL optimization tool that uses SQLGlot, PostgreSQL metadata, and EXPLAIN plans to detect query bottlenecks and generate LLM-powered optimization suggestions via the DeepSeek API. A safety pipeline — AST-based validation, read-only access, query timeouts, result comparison, and rollback-based index testing — keeps every suggestion verified before it's trusted. Built with FastAPI REST APIs, a web UI, and automated benchmarking that achieved 99.8% faster lookups and 54% faster aggregations, backed by 49 automated tests and Docker Compose.",
    flow: ["SQL INPUT", "AST VALIDATION — SQLGLOT", "EXPLAIN PLAN ANALYSIS", "LLM OPTIMIZATION SUGGESTIONS", "ROLLBACK INDEX TEST + BENCHMARK"],
    tech: ["Python", "FastAPI", "PostgreSQL", "SQLGlot", "DeepSeek API", "Pydantic", "pytest", "Docker Compose"],
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
