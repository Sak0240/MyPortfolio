export const DECISIONS = [
  { q: "Why RRF?", a: "Semantic search alone missed exact product terms — merging it with keyword ranking fixed that." },
  { q: "Why BM25 alongside embeddings?", a: "Keyword matching caught exact SKU and part numbers that pure embeddings blurred past." },
  { q: "Why LangGraph over a plain chain?", a: "Compliance workflows needed explicit state and conditional routing, not a linear pipeline." },
  { q: "Why Kubernetes?", a: "Reproducible deployment and horizontal scaling for inference workloads." },
  { q: "Why vLLM for self-hosted inference?", a: "Meaningfully higher throughput than naive serving when routing to a third-party API isn't the right call." },
  { q: "Why guardrails on both input and output?", a: "Grounding alone doesn't stop an unsafe query from reaching a downstream system." },
];
