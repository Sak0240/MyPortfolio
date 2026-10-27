import { useEffect, useState } from "react";
import { STEPS, statesFor, noteFor, statusLine } from "./howData";

const NODE_R = 12;

/**
 * The explanation drawn ON the circle: the dashed ring around the orb is the track, the steps are numbered
 * nodes along its right-hand arc, and each label sits beside its node, so the text follows the curve while
 * staying horizontal and easy to read. The ring fills in as the question travels.
 */
export default function HowRing({ trace, geom, vw, vh, reduced }) {
  const [demo, setDemo] = useState(0);

  // while nothing has been asked yet, the light slowly walks around the ring so it feels alive
  useEffect(() => {
    if (trace.phase !== "idle" || reduced) return undefined;
    const id = setInterval(() => setDemo((d) => (d + 1) % STEPS.length), 1700);
    return () => clearInterval(id);
  }, [trace.phase, reduced]);

  const states = statesFor(trace, demo);
  const n = STEPS.length;
  const ringR = (geom.d / 2) * 1.1; // the dashed ring that already circles the orb
  const half = Math.min(52, (Math.asin(Math.min(0.8, (vh / 2 - 96) / ringR)) * 180) / Math.PI);
  const pts = STEPS.map((_, i) => {
    const theta = ((-half + (2 * half * i) / (n - 1)) * Math.PI) / 180;
    return { x: geom.cx + ringR * Math.cos(theta), y: geom.cy + ringR * Math.sin(theta) };
  });
  const labelW = Math.max(220, Math.min(330, vw - (geom.cx + ringR) - 52));
  const first = pts[0];
  const last = pts[n - 1];
  const compact = vh < 760;

  return (
    <div className="how-ring" aria-hidden="true">
      <div className="how-scrim" style={{ left: geom.cx + ringR * 0.55, width: vw - (geom.cx + ringR * 0.55) }} />

      <svg className="how-svg" width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`}>
        {pts.slice(0, -1).map((a, i) => {
          const b = pts[i + 1];
          const lit = states[i] === "done" && states[i + 1] !== "idle";
          return (
            <path
              key={i}
              className={`how-arc${lit ? " is-lit" : ""}`}
              d={`M ${a.x} ${a.y} A ${ringR} ${ringR} 0 0 1 ${b.x} ${b.y}`}
            />
          );
        })}
        {pts.map((p, i) => (
          <g key={i} className={`how-node is-${states[i]}`} style={{ "--i": i }}>
            <line className="how-leader" x1={p.x + NODE_R} y1={p.y} x2={p.x + 26} y2={p.y} />
            {states[i] === "active" && <circle className="how-pulse" cx={p.x} cy={p.y} r={NODE_R} />}
            <circle className="how-dot" cx={p.x} cy={p.y} r={NODE_R} />
            <text className="how-dot-text" x={p.x} y={p.y + 0.5} textAnchor="middle" dominantBaseline="central">
              {states[i] === "done" ? "✓" : states[i] === "stop" ? "■" : states[i] === "skip" ? "–" : i + 1}
            </text>
          </g>
        ))}
      </svg>

      <div className="how-head" style={{ left: first.x + 30, top: Math.max(8, first.y - (compact ? 84 : 92)), width: labelW }}>
        <div className="how-kicker">FIG. A · the journey of one question</div>
        <div className="how-title">How this works</div>
      </div>

      {STEPS.map((s, i) => {
        const state = states[i];
        const note = noteFor(i, trace, state);
        return (
          <div
            key={s.title}
            className={`how-label is-${state}`}
            style={{ left: pts[i].x + 32, top: pts[i].y, width: labelW, "--i": i }}
          >
            <div className="how-label-title">
              {s.title} <em>{s.where}</em>
            </div>
            <div className={`how-label-short${note ? " is-note" : ""}`}>{note || s.short}</div>
          </div>
        );
      })}

      <p className="how-status" style={{ left: last.x + 30, top: Math.min(vh - 64, last.y + (compact ? 30 : 38)), width: labelW }}>
        {statusLine(trace)}
      </p>
    </div>
  );
}
