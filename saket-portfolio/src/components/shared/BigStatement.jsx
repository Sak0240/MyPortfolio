import { TOKENS } from "../../theme";
import SceneText from "./SceneText";

export default function BigStatement({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(10px, 3vw, 26px)" }}>
      {items.map((line, i) => (
        <SceneText key={i} delay={i * 90} y={34}>
          <div
            style={{
              fontSize: i === 0 ? "clamp(34px, 6.2vw, 84px)" : "clamp(30px, 5.6vw, 76px)",
              fontWeight: 550,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              color: line.accent ? TOKENS.teal : TOKENS.text,
              textShadow: line.accent ? `0 0 30px ${TOKENS.teal}40` : "none",
            }}
          >
            {line.text}
          </div>
        </SceneText>
      ))}
    </div>
  );
}
