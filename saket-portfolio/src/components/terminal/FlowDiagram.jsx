import { TOKENS } from "../../theme";

export default function FlowDiagram({ steps, compact }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map((step, i) => (
        <div key={i}>
          <div
            className="flow-node"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: compact ? 11.5 : 12,
              color: TOKENS.textDim,
              border: `1px solid ${TOKENS.border}`,
              borderRadius: 6,
              padding: compact ? "5px 9px" : "6px 11px",
              display: "inline-block",
              animationDelay: `${i * 90}ms`,
            }}
          >
            {step}
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                color: TOKENS.textFaint,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: compact ? 11 : 12,
                padding: "1px 0 1px 10px",
              }}
            >
              │
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
