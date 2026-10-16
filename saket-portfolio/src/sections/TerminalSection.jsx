import { TOKENS, FONTS } from "../theme";
import SceneNumber from "../components/shared/SceneNumber";
import SceneText from "../components/shared/SceneText";
import Shell from "../components/terminal/Shell";
import { Square, DotGrid } from "../components/blueprint/Decor";

export default function TerminalSection() {
  return (
    <section id="terminal" style={{ position: "relative", padding: "60px 32px 110px", maxWidth: 980, margin: "0 auto" }}>
      <DotGrid cols={7} rows={5} style={{ right: 0, top: 30 }} />
      <Square size={14} style={{ left: 8, top: 58 }} />
      <SceneNumber n="02" label="Terminal" />
      <SceneText>
        <h2 style={{ fontSize: "clamp(30px, 4.4vw, 52px)", color: TOKENS.ink, margin: "18px 0 10px" }}>
          Ask my work anything.
        </h2>
        <p style={{ fontFamily: FONTS.body, fontSize: 16, lineHeight: 1.8, color: TOKENS.textDim, margin: "0 0 36px", maxWidth: 560 }}>
          A tiny retrieval-powered terminal over my real experience. Try <code style={{ fontFamily: FONTS.mono, color: TOKENS.amber }}>more</code>,{" "}
          <code style={{ fontFamily: FONTS.mono, color: TOKENS.amber }}>work</code>, <code style={{ fontFamily: FONTS.mono, color: TOKENS.amber }}>projects</code>, or just type a question.
        </p>
      </SceneText>
      <SceneText delay={150}>
        <Shell />
      </SceneText>
    </section>
  );
}
