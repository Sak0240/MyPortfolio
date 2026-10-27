import { TOKENS } from "../../theme";
import { KNOWLEDGE } from "../../data/knowledge";
import { search, REFUSAL } from "../../lib/retrieval";

export { isGrounded, REFUSAL } from "../../lib/retrieval";

export function scoreChunks(query) {
  return search(query, KNOWLEDGE, 3);
}

export function normalizeScores(scored) {
  if (scored.length === 0) return [];
  const max = scored[0].rawScore || 1;
  return scored.map((c, i) => ({
    ...c,
    displayScore: Math.min(0.98, 0.55 + (c.rawScore / max) * 0.4 - i * 0.03),
  }));
}

export const SUGGESTIONS = ["more"];

function snippet(text, max = 340) {
  const lines = text.split("\n").filter(Boolean);
  const body = (lines.length > 1 ? lines.slice(1) : lines).join(" ").replace(/•\s*/g, "").trim();
  return body.length > max ? body.slice(0, max).replace(/\s+\S*$/, "") + "…" : body;
}

// Offline fallback: no model, just the best-matching passages from Saket's own documents.
export function localAnswer(scored) {
  if (!scored || scored.length === 0) return REFUSAL;
  const top = scored[0];
  const lead = `${snippet(top.text)} [${top.id}]`;
  if (scored.length > 1) {
    const second = scored[1];
    return `${lead} ${snippet(second.text, 200)} [${second.id}]`;
  }
  return lead;
}

export function renderAnswer(text) {
  const parts = text.split(/(\[DOC-\d+\])/g);
  return parts.map((p, i) => {
    const m = p.match(/^\[DOC-(\d+)\]$/);
    if (m) {
      return (
        <span
          key={i}
          style={{
            color: TOKENS.teal,
            border: `1px solid ${TOKENS.tealDim}`,
            borderRadius: 4,
            padding: "0 5px",
            fontSize: "11.5px",
            fontFamily: "'IBM Plex Mono', monospace",
            marginLeft: 2,
            whiteSpace: "nowrap",
          }}
        >
          {p}
        </span>
      );
    }
    return <span key={i}>{p}</span>;
  });
}


export const BOOT_LINES = [
  { prompt: "$", text: "whoami", speed: 30, pause: 300 },
  { text: "saket deshmukh — genai / ai engineer", color: TOKENS.text, pause: 120 },
  { text: "pune, india · 2.5+ years in production llm systems", color: TOKENS.textDim, pause: 320 },
  { prompt: "$", text: "work", speed: 30, pause: 300 },
  { text: "I'm currently working with KWAD Corporation as an AI Engineer, focusing on building and deploying production-grade AI solutions with LLMs, RAG, MLOps, and cloud infrastructure.", color: TOKENS.textDim, pause: 500 },
];

export const HELP_TEXT = [
  "more           see the rest of the site",
  "work           what I'm currently working on",
  "about          who I am",
  "experience     work history",
  "projects       list projects",
  "project <n>    show project architecture",
  "skills         technical skills",
  "contact        get in touch",
  "resume         download resume",
  "clear          clear the terminal",
  "",
  "or just type a question in plain english.",
].join("\n");
