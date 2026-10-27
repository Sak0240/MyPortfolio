# Technical Skills and Interview Reference

## Python
Python is my primary language for backend development and AI applications. Common use cases include API development, document processing, retrieval pipelines, data validation, and LLM integration.

## FastAPI
FastAPI is a Python framework for building APIs. It can receive requests, validate inputs, execute processing workflows, and return responses.

## LLMs
Large Language Models generate and interpret text based on the input and context provided. They are useful for summarization, structured extraction, classification, question answering, and tool selection. Their outputs can be incorrect, so important results should be validated.

## Prompt Engineering
Prompt engineering involves designing instructions and context to guide model behavior. A useful prompt defines the task, expected output, constraints, and how to handle missing information.

## Structured Outputs
Structured outputs constrain a model's response to a predefined format, such as JSON. They simplify downstream processing, but values still need factual validation.

## RAG
Retrieval-Augmented Generation retrieves relevant information and provides it to an LLM as context for generating a response. A typical workflow includes document processing, chunking, embeddings, indexing, retrieval, and answer generation. RAG does not guarantee factual correctness.

## Embeddings
Embeddings represent text as numerical vectors, allowing systems to compare text based on semantic similarity and retrieve related information.

## Vector Search
Vector search systems store or index embeddings and retrieve items based on similarity. pgvector enables vector operations in PostgreSQL. FAISS is a library for efficient similarity search over vectors.

## BM25
BM25 is a lexical retrieval method that ranks documents based on query-term relevance. It can work well when exact terms, names, codes, or product identifiers matter.

## Hybrid Search
Hybrid search combines multiple retrieval approaches, such as vector similarity and BM25. Results can be combined using a ranking strategy such as Reciprocal Rank Fusion.

## LangChain
LangChain provides components and integrations for LLM applications, including model interfaces, retrievers, prompts, and tools.

## LangGraph
LangGraph supports stateful workflows with nodes, conditional edges, and controlled transitions. It is useful for multi-step AI applications requiring explicit orchestration.

## LiteLLM
LiteLLM provides a common interface for supported model providers and can help applications integrate multiple models consistently.

## MCP
The Model Context Protocol defines a standardized approach for connecting AI applications with external tools and data sources.

## Function Calling
Function calling allows a model to request execution of a defined function or tool using structured arguments. The application validates the request, enforces permissions, executes the operation, and returns the result.

## Guardrails
Guardrails reduce risks such as invalid inputs, unsafe outputs, unsupported claims, and unauthorized tool use. They may include schema validation, permission checks, content checks, and deterministic rules.

## LLM Evaluation
LLM evaluation measures how well an AI application performs on defined tasks. Metrics may include correctness, groundedness, answer relevance, retrieval quality, schema validity, and tool-selection accuracy.

## RAGAS and TruLens
RAGAS and TruLens are tools and frameworks used to evaluate aspects of LLM applications and RAG pipelines. Their metrics and integrations differ; they are not the same product. Interpret scores according to metric definitions and evaluation data.

## LangSmith
LangSmith supports tracing, debugging, evaluation, and monitoring workflows for LLM applications.

## OCR
Optical Character Recognition converts text in images or scanned documents into machine-readable text. OCR output can contain errors, especially with poor image quality, handwriting, or complex layouts.

## Pydantic
Pydantic validates data using defined models and types. It is useful for API requests and structured model outputs.

## PostgreSQL
PostgreSQL is a relational database for structured application data. It can also support vector search through pgvector.

## Docker
Docker packages applications and dependencies into containers for consistent execution across environments.

## Kubernetes
Kubernetes orchestrates containers and supports deployment, scaling, networking, and application recovery.

## AWS
AWS provides cloud infrastructure and managed services. Relevant services include S3 for object storage, SQS for message queuing, and EKS for managed Kubernetes.

## Technical Problem-Solving Approach
I identify required behavior and failure cases, choose the simplest suitable solution, implement validation, test representative scenarios, inspect failures, and improve the system based on evidence.
