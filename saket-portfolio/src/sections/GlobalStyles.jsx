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

      .ask-showcase {
        border: 1px solid ${ink}; border-radius: 4px; background: ${TOKENS.panel};
        box-shadow: 8px 8px 0 ${ink}; overflow: hidden;
      }
      .ask-showcase-bar {
        display: flex; align-items: center; gap: 12px; padding: 10px 16px;
        background: ${ink}; color: ${TOKENS.bg}; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px;
      }
      .ask-showcase-body { padding: 22px clamp(16px, 4vw, 30px) 28px; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
      .ask-showcase-label { margin: 0 0 8px; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${TOKENS.textFaint}; }
      .ask-showcase-line {
        max-width: 100%; padding: 8px 12px; margin-left: -12px; border: 0; border-radius: 8px; cursor: pointer; text-align: left;
        background: transparent; color: ${ink}; font-family: 'IBM Plex Mono', monospace; font-size: 15px; line-height: 1.5;
        transition: background 0.15s ease, color 0.15s ease;
      }
      .ask-showcase-line span { color: ${orange}; margin-right: 6px; }
      .ask-showcase-line:hover { background: ${TOKENS.panelAlt}; }
      .ask-showcase-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 20px; margin-top: 22px; }
      .ask-showcase-note { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: ${TOKENS.textFaint}; }

      .ask-backdrop {
        position: fixed; inset: 0; z-index: 100;
        display: grid; place-items: center; padding: 28px;
        background:
          radial-gradient(circle at 1px 1px, rgba(20, 20, 20, 0.16) 1px, transparent 0) 0 0 / 22px 22px,
          rgba(244, 242, 238, 0.82);
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        animation: askFade 0.2s ease both;
      }
      @keyframes askFade { from { opacity: 0; } to { opacity: 1; } }
      .ask-window {
        position: relative; width: min(960px, 100%);
        height: min(780px, 100%);
        animation: askRise 0.28s cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }
      @keyframes askRise { from { opacity: 0; transform: translateY(18px) scale(0.985); } to { opacity: 1; transform: none; } }
      .ask-inner {
        position: relative; height: 100%; display: flex; flex-direction: column; overflow: hidden;
        background: ${TOKENS.bg}; border: 1px solid ${ink}; border-radius: 4px;
        box-shadow: 10px 10px 0 ${orange};
      }
      /* blueprint registration marks at the corners */
      .ask-mark { position: absolute; width: 16px; height: 16px; pointer-events: none; z-index: 2; }
      .ask-mark::before, .ask-mark::after { content: ""; position: absolute; background: ${ink}; }
      .ask-mark::before { left: 7px; top: 0; width: 1px; height: 16px; }
      .ask-mark::after { top: 7px; left: 0; height: 1px; width: 16px; }
      .ask-mark-tl { left: -9px; top: -9px; } .ask-mark-tr { right: 1px; top: -9px; }
      .ask-mark-bl { left: -9px; bottom: 1px; } .ask-mark-br { right: 1px; bottom: 1px; display: none; }

      .ask-bar {
        position: relative; display: flex; align-items: center; gap: 14px; padding: 12px 14px 12px 16px;
        background: ${ink}; color: ${TOKENS.bg}; font-family: 'IBM Plex Mono', monospace;
      }
      .ask-bar::after {
        content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 3px;
        background: linear-gradient(90deg, transparent 0%, ${orange} 40%, #FF9B73 60%, transparent 100%) 0 0 / 200% 100%;
        animation: askSweep 3.2s linear infinite;
      }
      @keyframes askSweep { from { background-position: 100% 0; } to { background-position: -100% 0; } }
      .ask-dots { display: inline-flex; gap: 6px; }
      .ask-dots i { width: 10px; height: 10px; border-radius: 50%; background: ${TOKENS.textFaint}; }
      .ask-bar .ask-dots i:first-child { background: ${orange}; }
      .ask-bar-title { font-size: 13px; letter-spacing: 0.03em; white-space: nowrap; }
      .ask-bar-badge {
        margin-left: auto; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: #d9d5cd;
        border: 1px solid rgba(255, 255, 255, 0.28); border-radius: 999px; padding: 4px 10px; white-space: nowrap;
      }
      .ask-bar-actions { display: inline-flex; gap: 2px; }
      .ask-icon-btn { width: 34px; height: 34px; border: 0; border-radius: 8px; cursor: pointer; background: transparent; color: ${TOKENS.bg}; font-size: 17px; line-height: 1; }
      .ask-icon-btn:hover { background: rgba(255, 255, 255, 0.16); }
      .ask-bar a:focus-visible, .ask-bar button:focus-visible { outline-color: #fff; }

      .ask-body {
        flex: 1; overflow-y: auto; overscroll-behavior: contain; padding: 24px clamp(16px, 4vw, 34px) 12px;
        background: radial-gradient(circle at 1px 1px, rgba(20, 20, 20, 0.07) 1px, transparent 0) 0 0 / 20px 20px, ${TOKENS.bg};
      }
      .ask-welcome { padding: 6px 0 18px; }
      .ask-kicker { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: ${orange}; }
      .ask-hello { font-size: clamp(34px, 6vw, 62px); line-height: 1 !important; margin: 12px 0 14px; color: ${ink}; }
      .ask-welcome > p { max-width: 640px; margin: 0 0 24px; font-size: 16px; line-height: 1.75; color: ${TOKENS.textDim}; }
      .ask-starters { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; max-width: 760px; }
      .ask-starter {
        display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 18px; cursor: pointer; text-align: left;
        background: #fff; color: ${ink}; border: 1px solid ${ink}; border-radius: 4px;
        font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; line-height: 1.35;
        box-shadow: 3px 3px 0 ${ink}; transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
      }
      .ask-starter b { color: ${orange}; font-size: 18px; transition: transform 0.15s ease; }
      .ask-starter:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 ${orange}; background: #fffaf6; }
      .ask-starter:hover b { transform: translateX(4px); }

      .ask-q { margin: 18px 0 8px; font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: ${orange}; overflow-wrap: anywhere; }
      .ask-q-question { color: ${ink}; font-weight: 500; font-size: 15px; }
      .ask-q-question span { color: ${orange}; }
      .ask-out { font-family: 'IBM Plex Mono', monospace; font-size: 13px; line-height: 1.75; color: ${TOKENS.textDim}; white-space: pre-wrap; overflow-wrap: anywhere; }
      .ask-a {
        margin: 6px 0 14px; padding: 14px 18px; background: #fff; color: ${ink};
        border: 1px solid ${TOKENS.border}; border-left: 3px solid ${orange}; border-radius: 2px;
        font-family: 'IBM Plex Sans', sans-serif; font-size: 15.5px; line-height: 1.75; overflow-wrap: anywhere;
        animation: askFade 0.25s ease both;
      }
      .ask-a p { margin: 0; } .ask-a p + p, .ask-a p + ul, .ask-a ul + p { margin-top: 10px; }
      .ask-a ul { margin: 0; padding-left: 22px; } .ask-a li + li { margin-top: 5px; }
      .ask-a-error { border-left-color: #D96B5C; }
      .ask-a .ask-sources { margin-top: 12px; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: ${TOKENS.textDim}; }
      .ask-sources span { color: ${orange}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-right: 6px; }
      .ask-retrieval { margin: 4px 0 4px; }
      .ask-retrieval-title { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${TOKENS.textFaint}; margin-bottom: 4px; }
      .ask-retrieval-row { display: flex; align-items: center; gap: 10px; padding: 3px 0; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; }
      .ask-retrieval-row span { color: ${orange}; min-width: 52px; }
      .ask-retrieval-row em { font-style: normal; color: ${TOKENS.textDim}; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ask-project { margin: 8px 0 14px; padding: 14px 18px; background: #fff; border: 1px solid ${TOKENS.border}; border-left: 3px solid ${ink}; }
      .ask-project-name { font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; font-weight: 600; margin-bottom: 2px; }
      .ask-project-org { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: ${TOKENS.textFaint}; margin-bottom: 10px; }
      .ask-thinking { display: flex; align-items: center; gap: 12px; margin: 10px 0; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: ${orange}; }
      .chat-dots { display: inline-flex; gap: 5px; align-items: center; height: 22px; }
      .chat-dots i { width: 7px; height: 7px; border-radius: 50%; background: ${orange}; animation: chatDot 1.1s ease-in-out infinite; }
      .chat-dots i:nth-child(2) { animation-delay: 0.15s; } .chat-dots i:nth-child(3) { animation-delay: 0.3s; }
      @keyframes chatDot { 0%, 80%, 100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-4px); } }

      .ask-chips { padding: 8px clamp(16px, 4vw, 34px) 4px; background: ${TOKENS.bg}; border-top: 1px dashed ${TOKENS.border}; }
      .ask-chip-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
      .ask-chip {
        padding: 8px 14px; border: 1px solid ${ink}; border-radius: 999px; cursor: pointer; background: #fff; color: ${ink};
        font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; line-height: 1.3; text-align: left;
        transition: background 0.15s ease, color 0.15s ease;
      }
      .ask-chip:hover { background: ${ink}; color: #fff; }
      .ask-chip-cmd { font-family: 'IBM Plex Mono', monospace; font-size: 12px; padding: 6px 12px; background: transparent; border-style: dashed; }
      .ask-form { display: flex; align-items: center; gap: 12px; padding: 12px clamp(16px, 4vw, 34px); background: #fff; border-top: 1px solid ${ink}; }
      .ask-prompt { font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 600; color: ${orange}; }
      .ask-form input {
        flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: ${ink};
        font-family: 'IBM Plex Mono', monospace; font-size: 16px; padding: 10px 0;
      }
      .ask-form input:focus-visible { outline: 0; }
      .ask-form:focus-within { box-shadow: inset 0 -3px 0 ${orange}; }
      .ask-send { flex: none; width: 46px; height: 42px; border: 0; border-radius: 8px; cursor: pointer; background: ${orange}; color: #fff; display: grid; place-items: center; }
      .ask-send:hover:not(:disabled) { background: #e84a10; }
      .ask-send:disabled { opacity: 0.35; cursor: not-allowed; }
      .ask-foot { padding: 7px 16px 9px; background: ${ink}; color: #c9c5bd; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.03em; text-align: center; }
      .ask-foot kbd { padding: 2px 6px; margin: 0 2px; }

      @media (max-width: 600px) {
        .site-nav { padding: 12px 14px !important; gap: 8px; }
        .site-nav > div { gap: 8px !important; }
        .nav-ask { padding: 7px 12px; font-size: 12px; }
        .site-nav .pill-sm { padding: 8px 14px; font-size: 13px; }
      }
      @media (max-width: 760px) {
        .ask-backdrop { padding: 0; }
        .ask-window { width: 100%; height: 100vh; height: 100dvh; }
        .ask-inner { border-radius: 0; border: 0; box-shadow: none; }
        .ask-mark { display: none; }
        .ask-bar-badge, .ask-foot { display: none; }
        .ask-starters { grid-template-columns: 1fr; }
        .ask-form input { font-size: 16px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .bp-letter, .bp-fill, .scroll-hint-arrow, .orbit, .orbit-badge { animation: none !important; }
        .bp-fill { clip-path: none; }
        .ask-spark, .ask-bar::after, .ask-backdrop, .ask-window, .ask-a, .chat-dots i { animation: none !important; }
        html { scroll-behavior: auto; }
      }
    `}</style>
  );
}
