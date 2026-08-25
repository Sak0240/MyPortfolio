import SceneEyebrow from "../components/shared/SceneEyebrow";
import BuildItem from "../components/shared/BuildItem";

export default function WhatIBuildSection() {
  return (
    <section style={{ position: "relative", padding: "100px 32px 40px", maxWidth: 900, margin: "0 auto" }}>
      <SceneEyebrow>what i build</SceneEyebrow>
      <BuildItem
        index={0}
        title="RAG"
        text="Retrieval-augmented pipelines that ground every answer in real documents and data — not the model's memory."
      />
      <BuildItem
        index={1}
        title="Agentic AI"
        text="Multi-step graphs with conditional routing, retrieval, generation, validation, and human-in-the-loop escalation for complex or high-risk queries."
      />
      <BuildItem
        index={2}
        title="LLM Infrastructure"
        text="Self-hosted inference on GPU workers, deployed and scaled through Kubernetes, Docker, and infrastructure-as-code."
      />
      <BuildItem
        index={3}
        title="Hybrid Retrieval"
        text="FAISS for semantic search and BM25 for keyword search, merged with Reciprocal Rank Fusion — catching what either method misses alone."
      />
      <BuildItem
        index={4}
        title="Evaluation"
        text="TruLens for groundedness and relevance, LangSmith for tracing — every answer measured before it ships."
      />
      <BuildItem
        index={5}
        title="Guardrails"
        text="Input and output checks that keep unsupported or unsafe responses from ever reaching a user."
      />
    </section>
  );
}
