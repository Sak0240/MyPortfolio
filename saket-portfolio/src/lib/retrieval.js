// Small BM25 retriever shared by the browser (terminal) and the serverless function.
// No dependencies — the knowledge base is only a few dozen chunks.

const STOP = new Set(
  (
    "a an and are as at be by can could did do does for from had has have how i if in into is it its " +
    "me my of on or our so than that the their them then there these they this to was we were what when " +
    "where which who whom why will with would you your about tell please give show list any some " +
    "saket his he him her she"
  ).split(" ")
);

// Light suffix stripping so "pipelines/pipeline", "optimized/optimization", "engineering/engineer" meet.
function stem(w) {
  let s = w;
  const rules = ["ations", "ation", "ings", "ing", "ers", "er", "ed", "es", "s"];
  let changed = true;
  while (changed) {
    changed = false;
    for (const r of rules) {
      if (s.endsWith(r) && s.length - r.length >= 4) {
        s = s.slice(0, -r.length);
        changed = true;
        break;
      }
    }
  }
  return s;
}

export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t && !STOP.has(t))
    .map(stem);
}

// Query-side synonyms so everyday phrasing finds the right chunk ("contact" -> email/linkedin).
const SYNONYMS = {
  contact: ["email", "linkedin", "gmail"],
  reach: ["email", "linkedin", "gmail"],
  email: ["gmail"],
  phone: ["pune"],
  located: ["pune"],
  location: ["pune"],
  based: ["pune"],
  live: ["pune"],
  city: ["pune"],
  company: ["kwad", "briowin"],
  employer: ["kwad", "briowin"],
  job: ["kwad", "briowin", "engineer"],
  work: ["kwad", "briowin"],
  worked: ["kwad", "briowin"],
  college: ["bachelor", "university"],
  degree: ["bachelor", "university"],
  study: ["bachelor", "university"],
  studied: ["bachelor", "university"],
  university: ["bachelor"],
  certificate: ["certification"],
  tech: ["skills"],
  stack: ["skills"],
  technology: ["skills"],
  technologies: ["skills"],
  tools: ["skills"],
};

const K1 = 1.4;
const B = 0.75;
const indexCache = new WeakMap();

function buildIndex(chunks) {
  const docs = chunks.map((c) => {
    // title counts double: "KWAD — Clinical Record Processing" should beat an incidental mention
    const tokens = tokenize(`${c.title} ${c.title} ${c.text}`);
    const tf = new Map();
    for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
    return { tf, len: tokens.length };
  });
  const df = new Map();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) || 0) + 1);
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / Math.max(1, docs.length);
  return { docs, df, avgLen, n: docs.length };
}

/**
 * Ranks chunks for a query. Returns [{ ...chunk, rawScore, matched }] best-first,
 * only chunks that share at least one meaningful term with the query.
 */
export function search(query, chunks, k = 4) {
  const base = tokenize(query);
  const extra = [];
  for (const w of String(query).toLowerCase().split(/[^a-z0-9]+/)) if (SYNONYMS[w]) extra.push(...SYNONYMS[w].map(stem));
  const qTokens = [...new Set([...base, ...extra])];
  if (base.length === 0 || chunks.length === 0) return [];
  let index = indexCache.get(chunks);
  if (!index) {
    index = buildIndex(chunks);
    indexCache.set(chunks, index);
  }
  const { docs, df, avgLen, n } = index;
  const scored = [];
  docs.forEach((d, i) => {
    let score = 0;
    const matched = [];
    for (const t of qTokens) {
      const f = d.tf.get(t);
      if (!f) continue;
      const idf = Math.log(1 + (n - (df.get(t) || 0) + 0.5) / ((df.get(t) || 0) + 0.5));
      score += (idf * (f * (K1 + 1))) / (f + K1 * (1 - B + (B * d.len) / avgLen));
      matched.push(t);
    }
    if (score > 0) scored.push({ ...chunks[i], rawScore: score, matched });
  });
  return scored.sort((a, b) => b.rawScore - a.rawScore).slice(0, k);
}

/**
 * Decides whether the retrieved context is relevant enough to answer from.
 * Off-topic questions ("capital of France", "write a poem") fail this and are refused
 * without ever calling the LLM.
 */
export function isGrounded(query, hits, minScore = 0.8) {
  if (!hits || hits.length === 0) return false;
  const qTokens = [...new Set(tokenize(query))];
  const top = hits[0];
  const coverage = top.matched.length / Math.max(1, qTokens.length);
  return top.rawScore >= minScore && (top.matched.length >= 2 || coverage >= 0.5);
}

export const REFUSAL =
  "That isn't covered in Saket's documents (his resume and notes), so I can't answer it. Try asking about his projects, skills, experience, or education.";
