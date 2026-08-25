import { useState, useEffect } from "react";
import { TOKENS } from "../../theme";
import { PORTRAIT_IMG } from "../../data/assets";

export default function HeroPortrait() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setActive(true), 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="hero-col hero-col-right">
      <div
        className="hero-portrait-frame"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(26px)",
          filter: active ? "blur(0px)" : "blur(8px)",
          transition: "opacity 2.2s cubic-bezier(0.16,1,0.3,1), transform 2.2s cubic-bezier(0.16,1,0.3,1), filter 2.2s ease",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-14%",
            background: "radial-gradient(ellipse 68% 60% at 55% 42%, #2F6FEB4d 0%, #2F6FEB1a 45%, transparent 72%)",
            zIndex: 0,
          }}
        />
        <img
          src={PORTRAIT_IMG}
          alt="Saket Deshmukh"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            filter: "contrast(1.04) brightness(0.97) saturate(0.95)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 8%)",
            maskImage: "linear-gradient(to top, transparent 0%, black 8%)",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          lineHeight: 1.6,
          color: TOKENS.textFaint,
        }}
      >
        // building systems that stay grounded in production.
      </div>
    </div>
  );
}
