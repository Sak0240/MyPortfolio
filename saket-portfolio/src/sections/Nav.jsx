import { TOKENS } from "../theme";
import { NAV_ITEMS, GITHUB_REPO_URL } from "../data/links";
import { RESUME_PDF } from "../data/assets";
import SparkMark from "../components/shared/SparkMark";

export default function Nav({ navSolid }) {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 40px",
        borderBottom: `1px solid ${navSolid ? TOKENS.border : "transparent"}`,
        background: navSolid ? "rgba(10,12,13,0.9)" : "transparent",
        backdropFilter: "blur(6px)",
        transition: "all 0.2s ease",
      }}
    >
      <a
        href="#hero"
        className="plain"
        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 17, color: TOKENS.text, display: "flex", alignItems: "center", gap: 10 }}
      >
        <SparkMark size={19} color={TOKENS.teal} />
        saket<span style={{ color: TOKENS.amber }}>.</span>dev
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="hide-mobile">
          {NAV_ITEMS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="plain"
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14.5, color: TOKENS.textDim }}
            >
              {s}
            </a>
          ))}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 14.5,
              color: TOKENS.textDim,
              textDecoration: "none",
            }}
          >
            github ↗
          </a>
        </div>
        <a
          href={RESUME_PDF}
          download="Saket_Deshmukh_Resume.pdf"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 14.5,
            color: TOKENS.amber,
            textDecoration: "none",
            border: `1px solid ${TOKENS.amberDim}`,
            borderRadius: 6,
            padding: "8px 16px",
            whiteSpace: "nowrap",
          }}
        >
          resume ↓
        </a>
      </div>
    </nav>
  );
}
