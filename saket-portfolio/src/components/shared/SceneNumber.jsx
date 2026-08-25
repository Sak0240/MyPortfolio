import { TOKENS } from "../../theme";

export default function SceneNumber({ n }) {
  return (
    <span
      aria-hidden="true"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        color: TOKENS.textFaint,
        letterSpacing: "0.1em",
      }}
    >
      SCENE {n}
    </span>
  );
}
