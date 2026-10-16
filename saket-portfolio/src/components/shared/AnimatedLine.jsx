import { TOKENS, FONTS } from "../../theme";
import useInView from "../../hooks/useInView";

export default function AnimatedLine({ text }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        fontFamily: FONTS.mono,
        fontSize: 15,
        fontStyle: "italic",
        lineHeight: 1.7,
        color: TOKENS.ink,
        borderLeft: `3px solid ${TOKENS.amber}`,
        paddingLeft: 16,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
        margin: "28px 0 0",
      }}
    >
      {text}
    </div>
  );
}
