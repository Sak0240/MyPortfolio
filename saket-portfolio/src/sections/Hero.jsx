import { useState, useEffect } from "react";
import { TOKENS, FONTS } from "../theme";
import BlueprintTitle from "../components/blueprint/BlueprintTitle";
import { OrangeSphere, CircleRig, DotGrid, HatchBar, PixelMark, Square, Rule, Target } from "../components/blueprint/Decor";
import { SocialLinks } from "../components/hero/SocialLinks";
import ScrollHint from "../components/shared/ScrollHint";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: TOKENS.ink,
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const CHIPS = [
  {
    label: "Python",
    icon: (
      <svg {...iconProps}>
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
      </svg>
    ),
  },
  {
    label: "RAG",
    icon: (
      <svg {...iconProps}>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    ),
  },
  {
    label: "LangGraph",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="5" r="2" />
        <circle cx="5" cy="19" r="2" />
        <circle cx="19" cy="19" r="2" />
        <path d="m11 7-5 10M13 7l5 10M7 19h10" />
      </svg>
    ),
  },
  {
    label: "AWS",
    icon: (
      <svg {...iconProps}>
        <path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9.5H7Z" />
      </svg>
    ),
  },
];

export default function Hero() {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <header
      id="hero"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 86px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px 110px",
      }}
    >
      {/* blueprint artwork */}
      <div className="hero-decor-lg" aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <OrangeSphere size={400} style={{ left: -215, top: "24%" }} />
        <CircleRig size={600} spin style={{ left: -310, top: "calc(24% - 100px)" }} />
        <PixelMark size={46} style={{ left: 196, top: 88 }} />
        <Square size={16} style={{ left: 22, top: "calc(24% - 62px)" }} />
        <Square size={13} style={{ left: 196, top: "calc(24% + 118px)" }} />
        <Square size={13} style={{ left: 66, top: "calc(24% + 258px)" }} />
        <Square size={46} color={TOKENS.amber} style={{ left: 86, bottom: 84, height: 9 }} />
        <Rule width={70} style={{ left: 140, bottom: 88 }} />
        <Rule width={1} style={{ left: 192, top: 0, bottom: 0, height: "100%", width: 1, opacity: 0.45 }} />

        <DotGrid cols={8} rows={6} style={{ right: 86, top: 64 }} />
        <Square size={16} style={{ right: 118, top: 118 }} />
        <Rule width={1} style={{ right: 112, top: 0, height: "100%", width: 1, opacity: 0.45 }} />
        <CircleRig size={660} style={{ right: -350, top: "28%" }} />
        <Square size={16} style={{ right: 36, top: "calc(28% + 96px)" }} />
        <DotGrid cols={6} rows={4} style={{ right: 56, bottom: 60 }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1180, textAlign: "center" }}>
        {/* name label */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 26 }}>
          <span
            style={{
              fontFamily: FONTS.display,
              fontVariationSettings: '"wdth" 118',
              fontWeight: 500,
              fontSize: "clamp(13px, 1.7vw, 24px)",
              letterSpacing: "0.46em",
              color: TOKENS.ink,
              textTransform: "uppercase",
              paddingLeft: "0.46em",
            }}
          >
            Saket Deshmukh
          </span>
          <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: TOKENS.amber }} />
          <span aria-hidden="true" className="hero-decor-lg" style={{ width: 150, height: 1, background: TOKENS.ink }} />
        </div>

        {/* title with leader line */}
        <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
          <HatchBar className="hero-decor-lg" width={150} height={34} style={{ right: -10, top: -62 }} />
          <div
            className="hero-decor-lg"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "48%",
              right: -20,
              top: -34,
              height: 78,
              borderTop: `1px solid ${TOKENS.amber}`,
              borderRight: `1px solid ${TOKENS.amber}`,
              borderTopRightRadius: 30,
              pointerEvents: "none",
            }}
          />
          <BlueprintTitle
            words={[
              { text: "AI", tone: "orange", pattern: ["hatch", "solid"] },
              { text: "Engineer", pattern: ["hatch", "outline", "hatch", "solid", "hatch", "hatch", "solid", "outline"] },
            ]}
          />
          <Target className="hero-decor-lg" size={40} style={{ right: -52, bottom: 8 }} />
        </div>

        {/* subtitle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 30 }}>
          <span aria-hidden="true" className="hero-decor-lg" style={{ width: 110, height: 1, background: TOKENS.ink }} />
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: "clamp(11px, 1.2vw, 15px)",
              letterSpacing: "0.34em",
              color: TOKENS.ink,
              textTransform: "uppercase",
              paddingLeft: "0.34em",
            }}
          >
            Building intelligent systems
          </span>
          <span aria-hidden="true" className="hero-decor-lg" style={{ width: 110, height: 1, background: TOKENS.ink }} />
        </div>

        {/* chips */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginTop: 34 }}>
          {CHIPS.map((c) => (
            <span key={c.label} className="chip">
              {c.icon}
              {c.label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 40 }}>
          <a href="#about" className="pill-cta">
            Know More About Me
            <svg className="cta-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        {/* socials */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 26, marginTop: 36 }}>
          <SocialLinks animated={drawn} />
        </div>
      </div>

      <ScrollHint />
    </header>
  );
}
