import { useState } from "react";
import { TOKENS } from "../../theme";
import FlowDiagram from "../terminal/FlowDiagram";
import Tag from "../shared/Tag";

export default function ProjectSnapshot({ project }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="project-snapshot"
      style={{
        border: `1px solid ${open ? TOKENS.tealDim : "rgba(255,255,255,0.1)"}`,
        borderRadius: 10,
        marginBottom: 16,
        background: "rgba(11,18,32,0.5)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        transition: "border-color 0.2s ease",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          all: "unset",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          width: "100%",
          boxSizing: "border-box",
          padding: "20px 22px",
          cursor: "pointer",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16.5, fontWeight: 600, color: TOKENS.text }}>{project.name}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: TOKENS.amberDim }}>
              {project.org}
            </span>
          </div>
          <p style={{ color: TOKENS.textDim, fontSize: 13.5, lineHeight: 1.6, margin: "6px 0 0" }}>{project.tagline}</p>
        </div>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 14,
            color: open ? TOKENS.teal : TOKENS.textFaint,
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease, color 0.2s ease",
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? 600 : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.25s ease",
        }}
      >
        <div style={{ padding: "0 22px 20px" }}>
          <FlowDiagram steps={project.flow} />
          <div style={{ marginTop: 14 }}>
            {project.tech.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
