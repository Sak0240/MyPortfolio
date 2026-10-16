import { TOKENS, FONTS } from "../../theme";
import { KWAD_LOGO } from "../../data/assets";

// Engineering-drawing style title block.
const ROWS = [
  ["PROFILE", "GenAI Engineer"],
  ["BASED", "Pune, India"],
  ["EXPERIENCE", "2.5+ years"],
];

export default function TitleBlock() {
  const cell = { padding: "10px 14px", fontSize: 13 };
  return (
    <div
      style={{
        border: `1px solid ${TOKENS.ink}`,
        background: TOKENS.panel,
        fontFamily: FONTS.mono,
        maxWidth: 440,
        margin: "28px auto 0",
      }}
    >
      {ROWS.map(([k, v]) => (
        <div key={k} style={{ display: "grid", gridTemplateColumns: "120px 1fr", borderBottom: `1px solid ${TOKENS.border}` }}>
          <div style={{ ...cell, background: TOKENS.panelAlt, color: TOKENS.textFaint, letterSpacing: "0.12em", fontSize: 11 }}>{k}</div>
          <div style={{ ...cell, color: TOKENS.ink }}>{v}</div>
        </div>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr" }}>
        <div style={{ ...cell, background: TOKENS.panelAlt, color: TOKENS.textFaint, letterSpacing: "0.12em", fontSize: 11 }}>AT</div>
        <div style={{ ...cell, display: "flex", alignItems: "center" }}>
          <img
            src={KWAD_LOGO}
            alt="KWAD Corporation"
            className="profile-kwad-logo"
            style={{ height: 16, display: "block", filter: "brightness(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
