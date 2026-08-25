import { TOKENS } from "../../theme";

export default function GridField() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundImage: `
          linear-gradient(${TOKENS.border}22 1px, transparent 1px),
          linear-gradient(90deg, ${TOKENS.border}22 1px, transparent 1px)
        `,
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 75%)",
        opacity: 0.6,
      }}
    />
  );
}
