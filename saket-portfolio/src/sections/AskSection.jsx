import { TOKENS, FONTS } from "../theme";
import SceneNumber from "../components/shared/SceneNumber";
import SceneText from "../components/shared/SceneText";
import { Square, DotGrid } from "../components/blueprint/Decor";
import { openAsk, STARTERS } from "../components/ask/events";

// Home-page entry to the "Ask Saket's AI" console (terminal + chat in one overlay).
export default function AskSection() {
  return (
    <section id="ask" style={{ position: "relative", padding: "60px 32px 110px", maxWidth: 980, margin: "0 auto" }}>
      <DotGrid cols={7} rows={5} style={{ right: 0, top: 30 }} />
      <Square size={14} style={{ left: 8, top: 58 }} />
      <SceneNumber n="02" label="Ask AI" />
      <SceneText>
        <h2 style={{ fontSize: "clamp(30px, 4.4vw, 52px)", color: TOKENS.ink, margin: "18px 0 10px" }}>
          Ask my work anything.
        </h2>
        <p style={{ fontFamily: FONTS.body, fontSize: 16, lineHeight: 1.8, color: TOKENS.textDim, margin: "0 0 36px", maxWidth: 600 }}>
          An AI that has read my real resume and project notes. Ask it anything in plain English — it answers only from
          my actual work, cites where it looked, and says so when it doesn&apos;t know. It also runs commands like{" "}
          <code style={{ fontFamily: FONTS.mono, color: TOKENS.amber }}>projects</code> and{" "}
          <code style={{ fontFamily: FONTS.mono, color: TOKENS.amber }}>skills</code>.
        </p>
      </SceneText>

      <SceneText delay={150}>
        <div className="ask-showcase">
          <div className="ask-showcase-bar">
            <span className="ask-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>saket@genai:~ — ask</span>
          </div>
          <div className="ask-showcase-body">
            <p className="ask-showcase-label">Try one of these</p>
            {STARTERS.map((q) => (
              <button key={q} type="button" className="ask-showcase-line" onClick={(e) => openAsk(q, e.currentTarget)}>
                <span aria-hidden="true">$</span> {q}
              </button>
            ))}
            <div className="ask-showcase-cta">
              <button type="button" className="ask-hero-btn" onClick={(e) => openAsk(undefined, e.currentTarget)}>
                <span className="ask-spark" aria-hidden="true">
                  ✦
                </span>
                Ask Saket&apos;s AI
                <kbd className="ask-kbd" aria-hidden="true">
                  Ctrl K
                </kbd>
              </button>
              <span className="ask-showcase-note">free-form questions · grounded in my resume &amp; notes</span>
            </div>
          </div>
        </div>
      </SceneText>
    </section>
  );
}
