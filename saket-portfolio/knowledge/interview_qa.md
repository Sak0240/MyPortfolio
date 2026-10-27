# Interview Questions and Answers

## Tell Me About Yourself
I completed my Bachelor's in Computer Engineering from Savitribai Phule Pune University. I have 2.5+ years of experience in software engineering, with a focus on Generative AI and LLM applications.

I have worked on AI-powered applications in fintech and e-commerce, including an agentic RAG system for financial investigations, a product catalog assistant, and document intelligence workflows.

My main technologies are Python, FastAPI, LangGraph, LangChain, LiteLLM, PostgreSQL, and vector search. I focus on building applications that retrieve relevant information, use tools where required, and validate their outputs.

## Explain RAG in Simple Words
RAG means Retrieval-Augmented Generation. Before answering a question, the application searches its knowledge base for relevant information and gives that information to the LLM as context. For example, a portfolio chatbot can search my resume and project documentation before answering questions about my experience.

## What Is Agentic AI?
Agentic AI refers to AI applications that can work through a task using defined steps, tools, and decisions rather than generating only one response. An agent might classify a financial question, retrieve transaction data, call an approved tool, and use the results to prepare an answer.

## What Is the Difference Between RAG and Fine-Tuning?
RAG provides relevant external information to the model at inference time. Fine-tuning changes model parameters through additional training. RAG is often useful when information changes frequently or must be retrieved from private documents. Fine-tuning is useful for adapting model behavior or task performance when the training approach and data support it.

## What Is the Difference Between LangChain and LangGraph?
LangChain provides components for building LLM applications, such as prompts, retrievers, and tool integrations. LangGraph provides orchestration for stateful, multi-step workflows with conditional transitions. They can be used together.

## What Is the Difference Between an LLM and an Embedding Model?
An LLM generates or interprets language. An embedding model converts text into numerical vectors for similarity search. Some model families offer both generation and embedding capabilities, but the tasks are different.

## What Is Hallucination?
Hallucination occurs when a model generates information that is unsupported or incorrect. It can be reduced through relevant retrieval, explicit instructions, constrained outputs, tool-based data access, validation, and evaluation. Adding RAG does not eliminate it.

## How Do You Evaluate a RAG Application?
I create test questions with expected answers and relevant source documents. I evaluate whether retrieval finds the correct information, whether the answer is supported by that information, and whether the final output is correct and useful. I also test missing-information cases and irrelevant retrieval results.

## What Is Grounding?
Grounding means linking a model's output to reliable information available in the application. For example, a clinical extraction system can retain the source page and text supporting an extracted value.

## How Do You Handle Incorrect Structured Output?
I validate the output against a schema. If validation fails, the application can retry with appropriate error information or route the case for review. Even when schema validation succeeds, I separately check whether the content is correct.

## What Is Function Calling?
Function calling lets a model request an operation using a defined function and structured arguments. The application executes the function only after validating the arguments and checking permissions.

## What Is Prompt Injection?
Prompt injection is an attempt to manipulate an AI application through instructions embedded in user input or retrieved content. Mitigations include treating retrieved documents as untrusted data, restricting tool permissions, validating inputs, and separating model-generated decisions from authorization checks.

## How Do You Prevent an Agent from Calling the Same Tool Repeatedly?
I inspect the execution trace and identify repeated calls, their arguments, and returned results. I check whether the workflow lacks a stopping condition, tool errors cause repeated retries, or the agent fails to use previous results. Possible fixes include limiting iterations, validating arguments, detecting repeated calls, adding stop conditions, and testing against a regression dataset.

## How Do You Choose Between an LLM and a Traditional ML Model?
I consider the task, data, expected accuracy, latency, cost, and output requirements. For stable classification tasks with sufficient labeled data, a traditional model may be more predictable and economical. An LLM may be more useful when contextual interpretation or varied inputs are important. A hybrid approach can use rules or traditional models for straightforward cases and an LLM for ambiguous cases.

## How Do You Debug Poor Retrieval?
I inspect the original documents, text extraction, chunking, metadata, embedding model, query, and retrieved results. I test changes individually and compare retrieval metrics on a representative dataset.

## What Is the Difference Between Precision and Recall?
Precision measures how many retrieved or predicted items are relevant or correct. Recall measures how many of the relevant or correct items were successfully retrieved or identified. The exact interpretation depends on the task and evaluation setup.

## What Is the Difference Between Latency and Throughput?
Latency is the time taken to complete an operation or request. Throughput is the number of operations or requests processed during a period.

## How Do You Make an AI Application More Reliable?
I use input validation, appropriate retrieval, controlled tool access, schema validation, source-grounding checks, automated tests, evaluation datasets, monitoring, and human review for uncertain cases.

## How Do You Handle Missing Information?
I distinguish between what the available evidence supports and what is unknown. If evidence is insufficient, I state the limitation rather than inventing a value.

## How Do You Explain a Technical Project to a Nontechnical Person?
I explain the problem first, then what the application does, how it helps the user, and how success is measured. I introduce technical details only when they help explain the solution.
