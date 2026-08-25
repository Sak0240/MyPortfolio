import { TOKENS } from "../../theme";
import useInView from "../../hooks/useInView";

export default function AnimatedLine({ text }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 15,
        fontStyle: "italic",
        color: TOKENS.teal,
        textShadow: `0 0 12px ${TOKENS.teal}40`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
        animation: inView ? "quoteGlowPulse 3.5s ease-in-out 1.2s infinite" : "none",
        margin: "8px 0 0",
      }}
    >
      {text}
    </div>
  );
}
