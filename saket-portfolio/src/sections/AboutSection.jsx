import { TOKENS, FONTS } from "../theme";
import SceneGlow from "../components/shared/SceneGlow";
import SceneNumber from "../components/shared/SceneNumber";
import BigStatement from "../components/shared/BigStatement";
import SceneText from "../components/shared/SceneText";
import AnimatedLine from "../components/shared/AnimatedLine";
import PortraitBlock from "../components/about/PortraitBlock";
import TitleBlock from "../components/about/TitleBlock";

export default function AboutSection() {
  return (
    <section id="about" style={{ position: "relative", padding: "140px 32px 110px", maxWidth: 1200, margin: "0 auto" }}>
      <SceneGlow x="92%" y="6%" size={560} opacity={0.14} />
      <div style={{ position: "relative" }}>
        <SceneNumber n="01" label="About" />
        <div style={{ marginTop: 26 }}>
          <BigStatement
            items={[
              { text: "I build systems" },
              { text: "that think." },
              { text: "retrieve." },
              { text: "reason." },
              { text: "ship.", accent: true },
            ]}
          />
        </div>
      </div>
      <div className="about-split" style={{ position: "relative" }}>
        <SceneText delay={200}>
          <div style={{ fontFamily: FONTS.body, fontSize: 16.5, lineHeight: 1.85, color: TOKENS.textDim, maxWidth: 520 }}>
            <p style={{ margin: "0 0 18px" }}>
              I'm Saket, a Software Engineer based in Pune, India, with 2.5+ years of experience building
              production-grade software, cloud infrastructure, GenAI, and MLOps systems.
            </p>
            <p style={{ margin: "0 0 18px" }}>
              I hold a Bachelor of Engineering in Computer Engineering from Savitribai Phule Pune
              University. My work spans Software Engineering, Cloud Engineering, GenAI, MLOps, LLMs, and
              RAG, combining AI with scalable and reliable infrastructure.
            </p>
            <p style={{ margin: "0 0 18px" }}>
              I've worked with Agentic RAG, hybrid retrieval, LLM inference, MLOps, Kubernetes, AWS, Azure,
              Terraform, Docker, and CI/CD. I enjoy building AI systems that are grounded, secure,
              observable, scalable, and cost-efficient, with a strong focus on reliable model deployment
              and production operations.
            </p>
            <p style={{ margin: 0 }}>
              Outside work, I build side projects and explore LLMOps, Cloud, and Infrastructure.
            </p>
          </div>
          <AnimatedLine text={'"If AI replaces me, at least I’ll be the one who built it."'} />
        </SceneText>
        <div>
          <PortraitBlock />
          <TitleBlock />
        </div>
      </div>
    </section>
  );
}
