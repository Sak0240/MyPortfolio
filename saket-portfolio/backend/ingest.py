"""Builds the knowledge base the chatbot answers from.

    python -m backend.ingest            # rebuild backend/data/knowledge.json
    python -m backend.ingest --check    # exit 1 if the committed file is out of date (used in CI)

Sources: public/resume.pdf and every .pdf / .md / .txt / .docx in knowledge/. Each stage is a pandas
DataFrame transformation so the pipeline can be inspected, de-duplicated and validated as a table:

    discover -> read -> chunk -> clean & validate -> assign ids -> write

NOTE: this repository is public, so everything under knowledge/ is public. Only add files you are
happy to publish.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import pandas as pd
from pydantic import ValidationError

from .app.schemas import KnowledgeChunk

ROOT = Path(__file__).resolve().parent.parent
RESUME = ROOT / "public" / "resume.pdf"
KNOWLEDGE_DIR = ROOT / "knowledge"
OUT = ROOT / "backend" / "data" / "knowledge.json"

MAX_CHUNK = 1400
TARGET = 1000
MAX_CHUNKS = 999
EXTS = {".pdf", ".md", ".txt", ".docx"}
# Instruction files (the chatbot's system prompt) steer the model; they are not facts to retrieve.
# portfolio_faq.md is a list of sample questions with no answers, so it would only pollute retrieval.
SKIP_NAME = re.compile(r"system[_-]?prompt|^portfolio_faq\.", re.IGNORECASE)
# Private contact details stay out of the public knowledge base (email / LinkedIn are already on the site).
PHONE = re.compile(r"\+?\d[\d\s().-]{8,}\d")


# ---------- 1. discover ----------
def discover_sources(root: Path = ROOT) -> pd.DataFrame:
    rows: list[dict[str, str]] = []
    resume = root / "public" / "resume.pdf"
    if resume.exists():
        rows.append({"label": "Resume", "path": str(resume)})
    kdir = root / "knowledge"
    if kdir.exists():
        for f in sorted(p for p in kdir.rglob("*") if p.is_file()):
            if (
                f.suffix.lower() in EXTS
                and not f.name.startswith("_")
                and not SKIP_NAME.search(f.name)
                and f.name.lower() != "readme.md"
            ):
                rows.append({"label": f.name, "path": str(f)})
    return pd.DataFrame(rows, columns=["label", "path"])


# ---------- 2. read ----------
def _needs_space(before: str, after: str) -> bool:
    """Should two same-line text pieces (`before` is the previous piece) be separated by a space?"""
    if before.endswith((" ", "\t")) or after.startswith((" ", "\t")):
        return False
    if after[0] in ".,;:!?%)]}" or before[-1] in "([{/-":
        return False  # "52%" + "." ; "(" + "RAG" ; "production-" + "ready"
    # a piece that is a single letter is kerning inside a word (small-caps "A" "W" "ARDS"), not a word
    return not (len(before) == 1 and before.isalpha())


def read_pdf(path: Path) -> str:
    """Extracts text page by page.

    pypdf's plain extraction glues words together when a PDF positions them with gaps instead of
    space characters ("with2.5+ years", "experiencebuilding"). So the text pieces are re-joined by
    position: a space between pieces on the same line, a line break when the baseline moves.
    """
    from pypdf import PdfReader

    pages: list[str] = []
    for page in PdfReader(str(path)).pages:
        pieces: list[tuple[str, float]] = []

        def visit(text: str, cm, tm, font_dict, font_size, _pieces=pieces) -> None:
            if text:
                _pieces.append((text, round(float(tm[5]), 1)))

        page.extract_text(visitor_text=visit)
        out = ""
        prev_text, prev_y = "", None
        for text, y in pieces:
            if out and not out.endswith("\n") and not text.startswith("\n"):
                if prev_y is not None and abs(y - prev_y) > 1.5:
                    out += "\n"
                elif _needs_space(prev_text, text):
                    out += " "
            out += text
            prev_text, prev_y = text, y
        pages.append(out)
    return "\n\n".join(pages)


def read_docx(path: Path) -> str:
    from docx import Document

    lines: list[str] = []
    for p in Document(str(path)).paragraphs:
        m = re.match(r"Heading (\d)", p.style.name or "")
        lines.append(f"{'#' * int(m.group(1))} {p.text}" if m and p.text.strip() else p.text)
        lines.append("")
    return "\n".join(lines)


def read_document(path: str) -> str:
    p = Path(path)
    ext = p.suffix.lower()
    if ext == ".pdf":
        return clean_pdf_text(read_pdf(p))
    if ext == ".docx":
        return read_docx(p)
    return p.read_text(encoding="utf-8")


def clean_pdf_text(t: str) -> str:
    """Repairs common PDF text-extraction artifacts (glued month/year, glued words)."""
    t = t.replace("\r", "")
    t = re.sub(r"[ \t]+$", "", t, flags=re.MULTILINE)
    t = re.sub(r"([a-z)])((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4})", r"\1 \2", t)
    t = re.sub(r"([A-Za-z])(\d{4}\s*[–-]\s*(?:\d{4}|Present))", r"\1 \2", t)
    t = t.replace("OpenAItext-embedding-3-smallsemantic", "OpenAI text-embedding-3-small semantic")
    # small-caps headings come out letter-spaced ("A W ARDS", "S KILLS"): glue them back together
    t = re.sub(r"^((?:[A-Z] ){1,3}[A-Z]{2,})$", lambda m: m.group(1).replace(" ", ""), t, flags=re.MULTILINE)
    return t


# ---------- 3. chunk ----------
SECTION = re.compile(r"^[A-Z][A-Z &/]{2,38}$")
BULLET = re.compile(r"^[•–*-]\s*\S")


def is_section(line: str) -> bool:
    return bool(SECTION.match(line.strip()))


def to_logical_lines(raw: str) -> list[str]:
    """Joins bullet markers with their text and re-joins wrapped bullet lines."""
    lines = [ln.strip() for ln in raw.split("\n") if ln.strip()]
    out: list[str] = []
    pending_bullet = False
    for ln in lines:
        if ln == "•":
            pending_bullet = True
            continue
        if pending_bullet:
            out.append("• " + ln)
            pending_bullet = False
            continue
        if BULLET.match(ln):
            out.append("• " + re.sub(r"^[•–*-]\s*", "", ln))
            continue
        prev = out[-1] if out else None
        if prev and prev.startswith("• ") and not is_section(ln) and not re.search(r"[.!?]$", prev):
            out[-1] = prev + " " + ln  # wrapped line of the same bullet
            continue
        if prev and prev.startswith("• ") and not is_section(ln) and re.match(r"^[a-z0-9(]", ln):
            out[-1] = prev + " " + ln
            continue
        out.append(ln)
    return out


def structured_chunks(raw: str, source: str) -> list[dict[str, str]]:
    """Chunks a resume-like document by its ALL-CAPS sections, role headings and bullet lists."""
    lines = to_logical_lines(raw)
    chunks: list[dict[str, str]] = []
    section = parent = sub = ""
    buf: list[str] = []

    def trail() -> str:
        return " › ".join(x for x in (section, parent, sub) if x)

    def flush() -> None:
        nonlocal buf
        if not buf:
            return
        head = parent and re.split(r" [–-] ", parent)[0]
        title = " — ".join(x for x in (head, sub) if x) or section or source
        chunks.append({"source": source, "title": title[:110], "text": f"{trail()}\n" + "\n".join(buf)})
        buf = []

    def push_line(line: str) -> None:
        if buf and len("\n".join(buf)) + len(line) > MAX_CHUNK:
            flush()
        buf.append(line)

    for i, ln in enumerate(lines):
        if is_section(ln):
            flush()
            section = ln[0] + ln[1:].lower()
            parent = sub = ""
            continue
        if not ln.startswith("• "):
            nxt = lines[i + 1] if i + 1 < len(lines) else None
            nxt2 = lines[i + 2] if i + 2 < len(lines) else None
            next_is_bullet = bool(nxt and nxt.startswith("• "))
            next_is_heading = bool(
                nxt and not nxt.startswith("• ") and not is_section(nxt) and nxt2 and nxt2.startswith("• ")
            )
            if next_is_bullet or next_is_heading:
                flush()
                if next_is_heading:
                    parent, sub = ln, ""
                else:
                    sub = ln
                continue
        push_line(ln)
    flush()
    return chunks


def split_long(text: str) -> list[str]:
    if len(text) <= MAX_CHUNK:
        return [text]
    out: list[str] = []
    buf = ""
    for para in re.split(r"\n{2,}", text):
        if buf and len(buf + "\n\n" + para) > MAX_CHUNK:
            out.append(buf)
            buf = ""
        if len(para) > MAX_CHUNK:
            for sent in re.findall(r"[^.!?]+[.!?]+\s*|[^.!?]+$", para) or [para]:
                if buf and len(buf + " " + sent) > MAX_CHUNK:
                    out.append(buf)
                    buf = ""
                buf += (" " if buf else "") + sent.strip()
        else:
            buf += ("\n\n" if buf else "") + para
    if buf:
        out.append(buf)
    return out


def generic_chunks(raw: str, source: str) -> list[dict[str, str]]:
    """Chunks markdown / plain text by heading, then merges neighbours up to ~TARGET characters.

    Titles read "Document title — Section"; headings stay in the text so a multi-step description
    (e.g. a project architecture) stays together and still matches on its headings.
    """
    sections: list[tuple[str, str]] = []
    h1 = heading = h2 = ""
    body: list[str] = []

    def close() -> None:
        nonlocal body
        text = "\n".join(body).strip()
        if text:
            sections.append((heading, text))
        body = []

    for line in raw.replace("\r", "").split("\n"):
        m = re.match(r"^(#{1,4})\s+(.+?)\s*$", line)
        if not m:
            body.append(line)
            continue
        close()
        level, title = len(m.group(1)), m.group(2)
        if level == 1 and not h1:
            h1 = title
        if level == 2:
            h2 = title
        # an H3 under an H2 keeps its parent ("Architecture › 1. User Interface") so a heading-only H2 is not lost
        heading = f"{h2} › {title}" if level >= 3 and h2 else title
    close()

    def label(head: str) -> str:
        return (head or source) if (head == h1 or not h1) else f"{h1} — {head}"

    blocks: list[tuple[str, str]] = []
    for head, text in sections:
        for part in split_long(text):
            blocks.append((head, part if not head or head == h1 else f"## {head}\n{part}"))

    chunks: list[dict[str, str]] = []
    group: list[tuple[str, str]] = []

    def flush_group() -> None:
        nonlocal group
        if not group:
            return
        first, last = label(group[0][0]), group[-1][0]
        title = (f"{first} … {last}" if len(group) > 1 and last and last != group[0][0] else first)[:110]
        prefix = f"{h1}\n" if h1 and not title.startswith(h1) else ""
        chunks.append({"source": source, "title": title, "text": prefix + "\n\n".join(t for _, t in group)})
        group = []

    for blk in blocks:
        size = sum(len(t) + 2 for _, t in group)
        if group and size + len(blk[1]) > TARGET:
            flush_group()
        group.append(blk)
    flush_group()
    return chunks


def chunk_document(label: str, raw: str, ext: str) -> list[dict[str, str]]:
    structured = ext == ".pdf" or bool(re.search(r"^[A-Z][A-Z &/]{2,38}$", raw, flags=re.MULTILINE))
    return structured_chunks(raw, label) if structured else generic_chunks(raw, label)


# ---------- 4. clean & validate ----------
def normalise(text: str) -> str:
    return re.sub(r"\W+", " ", text.lower()).strip()


def clean_and_validate(chunks: pd.DataFrame) -> pd.DataFrame:
    df = chunks.copy()
    df["text"] = df["text"].str.replace(PHONE, "[phone omitted]", regex=True)
    df["title"] = df["title"].str.strip()
    df = df[df["text"].str.strip().str.len() > 0]
    df = df.drop_duplicates(subset=["text"], keep="first")
    # the same passage pasted into two files would be retrieved twice; keep one copy
    df = df[~df["text"].map(normalise).duplicated(keep="first")].reset_index(drop=True)
    if len(df) > MAX_CHUNKS:
        raise ValueError(f"too many chunks ({len(df)} > {MAX_CHUNKS}); the id format is DOC-1..DOC-{MAX_CHUNKS}")
    df.insert(0, "id", [f"DOC-{i + 1}" for i in range(len(df))])
    for row in df.to_dict("records"):
        try:
            KnowledgeChunk(**row)
        except ValidationError as e:
            raise ValueError(f"invalid chunk {row['id']} from {row['source']!r}: {e.errors()[0]['msg']}") from e
    return df


# ---------- pipeline ----------
def build_knowledge(root: Path = ROOT) -> pd.DataFrame:
    sources = discover_sources(root)
    if sources.empty:
        raise SystemExit("ingest: no sources found (public/resume.pdf or knowledge/*)")
    sources["ext"] = sources["path"].map(lambda p: Path(p).suffix.lower())
    sources["raw"] = sources["path"].map(read_document)
    rows: list[dict[str, str]] = []
    for s in sources.itertuples():
        rows.extend(chunk_document(s.label, s.raw, s.ext))
    return clean_and_validate(pd.DataFrame(rows, columns=["source", "title", "text"]))


def to_json(df: pd.DataFrame) -> str:
    return json.dumps(df[["id", "source", "title", "text"]].to_dict("records"), ensure_ascii=False, indent=2) + "\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="fail if backend/data/knowledge.json is out of date")
    args = parser.parse_args(argv)

    df = build_knowledge()
    payload = to_json(df)
    if args.check:
        current = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
        if current != payload:
            print("ingest --check: backend/data/knowledge.json is out of date; run `python -m backend.ingest`")
            return 1
        print(f"ingest --check: up to date ({len(df)} chunks)")
        return 0

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(payload, encoding="utf-8")
    summary = df.groupby("source", sort=False).agg(chunks=("id", "count"), chars=("text", lambda s: int(s.str.len().sum())))
    print(summary.to_string())
    print(f"ingest: wrote {len(df)} chunks to {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
