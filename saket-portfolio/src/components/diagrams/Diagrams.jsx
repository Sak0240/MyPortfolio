import { TOKENS } from "../../theme";
import useInView from "../../hooks/useInView";

function DiagramNode({ label }) {
  const [ref, inView] = useInView(0.6);
  return (
    <div
      ref={ref}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12.5,
        textAlign: "center",
        border: `1px solid ${inView ? TOKENS.amberDim : TOKENS.border}`,
        color: inView ? TOKENS.amber : TOKENS.textFaint,
        borderRadius: 6,
        padding: "8px 14px",
        transition: "all 0.4s ease",
        display: "inline-block",
      }}
    >
      {label}
    </div>
  );
}

function DiagramArrow() {
  return (
    <div style={{ textAlign: "center", color: TOKENS.textFaint, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, padding: "2px 0" }}>
      │
    </div>
  );
}

export function ArchitectureDiagram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <DiagramNode label="USER" />
      <DiagramArrow />
      <DiagramNode label="INPUT VALIDATION" />
      <DiagramArrow />
      <DiagramNode label="QUERY ROUTER" />
      <DiagramArrow />
      <DiagramNode label="HYBRID RETRIEVAL" />
      <DiagramArrow />
      <div style={{ display: "flex", gap: 10 }}>
        <DiagramNode label="FAISS" />
        <DiagramNode label="BM25" />
      </div>
      <DiagramArrow />
      <DiagramNode label="RRF" />
      <DiagramArrow />
      <DiagramNode label="LLM" />
      <DiagramArrow />
      <DiagramNode label="OUTPUT VALIDATION" />
      <DiagramArrow />
      <DiagramNode label="RESPONSE" />
    </div>
  );
}

export function InfraDiagram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <DiagramNode label="FastAPI" />
      <DiagramArrow />
      <DiagramNode label="LangGraph" />
      <DiagramArrow />
      <DiagramNode label="API Gateway / Ingress" />
      <DiagramArrow />
      <DiagramNode label="Kubernetes" />
      <DiagramArrow />
      <DiagramNode label="Docker Containers" />
      <DiagramArrow />
      <DiagramNode label="AWS / Azure" />
      <DiagramArrow />
      <DiagramNode label="Terraform" />
      <DiagramArrow />
      <DiagramNode label="CI/CD" />
      <DiagramArrow />
      <DiagramNode label="Monitoring" />
    </div>
  );
}
