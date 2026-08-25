import { TOKENS } from "../../theme";

export default function Tag({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        border: `1px solid ${TOKENS.border}`,
        color: TOKENS.textDim,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11.5,
        padding: "3px 9px",
        borderRadius: 5,
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      {children}
    </span>
  );
}
