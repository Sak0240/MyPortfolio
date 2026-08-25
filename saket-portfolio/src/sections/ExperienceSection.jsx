import { TOKENS } from "../theme";
import { KWAD_LOGO, BRIOWIN_LOGO } from "../data/assets";
import SceneNumber from "../components/shared/SceneNumber";
import SceneText from "../components/shared/SceneText";
import TimelineNode from "../components/experience/TimelineNode";

export default function ExperienceSection() {
  return (
    <section id="experience" style={{ position: "relative", padding: "140px 32px 40px", maxWidth: 900, margin: "0 auto" }}>
      <SceneNumber n="03" />
      <div style={{ marginTop: 14, marginBottom: 12 }}>
        <SceneText>
          <h2 style={{ fontSize: "clamp(30px, 4.4vw, 52px)", fontWeight: 550, letterSpacing: "-0.02em", color: TOKENS.text, margin: 0 }}>
            Where it was built.
          </h2>
        </SceneText>
      </div>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: TOKENS.textFaint, margin: "0 0 56px" }}>
        same request-time shape as{" "}
        <a className="link" href="#systems">
          → systems
        </a>
      </p>
      <div style={{ position: "relative" }}>
        <TimelineNode
          index={0}
          role="AI Engineer"
          company="KWAD Corporation"
          dates="Apr 2025 — Present"
          logo={KWAD_LOGO}
          companyUrl="https://kwad.in/"
          subtitle="AI Compliance & Financial Operations Copilot"
          bullets={[
            "Agentic RAG system (LangChain + LangGraph) for natural-language investigation of B2B transaction and compliance data — conditional routing, retrieval, generation, human-in-the-loop escalation.",
            "Tenant-isolated retrieval and grounded responses with source citations; input/output guardrails to keep unsupported or unsafe requests out.",
            "Deployed on Kubernetes with Docker and Helm, GitHub Actions CI/CD, and LangSmith for tracing and evaluation.",
          ]}
          tags={["LangChain", "LangGraph", "Kubernetes", "Helm", "GitHub Actions", "LangSmith"]}
        />
        <TimelineNode
          index={1}
          role="Software Engineer"
          company="Briowin (Startup)"
          dates="Feb 2024 — Apr 2025"
          logo={BRIOWIN_LOGO}
          subtitle="CatalogSage — AI-powered product catalog assistant"
          bullets={[
            "RAG assistant for natural-language search and recommendations across a 300+ SKU catalog — Python, FastAPI, LangGraph, OpenAI.",
            "Hybrid retrieval combining FAISS semantic search and BM25 keyword search, merged with Reciprocal Rank Fusion.",
            "Evaluation pipeline with TruLens measuring groundedness, context relevance, and answer relevance; Dockerized for deterministic CI.",
          ]}
          tags={["FastAPI", "FAISS", "BM25", "RRF", "TruLens", "Docker"]}
          last
        />
      </div>
      <SceneText delay={150}>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 16,
            color: TOKENS.textDim,
            paddingLeft: 46,
          }}
        >
          B.E. Computer Engineering · Savitribai Phule Pune University · 2019 — 2023
        </div>
      </SceneText>
    </section>
  );
}
