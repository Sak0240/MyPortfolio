import { TOKENS } from "../../theme";

export default function SceneEyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: TOKENS.teal,
        marginBottom: 22,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span aria-hidden="true" style={{ width: 26, height: 1, background: TOKENS.tealDim }} />
      {children}
    </div>
  );
}
