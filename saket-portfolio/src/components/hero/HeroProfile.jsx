import { useState, useEffect } from "react";
import { TOKENS } from "../../theme";
import { SocialLinks } from "./SocialLinks";

export default function HeroProfile() {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 350);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="hero-col hero-col-left">
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: TOKENS.textFaint, letterSpacing: "0.08em", marginBottom: 12 }}>
          PROFILE
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 600, color: TOKENS.teal, marginBottom: 10, letterSpacing: "0.01em" }}>
          GENAI ENGINEER
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: TOKENS.textDim, marginBottom: 6 }}>PUNE, INDIA</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: TOKENS.textDim }}>2.5+ YEARS</div>
      </div>
      <div aria-hidden="true" style={{ flex: 1, width: 1, margin: "18px 0", minHeight: 40, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: TOKENS.border,
            transform: drawn ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "top",
            transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: -2.5,
            bottom: -2,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: TOKENS.teal,
            boxShadow: `0 0 8px ${TOKENS.teal}`,
            opacity: drawn ? 1 : 0,
            transform: drawn ? "scale(1)" : "scale(0.3)",
            transition: "opacity 0.4s ease 1s, transform 0.4s ease 1s",
          }}
        />
      </div>
      <div
        className="hero-shift-left"
        style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}
      >
        <SocialLinks animated={drawn} />
      </div>
    </div>
  );
}
