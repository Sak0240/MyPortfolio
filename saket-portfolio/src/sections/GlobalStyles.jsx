import { TOKENS } from "../theme";

export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      ::selection { background: ${TOKENS.amberDim}; color: ${TOKENS.bg}; }
      input::placeholder { color: ${TOKENS.textFaint}; }
      a.plain { color: ${TOKENS.text}; text-decoration: none; }
      a.link { color: ${TOKENS.teal}; text-decoration: none; border-bottom: 1px solid ${TOKENS.tealDim}; }
      a.link:hover { border-color: ${TOKENS.teal}; }
      @media (max-width: 1400px) {
        .hide-mobile { display: none !important; }
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 28px;
      }
      .hero-col-left, .hero-col-right { display: none; }
      @media (min-width: 1280px) {
        .hero-grid {
          grid-template-columns: 180px minmax(0, 1fr) minmax(260px, 350px);
          gap: 48px;
          align-items: stretch;
        }
        .hero-col-left, .hero-col-right { display: flex; flex-direction: column; }
        .hero-col-center { max-width: 580px; }
        .hero-eyebrow-mobile { display: none; }
      }
      .hero-portrait-frame {
        position: relative;
        flex: 1;
        min-height: 360px;
      }
      .social-dock { display: flex; }
      @media (min-width: 1280px) {
        .social-dock { display: none; }
      }
      .dock-link:hover { color: ${TOKENS.teal}; }
      @keyframes quoteGlowPulse {
        0%, 100% { text-shadow: 0 0 12px ${TOKENS.teal}40; }
        50% { text-shadow: 0 0 20px ${TOKENS.teal}80; }
      }
      .skill-tooltip { opacity: 0; visibility: hidden; transition: opacity 0.15s ease; }
      .skill-tag:hover .skill-tooltip { opacity: 1; visibility: visible; }
      @media (min-width: 1280px) {
        .hero-shift-left { left: 103.5px; }
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
      .about-scene-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
      }
      @media (min-width: 900px) {
        .about-scene-grid { grid-template-columns: 1.5fr 1fr; align-items: center; gap: 48px; }
      }
      .about-grid {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: 36px;
        align-items: center;
      }
      @media (max-width: 700px) {
        .about-grid { grid-template-columns: 1fr; }
      }
      .term-scroll::-webkit-scrollbar { width: 6px; }
      .term-scroll::-webkit-scrollbar-track { background: transparent; }
      .term-scroll::-webkit-scrollbar-thumb { background: ${TOKENS.borderStrong}; border-radius: 4px; }
      .term-scroll { scrollbar-width: thin; scrollbar-color: ${TOKENS.borderStrong} transparent; height: 320px; }
      @media (min-width: 1280px) {
        .term-scroll { height: 262px; }
      }
      @keyframes termBreathe {
        0%, 100% { opacity: 0.14; }
        50% { opacity: 0.28; }
      }
      @keyframes termDotPulse {
        0%, 100% { opacity: 0.35; transform: scale(0.85); }
        50% { opacity: 1; transform: scale(1); }
      }
      .term-dot { animation: termDotPulse 1.8s ease-in-out infinite; }
      @keyframes cursorBlink {
        0%, 50% { opacity: 1; }
        50.01%, 100% { opacity: 0; }
      }
      .type-cursor { animation: cursorBlink 0.9s step-end infinite; margin-left: 1px; }
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
      @keyframes railFade {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .rail-fade { animation: railFade 0.5s ease; }
      @keyframes flowIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .flow-node { opacity: 0; animation: flowIn 0.4s ease forwards; transition: border-color 0.2s ease, color 0.2s ease; }
      .project-snapshot:hover .flow-node {
        border-color: ${TOKENS.amberDim};
        color: ${TOKENS.amber};
      }
    `}</style>
  );
}
