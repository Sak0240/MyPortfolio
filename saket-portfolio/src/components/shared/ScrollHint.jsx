import { useState, useEffect } from "react";
import { TOKENS } from "../../theme";

export default function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#about"
      aria-label="Scroll to explore the rest of the page"
      className="scroll-hint"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 22,
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        color: TOKENS.textFaint,
        textDecoration: "none",
        zIndex: 15,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease",
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        scroll to explore
      </span>
      <span aria-hidden="true" className="scroll-hint-arrow" style={{ fontSize: 16, lineHeight: 1, color: TOKENS.teal }}>
        ↓
      </span>
    </a>
  );
}
