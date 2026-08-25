import { TOKENS } from "../../theme";

export default function SceneGlow({ x = "50%", y = "0%", size = 700, color, opacity = 0.16 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${color || TOKENS.teal} 0%, transparent 70%)`,
        opacity,
        filter: "blur(10px)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
