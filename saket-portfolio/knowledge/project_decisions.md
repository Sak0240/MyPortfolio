# Project Decisions and Engineering Reasoning

## Purpose
This document records reasoning behind technical decisions in my projects. The answers below describe general engineering principles relevant to my projects. They should not be interpreted as records of specific experiments unless those experiments were actually performed.

## Why Use RAG Instead of Sending Every Document to an LLM?
RAG retrieves relevant information instead of requiring the application to include every document in each request. It can reduce unnecessary context, improve access to relevant evidence, and support larger knowledge collections. The best approach depends on document size, retrieval quality, context limits, cost, and latency.

## Why Use Structured Outputs?
Structured outputs make model responses easier to validate and process programmatically. A clinical extraction workflow might require fields such as test name, value, unit, and date. The schema must match the application's requirements, and factual validation remains necessary.

## Why Use Deterministic Validation Alongside an LLM?
An LLM is useful for interpreting language and context, but it may generate incorrect values. Deterministic checks are better suited to enforce rules such as required fields, allowed formats, valid dates, and known constraints. A combined approach uses the LLM for interpretation and application code for explicit rules.

## Why Use a Workflow Graph?
A graph can make complex AI workflows easier to control. Nodes can handle classification, retrieval, tool execution, validation, and response generation. Conditional transitions allow the workflow to choose the next step based on the current state. For simple tasks, a single model call may be sufficient.

## Why Use Hybrid Retrieval?
Vector search can retrieve conceptually similar information, while lexical search can retrieve content with matching terms. Hybrid retrieval can combine these strengths, especially when a query contains descriptive language and exact names or identifiers. Confirm benefits using a representative evaluation dataset.

## Why Include Human Review?
Human review is useful when the application encounters ambiguous evidence, conflicting values, low-quality OCR, or high-impact decisions. The system should identify uncertain cases and provide source information for the reviewer.

## Why Keep Tools Restricted?
An AI application should not receive broader permissions than it needs. Tools should validate arguments, enforce authorization, and limit operations to approved actions. Sensitive actions should not depend solely on the LLM's judgment.

## How Should a New AI Feature Be Evaluated?
1. Define the task and expected behavior.
2. Build a representative test dataset.
3. Establish baseline performance.
4. Select metrics that match the task.
5. Test normal cases, edge cases, and failure cases.
6. Review incorrect outputs.
7. Change one major factor at a time where practical.
8. Compare results against the baseline.
9. Keep regression tests for previously solved failures.

## How Should Model Cost Be Reduced?
Potential methods include choosing a suitable model for each task, reducing unnecessary context, caching repeated results where appropriate, limiting redundant tool calls, and using smaller models for simpler tasks. Evaluate each optimization against quality, latency, reliability, and total operating cost.

## How Should Latency Be Reduced?
Potential methods include profiling the workflow, reducing unnecessary sequential model calls, optimizing retrieval, caching suitable results, and running independent operations concurrently where safe. Measure actual latency before choosing an optimization.

## How Should Hallucinations Be Investigated?
1. Identify the exact question and incorrect response.
2. Inspect retrieved context and tool outputs.
3. Check whether the required evidence was available.
4. Determine whether the failure came from retrieval, interpretation, generation, or validation.
5. Add a targeted test case.
6. Apply a specific fix.
7. Re-run the test and broader regression suite.

## How Should Production Readiness Be Assessed?
Consider correctness, security, authorization, error handling, observability, performance, scalability, cost, data privacy, and recovery from failures. A successful demonstration is not enough to establish production readiness.

## How Should Metrics Be Reported?
Metrics should be tied to a defined measurement method, test dataset, and evaluation period. A retrieval-quality claim should specify the baseline, evaluation questions, relevance criteria, and metric used. If a metric has not been measured, describe it as a target or expected benefit rather than an achieved result.
