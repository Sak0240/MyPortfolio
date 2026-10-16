import { LLM_LOGOS } from "../../data/llmLogos";
import { TOKENS } from "../../theme";

const RING = 47.5; // % of the rig size: radius of the outer dashed ring

/**
 * LLM / platform logos that ride the outer dashed ring. The whole layer rotates with the
 * ring and each badge counter-rotates so the marks always stay upright.
 */
export default function OrbitLogos({ size = "min(560px, 112%)", left = "50%", top = "46%", seconds = 90 }) {
  return (
    <div
      aria-hidden="false"
      className="orbit-wrap"
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <div className="orbit" style={{ position: "absolute", inset: 0, animationDuration: `${seconds}s` }}>
        {LLM_LOGOS.map((logo, i) => {
          const a = (i / LLM_LOGOS.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + RING * Math.cos(a);
          const y = 50 + RING * Math.sin(a);
          return (
            <div key={logo.name} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: 0, height: 0 }}>
              <div className="orbit-badge" style={{ animationDuration: `${seconds}s`, pointerEvents: "auto" }} title={logo.name}>
                <img
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(logo.svg)}`}
                  alt={logo.name}
                  draggable={false}
                  style={{ width: "100%", height: "100%", display: "block" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
