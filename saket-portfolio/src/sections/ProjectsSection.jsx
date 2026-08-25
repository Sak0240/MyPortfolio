import { TOKENS } from "../theme";
import { PROJECTS } from "../data/projects";
import SceneNumber from "../components/shared/SceneNumber";
import SceneText from "../components/shared/SceneText";
import Reveal from "../components/shared/Reveal";
import Tag from "../components/shared/Tag";
import FlowDiagram from "../components/terminal/FlowDiagram";
import ProjectSnapshot from "../components/projects/ProjectSnapshot";

export default function ProjectsSection() {
  return (
    <section id="projects" style={{ position: "relative", padding: "160px 32px 40px", maxWidth: 980, margin: "0 auto" }}>
      <SceneNumber n="05" />
      <div style={{ marginTop: 14, marginBottom: 56 }}>
        <SceneText>
          <h2 style={{ fontSize: "clamp(30px, 4.4vw, 52px)", fontWeight: 550, letterSpacing: "-0.02em", color: TOKENS.text, margin: "0 0 12px" }}>
            Self-Hosted LLM Inference Platform
          </h2>
        </SceneText>
        <SceneText delay={100}>
          <p style={{ color: TOKENS.textDim, fontSize: 16, lineHeight: 1.8, margin: "0 0 32px", maxWidth: 620 }}>
            GPU-accelerated model serving on AWS EKS — for the cases where routing to a third-party API
            isn't the right call on cost, latency, or data residency.
          </p>
        </SceneText>
        <SceneText delay={200}>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "32px 28px",
              background: "rgba(11,18,32,0.5)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: `0 30px 80px -20px ${TOKENS.teal}18, 0 8px 32px rgba(0,0,0,0.25)`,
            }}
          >
            <FlowDiagram steps={["REQUEST", "LOAD BALANCER", "vLLM WORKER — GPU", "RESPONSE"]} />
            <div style={{ marginTop: 18 }}>
              {["AWS EKS", "Kubernetes", "Terraform", "Docker", "vLLM"].map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </SceneText>
      </div>
      <SceneText delay={100}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: TOKENS.textFaint, letterSpacing: "0.08em", marginBottom: 16 }}>
          MORE SYSTEMS
        </div>
      </SceneText>
      {PROJECTS.filter((p) => p.id !== 3).map((p, i) => (
        <Reveal key={p.id} delay={i * 60}>
          <ProjectSnapshot project={p} />
        </Reveal>
      ))}
    </section>
  );
}
