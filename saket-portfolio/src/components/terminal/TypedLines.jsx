import { useState, useEffect, useRef } from "react";
import { TOKENS } from "../../theme";

export default function TypedLines({ lines, onDone }) {
  const [rendered, setRendered] = useState([]);
  const idxRef = useRef(0);
  const charRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let current = [];
    setRendered([]);

    function step() {
      if (cancelled) return;
      const li = idxRef.current;
      if (li >= lines.length) {
        onDone && onDone();
        return;
      }
      const line = lines[li];
      const ci = charRef.current;
      if (ci <= line.text.length) {
        const partial = line.text.slice(0, ci);
        const next = [...current];
        next[li] = { ...line, text: partial };
        current = next;
        setRendered(next);
        charRef.current += 1;
        setTimeout(step, line.speed || 14);
      } else {
        idxRef.current += 1;
        charRef.current = 0;
        setTimeout(step, line.pause || 220);
      }
    }
    const t = setTimeout(step, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [lines]);

  return (
    <>
      {rendered.map((l, i) => (
        <div
          key={i}
          style={{
            color: l.color || TOKENS.text,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "13.5px",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {l.prompt && <span style={{ color: TOKENS.teal }}>{l.prompt} </span>}
          {l.text}
        </div>
      ))}
    </>
  );
}
