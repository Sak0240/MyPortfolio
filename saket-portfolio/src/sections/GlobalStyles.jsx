import { TOKENS } from "../theme";

export default function GlobalStyles() {
  const ink = TOKENS.ink;
  const orange = TOKENS.amber;
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { background: ${TOKENS.bg}; }
      ::selection { background: ${orange}; color: #fff; }
      input::placeholder { color: ${TOKENS.textFaint}; }
      a.plain { color: ${ink}; text-decoration: none; }
      a.link { color: ${orange}; text-decoration: none; border-bottom: 1px solid ${TOKENS.tealDim}; }
      a.link:hover { border-color: ${orange}; }
      h1, h2, h3 {
        font-family: 'Archivo', 'Arial Black', sans-serif;
        font-variation-settings: "wdth" 108;
        text-transform: uppercase;
        letter-spacing: -0.01em;
      }
      h2 { font-weight: 800 !important; line-height: 1.04 !important; }

      @media (max-width: 1280px) {
        .hide-mobile { display: none !important; }
      }

      /* ---------- blueprint lettering ---------- */
      .bp-title { --S: max(8px, 0.056em); --cap: 0.094em; --base: 0.784em; }
      .bp-letter { animation: bpLetterIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
      @keyframes bpLetterIn {
        from { opacity: 0; transform: translateY(0.12em); }
        to { opacity: 1; transform: none; }
      }
      .bp-outline { display: inline-block; }
      .bp-fill {
        position: absolute;
        inset: 0;
        display: inline-block;
        pointer-events: none;
        clip-path: inset(100% 0 0 0);
        animation: bpFill 0.9s cubic-bezier(0.65, 0, 0.35, 1) forwards, hatchDrift 24s linear infinite;
      }
      @keyframes bpFill { to { clip-path: inset(0 0 0 0); } }
      @keyframes hatchDrift {
        from { background-position: 0 0; }
        to { background-position: var(--S) 0; }
      }
      .bp-fill-solid { color: ${ink}; }
      .bp-fill-solid.bp-fill-orange { color: ${orange}; }
      .bp-fill-hatch,
      .bp-fill-outline {
        color: transparent;
        background-image: linear-gradient(135deg, ${ink} 25%, transparent 25%, transparent 50%, ${ink} 50%, ${ink} 75%, transparent 75%);
        background-size: var(--S) var(--S);
        -webkit-background-clip: text;
        background-clip: text;
      }
      .bp-fill-outline { opacity: 0.35; }
      .bp-fill-orange.bp-fill-hatch,
      .bp-fill-orange.bp-fill-outline {
        background-image: linear-gradient(135deg, ${orange} 25%, transparent 25%, transparent 50%, ${orange} 50%, ${orange} 75%, transparent 75%);
      }
      .bp-guide {
        position: absolute;
        left: -0.14em;
        right: -0.14em;
        height: 0;
        border-top: 1px dashed rgba(20, 20, 20, 0.5);
        pointer-events: none;
      }
      .bp-guide-top { top: var(--cap); }
      .bp-guide-bottom { top: var(--base); }
      .bp-guide::before, .bp-guide::after {
        content: "";
        position: absolute;
        top: -3px;
        width: 5px;
        height: 5px;
        background: ${ink};
      }
      .bp-guide::before { left: 0; }
      .bp-guide::after { right: 0; }
      .bp-node {
        position: absolute;
        width: max(5px, 0.04em);
        height: max(5px, 0.04em);
        background: ${ink};
        pointer-events: none;
      }
      .bp-node-tl { left: -0.02em; top: calc(var(--cap) - 0.02em); }
      .bp-node-bl { left: -0.02em; top: calc(var(--base) - 0.02em); }

      @keyframes kwadLogoPulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      .profile-kwad-logo { animation: kwadLogoPulse 2.6s ease-in-out infinite; }

      @media (max-width: 600px) {
        .bp-title { font-size: 12.4vw !important; row-gap: 0.16em !important; }
        .bp-word { flex: 0 0 100%; justify-content: center; }
      }

      @keyframes rigSpin { to { transform: rotate(360deg); } }

      /* ---------- buttons, chips ---------- */
      .pill-cta {
        display: inline-flex;
        align-items: center;
        gap: 14px;
        padding: 16px 30px;
        border-radius: 999px;
        background: linear-gradient(180deg, #FF7A2E 0%, #FF4E12 100%);
        color: #fff;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 17px;
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
        box-shadow: 0 10px 28px -8px rgba(255, 90, 31, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.35);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .pill-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 34px -8px rgba(255, 90, 31, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.35);
      }
      .pill-cta .cta-arrow { transition: transform 0.2s ease; }
      .pill-cta:hover .cta-arrow { transform: translateX(5px); }
      .pill-sm { padding: 9px 18px; font-size: 14px; gap: 8px; }
      .pill-ghost {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 18px;
        border: 1px solid ${ink};
        border-radius: 999px;
        color: ${ink};
        background: transparent;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 13px;
        text-decoration: none;
        transition: background 0.2s ease, color 0.2s ease;
      }
      .pill-ghost:hover { background: ${ink}; color: ${TOKENS.bg}; }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 9px 20px 9px 15px;
        border: 1px solid ${ink};
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.6);
        color: ${ink};
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: 15px;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      .chip:hover { background: #fff; transform: translateY(-2px); }
      .dock-link:hover { color: ${orange}; }
      .scroll-hint-arrow { animation: scrollHintBounce 1.8s ease-in-out infinite; }
      .scroll-hint:hover { color: ${orange}; }
      @keyframes scrollHintBounce {
        0%, 100% { transform: translateY(0); opacity: 0.6; }
        50% { transform: translateY(6px); opacity: 1; }
      }

      /* ---------- cards ---------- */
      .bp-card {
        background: ${TOKENS.panel};
        border: 1px solid ${ink};
        border-radius: 3px;
        transition: box-shadow 0.2s ease, transform 0.2s ease;
      }
      .bp-card:hover { box-shadow: 5px 5px 0 ${orange}; transform: translate(-2px, -2px); }
      .skill-tooltip { opacity: 0; visibility: hidden; transition: opacity 0.15s ease; }
      .skill-tag:hover .skill-tooltip { opacity: 1; visibility: visible; }

      /* ---------- layout helpers ---------- */
      .hero-decor-lg { display: block; }
      @media (max-width: 960px) {
        .hero-decor-lg { display: none; }
      }
      .systems-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
        margin-bottom: 12px;
      }
      @media (min-width: 860px) {
        .systems-grid { grid-template-columns: 1.4fr 1fr; align-items: start; }
      }
      .about-split {
        display: grid;
        grid-template-columns: 1fr;
        gap: 56px;
        margin-top: 56px;
      }
      @media (min-width: 900px) {
        .about-split { grid-template-columns: 1.15fr 1fr; align-items: center; gap: 72px; }
      }
      .term-scroll::-webkit-scrollbar { width: 6px; }
      .term-scroll::-webkit-scrollbar-track { background: transparent; }
      .term-scroll::-webkit-scrollbar-thumb { background: ${TOKENS.borderStrong}; border-radius: 4px; }
      .term-scroll { scrollbar-width: thin; scrollbar-color: ${TOKENS.borderStrong} transparent; height: 300px; }
      @keyframes termDotPulse {
        0%, 100% { opacity: 0.35; transform: scale(0.85); }
        50% { opacity: 1; transform: scale(1); }
      }
      .term-dot { animation: termDotPulse 1.8s ease-in-out infinite; }
      @keyframes cursorBlink {
        0%, 50% { opacity: 1; }
        50.01%, 100% { opacity: 0; }
      }
      .type-cursor { animation: cursorBlink 0.9s step-end infinite; margin-left: 1px; color: ${orange}; }
      @keyframes logoFlicker {
        0% { opacity: 0; }
        8% { opacity: 1; }
        16% { opacity: 0.15; }
        24% { opacity: 1; }
        34% { opacity: 0.2; }
        46% { opacity: 1; }
        60% { opacity: 0.4; }
        72% { opacity: 1; }
        100% { opacity: 1; }
      }
      @keyframes flowIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .flow-node { opacity: 0; animation: flowIn 0.4s ease forwards; transition: border-color 0.2s ease, color 0.2s ease; }
      .bp-card:hover .flow-node {
        border-color: ${orange};
        color: ${orange};
      }

      @media (prefers-reduced-motion: reduce) {
        .bp-letter, .bp-fill, .scroll-hint-arrow { animation: none !important; }
        .bp-fill { clip-path: none; }
      }
    `}</style>
  );
}
