import { TOKENS } from "../../theme";
import SceneText from "./SceneText";

export default function BuildItem({ index, title, text }) {
  return (
    <SceneText delay={index * 70}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "56px 1fr",
          gap: 20,
          padding: "28px 0",
          borderTop: `1px solid ${TOKENS.border}`,
          alignItems: "baseline",
        }}
      >
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: TOKENS.teal }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <div
            style={{
              fontSize: "clamp(22px, 3vw, 34px)",
              fontWeight: 550,
              color: TOKENS.text,
              letterSpacing: "-0.01em",
              marginBottom: 8,
            }}
          >
            {title}
          </div>
          <p style={{ color: TOKENS.textDim, fontSize: 14.5, lineHeight: 1.7, maxWidth: 620, margin: 0 }}>{text}</p>
        </div>
      </div>
    </SceneText>
  );
}
