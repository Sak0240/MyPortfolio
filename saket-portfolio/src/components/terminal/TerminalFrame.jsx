import { useState, useEffect } from "react";
import { TOKENS } from "../../theme";

export default function TerminalFrame({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-12%",
          zIndex: -1,
          background: `radial-gradient(circle, ${TOKENS.teal}33 0%, ${TOKENS.teal}00 70%)`,
          opacity: ready ? 0.2 : 0,
          animation: ready ? "termBreathe 4.5s ease-in-out infinite" : "none",
          transition: "opacity 1.2s ease",
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />
      {children}
    </div>
  );
}
