import { useCallback, useEffect, useRef, useState } from "react";
import { TOKENS } from "../../theme";
import { PROJECTS } from "../../data/projects";
import { RESUME_PDF } from "../../data/assets";
import { askQuestion, ChatError, RATE_LIMITED_TEXT, UNREACHABLE_TEXT } from "../../lib/chatApi";
import { OPEN_ASK_EVENT, STARTERS } from "./events";
import RichText from "./RichText";
import ScoreBar from "../terminal/ScoreBar";
import FlowDiagram from "../terminal/FlowDiagram";
import Tag from "../shared/Tag";

const STORE_KEY = "saket-ask-v1";
const MAX_STORED = 40;
const MONO = "'IBM Plex Mono', monospace";

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
  "esc             close this window",
].join("\n");

function load() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.slice(-MAX_STORED) : [];
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

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export default function AskConsole() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState(load);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const openerRef = useRef(null);
  const busyRef = useRef(false);
  const pendingRef = useRef(null);
  const idRef = useRef(Math.max(0, ...history.map((e) => e.id || 0)));
  const lastQuestion = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-MAX_STORED)));
    } catch {
      /* private mode: the console still works, it just isn't remembered */
    }
  }, [history]);

  const push = useCallback((entry) => setHistory((h) => [...h, { id: ++idRef.current, ...entry }]), []);

  const openConsole = useCallback((question) => {
    if (document.activeElement instanceof HTMLElement) openerRef.current = document.activeElement;
    if (typeof question === "string" && question.trim()) pendingRef.current = question.trim();
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    openerRef.current?.focus?.();
  }, []);

  // open from anywhere: hero button, nav, showcase card, Ctrl/Cmd+K, or a #ask link
  useEffect(() => {
    const onOpen = (e) => openConsole(e.detail && e.detail.question);
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o && document.activeElement instanceof HTMLElement) openerRef.current = document.activeElement;
          return !o;
        });
      }
    };
    const onHash = () => window.location.hash === "#ask" && openConsole();
    window.addEventListener(OPEN_ASK_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      window.removeEventListener(OPEN_ASK_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [openConsole]);

  // the page behind must not scroll while the console is open
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

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
          text: r.answer || UNREACHABLE_TEXT,
          sources: r.grounded ? [...new Set(r.sources.map((s) => sourceLabel(s.source)))].slice(0, 3) : [],
          suggestions: r.suggestions,
        });
      } catch (e) {
        push({ kind: "answer", error: true, text: e instanceof ChatError && e.kind === "rate" ? RATE_LIMITED_TEXT : UNREACHABLE_TEXT });
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
        else push({ kind: "out", text: `no project ${arg} — try: projects`, color: "#D96B5C" });
      } else if (lower === "sudo hire saket") {
        push({
          kind: "out",
          color: TOKENS.amber,
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
    if (open && pendingRef.current) {
      const q = pendingRef.current;
      pendingRef.current = null;
      const t = setTimeout(() => run(q), 120);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open, run]);

  // focus the prompt when the console opens, and again whenever it is ready for the next question
  useEffect(() => {
    if (open && !busy) inputRef.current?.focus();
  }, [open, busy]);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [history, busy, open]);

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

  if (!open) return null;

  const lastAnswer = [...history].reverse().find((e) => e.kind === "answer");
  const questionChips = busy ? [] : lastAnswer?.suggestions?.length ? lastAnswer.suggestions : STARTERS;
  const fresh = history.length === 0;

  return (
    <div className="ask-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        ref={dialogRef}
        className="ask-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-title"
        onKeyDown={onDialogKeyDown}
      >
        <i className="ask-mark ask-mark-tl" aria-hidden="true" />
        <i className="ask-mark ask-mark-tr" aria-hidden="true" />
        <i className="ask-mark ask-mark-bl" aria-hidden="true" />
        <i className="ask-mark ask-mark-br" aria-hidden="true" />

        <div className="ask-inner">
          <header className="ask-bar">
            <span className="ask-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span id="ask-title" className="ask-bar-title">
              <span className="ask-spark" aria-hidden="true">
                ✦
              </span>
              saket@genai:~ — ask
            </span>
            <span className="ask-bar-badge">answers only from his real work</span>
            <span className="ask-bar-actions">
              {!fresh && (
                <button type="button" className="ask-icon-btn" onClick={() => run("clear")} aria-label="Start over" title="Start over">
                  ↺
                </button>
              )}
              <button type="button" className="ask-icon-btn" onClick={close} aria-label="Close" title="Close (Esc)">
                ✕
              </button>
            </span>
          </header>

          <div ref={bodyRef} className="ask-body" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation">
            {fresh && (
              <div className="ask-welcome">
                <div className="ask-kicker">✦ retrieval-grounded · cited from my resume &amp; notes</div>
                <h2 className="ask-hello">Ask Saket's AI</h2>
                <p>
                  I've read Saket's real resume and project notes, and I answer only from them — so everything here is
                  grounded in his actual work. Ask in plain English, or run a command.
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
                  <div key={e.id} className="ask-out" style={e.color ? { color: e.color } : undefined}>
                    {e.text}
                  </div>
                );
              }
              if (e.kind === "retrieval") {
                return (
                  <div key={e.id} className="ask-retrieval">
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
                  <div key={e.id} className={`ask-a${e.error ? " ask-a-error" : ""}`}>
                    <RichText text={e.text} />
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
                  <div key={e.id} className="ask-project">
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
                reading Saket's documents…
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
              Ask Saket's AI a question, or type help for commands
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
          <div className="ask-foot" aria-hidden="true">
            <kbd>Esc</kbd> close · <kbd>Ctrl</kbd>+<kbd>K</kbd> toggle · <kbd>Enter</kbd> send
          </div>
        </div>
      </div>
    </div>
  );
}
