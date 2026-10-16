import { TOKENS, FONTS } from "../theme";
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
        padding: "20px 40px",
        borderBottom: `1px solid ${navSolid ? TOKENS.ink : "transparent"}`,
        background: navSolid ? "rgba(244,242,238,0.92)" : "transparent",
        backdropFilter: "blur(6px)",
        transition: "all 0.2s ease",
      }}
    >
      <a
        href="#hero"
        className="plain"
        style={{ fontFamily: FONTS.mono, fontSize: 17, color: TOKENS.ink, display: "flex", alignItems: "center", gap: 10 }}
      >
        <SparkMark size={19} color={TOKENS.amber} />
        saket<span style={{ color: TOKENS.amber }}>.</span>dev
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="hide-mobile">
          {NAV_ITEMS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="plain"
              style={{ fontFamily: FONTS.mono, fontSize: 14, color: TOKENS.textDim }}
            >
              {s}
            </a>
          ))}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="plain"
            style={{ fontFamily: FONTS.mono, fontSize: 14, color: TOKENS.textDim }}
          >
            github ↗
          </a>
        </div>
        <a href={RESUME_PDF} download="Saket_Deshmukh_Resume.pdf" className="pill-cta pill-sm">
          resume ↓
        </a>
      </div>
    </nav>
  );
}
