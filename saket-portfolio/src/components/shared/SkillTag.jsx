import { TOKENS } from "../../theme";

export default function SkillTag({ children, definition }) {
  return (
    <span
      className="skill-tag"
      style={{ position: "relative", display: "inline-block", marginRight: 6, marginBottom: 6 }}
    >
      <span
        style={{
          display: "inline-block",
          border: `1px solid ${TOKENS.border}`,
          color: TOKENS.textDim,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11.5,
          padding: "3px 9px",
          borderRadius: 5,
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
          width: 210,
          padding: "10px 12px",
          background: "rgba(11,18,32,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${TOKENS.tealDim}`,
          borderRadius: 8,
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 12.5,
          fontWeight: 400,
          color: TOKENS.textDim,
          lineHeight: 1.5,
          textAlign: "left",
          textTransform: "none",
          letterSpacing: "normal",
          pointerEvents: "none",
          zIndex: 30,
          boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
        }}
      >
        {definition}
      </span>
    </span>
  );
}
