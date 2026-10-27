// Small BM25 retriever shared by the browser (terminal) and the serverless function.
// No dependencies — the knowledge base is only a few dozen chunks.

const STOP = new Set(
  (
    "a an and are as at be by can could did do does for from had has have how i if in into is it its " +
    "me my of on or our so than that the their them then there these they this to was we were what when " +
    "where which who whom why will with would you your about tell please give show list any some " +
    "saket his he him her she explain explains explained describe walk through"
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
    .replace(/[’']s/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t.length > 1 && !STOP.has(t))
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
  project: ["kwad", "briowin", "catalogsage"],
  projects: ["kwad", "briowin", "catalogsage"],
  role: ["engineer", "kwad"],
  current: ["kwad"],
  currently: ["kwad"],
  position: ["engineer", "kwad"],
  made: ["built", "develop"],
  make: ["built", "develop"],
  created: ["built", "develop"],
  create: ["built", "develop"],
  achievement: ["award", "reduc", "improv"],
  achievements: ["award", "reduc", "improv"],
  accomplishments: ["award", "reduc", "improv"],
  impact: ["reduc", "improv", "achiev"],
  yourself: ["summary", "engineer", "experience"],
  background: ["summary", "engineer", "experience", "bachelor"],
  introduce: ["summary", "engineer", "experience"],
  skills: ["python", "langchain"],
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
  // synonyms count for half so they help recall without outranking the words actually asked
  const weights = new Map();
  for (const t of extra) weights.set(t, 0.5);
  for (const t of base) weights.set(t, 1);
  const qTokens = [...weights.keys()];
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
      score += weights.get(t) * ((idf * (f * (K1 + 1))) / (f + K1 * (1 - B + (B * d.len) / avgLen)));
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
  "The available portfolio documentation does not specify that detail, so I can't confirm it. Try asking about Saket's projects, skills, experience, or education.";

const GREETING =
  /^(?:hi|hii+|hello|hey|heya|hiya|yo|sup|namaste|good\s+(?:morning|afternoon|evening))(?:\s+(?:there|team|bot|saket|everyone|friend|buddy))?\s*[!.,?]*\s*$/i;
const THANKS = /^(?:thanks|thank\s+you|thx|ty|cheers)(?:\s+(?:a\s+lot|so\s+much|saket|bot))?\s*[!.,?]*\s*$/i;
const BYE = /^(?:bye|goodbye|see\s+you|cya|good\s*night)(?:\s+(?:saket|bot))?\s*[!.,?]*\s*$/i;
const ABOUT_BOT = /^(?:who\s+are\s+you|what\s+are\s+you|what\s+can\s+you\s+do|what\s+can\s+i\s+ask|how\s+does\s+this\s+work)\s*[!.,?]*\s*$/i;

const INTRO =
  "I'm an assistant that only knows what's in Saket's resume and notes. Ask about his projects, skills, experience, or education — for example: \"What did Saket build at KWAD?\" or \"Which cloud tools does he use?\"";

/** Friendly canned replies for greetings / thanks / "what are you" — no model call needed. */
export function smallTalk(question) {
  const q = String(question).trim();
  if (GREETING.test(q)) return `Hi there! ${INTRO}`;
  if (ABOUT_BOT.test(q)) return INTRO;
  if (THANKS.test(q)) return "You're welcome! Ask me anything else about Saket's work.";
  if (BYE.test(q)) return "Thanks for stopping by — the rest of the portfolio is just a scroll away.";
  return null;
}
