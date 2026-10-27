import { TOKENS } from "../../theme";

// Everything the chatbot knows lives in the Python backend (backend/data/knowledge.json, searched
// server-side); the page only renders what the API returns.

export const UNREACHABLE =
  "The chat backend is unreachable right now, so I can't answer that. Please try again in a moment — the commands (help, projects, skills, contact) still work.";

/** Adds a 0..1 bar length to the API's retrieval sources ({ id, title, score }). */
export function normalizeScores(sources) {
  if (!sources || sources.length === 0) return [];
  const max = sources[0].score || 1;
  return sources.map((c, i) => ({
    ...c,
    displayScore: Math.min(0.98, 0.55 + (c.score / max) * 0.4 - i * 0.03),
  }));
}

export const SUGGESTIONS = ["more"];

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
