import { TOKENS } from "../../theme";
import { DECISIONS } from "../../data/decisions";

export default function DecisionLog() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginTop: 28 }}>
      {DECISIONS.map((d) => (
        <div key={d.q}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: TOKENS.amber, marginBottom: 4 }}>
            {d.q}
          </div>
          <div style={{ fontSize: 13.5, color: TOKENS.textDim, lineHeight: 1.6 }}>→ {d.a}</div>
        </div>
      ))}
    </div>
  );
}
