import { TOKENS } from "../../theme";
import { CORPUS } from "../../data/corpus";

export function tokenize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function scoreChunks(query) {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];
  return CORPUS.map((chunk) => {
    const bodyTokens = tokenize(chunk.text + " " + chunk.title);
    const kwSet = new Set(chunk.keywords);
    let raw = 0;
    qTokens.forEach((qt) => {
      if (kwSet.has(qt)) raw += 2.2;
      const bodyHits = bodyTokens.filter((bt) => bt === qt).length;
      raw += bodyHits * 1.0;
      chunk.keywords.forEach((kw) => {
        if (kw.includes(qt) && qt.length > 3) raw += 0.6;
      });
    });
    const norm = raw / Math.sqrt(bodyTokens.length + chunk.keywords.length);
    return { ...chunk, rawScore: norm };
  })
    .sort((a, b) => b.rawScore - a.rawScore)
    .filter((c) => c.rawScore > 0);
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

export function firstSentences(text, count) {
  const sentences = text.match(/[^.]+\./g) || [text];
  return sentences.slice(0, count).join(" ").trim();
}

export function localAnswer(scored) {
  if (!scored || scored.length === 0) {
    return "No live model connection right now, so here's what retrieval alone can surface — try one of the suggested questions, or reach out directly below.";
  }
  const top = scored[0];
  const lead = `${firstSentences(top.text, 2)} [${top.id}]`;
  if (scored.length > 1) {
    const second = scored[1];
    const support = `${firstSentences(second.text, 1)} [${second.id}]`;
    return `${lead} ${support}`;
  }
  return lead;
}


export function renderAnswer(text) {
  const parts = text.split(/(\[DOC-\d\])/g);
  return parts.map((p, i) => {
    const m = p.match(/^\[DOC-(\d)\]$/);
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
  { prompt: "$", text: "more", speed: 30, pause: 300 },
  { text: "type 'more' to see the rest of the site, or ask a question about my work.", color: TOKENS.textDim, pause: 500 },
];

export const HELP_TEXT = [
  "more           see the rest of the site",
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
