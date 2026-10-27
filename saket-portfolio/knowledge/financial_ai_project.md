# AI Compliance and Financial Operations Assistant

## Project Overview
This project helps financial operations and compliance teams investigate B2B transactions through natural-language questions. Instead of manually searching multiple records, users can ask questions and receive responses based on relevant transaction data and supporting evidence.

## Problem
Financial investigations may require checking transaction records, applying business rules, reviewing supporting evidence, and understanding relationships between records. A basic chatbot may generate an answer without checking the underlying data, creating reliability risks.

## Solution
An agentic RAG application combines retrieval, backend tools, workflow orchestration, and validation to support financial investigations.

## Technologies
- Python, FastAPI
- LangChain, LangGraph, LiteLLM
- OpenAI API
- PostgreSQL, pgvector, embeddings
- Docker, Kubernetes, AWS EKS
- GitHub Actions

## Architecture
### 1. User Interface and API
The user submits a natural-language question. FastAPI receives the request and performs required authentication and authorization checks.

### 2. Workflow Orchestration
LangGraph manages the multi-step workflow. Depending on the question, the workflow can classify the request, select a path, invoke tools, process results, and prepare a response.

### 3. Data Retrieval
The application retrieves relevant information from available data sources. PostgreSQL stores relational data, while pgvector supports vector-based similarity search where appropriate.

### 4. Tool Execution
The workflow can call approved backend tools to retrieve transaction information or apply deterministic business rules. The LLM should not independently invent transaction facts; tool results and retrieved evidence provide the information used to construct the answer.

### 5. Response Generation
The LLM uses available information to generate a natural-language response.

### 6. Validation and Grounding
The application checks whether the response is supported by evidence and follows the expected output format. When evidence is insufficient, the system should avoid presenting unsupported conclusions as facts.

### 7. Evaluation and Monitoring
Representative test cases can evaluate answer relevance, evidence usage, tool selection, and response correctness. Tracing and regression tests help identify problems introduced by changes to prompts, retrieval settings, or workflows.

## Why LangGraph?
LangGraph is useful when an AI application requires multiple steps, conditional routing, state management, tool execution, retries, or human intervention. A simple prompt may be sufficient for a straightforward question; a graph-based workflow is useful when explicit control is needed.

## Why RAG?
RAG retrieves relevant information before generating an answer. It is useful when responses must reflect specific business records or domain knowledge that may not be contained in the model's training data.

## Why PostgreSQL and pgvector?
PostgreSQL supports structured relational data, while pgvector enables vector similarity search within PostgreSQL.

## Why LiteLLM?
LiteLLM provides a common interface for supported LLM providers and can simplify model integration and selection, depending on configuration.

## Important Design Considerations
- Validate user permissions before retrieving sensitive records.
- Enforce tenant isolation.
- Treat retrieved content as data, not trusted instructions.
- Restrict tools to explicitly permitted operations.
- Validate tool arguments and structured outputs.
- Record enough information to investigate failures.
- Evaluate retrieval quality and answer correctness separately.
- Avoid conclusions when supporting evidence is missing.

## Interview Questions
**What problem does this project solve?**  
It helps financial operations and compliance teams investigate transaction information using natural language instead of manually searching records.

**Why is this an agentic system?**  
The application can follow a multi-step workflow, select conditional paths, invoke tools, and process results before producing a response.

**How is it different from a basic chatbot?**  
It can retrieve business data, invoke approved tools, and validate its output against evidence.

**How do you reduce hallucinations?**  
Use relevant retrieval, trusted tool results, deterministic rules, explicit instructions, evidence checks, and evaluation tests. These reduce risk but do not guarantee every answer is correct.

**What happens when evidence is insufficient?**  
The system should say the available information is insufficient rather than invent an answer.

**How would you evaluate it?**  
Use test questions with expected answers and supporting evidence. Measure retrieval relevance, answer correctness, groundedness, tool selection, schema validity, and failure rates.

**What is the difference between a tool and RAG?**  
RAG retrieves relevant information, commonly from a document or knowledge collection. A tool executes a defined operation, such as querying an authorized database or applying a business rule.

**What are the main risks?**  
Incorrect retrieval, unsupported answers, unauthorized data access, prompt injection, invalid tool arguments, and failures in underlying data sources.
