import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "../../data/projects";
import { RESUME_PDF } from "../../data/assets";
import { askQuestion, ChatError, RATE_LIMITED_TEXT, UNREACHABLE_TEXT } from "../../lib/chatApi";
import { OrangeSphere } from "../blueprint/Decor";
import { OPEN_ASK_EVENT, STARTERS } from "./events";
import RichText from "./RichText";
import ScoreBar from "../terminal/ScoreBar";
import FlowDiagram from "../terminal/FlowDiagram";
import Tag from "../shared/Tag";

const STORE_KEY = "saket-ask-v1";
const MAX_STORED = 40;
const OPEN_MS = 780;
const CLOSE_MS = 560;
const COMMAND_CHIPS = ["projects", "skills", "contact", "resume", "help"];

// Commands whose answers should come from Saket's documents rather than hard-coded text.
const COMMAND_QUESTIONS = {
  about: "Tell me about Saket",
  work: "What is Saket's current role?",
  experience: "Summarize Saket's work experience",
  skills: "What are Saket's technical skills?",
};

const HELP_TEXT = [
  "ask anything    e.g. \"What did Saket build at KWAD?\"",
  "about           who Saket is",
  "work            current role",
  "experience      work history",
  "skills          technical skills",
  "projects        list projects",
  "project <n>     project architecture diagram",
  "contact         get in touch",
  "resume          download resume",
  "clear           start over",
  "esc             close",
].join("\n");

const reducedMotion = () => typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function load() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.slice(-MAX_STORED).map((e) => ({ ...e, fresh: false })) : [];
  } catch {
    return [];
  }
}

function sourceLabel(source) {
  return source === "Resume" ? "Resume" : source.replace(/\.(md|txt|pdf|docx)$/i, "").replace(/[_-]+/g, " ");
}

/** Adds a 0..1 bar length to the API's retrieval sources ({ id, title, score }). */
function withBars(sources) {
  const max = sources[0]?.score || 1;
  return sources.map((c, i) => ({ ...c, bar: Math.min(0.98, 0.55 + (c.score / max) * 0.4 - i * 0.03) }));
}

/** Where the circle should end up: a big orb over the left of the screen (desktop) or the whole screen (phone). */
function targetGeometry() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw <= 760) {
    const d = Math.hypot(vw, vh) * 1.04; // a circle that covers the entire screen
    return { mobile: true, d, cx: vw / 2, cy: vh / 2 };
  }
  const d = Math.min(vh * 1.04, vw * 0.9);
  return { mobile: false, d, cx: d * 0.47, cy: vh / 2, boxW: d * 0.62, boxH: Math.min(d * 0.74, vh - 40) };
}

/** Where the animation starts: the hero's own orange sphere if it is on screen, otherwise the button that was clicked. */
function findOrigin(trigger) {
  const sphere = document.querySelector("[data-hero-sphere]");
  if (sphere) {
    const r = sphere.getBoundingClientRect();
    if (r.width > 40 && r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight) {
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, d: r.width };
    }
  }
  const t = trigger && trigger.getBoundingClientRect ? trigger.getBoundingClientRect() : null;
  if (t && t.width > 0) {
    return { cx: t.left + t.width / 2, cy: t.top + t.height / 2, d: Math.max(36, Math.min(t.width, t.height)) };
  }
  return { cx: window.innerWidth / 2, cy: window.innerHeight / 2, d: 40 };
}

const circleStyle = (g, k = 1) => ({ left: g.cx - (g.d * k) / 2, top: g.cy - (g.d * k) / 2, width: g.d * k, height: g.d * k });

/** An answer that writes itself out word by word (instantly when it is old or motion is reduced). */
function TypedAnswer({ text, animate, onProgress }) {
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  const [count, setCount] = useState(animate ? 0 : tokens.length);
  useEffect(() => {
    if (!animate) return undefined;
    const perToken = Math.max(8, Math.min(26, 1500 / tokens.length));
    let shown = 0;
    let last = performance.now();
    let raf = 0;
    const step = (now) => {
      const advance = Math.floor((now - last) / perToken);
      if (advance > 0) {
        shown = Math.min(tokens.length, shown + advance);
        last = now;
        setCount(shown);
        if (onProgress) onProgress();
      }
      if (shown < tokens.length) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animate, tokens, onProgress]);
  return <RichText text={tokens.slice(0, count).join("")} />;
}

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export default function AskConsole() {
  const [phase, setPhase] = useState("closed"); // closed | open | closing
  const [geom, setGeom] = useState(targetGeometry);
  const [history, setHistory] = useState(load);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const orbRef = useRef(null);
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const openerRef = useRef(null);
  const originRef = useRef(null);
  const busyRef = useRef(false);
  const pendingRef = useRef(null);
  const phaseRef = useRef("closed");
  const idRef = useRef(Math.max(0, ...history.map((e) => e.id || 0)));
  const lastQuestion = useRef(null);
  const emptyRef = useRef(true);
  phaseRef.current = phase;
  emptyRef.current = history.length === 0;

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-MAX_STORED).map((e) => ({ ...e, fresh: false }))));
    } catch {
      /* private mode: the console still works, it just isn't remembered */
    }
  }, [history]);

  const push = useCallback((entry) => setHistory((h) => [...h, { id: ++idRef.current, ...entry }]), []);

  const scrollToEnd = useCallback(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = emptyRef.current ? 0 : body.scrollHeight; // the welcome screen stays at its top
  }, []);

  const openConsole = useCallback((question, trigger) => {
    if (phaseRef.current !== "closed") return;
    const from = trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    openerRef.current = from;
    originRef.current = findOrigin(from);
    if (typeof question === "string" && question.trim()) pendingRef.current = question.trim();
    setGeom(targetGeometry());
    document.documentElement.classList.add("ask-open"); // hides the hero sphere: the orb *is* that sphere
    setPhase("open");
  }, []);

  const close = useCallback(() => {
    if (phaseRef.current !== "open") return;
    setPhase("closing");
    const finish = () => {
      document.documentElement.classList.remove("ask-open");
      setHistory((h) => (h.some((e) => e.fresh) ? h.map((e) => ({ ...e, fresh: false })) : h));
      setPhase("closed");
      const opener = openerRef.current;
      if (opener && opener.isConnected && opener.focus) opener.focus();
    };
    const orb = orbRef.current;
    const o = originRef.current;
    if (!orb || !o || reducedMotion()) {
      finish();
      return;
    }
    const g = targetGeometry();
    orb
      .animate(
        [
          { transform: "translate(0px, 0px) scale(1)" },
          { transform: `translate(${o.cx - g.cx}px, ${o.cy - g.cy}px) scale(${o.d / g.d})` },
        ],
        { duration: CLOSE_MS, easing: "cubic-bezier(0.6, 0, 0.3, 1)", fill: "forwards" }
      )
      .addEventListener("finish", finish, { once: true });
  }, []);

  // the circle grows out of the hero sphere (or the clicked button) to its place on screen
  useLayoutEffect(() => {
    if (phase !== "open" || !orbRef.current || !originRef.current) return;
    const o = originRef.current;
    const g = targetGeometry();
    if (reducedMotion()) return;
    orbRef.current.animate(
      [
        { transform: `translate(${o.cx - g.cx}px, ${o.cy - g.cy}px) scale(${o.d / g.d})` },
        { transform: "translate(0px, 0px) scale(1)" },
      ],
      { duration: OPEN_MS, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" }
    );
  }, [phase]);

  // open from anywhere: hero button, nav, showcase card, Ctrl/Cmd+K, or a #ask link
  useEffect(() => {
    const onOpen = (e) => openConsole(e.detail && e.detail.question, e.detail && e.detail.trigger);
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (phaseRef.current === "closed") openConsole();
        else close();
      }
    };
    const onHash = () => window.location.hash === "#ask" && openConsole();
    const onResize = () => phaseRef.current === "open" && setGeom(targetGeometry());
    window.addEventListener(OPEN_ASK_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("resize", onResize);
    onHash();
    return () => {
      window.removeEventListener(OPEN_ASK_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("resize", onResize);
    };
  }, [openConsole, close]);

  // the page behind must not scroll while the console is open
  useEffect(() => {
    if (phase === "closed") return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase === "closed"]); // eslint-disable-line react-hooks/exhaustive-deps

  const ask = useCallback(
    async (question) => {
      busyRef.current = true;
      setBusy(true);
      try {
        const r = await askQuestion(question, lastQuestion.current);
        lastQuestion.current = question;
        if (r.grounded && r.sources.length) push({ kind: "retrieval", items: withBars(r.sources).slice(0, 3) });
        push({
          kind: "answer",
          fresh: true,
          text: r.answer || UNREACHABLE_TEXT,
          sources: r.grounded ? [...new Set(r.sources.map((s) => sourceLabel(s.source)))].slice(0, 3) : [],
          suggestions: r.suggestions,
        });
      } catch (e) {
        push({ kind: "answer", error: true, fresh: true, text: e instanceof ChatError && e.kind === "rate" ? RATE_LIMITED_TEXT : UNREACHABLE_TEXT });
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [push]
  );

  const run = useCallback(
    (raw) => {
      const text = raw.trim();
      if (!text || busyRef.current) return;
      const lower = text.toLowerCase();
      const [cmd, arg] = lower.split(/\s+/);

      if (lower === "clear") {
        setHistory([]);
        lastQuestion.current = null;
        return;
      }
      push({ kind: "cmd", text });

      if (cmd === "help") push({ kind: "out", text: HELP_TEXT });
      else if (COMMAND_QUESTIONS[lower]) ask(COMMAND_QUESTIONS[lower]);
      else if (lower === "contact") push({ kind: "out", text: "heyiamsaket@gmail.com\nlinkedin.com/in/saket-deshmukh" });
      else if (lower === "resume") {
        push({ kind: "out", text: "downloading resume..." });
        const a = document.createElement("a");
        a.href = RESUME_PDF;
        a.download = "Saket_Deshmukh_Resume.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (lower === "projects") {
        push({ kind: "out", text: PROJECTS.map((p) => `[0${p.id}] ${p.name}`).join("\n") + "\n\ntype: project <n> for architecture" });
      } else if (cmd === "project" && arg) {
        const n = parseInt(arg.replace(/\D/g, ""), 10);
        if (PROJECTS.some((p) => p.id === n)) push({ kind: "project", pid: n });
        else push({ kind: "out", text: `no project ${arg} — try: projects`, color: "#8A1F0E" });
      } else if (lower === "sudo hire saket") {
        push({
          kind: "out",
          text: ["checking qualifications...", "✓ AI systems", "✓ RAG", "✓ Agentic workflows", "✓ Kubernetes", "✓ AWS", "", "permission granted."].join("\n"),
        });
      } else {
        // not a command: a question for the AI. Re-label the echoed line so it reads as a question.
        setHistory((h) => h.map((e, i) => (i === h.length - 1 ? { ...e, ask: true } : e)));
        ask(text);
      }
    },
    [push, ask]
  );

  // run a question that was handed over when the console was opened ("Ask this" from the page)
  useEffect(() => {
    if (phase === "open" && pendingRef.current) {
      const q = pendingRef.current;
      pendingRef.current = null;
      const t = setTimeout(() => run(q), reducedMotion() ? 100 : OPEN_MS * 0.6);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase, run]);

  // focus the prompt when the console opens, and again whenever it is ready for the next question
  useEffect(() => {
    if (phase === "open" && !busy) inputRef.current?.focus({ preventScroll: true });
  }, [phase, busy]);

  useEffect(() => {
    scrollToEnd();
  }, [history, busy, phase, scrollToEnd]);

  const onDialogKeyDown = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (phase === "closed") return null;

  const lastAnswer = [...history].reverse().find((e) => e.kind === "answer");
  const questionChips = busy ? [] : lastAnswer?.suggestions?.length ? lastAnswer.suggestions : STARTERS;
  const fresh = history.length === 0;
  const g = geom;
  const stageStyle = g.mobile ? undefined : { left: g.cx - g.boxW / 2, top: g.cy - g.boxH / 2, width: g.boxW, height: g.boxH };

  return (
    <div className={`ask-root is-${phase}`}>
      <div className="ask-veil" aria-hidden="true" onMouseDown={close} />
      {!g.mobile && (
        <>
          <i className="ask-ring ask-ring-a" aria-hidden="true" style={circleStyle(g, 1.1)} />
          <i className="ask-ring ask-ring-b" aria-hidden="true" style={circleStyle(g, 1.24)} />
        </>
      )}
      <i className="ask-ripple" aria-hidden="true" style={circleStyle(g)} />
      <div ref={orbRef} className="ask-orb" aria-hidden="true" style={circleStyle(g)}>
        <div className={`ask-orb-inner${busy ? " is-busy" : ""}`}>
          <OrangeSphere idSuffix="-orb" size="100%" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        </div>
      </div>

      <div
        ref={dialogRef}
        className={`ask-stage${g.mobile ? " ask-stage-m" : ""}`}
        style={stageStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-title"
        onKeyDown={onDialogKeyDown}
      >
        <header className="ask-head">
          <div>
            <div className="ask-kicker">✦ answers only from his real work</div>
            <h2 id="ask-title" className="ask-title">
              Ask Saket&apos;s AI
            </h2>
          </div>
          <div className="ask-head-actions">
            {!fresh && (
              <button type="button" className="ask-icon-btn" onClick={() => run("clear")} aria-label="Start over" title="Start over">
                ↺
              </button>
            )}
            <button type="button" className="ask-icon-btn" onClick={close} aria-label="Close" title="Close (Esc)">
              ✕
            </button>
          </div>
        </header>

        <div ref={bodyRef} className="ask-body" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation">
          {fresh && (
            <div className="ask-welcome">
              <p>
                I&apos;ve read Saket&apos;s real resume and project notes, and I answer only from them. Ask in plain English, or run a
                command.
              </p>
              <div className="ask-starters">
                {STARTERS.map((q) => (
                  <button key={q} type="button" className="ask-starter" onClick={() => run(q)}>
                    <span>{q}</span>
                    <b aria-hidden="true">→</b>
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.map((e) => {
            if (e.kind === "cmd") {
              return (
                <div key={e.id} className={`ask-q${e.ask ? " ask-q-question" : ""}`}>
                  <span aria-hidden="true">$</span> {e.text}
                </div>
              );
            }
            if (e.kind === "out") {
              return (
                <div key={e.id} className="ask-card ask-out" style={e.color ? { color: e.color } : undefined}>
                  {e.text}
                </div>
              );
            }
            if (e.kind === "retrieval") {
              return (
                <div key={e.id} className="ask-card ask-retrieval">
                  <div className="ask-retrieval-title">read from · BM25 score</div>
                  {e.items.map((c) => (
                    <div key={c.id} className="ask-retrieval-row">
                      <span>{c.id}</span>
                      <ScoreBar value={c.bar} />
                      <em>{c.title.split(" — ").slice(-1)[0]}</em>
                    </div>
                  ))}
                </div>
              );
            }
            if (e.kind === "answer") {
              return (
                <div key={e.id} className={`ask-card ask-a${e.error ? " ask-a-error" : ""}`}>
                  <TypedAnswer text={e.text} animate={Boolean(e.fresh) && !reducedMotion()} onProgress={scrollToEnd} />
                  {e.sources && e.sources.length > 0 && (
                    <p className="ask-sources">
                      <span>Sources</span> {e.sources.join(" · ")}
                    </p>
                  )}
                </div>
              );
            }
            if (e.kind === "project") {
              const p = PROJECTS.find((x) => x.id === e.pid);
              if (!p) return null;
              return (
                <div key={e.id} className="ask-card ask-project">
                  <div className="ask-project-name">{p.name}</div>
                  <div className="ask-project-org">{p.org}</div>
                  <FlowDiagram steps={p.flow} compact />
                  <div style={{ marginTop: 10 }}>
                    {p.tech.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}

          {busy && (
            <div className="ask-thinking" role="status">
              <span className="chat-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              reading Saket&apos;s documents…
            </div>
          )}
        </div>

        {!busy && (
          <div className="ask-chips">
            {!fresh && (
              <div className="ask-chip-row" aria-label="Suggested questions">
                {questionChips.map((q) => (
                  <button key={q} type="button" className="ask-chip" onClick={() => run(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div className="ask-chip-row" aria-label="Commands">
              {COMMAND_CHIPS.map((c) => (
                <button key={c} type="button" className="ask-chip ask-chip-cmd" onClick={() => run(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          className="ask-form"
          onSubmit={(e) => {
            e.preventDefault();
            const q = input;
            setInput("");
            run(q);
          }}
        >
          <span className="ask-prompt" aria-hidden="true">
            $
          </span>
          <label htmlFor="ask-input" className="sr-only">
            Ask Saket&apos;s AI a question, or type help for commands
          </label>
          <input
            id="ask-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={300}
            placeholder="Ask anything about Saket — or type help"
            autoComplete="off"
            spellCheck="false"
            enterKeyHint="send"
            disabled={busy}
          />
          <button type="submit" className="ask-send" disabled={busy || !input.trim()} aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
