import { TOKENS } from "../theme";
import SceneGlow from "../components/shared/SceneGlow";
import SceneNumber from "../components/shared/SceneNumber";
import BigStatement from "../components/shared/BigStatement";
import SceneText from "../components/shared/SceneText";

export default function AboutSection() {
  return (
    <section id="about" style={{ position: "relative", padding: "160px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <SceneGlow y="10%" size={780} opacity={0.14} />
      <SceneNumber n="01" />
      <div className="about-scene-grid" style={{ marginTop: 18 }}>
        <BigStatement
          items={[
            { text: "I build systems" },
            { text: "that think." },
            { text: "retrieve." },
            { text: "reason." },
            { text: "ship." },
          ]}
        />
        <SceneText delay={500}>
          <div style={{ fontSize: 16, lineHeight: 1.85, color: TOKENS.textDim, maxWidth: 460 }}>
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
        </SceneText>
      </div>
    </section>
  );
}
