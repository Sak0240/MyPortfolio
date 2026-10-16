import { TOKENS } from "../../theme";

const ORANGE = TOKENS.amber;
const INK = TOKENS.ink;

const abs = { position: "absolute", pointerEvents: "none" };

/** Textured orange sphere (grainy, like the reference artwork). */
export function OrangeSphere({ size = 360, style }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 200 200" style={{ ...abs, ...style }}>
      <defs>
        <radialGradient id="sphereBase" cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#FF8A3D" />
          <stop offset="60%" stopColor="#FF6420" />
          <stop offset="100%" stopColor="#FF4F12" />
        </radialGradient>
        <filter id="sphereGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.4 -1.15" result="speckle" />
          <feComposite in="speckle" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="sphereMottle" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="3" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 0.78  0 0 0 0 0.55  0 0 0 2.2 -0.95" result="blotch" />
          <feComposite in="blotch" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <circle cx="100" cy="100" r="100" fill="url(#sphereBase)" />
      <circle cx="100" cy="100" r="100" fill="#fff" filter="url(#sphereMottle)" opacity="0.55" />
      <circle cx="100" cy="100" r="100" fill="#fff" filter="url(#sphereGrain)" opacity="0.7" />
    </svg>
  );
}

/** Concentric dashed rings with a crosshair and a few orange markers. */
export function CircleRig({ size = 460, style, spin = false }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 400 400" fill="none" style={{ ...abs, ...style }}>
      <g style={spin ? { transformOrigin: "200px 200px", animation: "rigSpin 90s linear infinite" } : undefined}>
        <circle cx="200" cy="200" r="190" stroke={INK} strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="200" cy="200" r="150" stroke={ORANGE} strokeWidth="1" />
        <circle cx="200" cy="200" r="112" stroke={INK} strokeWidth="1" strokeDasharray="2 6" />
        <rect x="186" y="6" width="9" height="9" fill={ORANGE} />
        <rect x="381" y="196" width="8" height="8" fill={INK} />
        <circle cx="62" cy="62" r="3.5" fill={ORANGE} />
      </g>
      <line x1="0" y1="200" x2="400" y2="200" stroke={INK} strokeWidth="0.6" opacity="0.5" />
      <line x1="200" y1="0" x2="200" y2="400" stroke={INK} strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}

/** Grid of small dots. */
export function DotGrid({ cols = 9, rows = 7, gap = 13, color = INK, style }) {
  const w = (cols - 1) * gap + 4;
  const h = (rows - 1) * gap + 4;
  const dots = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      dots.push(<circle key={`${r}-${c}`} cx={2 + c * gap} cy={2 + r * gap} r="1.1" fill={color} />);
    }
  }
  return (
    <svg aria-hidden="true" width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ ...abs, opacity: 0.55, ...style }}>
      {dots}
    </svg>
  );
}

/** Orange diagonal-stripe block ("///////"). */
export function HatchBar({ width = 150, height = 36, color = ORANGE, style, className }) {
  const lines = [];
  for (let x = -height; x < width; x += 11) {
    lines.push(<line key={x} x1={x} y1={height} x2={x + height} y2="0" stroke={color} strokeWidth="3.2" />);
  }
  return (
    <svg aria-hidden="true" className={className} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ ...abs, ...style }}>
      <clipPath id={`hb-${width}-${height}`}>
        <rect width={width} height={height} />
      </clipPath>
      <g clipPath={`url(#hb-${width}-${height})`}>{lines}</g>
    </svg>
  );
}

/** Little pixel-cluster mark (orange + black squares). */
export function PixelMark({ size = 46, style }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 4 4" style={{ ...abs, ...style }}>
      <rect x="1" y="0" width="1" height="1" fill={ORANGE} />
      <rect x="0" y="1" width="1" height="1" fill={ORANGE} />
      <rect x="1" y="1" width="1" height="1" fill="#fff" stroke={ORANGE} strokeWidth="0.08" />
      <rect x="2" y="1" width="1" height="1" fill={INK} />
      <rect x="1" y="2" width="1" height="1" fill={ORANGE} />
    </svg>
  );
}

/** Solid orange square marker. */
export function Square({ size = 14, color = ORANGE, style }) {
  return <span aria-hidden="true" style={{ ...abs, width: size, height: size, background: color, ...style }} />;
}

/** Thin ink rule with an optional end dot. */
export function Rule({ width = 160, color = INK, dot = false, style }) {
  return (
    <span aria-hidden="true" style={{ ...abs, display: "block", width, height: 1, background: color, ...style }}>
      {dot && (
        <span style={{ position: "absolute", left: -3, top: -2.5, width: 6, height: 6, borderRadius: "50%", background: ORANGE }} />
      )}
    </span>
  );
}

/** Crosshair target (orange ring + dot), as used at the end of leader lines. */
export function Target({ size = 44, style, className }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ ...abs, ...style }}>
      <circle cx="22" cy="22" r="19" stroke={ORANGE} strokeWidth="1.4" />
      <circle cx="22" cy="22" r="9" fill={ORANGE} />
    </svg>
  );
}
