// Builds the RAG knowledge base: reads the resume (public/resume.pdf) and every file in
// knowledge/ (pdf, md, txt, docx), splits them into chunks, and writes src/data/knowledge.js.
// Runs automatically before every build ("prebuild") and via `npm run ingest`.
//
// NOTE: this repo is public and the chunks ship inside the site bundle — only add files you
// are happy to publish.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src", "data", "knowledge.js");
const MAX_CHUNK = 1400;
const TARGET = 1000;
const EXTS = new Set([".pdf", ".md", ".txt", ".docx"]);
// Instruction files (e.g. the chatbot's system prompt) steer the model; they are not facts to retrieve.
// portfolio_faq.md is a list of sample questions with no answers, so it would only pollute retrieval.
const SKIP_NAME = /system[_-]?prompt|^portfolio_faq\./i;
// Private contact details stay out of the public knowledge base (email / LinkedIn are already on the site).
const PHONE = /\+?\d[\d\s().-]{8,}\d/g;

// ---------- readers ----------
async function readPdf(file) {
  const pdf = (await import("pdf-parse/lib/pdf-parse.js")).default;
  return (await pdf(fs.readFileSync(file))).text;
}
async function readDocx(file) {
  const mammoth = require("mammoth");
  return (await mammoth.extractRawText({ buffer: fs.readFileSync(file) })).value;
}
async function readFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".pdf") return readPdf(file);
  if (ext === ".docx") return readDocx(file);
  return fs.readFileSync(file, "utf8");
}

// ---------- cleanup of common PDF text-extraction artifacts ----------
function cleanPdfText(t) {
  return t
    .replace(/\r/g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/([a-z)])((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4})/g, "$1 $2")
    .replace(/([A-Za-z])(\d{4}\s*[–-]\s*(?:\d{4}|Present))/g, "$1 $2")
    .replace(/OpenAItext-embedding-3-smallsemantic/g, "OpenAI text-embedding-3-small semantic");
}

// ---------- structured chunking (resumes / headed documents) ----------
const isSection = (l) => /^[A-Z][A-Z &/]{2,38}$/.test(l.trim());

// Joins "•" markers with their text and re-joins wrapped bullet lines.
function toLogicalLines(raw) {
  const lines = raw.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const out = [];
  let pendingBullet = false;
  for (const l of lines) {
    if (l === "•") {
      pendingBullet = true;
      continue;
    }
    if (pendingBullet) {
      out.push("• " + l);
      pendingBullet = false;
      continue;
    }
    if (/^[•–*-]\s*\S/.test(l)) {
      out.push("• " + l.replace(/^[•–*-]\s*/, ""));
      continue;
    }
    const prev = out[out.length - 1];
    if (prev && prev.startsWith("• ") && !isSection(l) && !/[.!?]$/.test(prev)) {
      out[out.length - 1] = prev + " " + l; // wrapped line of the same bullet
      continue;
    }
    if (prev && prev.startsWith("• ") && !isSection(l) && /^[a-z0-9(]/.test(l)) {
      out[out.length - 1] = prev + " " + l;
      continue;
    }
    out.push(l);
  }
  return out;
}

function structuredChunks(raw, source) {
  const lines = toLogicalLines(raw);
  const chunks = [];
  let section = "";
  let parent = "";
  let sub = "";
  let buf = [];
  const trail = () => [section, parent, sub].filter(Boolean).join(" › ");
  const flush = () => {
    if (!buf.length) return;
    const title = [parent && parent.split(/ [–-] /)[0], sub].filter(Boolean).join(" — ") || section || source;
    chunks.push({ source, title: title.slice(0, 110), text: `${trail()}\n${buf.join("\n")}` });
    buf = [];
  };
  const pushLine = (l) => {
    if (buf.length && buf.join("\n").length + l.length > MAX_CHUNK) flush();
    buf.push(l);
  };

  for (let i = 0; i < lines.length; i += 1) {
    const l = lines[i];
    if (isSection(l)) {
      flush();
      section = l[0] + l.slice(1).toLowerCase();
      parent = "";
      sub = "";
      continue;
    }
    if (!l.startsWith("• ")) {
      const next = lines[i + 1];
      const next2 = lines[i + 2];
      const nextIsBullet = next && next.startsWith("• ");
      const nextIsHeading = next && !next.startsWith("• ") && !isSection(next) && next2 && next2.startsWith("• ");
      if (nextIsBullet || nextIsHeading) {
        flush();
        if (nextIsHeading) {
          parent = l;
          sub = "";
        } else {
          sub = l;
        }
        continue;
      }
    }
    pushLine(l);
  }
  flush();
  return chunks;
}

// ---------- generic chunking (markdown / plain text / docx) ----------
// One chunk per heading section, titled "Document title — Section", so a Q&A file or a
// project write-up retrieves by the section that actually answers the question.
function splitLong(text) {
  if (text.length <= MAX_CHUNK) return [text];
  const out = [];
  let buf = "";
  for (const para of text.split(/\n{2,}/)) {
    if (buf && (buf + "\n\n" + para).length > MAX_CHUNK) {
      out.push(buf);
      buf = "";
    }
    if (para.length > MAX_CHUNK) {
      for (const sent of para.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) || [para]) {
        if (buf && (buf + " " + sent).length > MAX_CHUNK) {
          out.push(buf);
          buf = "";
        }
        buf += (buf ? " " : "") + sent.trim();
      }
    } else {
      buf += (buf ? "\n\n" : "") + para;
    }
  }
  if (buf) out.push(buf);
  return out;
}

function genericChunks(raw, source) {
  const lines = raw.replace(/\r/g, "").split("\n");
  const sections = [];
  let h1 = "";
  let heading = "";
  let h2 = "";
  let body = [];
  const close = () => {
    const text = body.join("\n").trim();
    if (text) sections.push({ heading, text });
    body = [];
  };
  for (const line of lines) {
    const h = line.match(/^(#{1,4})\s+(.+?)\s*$/);
    if (!h) {
      body.push(line);
      continue;
    }
    close();
    if (h[1].length === 1 && !h1) h1 = h[2];
    if (h[1].length === 2) h2 = h[2];
    // an H3 under an H2 keeps its parent ("Architecture › 1. User Interface") so a heading-only H2 is not lost
    heading = h[1].length >= 3 && h2 ? `${h2} › ${h[2]}` : h[2];
  }
  close();

  // Merge neighbouring sections into ~TARGET-sized chunks so a multi-step description (e.g. a
  // project architecture) stays together; the headings remain in the text for matching.
  const label = (sec) => (sec.heading === h1 || !h1 ? sec.heading || source : `${h1} — ${sec.heading}`);
  const blocks = sections.flatMap((sec) =>
    splitLong(sec.text).map((part) => ({
      heading: sec.heading,
      sec,
      text: sec.heading && sec.heading !== h1 ? `## ${sec.heading}\n${part}` : part,
    }))
  );
  const chunks = [];
  let group = [];
  const flushGroup = () => {
    if (!group.length) return;
    const first = label(group[0].sec);
    const last = group[group.length - 1].heading;
    const title = (group.length > 1 && last && last !== group[0].heading ? `${first} … ${last}` : first).slice(0, 110);
    chunks.push({ source, title, text: `${h1 && !title.startsWith(h1) ? h1 + "\n" : ""}${group.map((g) => g.text).join("\n\n")}` });
    group = [];
  };
  for (const blk of blocks) {
    const size = group.reduce((n, g) => n + g.text.length + 2, 0);
    if (group.length && size + blk.text.length > TARGET) flushGroup();
    group.push(blk);
  }
  flushGroup();
  return chunks;
}

// ---------- main ----------
function listKnowledgeFiles() {
  const dir = path.join(ROOT, "knowledge");
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (EXTS.has(path.extname(e.name).toLowerCase()) && !e.name.startsWith("_") && !SKIP_NAME.test(e.name) && e.name.toLowerCase() !== "readme.md") out.push(full);
    }
  };
  walk(dir);
  return out.sort();
}

const sources = [];
const resume = path.join(ROOT, "public", "resume.pdf");
if (fs.existsSync(resume)) sources.push({ file: resume, label: "Resume" });
for (const f of listKnowledgeFiles()) sources.push({ file: f, label: path.basename(f) });

const all = [];
for (const s of sources) {
  try {
    let raw = await readFile(s.file);
    const ext = path.extname(s.file).toLowerCase();
    if (ext === ".pdf") raw = cleanPdfText(raw);
    const structured = ext === ".pdf" || /^[A-Z][A-Z &/]{2,38}$/m.test(raw);
    const chunks = structured ? structuredChunks(raw, s.label) : genericChunks(raw, s.label);
    for (const c of chunks) c.text = c.text.replace(PHONE, "[phone omitted]");
    console.log(`  ${s.label}: ${chunks.length} chunks`);
    all.push(...chunks);
  } catch (e) {
    console.warn(`  skipped ${s.label}: ${e.message}`);
  }
}

if (all.length === 0) {
  console.warn("ingest: no knowledge found — leaving src/data/knowledge.js unchanged");
  process.exit(0);
}
if (all.length > 999) throw new Error("ingest: too many chunks (max 999)");
const withIds = all.map((c, i) => ({ id: `DOC-${i + 1}`, ...c }));
const header = "// GENERATED by scripts/ingest.mjs from public/resume.pdf and knowledge/* — do not edit by hand.\n";
fs.writeFileSync(OUT, `${header}export const KNOWLEDGE = ${JSON.stringify(withIds, null, 2)};\n`);
console.log(`ingest: wrote ${withIds.length} chunks to src/data/knowledge.js`);
