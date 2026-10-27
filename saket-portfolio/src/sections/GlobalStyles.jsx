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
      @keyframes orbitSpin { to { transform: rotate(360deg); } }
      @keyframes orbitCounter { to { transform: translate(-50%, -50%) rotate(-360deg); } }
      .orbit { animation: orbitSpin 90s linear infinite; }
      .orbit-badge {
        position: absolute;
        left: 0;
        top: 0;
        width: 44px;
        height: 44px;
        padding: 9px;
        border-radius: 50%;
        background: #fff;
        border: 1px solid ${ink};
        box-shadow: 3px 3px 0 ${orange};
        transform: translate(-50%, -50%);
        animation: orbitCounter 90s linear infinite;
        transition: width 0.2s ease, height 0.2s ease, padding 0.2s ease;
      }
      .orbit-badge:hover { width: 54px; height: 54px; padding: 11px; }
      .orbit-wrap:hover .orbit, .orbit-wrap:hover .orbit-badge { animation-play-state: paused; }
      @media (max-width: 600px) {
        .orbit-badge { width: 36px; height: 36px; padding: 7px; }
      }

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
      .pill-ghost { white-space: nowrap; }
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

      /* ---------- accessibility helpers ---------- */
      .sr-only {
        position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
        overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
      }
      a:focus-visible, button:focus-visible, input:focus-visible {
        outline: 3px solid ${orange};
        outline-offset: 3px;
      }

      /* ---------- "Ask Saket's AI": hero button, home showcase, console ---------- */
      .ask-hero-btn {
        position: relative; display: inline-flex; align-items: center; gap: 14px;
        padding: 16px 20px 16px 24px; cursor: pointer;
        border: 1px solid ${ink}; border-radius: 999px;
        background: ${ink}; color: #fff;
        font-family: 'IBM Plex Sans', sans-serif; font-size: 17px; font-weight: 500; white-space: nowrap;
        box-shadow: 5px 5px 0 ${orange};
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }
      .ask-hero-btn:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 ${orange}; }
      .ask-hero-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 ${orange}; }
      .ask-spark { color: ${orange}; display: inline-block; font-size: 1.05em; animation: askSpin 7s linear infinite; }
      @keyframes askSpin { to { transform: rotate(360deg); } }
      .ask-kbd, .ask-foot kbd {
        font-family: 'IBM Plex Mono', monospace; font-size: 11px; line-height: 1;
        padding: 4px 7px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.4); color: #e6e2da;
      }
      @media (max-width: 700px) { .ask-kbd { display: none; } }

      /* ---------- the orange orb: the hero sphere grows and the conversation lives inside it ---------- */
      html.ask-open [data-hero-sphere] { visibility: hidden; } /* the orb is that sphere, taking over its place */
      .ask-root { position: fixed; inset: 0; z-index: 100; }
      .ask-veil {
        position: absolute; inset: 0;
        background: rgba(244, 242, 238, 0.5);
        backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
        animation: askFade 0.55s ease both;
      }
      .ask-root.is-closing .ask-veil { animation: askFadeOut 0.5s ease both; }
      @keyframes askFade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes askFadeOut { from { opacity: 1; } to { opacity: 0; } }

      .ask-orb { position: absolute; z-index: 2; border-radius: 50%; will-change: transform; transform-origin: 50% 50%; }
      .ask-orb-inner {
        position: absolute; inset: 0; border-radius: 50%;
        box-shadow: 0 40px 90px -30px rgba(255, 90, 31, 0.65), 0 0 0 1px rgba(20, 20, 20, 0.9);
      }
      .ask-orb-inner.is-busy { animation: askBreathe 2.2s ease-in-out infinite; }
      @keyframes askBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.022); } }

      /* ripples and the slow dashed orbits that echo the hero artwork */
      .ask-ripple {
        position: absolute; border-radius: 50%; border: 2px solid #FF5A1F; pointer-events: none;
        animation: askRipple 1.1s ease-out 0.3s both;
      }
      @keyframes askRipple { from { transform: scale(0.96); opacity: 0.85; } to { transform: scale(1.22); opacity: 0; } }
      .ask-ring { position: absolute; border-radius: 50%; border: 1px dashed rgba(20, 20, 20, 0.55); pointer-events: none; opacity: 0; }
      .ask-ring-a { animation: askRingIn 0.7s ease 0.55s forwards, askSpin 90s linear infinite; }
      .ask-ring-b { border-color: rgba(255, 90, 31, 0.7); animation: askRingIn 0.7s ease 0.75s forwards, askSpin 140s linear infinite reverse; }
      @keyframes askRingIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      .ask-root.is-closing .ask-ring { animation: askFadeOut 0.3s ease both; }
      .ask-root.is-closing .ask-ripple { display: none; }

      .ask-stage {
        position: absolute; z-index: 3; display: flex; flex-direction: column; min-height: 0;
        color: ${ink};
        animation: askStageIn 0.5s ease 0.42s both;
      }
      .ask-stage-m { inset: 0; width: 100%; height: 100vh; height: 100dvh; padding: 14px 16px 12px; }
      .ask-root.is-closing .ask-stage { animation: askStageOut 0.2s ease both; }
      @keyframes askStageIn { from { opacity: 0; transform: translateY(14px) scale(0.985); } to { opacity: 1; transform: none; } }
      @keyframes askStageOut { from { opacity: 1; } to { opacity: 0; transform: translateY(6px); } }

      .ask-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 4px 4px 10px; }
      .ask-kicker { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${ink}; opacity: 0.85; }
      .ask-title { font-size: clamp(26px, 3.2vw, 40px); line-height: 1 !important; margin: 6px 0 0; color: ${ink}; }
      .ask-head-actions { display: flex; gap: 8px; }
      .ask-icon-btn {
        width: 38px; height: 38px; border-radius: 50%; cursor: pointer; line-height: 1; font-size: 16px;
        border: 1px solid ${ink}; background: ${TOKENS.bg}; color: ${ink};
        transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
      }
      .ask-icon-btn:hover { background: ${ink}; color: #fff; transform: rotate(90deg); }

      .ask-body {
        flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 6px 6px 10px;
        -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 14px, #000 calc(100% - 18px), transparent 100%);
        mask-image: linear-gradient(to bottom, transparent 0, #000 14px, #000 calc(100% - 18px), transparent 100%);
        scrollbar-width: thin; scrollbar-color: rgba(20, 20, 20, 0.5) transparent;
      }
      .ask-welcome > p { margin: 4px 0 16px; font-size: 15.5px; line-height: 1.65; color: ${ink}; max-width: 440px; }
      .ask-starters { display: flex; flex-direction: column; gap: 10px; }
      .ask-starter {
        display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px 18px; cursor: pointer; text-align: left;
        background: ${TOKENS.bg}; color: ${ink}; border: 1px solid ${ink}; border-radius: 999px;
        font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; line-height: 1.3;
        box-shadow: 3px 3px 0 ${ink}; transition: transform 0.15s ease, box-shadow 0.15s ease;
        animation: askPop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .ask-starter:nth-child(1) { animation-delay: 0.7s; } .ask-starter:nth-child(2) { animation-delay: 0.78s; }
      .ask-starter:nth-child(3) { animation-delay: 0.86s; } .ask-starter:nth-child(4) { animation-delay: 0.94s; }
      @keyframes askPop { from { opacity: 0; transform: translateY(14px) scale(0.96); } to { opacity: 1; transform: none; } }
      .ask-starter b { font-size: 18px; transition: transform 0.15s ease; }
      .ask-starter:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 ${ink}; }
      .ask-starter:hover b { transform: translateX(4px); }

      .ask-q { margin: 14px 0 8px; font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 500; color: ${ink}; overflow-wrap: anywhere; animation: askPop 0.35s ease both; }
      .ask-q span { color: #fff; margin-right: 4px; }
      .ask-q-question { font-size: 15px; font-weight: 600; }
      .ask-card {
        margin: 6px 0 12px; padding: 13px 17px; background: ${TOKENS.bg}; color: ${ink};
        border: 1px solid ${ink}; border-radius: 18px; border-top-left-radius: 4px;
        box-shadow: 4px 4px 0 rgba(20, 20, 20, 0.9); overflow-wrap: anywhere; animation: askPop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .ask-out { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; line-height: 1.7; white-space: pre-wrap; }
      .ask-a { font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; line-height: 1.7; }
      .ask-a p { margin: 0; } .ask-a p + p, .ask-a p + ul, .ask-a ul + p { margin-top: 9px; }
      .ask-a ul { margin: 0; padding-left: 20px; } .ask-a li + li { margin-top: 4px; }
      .ask-a-error { border-color: #8A1F0E; }
      .ask-a .ask-sources { margin-top: 10px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: ${TOKENS.textDim}; }
      .ask-sources span { color: ${orange}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-right: 6px; }
      .ask-retrieval-title { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${TOKENS.textFaint}; margin-bottom: 4px; }
      .ask-retrieval-row { display: flex; align-items: center; gap: 10px; padding: 2px 0; font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
      .ask-retrieval-row span { color: ${orange}; min-width: 50px; }
      .ask-retrieval-row em { font-style: normal; color: ${TOKENS.textDim}; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ask-project-name { font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; font-weight: 600; margin-bottom: 2px; }
      .ask-project-org { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: ${TOKENS.textFaint}; margin-bottom: 10px; }
      .ask-thinking { display: flex; align-items: center; gap: 12px; margin: 10px 0; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 500; color: ${ink}; }
      .chat-dots { display: inline-flex; gap: 5px; align-items: center; height: 22px; }
      .chat-dots i { width: 8px; height: 8px; border-radius: 50%; background: ${ink}; animation: chatDot 1.1s ease-in-out infinite; }
      .chat-dots i:nth-child(2) { animation-delay: 0.15s; } .chat-dots i:nth-child(3) { animation-delay: 0.3s; }
      @keyframes chatDot { 0%, 80%, 100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-4px); } }

      @media (max-height: 780px) {
        .ask-title { font-size: 30px; }
        .ask-head { padding-bottom: 4px; }
        .ask-welcome > p { font-size: 14px; line-height: 1.5; margin-bottom: 10px; }
        .ask-starters { gap: 7px; }
        .ask-starter { padding: 9px 16px; font-size: 14px; box-shadow: 2px 2px 0 ${ink}; }
        .ask-chip-cmd { padding: 4px 10px; }
        .ask-q { margin-top: 10px; }
      }
      .ask-chips { padding: 4px 4px 0; }
      .ask-chip-row { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 7px; }
      .ask-chip {
        padding: 7px 13px; border: 1px solid ${ink}; border-radius: 999px; cursor: pointer; background: ${TOKENS.bg}; color: ${ink};
        font-family: 'IBM Plex Sans', sans-serif; font-size: 12.5px; line-height: 1.3; text-align: left;
        transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
      }
      .ask-chip:hover { background: ${ink}; color: #fff; transform: translateY(-1px); }
      .ask-chip-cmd { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; padding: 5px 11px; background: transparent; border-style: dashed; }
      .ask-form {
        display: flex; align-items: center; gap: 10px; margin: 4px 0 2px; padding: 6px 6px 6px 18px;
        background: ${TOKENS.bg}; border: 1px solid ${ink}; border-radius: 999px; box-shadow: 4px 4px 0 ${ink};
      }
      .ask-form:focus-within { box-shadow: 4px 4px 0 ${ink}, 0 0 0 3px #fff; }
      .ask-prompt { font-family: 'IBM Plex Mono', monospace; font-size: 17px; font-weight: 700; color: ${orange}; }
      .ask-form input {
        flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: ${ink};
        font-family: 'IBM Plex Mono', monospace; font-size: 16px; padding: 9px 0;
      }
      .ask-form input:focus-visible { outline: 0; }
      .ask-form input::placeholder { color: ${TOKENS.textFaint}; }
      .ask-send { flex: none; width: 42px; height: 42px; border: 0; border-radius: 50%; cursor: pointer; background: ${ink}; color: #fff; display: grid; place-items: center; transition: transform 0.15s ease, background 0.15s ease; }
      .ask-send:hover:not(:disabled) { background: ${orange}; transform: scale(1.06); }
      .ask-send:disabled { opacity: 0.3; cursor: not-allowed; }
      .ask-stage a:focus-visible, .ask-stage button:focus-visible { outline: 3px solid #fff; outline-offset: 2px; box-shadow: 0 0 0 5px ${ink}; }


      @media (max-width: 760px) {
        .ask-title { font-size: clamp(26px, 8vw, 38px); }
        .ask-welcome > p { max-width: none; }
        .ask-ripple { display: none; }
      }

      @media (max-width: 600px) {
        .site-nav { padding: 12px 14px !important; gap: 8px; }
        .site-nav > div { gap: 8px !important; }
        .nav-ask { padding: 7px 12px; font-size: 12px; }
        .site-nav .pill-sm { padding: 8px 14px; font-size: 13px; }
      }

      /* ---------- "how this works": drawn around the orb's dashed ring (no box) ---------- */
      .how-ring { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
      .ring-glow, .how-ring { --paper-glow: 0 0 5px #F4F2EE, 0 0 10px #F4F2EE, 0 0 18px #F4F2EE; }
      .how-scrim { /* a soft paper cloud behind the text: no edges, so it reads as part of the page, not a box */
        position: absolute; top: 0; bottom: 0;
        background: radial-gradient(ellipse 62% 64% at 38% 50%, rgba(244, 242, 238, 0.97) 0%, rgba(244, 242, 238, 0.9) 48%, rgba(244, 242, 238, 0) 100%);
        animation: askFade 0.9s ease 0.5s both;
      }
      .how-svg { position: absolute; inset: 0; overflow: visible; }
      .how-arc { fill: none; stroke: rgba(20, 20, 20, 0.3); stroke-width: 2; stroke-dasharray: 3 6; stroke-linecap: round; transition: stroke 0.5s ease, stroke-width 0.5s ease; }
      .how-arc.is-lit { stroke: ${orange}; stroke-width: 3.5; stroke-dasharray: none; }
      .how-node { animation: howIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: calc(0.85s + var(--i) * 0.08s); }
      .how-leader { stroke: rgba(20, 20, 20, 0.45); stroke-width: 1.2; }
      .how-dot { fill: ${TOKENS.bg}; stroke: ${ink}; stroke-width: 1.8; transition: fill 0.35s ease, stroke 0.35s ease; }
      .how-dot-text { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 700; fill: ${ink}; transition: fill 0.35s ease; }
      .how-node.is-active .how-dot { fill: ${orange}; }
      .how-node.is-active .how-dot-text, .how-node.is-done .how-dot-text { fill: #fff; }
      .how-node.is-active .how-leader { stroke: ${orange}; stroke-width: 2; }
      .how-node.is-done .how-dot { fill: ${ink}; }
      .how-node.is-stop .how-dot { fill: ${orange}; stroke-width: 2.5; }
      .how-node.is-stop .how-leader { stroke: ${orange}; stroke-width: 2; }
      .how-node.is-skip .how-dot { stroke-dasharray: 3 3; stroke: rgba(20, 20, 20, 0.45); }
      .how-node.is-skip .how-dot-text { fill: rgba(20, 20, 20, 0.5); }
      .how-pulse { fill: none; stroke: ${orange}; stroke-width: 2.5; transform-box: fill-box; transform-origin: center; animation: howPulse 1.3s ease-out infinite; }
      @keyframes howPulse { from { transform: scale(1); opacity: 0.9; } to { transform: scale(2.4); opacity: 0; } }
      @keyframes howIn { from { opacity: 0; translate: -14px 0; } to { opacity: 1; translate: 0 0; } }

      .how-head { position: absolute; text-shadow: var(--paper-glow); animation: howIn 0.55s ease 0.7s both; }
      .how-kicker { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${orange}; font-weight: 600; }
      .how-title { font-family: 'Archivo', 'Arial Black', sans-serif; font-variation-settings: "wdth" 108; font-weight: 800; text-transform: uppercase; font-size: 26px; line-height: 1; margin-top: 5px; color: ${ink}; letter-spacing: -0.01em; }
      .how-label {
        position: absolute; translate: 0 -50%; color: ${ink}; text-shadow: var(--paper-glow);
        animation: howLabelIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: calc(0.9s + var(--i) * 0.08s);
        transition: opacity 0.4s ease;
      }
      @keyframes howLabelIn { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
      .how-label-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; font-weight: 600; line-height: 1.25; }
      .how-label-title em {
        font-style: normal; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; font-weight: 500; letter-spacing: 0.02em;
        margin-left: 4px; padding: 1px 8px; border: 1px solid rgba(20, 20, 20, 0.35); border-radius: 999px; color: #4b4943; white-space: nowrap; text-shadow: none; background: rgba(244, 242, 238, 0.85);
      }
      .how-label-short { margin-top: 2px; font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; line-height: 1.35; color: #3b3833; }
      .how-label-short.is-note { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; font-weight: 500; color: ${ink}; }
      .how-label.is-idle { opacity: 0.78; }
      .how-label.is-active .how-label-title em { border-color: ${orange}; color: ${ink}; background: #fff; }
      .how-label.is-active .how-label-short { color: ${ink}; }
      .how-label.is-stop .how-label-short { color: #8A1F0E; font-weight: 600; }
      .how-label.is-stop .how-label-title em { border-color: ${orange}; background: #fff; }
      .how-label.is-skip { opacity: 0.5; }
      .how-status {
        position: absolute; margin: 0; padding-left: 12px; border-left: 3px solid ${orange}; text-shadow: var(--paper-glow);
        font-family: 'IBM Plex Sans', sans-serif; font-size: 13.5px; font-weight: 500; line-height: 1.4; color: ${ink};
        animation: howIn 0.55s ease 1.5s both;
      }
      .ask-root.is-closing .how-ring { animation: askFadeOut 0.25s ease both; }

      /* the same journey as a flat list on the orange, for screens with no room beside the orb */
      .ask-how-inline { padding: 2px 2px 14px; }
      .ask-how-inline .how-kicker { color: ${ink}; opacity: 0.85; }
      .how-list-title { font-size: 26px; line-height: 1 !important; margin: 6px 0 16px; color: ${ink}; }
      .how-steps { list-style: none; margin: 0; padding: 0; }
      .how-step { position: relative; display: flex; gap: 12px; padding-bottom: 12px; }
      .how-step:last-child { padding-bottom: 0; }
      .how-step::before { content: ""; position: absolute; left: 11px; top: 26px; bottom: -1px; width: 2px; background: rgba(20, 20, 20, 0.35); transition: background 0.4s ease; }
      .how-step:last-child::before { display: none; }
      .how-step.is-done::before { background: ${ink}; }
      .how-badge {
        flex: none; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; line-height: 1;
        font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 700; border: 1.5px solid ${ink}; color: ${ink}; background: ${TOKENS.bg};
        transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
      }
      .how-step.is-active .how-badge { background: #fff; transform: scale(1.18); animation: howBadgePulse 1.2s ease-in-out infinite; }
      @keyframes howBadgePulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(20, 20, 20, 0.5); } 50% { box-shadow: 0 0 0 7px rgba(20, 20, 20, 0); } }
      .how-step.is-done .how-badge { background: ${ink}; color: #fff; }
      .how-step.is-stop .how-badge { background: #fff; color: ${ink}; box-shadow: 2px 2px 0 ${ink}; }
      .how-step.is-skip .how-badge { border-style: dashed; opacity: 0.6; }
      .how-step.is-skip { opacity: 0.6; }
      .how-text { min-width: 0; }
      .how-row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; }
      .how-row strong { font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; font-weight: 600; color: ${ink}; }
      .how-row em { font-style: normal; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: ${ink}; border: 1px solid ${ink}; border-radius: 999px; padding: 1px 8px; background: rgba(244, 242, 238, 0.7); }
      .how-text p { margin: 3px 0 0; font-family: 'IBM Plex Sans', sans-serif; font-size: 13.5px; line-height: 1.5; color: ${ink}; }
      .how-text .how-note { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; overflow-wrap: anywhere; }
      .how-step.is-stop .how-note { color: #6b1608; }
      .how-list-status { margin: 14px 0 0; padding-left: 12px; border-left: 3px solid #fff; font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; font-weight: 600; line-height: 1.45; color: ${ink}; }

      @media (prefers-reduced-motion: reduce) {
        .bp-letter, .bp-fill, .scroll-hint-arrow, .orbit, .orbit-badge { animation: none !important; }
        .bp-fill { clip-path: none; }
        .how-node, .how-label, .how-head, .how-status, .how-scrim, .how-pulse, .how-badge, .ask-spark, .ask-veil, .ask-ripple, .ask-ring, .ask-stage, .ask-starter, .ask-q, .ask-card, .ask-orb-inner, .chat-dots i { animation: none !important; }
        .ask-ring { opacity: 1; }
        html { scroll-behavior: auto; }
      }
    `}</style>
  );
}
