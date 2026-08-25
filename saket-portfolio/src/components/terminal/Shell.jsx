import { useState, useEffect, useRef, useCallback } from "react";
import { TOKENS } from "../../theme";
import { CORPUS } from "../../data/corpus";
import {
  SUGGESTIONS,
  BOOT_LINES,
  HELP_TEXT,
  scoreChunks,
  normalizeScores,
  localAnswer,
  renderAnswer,
} from "./terminalEngine";
import TypedLines from "./TypedLines";
import ScoreBar from "./ScoreBar";
import FlowDiagram from "./FlowDiagram";

export default function Shell() {
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);
  const idRef = useRef(0);
  const nextId = () => {
    idRef.current += 1;
    return idRef.current;
  };

  const push = useCallback((entry) => {
    setHistory((h) => [...h, { id: nextId(), ...entry }]);
  }, []);

  const runAsk = useCallback(async (q) => {
    setBusy(true);
    const scored = normalizeScores(scoreChunks(q)).slice(0, 3);
    await new Promise((r) => setTimeout(r, 500));
    push({ kind: "retrieval", items: scored });

    const context =
      scored.length > 0
        ? scored.map((c) => `[${c.id}] ${c.title}\n${c.text}`).join("\n\n")
        : CORPUS.slice(0, 3).map((c) => `[${c.id}] ${c.title}\n${c.text}`).join("\n\n");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system:
            "You are a grounded assistant answering questions on behalf of Saket Deshmukh, a GenAI engineer, for visitors to his portfolio site. Answer ONLY using the provided context chunks below, written in third person, in 2-4 concise sentences, confident and specific, no filler. Cite the chunk id inline like [DOC-1] right after any claim drawn from it. If the context doesn't cover the question, say so honestly and suggest what the visitor could ask instead, still in Saket's voice as described by his portfolio.\n\nCONTEXT:\n" +
            context,
          messages: [{ role: "user", content: q }],
        }),
      });
      if (!response.ok) throw new Error("api unavailable");
      const data = await response.json();
      const textBlock = (data.content || []).find((b) => b.type === "text");
      push({ kind: "answer", text: textBlock && textBlock.text ? textBlock.text.trim() : localAnswer(scored) });
    } catch (e) {
      push({ kind: "answer", text: localAnswer(scored) });
    }
    setBusy(false);
  }, [push]);

  const runCommand = useCallback(
    (raw) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      push({ kind: "cmd", text: trimmed });

      const lower = trimmed.toLowerCase();
      const tokens = lower.split(/\s+/);
      const cmd = tokens[0];

      if (cmd === "help") {
        push({ kind: "text", text: HELP_TEXT });
      } else if (cmd === "clear") {
        setHistory([]);
        return;
      } else if (cmd === "about") {
        push({
          kind: "text",
          text: "GenAI Engineer, Pune, India. 2.5+ years building production RAG pipelines, agentic workflows, and LLM evaluation systems — with the cloud infrastructure and CI/CD underneath them.",
        });
      } else if (cmd === "experience") {
        push({
          kind: "text",
          text: [
            "AI Engineer — KWAD Corporation (Apr 2025–Present)",
            "  agentic RAG for compliance & financial ops",
            "Software Engineer — Briowin (Feb 2024–Apr 2025)",
            "  CatalogSage — RAG product assistant",
          ].join("\n"),
        });
      } else if (cmd === "skills") {
        push({
          kind: "text",
          text: [
            "genai        RAG, agentic AI, prompt engineering, guardrails",
            "llmops       LangSmith, TruLens, LLM evaluation",
            "retrieval    FAISS, BM25, hybrid search, RRF",
            "cloud        AWS, Azure, Docker, Kubernetes, Terraform",
          ].join("\n"),
        });
      } else if (cmd === "contact") {
        push({
          kind: "text",
          text: "heyiamsaket@gmail.com\nlinkedin.com/in/saket-deshmukh",
        });
      } else if (cmd === "resume") {
        push({ kind: "text", text: "downloading resume..." });
        const a = document.createElement("a");
        a.href = RESUME_PDF;
        a.download = "Saket_Deshmukh_Resume.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (cmd === "projects") {
        push({
          kind: "text",
          text: PROJECTS.map((p) => `[0${p.id}] ${p.name}`).join("\n") + "\n\ntype: project <n> for architecture",
        });
      } else if (cmd === "project" && tokens[1]) {
        const n = parseInt(tokens[1].replace(/\D/g, ""), 10);
        const project = PROJECTS.find((p) => p.id === n);
        if (project) {
          push({ kind: "project", project });
        } else {
          push({ kind: "text", text: `no project ${tokens[1]} — try: projects`, color: "#D96B5C" });
        }
      } else if (lower === "sudo hire saket") {
        push({
          kind: "text",
          text: [
            "checking qualifications...",
            "✓ AI systems",
            "✓ RAG",
            "✓ Agentic workflows",
            "✓ Kubernetes",
            "✓ AWS",
            "",
            "permission granted.",
          ].join("\n"),
          color: TOKENS.teal,
        });
      } else {
        runAsk(trimmed);
      }
    },
    [push, runAsk]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, busy]);

  return (
    <div
      style={{
        background: "rgba(11,18,32,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderBottom: `1px solid ${TOKENS.border}`,
          background: TOKENS.panelAlt,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <span className="term-dot" style={{ width: 10, height: 10, borderRadius: "50%", background: "#4A4F54", animationDelay: "0s" }} />
          <span className="term-dot" style={{ width: 10, height: 10, borderRadius: "50%", background: "#4A4F54", animationDelay: "0.3s" }} />
          <span className="term-dot" style={{ width: 10, height: 10, borderRadius: "50%", background: "#4A4F54", animationDelay: "0.6s" }} />
        </div>
        <span style={{ marginLeft: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: TOKENS.textDim }}>
          saket@genai:~$
        </span>
      </div>

      <div ref={scrollRef} className="term-scroll" style={{ padding: "16px 22px", overflowY: "auto" }}>
        <TypedLines lines={BOOT_LINES} onDone={() => setBooted(true)} />

        {booted && (
          <div style={{ marginTop: 16 }}>
            {history.map((entry) => {
              if (entry.kind === "cmd") {
                return (
                  <div
                    key={entry.id}
                    style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, color: TOKENS.amber, margin: "10px 0 4px" }}
                  >
                    $ {entry.text}
                  </div>
                );
              }
              if (entry.kind === "text") {
                return (
                  <div
                    key={entry.id}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 12.5,
                      color: entry.color || TOKENS.textDim,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.7,
                    }}
                  >
                    {entry.text}
                  </div>
                );
              }
              if (entry.kind === "retrieval") {
                return (
                  <div key={entry.id} style={{ marginTop: 4, marginBottom: 4 }}>
                    <div
                      style={{
                        color: TOKENS.textFaint,
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      retrieval — hybrid score
                    </div>
                    {entry.items.map((c) => (
                      <div
                        key={c.id}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5 }}
                      >
                        <span style={{ color: TOKENS.teal, minWidth: 52 }}>{c.id}</span>
                        <ScoreBar value={c.displayScore} />
                        <span style={{ color: TOKENS.textDim }}>{c.title}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              if (entry.kind === "answer") {
                return (
                  <div
                    key={entry.id}
                    style={{ marginTop: 8, marginBottom: 10, color: TOKENS.text, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14.5, lineHeight: 1.75 }}
                  >
                    {renderAnswer(entry.text)}
                  </div>
                );
              }
              if (entry.kind === "project") {
                const p = entry.project;
                return (
                  <div key={entry.id} style={{ margin: "8px 0 12px" }}>
                    <div style={{ color: TOKENS.text, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                      {p.name}
                    </div>
                    <div style={{ color: TOKENS.textFaint, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, marginBottom: 10 }}>
                      {p.org}
                    </div>
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
              <div style={{ color: TOKENS.amber, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, margin: "6px 0" }}>
                retrieving and generating...
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0" }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => runCommand(s)}
                  disabled={busy}
                  style={{
                    background: "transparent",
                    border: `1px solid ${TOKENS.border}`,
                    color: TOKENS.textDim,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11.5,
                    padding: "5px 10px",
                    borderRadius: 6,
                    cursor: busy ? "default" : "pointer",
                    opacity: busy ? 0.5 : 1,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!input.trim() || busy) return;
                runCommand(input);
                setInput("");
              }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ color: TOKENS.amber, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5 }}>$</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type help, or ask a question..."
                disabled={busy}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: TOKENS.text,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13.5,
                }}
              />
              <button
                type="submit"
                disabled={busy}
                style={{
                  background: "transparent",
                  border: `1px solid ${TOKENS.amberDim}`,
                  color: TOKENS.amber,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  padding: "5px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  opacity: busy ? 0.5 : 1,
                }}
              >
                run
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
