import { TOKENS, FONTS } from "../../theme";

export default function Tag({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        border: `1px solid ${TOKENS.ink}`,
        color: TOKENS.ink,
        background: "rgba(255,255,255,0.6)",
        fontFamily: FONTS.mono,
        fontSize: 11.5,
        padding: "3px 11px",
        borderRadius: 999,
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      {children}
    </span>
  );
}
