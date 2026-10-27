# CatalogSage — AI-Powered Product Catalog Assistant

## Project Overview
CatalogSage is an AI assistant designed to answer natural-language questions about an e-commerce product catalog containing more than 300 SKUs. It helps users find relevant product information without manually searching through catalog entries.

## Problem
Users may ask about products using descriptions rather than exact product names or identifiers. Simple keyword search may fail when the question wording differs from the catalog wording.

## Solution
The application combines an API backend, an AI workflow, retrieval, and catalog-service integrations to identify relevant product information and generate a useful response.

## Technologies
- Python, FastAPI
- LangGraph, OpenAI API
- Embeddings, BM25, hybrid retrieval
- MCP
- Docker, Kubernetes, Jenkins, Ansible

## Architecture
1. **User question:** The user submits a product-related question.
2. **Request processing:** The backend validates the request and identifies the required processing path.
3. **Retrieval:** The application searches the catalog. Semantic retrieval can find related content when wording differs; BM25 identifies relevant results using lexical term matching. A hybrid approach can combine these signals.
4. **Tool integration:** MCP can provide a standardized way for an AI application to interact with supported catalog tools or services. Tool access should be limited to required operations.
5. **Response generation:** The LLM uses retrieved product information to prepare a natural-language answer. It should not invent product specifications.
6. **Validation:** The application checks inputs and outputs and handles cases where relevant information cannot be found.

## Why Combine Semantic Search and BM25?
Semantic search focuses on meaning and conceptual similarity. BM25 focuses on lexical overlap and term relevance. Combining them can help with descriptive questions and exact product terminology.

## Why LangGraph?
LangGraph supports explicit workflow steps and conditional routing. It is useful when the application needs different paths for different request types or needs to call tools before generating a response.

## Interview Questions
**What problem does CatalogSage solve?**  
It helps users find product information by asking natural-language questions instead of manually searching the catalog.

**Why use hybrid retrieval?**  
Semantic search helps with meaning, while BM25 helps with keyword matching. Combining them can improve retrieval across different types of questions.

**What is MCP?**  
The Model Context Protocol is a standard for connecting AI applications with external tools and data sources through defined interfaces.

**Why use FastAPI?**  
FastAPI provides a framework for building Python APIs, validating requests, and exposing backend functionality.

**What happens if the catalog does not contain the answer?**  
The application should indicate that the information is unavailable instead of inventing product specifications.

**How would you evaluate retrieval quality?**  
Create representative product questions with known relevant catalog entries. Measure whether correct entries appear in top results, using metrics such as Recall@k and MRR where appropriate.
