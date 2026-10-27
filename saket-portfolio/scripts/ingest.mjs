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
const EXTS = new Set([".pdf", ".md", ".txt", ".docx"]);

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
function genericChunks(raw, source) {
  const text = raw.replace(/\r/g, "");
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const chunks = [];
  let heading = "";
  let buf = "";
  const flush = () => {
    if (!buf.trim()) return;
    const first = buf.trim().split("\n")[0].replace(/^#+\s*/, "").slice(0, 80);
    chunks.push({ source, title: heading || first, text: (heading ? heading + "\n" : "") + buf.trim() });
    buf = "";
  };
  for (const b of blocks) {
    const h = b.match(/^#{1,4}\s+(.+)$/);
    if (h && b.split("\n").length === 1) {
      flush();
      heading = h[1].trim();
      continue;
    }
    if (buf && (buf + "\n\n" + b).length > MAX_CHUNK) flush();
    if (b.length > MAX_CHUNK) {
      const sentences = b.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) || [b];
      for (const s of sentences) {
        if (buf && (buf + " " + s).length > MAX_CHUNK) flush();
        buf += (buf ? " " : "") + s.trim();
      }
    } else {
      buf += (buf ? "\n\n" : "") + b;
    }
  }
  flush();
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
      else if (EXTS.has(path.extname(e.name).toLowerCase()) && !e.name.startsWith("_") && e.name.toLowerCase() !== "readme.md") out.push(full);
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
