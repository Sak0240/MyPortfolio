import { TOKENS, FONTS } from "../../theme";
import SceneText from "./SceneText";

export default function BigStatement({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2px, 0.6vw, 8px)" }}>
      {items.map((line, i) => (
        <SceneText key={i} delay={i * 90} y={34}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontVariationSettings: '"wdth" 110',
              textTransform: "uppercase",
              fontSize: "clamp(32px, 6vw, 76px)",
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.015em",
              color: line.accent ? TOKENS.amber : TOKENS.ink,
            }}
          >
            {line.text}
          </div>
        </SceneText>
      ))}
    </div>
  );
}
