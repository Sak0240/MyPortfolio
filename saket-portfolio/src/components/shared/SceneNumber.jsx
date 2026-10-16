import { TOKENS, FONTS } from "../../theme";

export default function SceneNumber({ n, label }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: FONTS.mono,
        fontSize: 12,
        color: TOKENS.textDim,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 8, height: 8, background: TOKENS.amber, display: "inline-block" }} />
      FIG. {n}
      {label ? <span style={{ color: TOKENS.textFaint }}>— {label}</span> : null}
      <span style={{ width: 54, height: 1, background: TOKENS.ink, display: "inline-block" }} />
    </span>
  );
}
