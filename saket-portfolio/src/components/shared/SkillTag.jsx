import { TOKENS, FONTS } from "../../theme";

export default function SkillTag({ children, definition }) {
  return (
    <span
      className="skill-tag"
      style={{ position: "relative", display: "inline-block", marginRight: 6, marginBottom: 6 }}
    >
      <span
        style={{
          display: "inline-block",
          border: `1px solid ${TOKENS.ink}`,
          background: "rgba(255,255,255,0.6)",
          color: TOKENS.ink,
          fontFamily: FONTS.mono,
          fontSize: 11.5,
          padding: "3px 11px",
          borderRadius: 999,
          cursor: "default",
        }}
      >
        {children}
      </span>
      <span
        className="skill-tooltip"
        style={{
          position: "absolute",
          bottom: "calc(100% + 9px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: 220,
          padding: "10px 12px",
          background: TOKENS.ink,
          borderRadius: 3,
          fontFamily: FONTS.body,
          fontSize: 12.5,
          fontWeight: 400,
          color: TOKENS.bg,
          lineHeight: 1.5,
          textAlign: "left",
          textTransform: "none",
          letterSpacing: "normal",
          pointerEvents: "none",
          zIndex: 30,
          boxShadow: `4px 4px 0 ${TOKENS.amber}`,
        }}
      >
        {definition}
      </span>
    </span>
  );
}
