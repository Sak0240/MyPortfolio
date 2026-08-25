import { TOKENS } from "../../theme";
import SceneText from "../shared/SceneText";
import RevealLogo from "../shared/RevealLogo";
import Tag from "../shared/Tag";

export default function TimelineNode({ index, role, company, dates, subtitle, bullets, tags, logo, companyUrl, last }) {
  return (
    <SceneText delay={index * 100} y={30}>
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "22px 1fr", gap: 24 }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <span
            aria-hidden="true"
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: TOKENS.panel,
              border: `2px solid ${index === 0 ? TOKENS.teal : TOKENS.borderStrong}`,
              boxShadow: index === 0 ? `0 0 12px ${TOKENS.teal}` : "none",
              marginTop: 6,
              zIndex: 1,
            }}
          />
          {!last && (
            <span
              aria-hidden="true"
              style={{ position: "absolute", top: 17, bottom: -56, width: 1, background: TOKENS.border }}
            />
          )}
        </div>
        <div style={{ paddingBottom: 56 }}>
          {logo && (
            <div style={{ marginBottom: 12 }}>
              {companyUrl ? (
                <a href={companyUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block" }}>
                  <RevealLogo src={logo} alt={`${company} logo`} />
                </a>
              ) : (
                <RevealLogo src={logo} alt={`${company} logo`} />
              )}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: "clamp(19px, 2.4vw, 26px)", fontWeight: 600, color: TOKENS.text }}>
              {role}{" "}
              <span style={{ color: TOKENS.textDim, fontWeight: 400, fontSize: "0.7em" }}>
                ·{" "}
                {companyUrl ? (
                  <a
                    href={companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: TOKENS.textDim, textDecoration: "none", borderBottom: `1px solid ${TOKENS.border}` }}
                  >
                    {company}
                  </a>
                ) : (
                  company
                )}
              </span>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: TOKENS.textFaint, whiteSpace: "nowrap" }}>
              {dates}
            </div>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: TOKENS.amber, marginBottom: 14 }}>
            {subtitle}
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, color: TOKENS.textDim, fontSize: 14.5, lineHeight: 1.75 }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ marginBottom: 7 }}>
                {b}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 14 }}>
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>
    </SceneText>
  );
}
