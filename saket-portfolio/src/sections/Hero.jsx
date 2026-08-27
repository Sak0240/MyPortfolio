import { TOKENS } from "../theme";
import HeroProfile from "../components/hero/HeroProfile";
import HeroPortrait from "../components/hero/HeroPortrait";
import { MobileSocialDock } from "../components/hero/SocialLinks";
import AnimatedLine from "../components/shared/AnimatedLine";
import ScrollHint from "../components/shared/ScrollHint";
import TerminalFrame from "../components/terminal/TerminalFrame";
import Shell from "../components/terminal/Shell";

export default function Hero() {
  return (
    <header
      id="hero"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 86px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ padding: "32px 32px 20px", maxWidth: 1320, margin: "0 auto", position: "relative", width: "100%" }}>
        <div className="hero-grid" style={{ position: "relative", zIndex: 1 }}>
          <HeroProfile />

          <div className="hero-col hero-col-center">
            <div
              className="hero-eyebrow-mobile"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12.5,
                color: TOKENS.textFaint,
                marginBottom: 12,
              }}
            >
              genai engineer · pune, india · 2.5+ years
            </div>
            <h1 style={{ fontSize: "clamp(26px, 2.6vw, 32px)", fontWeight: 600, margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
              I build production-grade
              <br />
              <span
                style={{
                  color: TOKENS.teal,
                  textShadow: `0 0 14px ${TOKENS.teal}55, 0 0 34px ${TOKENS.teal}30`,
                }}
              >
                GenAI systems
              </span>{" "}
              that actually work.
            </h1>
            <p style={{ color: TOKENS.textDim, fontSize: 15.5, lineHeight: 1.65, margin: "0 0 12px" }}>
              RAG pipelines, agentic workflows, hybrid retrieval, and the infrastructure behind them — built
              for reliability, observability, and real-world data.
            </p>
            <AnimatedLine text={'"If AI replaces me, at least I’ll be the one who built it."'} />
            <div style={{ marginTop: 20 }}>
              <TerminalFrame>
                <Shell />
              </TerminalFrame>
            </div>
            <MobileSocialDock />
          </div>

          <HeroPortrait />
        </div>
      </div>
      <ScrollHint />
    </header>
  );
}
