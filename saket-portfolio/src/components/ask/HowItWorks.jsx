import { useEffect, useState } from "react";
import { STEPS, statesFor, noteFor, statusLine } from "./howData";

/** The same journey as the ring, as a flat list: used on small screens, where there is no room beside the orb. */
export default function HowItWorks({ trace, reduced }) {
  const [demo, setDemo] = useState(0);

  useEffect(() => {
    if (trace.phase !== "idle" || reduced) return undefined;
    const id = setInterval(() => setDemo((d) => (d + 1) % STEPS.length), 1700);
    return () => clearInterval(id);
  }, [trace.phase, reduced]);

  const states = statesFor(trace, demo);

  return (
    <div className="how">
      <div className="how-kicker">FIG. A · the journey of one question</div>
      <h3 className="how-list-title">How this works</h3>
      <ol className="how-steps">
        {STEPS.map((s, i) => {
          const state = states[i];
          const note = noteFor(i, trace, state);
          return (
            <li key={s.title} className={`how-step is-${state}`}>
              <span className="how-badge" aria-hidden="true">
                {state === "done" ? "✓" : state === "stop" ? "■" : state === "skip" ? "–" : i + 1}
              </span>
              <div className="how-text">
                <div className="how-row">
                  <strong>{s.title}</strong>
                  <em>{s.where}</em>
                </div>
                <p>{s.body}</p>
                {note && <p className="how-note">{note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="how-list-status">{statusLine(trace)}</p>
    </div>
  );
}
