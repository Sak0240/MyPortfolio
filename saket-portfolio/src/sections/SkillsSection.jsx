import { TOKENS } from "../theme";
import { skillGroups } from "../data/skillGroups";
import { SKILL_DEFINITIONS } from "../data/skillDefinitions";
import SceneNumber from "../components/shared/SceneNumber";
import SceneText from "../components/shared/SceneText";
import Reveal from "../components/shared/Reveal";
import Tag from "../components/shared/Tag";
import SkillTag from "../components/shared/SkillTag";
import TypewriterLine from "../components/shared/TypewriterLine";

export default function SkillsSection() {
  return (
    <section id="skills" style={{ position: "relative", padding: "160px 32px 60px", maxWidth: 980, margin: "0 auto" }}>
      <SceneNumber n="06" />
      <div style={{ marginTop: 14, marginBottom: 8 }}>
        <SceneText>
          <h2 style={{ fontSize: "clamp(30px, 4.4vw, 52px)", fontWeight: 550, letterSpacing: "-0.02em", color: TOKENS.text, margin: 0 }}>
            The stack.
          </h2>
        </SceneText>
      </div>
      <Reveal>
        <div>
          {skillGroups.map((g, i) => (
            <div
              key={g.label}
              style={{
                padding: "18px 0",
                borderTop: i > 0 ? `1px solid ${TOKENS.border}` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 10 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: TOKENS.teal }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: TOKENS.text,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {g.label}
                </span>
              </div>
              <div style={{ paddingLeft: 30 }}>
                {g.items.map((it) =>
                  SKILL_DEFINITIONS[it] ? (
                    <SkillTag key={it} definition={SKILL_DEFINITIONS[it]}>
                      {it}
                    </SkillTag>
                  ) : (
                    <Tag key={it}>{it}</Tag>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
      <TypewriterLine text="learning never stops — always exploring what's next." />
    </section>
  );
}
