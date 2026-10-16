import { CircleRig } from "../blueprint/Decor";

// Kept under its old name: now draws faint drafting rings instead of a glow.
export default function SceneGlow({ x = "50%", y = "0%", size = 700, opacity = 0.16 }) {
  return (
    <CircleRig
      size={Math.min(size, 640)}
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        opacity: Math.min(0.9, opacity * 3.2),
        zIndex: 0,
      }}
    />
  );
}
