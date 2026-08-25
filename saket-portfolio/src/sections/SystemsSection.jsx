import { TOKENS } from "../theme";
import SceneGlow from "../components/shared/SceneGlow";
import SceneNumber from "../components/shared/SceneNumber";
import SceneText from "../components/shared/SceneText";
import { ArchitectureDiagram, InfraDiagram } from "../components/diagrams/Diagrams";
import DecisionLog from "../components/diagrams/DecisionLog";

export default function SystemsSection() {
  return (
    <section id="systems" style={{ position: "relative", padding: "160px 32px 60px", maxWidth: 1000, margin: "0 auto" }}>
      <SceneGlow x="20%" y="20%" size={640} opacity={0.12} />
      <SceneNumber n="04" />
      <div style={{ marginTop: 14, marginBottom: 18 }}>
        <SceneText>
          <h2 style={{ fontSize: "clamp(30px, 4.4vw, 52px)", fontWeight: 550, letterSpacing: "-0.02em", color: TOKENS.text, margin: 0 }}>
            How it all connects.
          </h2>
        </SceneText>
      </div>
      <SceneText delay={100}>
        <p style={{ color: TOKENS.textDim, fontSize: 16, lineHeight: 1.8, margin: "0 0 48px", maxWidth: 640 }}>
          The same request-time shape underneath a RAG assistant or an agentic workflow — validated in,
          validated out, nothing reaching a model or a user ungrounded.
        </p>
      </SceneText>
      <div className="systems-grid">
        <SceneText delay={150}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: TOKENS.textFaint, letterSpacing: "0.08em", marginBottom: 16 }}>
            REQUEST-TIME PIPELINE
          </div>
          <ArchitectureDiagram />
        </SceneText>
        <SceneText delay={250}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: TOKENS.textFaint, letterSpacing: "0.08em", marginBottom: 16 }}>
            DEPLOYMENT
          </div>
          <InfraDiagram />
        </SceneText>
      </div>
      <SceneText delay={300}>
        <DecisionLog />
      </SceneText>
    </section>
  );
}
