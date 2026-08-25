import { TOKENS } from "../theme";
import { GITHUB_REPO_URL, SOURCE_REPO_URL } from "../data/links";
import { RESUME_PDF } from "../data/assets";
import SceneGlow from "../components/shared/SceneGlow";
import SceneText from "../components/shared/SceneText";

export default function ContactSection() {
  return (
    <section id="contact" style={{ position: "relative", padding: "160px 32px 80px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
      <SceneGlow size={820} opacity={0.18} />
      <SceneText>
        <h2
          style={{
            fontSize: "clamp(32px, 5.4vw, 64px)",
            fontWeight: 550,
            letterSpacing: "-0.02em",
            lineHeight: 1.08,
            color: TOKENS.text,
            margin: "0 0 6px",
          }}
        >
          Have a system worth building?
        </h2>
      </SceneText>
      <SceneText delay={120}>
        <h2
          style={{
            fontSize: "clamp(32px, 5.4vw, 64px)",
            fontWeight: 550,
            letterSpacing: "-0.02em",
            lineHeight: 1.08,
            color: TOKENS.teal,
            textShadow: `0 0 30px ${TOKENS.teal}40`,
            margin: "0 0 40px",
          }}
        >
          Let's build it.
        </h2>
      </SceneText>
      <SceneText delay={240}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, marginBottom: 28 }}>
          <a className="link" href="mailto:heyiamsaket@gmail.com">
            heyiamsaket@gmail.com
          </a>
          <a className="link" href="https://linkedin.com/in/saket-deshmukh" target="_blank" rel="noreferrer">
            linkedin.com/in/saket-deshmukh
          </a>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          <a
            href={RESUME_PDF}
            download="Saket_Deshmukh_Resume.pdf"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12.5,
              color: TOKENS.amber,
              textDecoration: "none",
              border: `1px solid ${TOKENS.amberDim}`,
              borderRadius: 6,
              padding: "8px 16px",
            }}
          >
            download resume ↓
          </a>
          <a
            href={SOURCE_REPO_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12.5,
              color: TOKENS.textDim,
              textDecoration: "none",
              border: `1px solid ${TOKENS.border}`,
              borderRadius: 6,
              padding: "8px 16px",
            }}
          >
            source code ↗
          </a>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12.5,
              color: TOKENS.textDim,
              textDecoration: "none",
              border: `1px solid ${TOKENS.border}`,
              borderRadius: 6,
              padding: "8px 16px",
            }}
          >
            github ↗
          </a>
        </div>
      </SceneText>
      <div
        style={{
          marginTop: 64,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11.5,
          color: TOKENS.textFaint,
        }}
      >
        no templates, no page builders — every pixel and every retrieval, hand-built.
      </div>
    </section>
  );
}
