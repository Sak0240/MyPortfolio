import { useState, useEffect } from "react";
import { TOKENS } from "../../theme";
import useInView from "../../hooks/useInView";

export default function TypewriterLine({ text }) {
  const [ref, inView] = useInView(0.6);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    let cancelled = false;
    function step() {
      if (cancelled) return;
      i += 1;
      setChars(i);
      if (i < text.length) setTimeout(step, 38);
    }
    const t = setTimeout(step, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [inView, text]);

  return (
    <div
      ref={ref}
      style={{
        marginTop: 56,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 14.5,
        color: TOKENS.textDim,
        letterSpacing: "0.01em",
      }}
    >
      <span style={{ color: TOKENS.teal }}>{"// "}</span>
      {text.slice(0, chars)}
      <span className="type-cursor" aria-hidden="true">▌</span>
    </div>
  );
}
