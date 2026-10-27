"""BM25 retrieval over the knowledge base, plus the guards that decide whether to answer at all.

No dependencies: the knowledge base is a few dozen chunks, so an in-memory index is enough.
"""

from __future__ import annotations

import math
import re
from collections import Counter
from dataclasses import dataclass, field

from .schemas import KnowledgeChunk

STOP = frozenset(
    (
        "a an and are as at be by can could did do does for from had has have how i if in into is it its "
        "me my of on or our so than that the their them then there these they this to was we were what when "
        "where which who whom why will with would you your about tell please give show list any some "
        "saket his he him her she explain explains explained describe walk through more"
    ).split()
)

_SUFFIXES = ("ations", "ation", "ings", "ing", "ers", "er", "ed", "es", "s")
_ES_PLURAL = re.compile(r"(?:ss|x|z|ch|sh)es$")


def stem(word: str) -> str:
    """Light suffix stripping so "pipelines/pipeline" and "engineering/engineer" meet."""
    s = word
    changed = True
    while changed:
        changed = False
        for suffix in _SUFFIXES:
            # "-es" is a plural ending only after ss/x/z/ch/sh ("classes"); otherwise strip just the "s"
            # so "pipelines" -> "pipeline" meets "pipeline", and "services" meets "service"
            if suffix == "es" and not _ES_PLURAL.search(s):
                continue
            if s.endswith(suffix) and len(s) - len(suffix) >= 4:
                s = s[: -len(suffix)]
                changed = True
                break
    return s


def tokenize(text: str) -> list[str]:
    cleaned = re.sub(r"[^a-z0-9]+", " ", re.sub(r"[’']s", "", str(text).lower()))
    return [stem(t) for t in cleaned.split() if len(t) > 1 and t not in STOP]


# Query-side synonyms so everyday phrasing finds the right chunk ("contact" -> email / linkedin).
SYNONYMS: dict[str, list[str]] = {
    "contact": ["email", "linkedin", "gmail"],
    "reach": ["email", "linkedin", "gmail"],
    "email": ["gmail"],
    "phone": ["pune"],
    "located": ["pune"],
    "location": ["pune"],
    "based": ["pune"],
    "live": ["pune"],
    "city": ["pune"],
    "company": ["kwad", "briowin"],
    "employer": ["kwad", "briowin"],
    "job": ["kwad", "briowin", "engineer"],
    "work": ["kwad", "briowin"],
    "worked": ["kwad", "briowin"],
    "college": ["bachelor", "university"],
    "degree": ["bachelor", "university"],
    "study": ["bachelor", "university"],
    "studied": ["bachelor", "university"],
    "university": ["bachelor"],
    "certificate": ["certification"],
    "tech": ["skills"],
    "stack": ["skills"],
    "technology": ["skills"],
    "technologies": ["skills"],
    "tools": ["skills"],
    "project": ["kwad", "briowin", "catalogsage"],
    "projects": ["kwad", "briowin", "catalogsage"],
    "role": ["engineer", "kwad"],
    "current": ["kwad"],
    "currently": ["kwad"],
    "position": ["engineer", "kwad"],
    "made": ["built", "develop"],
    "make": ["built", "develop"],
    "created": ["built", "develop"],
    "create": ["built", "develop"],
    "achievement": ["award", "reduc", "improv"],
    "achievements": ["award", "reduc", "improv"],
    "accomplishments": ["award", "reduc", "improv"],
    "impact": ["reduc", "improv", "achiev"],
    "yourself": ["summary", "engineer", "experience"],
    "background": ["summary", "engineer", "experience", "bachelor"],
    "introduce": ["summary", "engineer", "experience"],
    "skills": ["python", "langchain"],
}

K1 = 1.4
B = 0.75
SYNONYM_WEIGHT = 0.5  # synonyms help recall without outranking the words actually asked

# "tell me about Saket" / "who is he" / "tell me more" have no topic words of their own, so they are
# searched as a request for the profile summary (tolerates the typo "sake").
_OVERVIEW = re.compile(
    # optional chatty lead-in: "hey, ", "so ", "can you ", "i want to know "
    r"^(?:(?:hey|hi|hello|hiya|yo|so|ok|okay|well|and|but|please|can\s+you|could\s+you|would\s+you|will\s+you"
    r"|i\s+want\s+to\s+know|i'd\s+like\s+to\s+know|i\s+would\s+like\s+to\s+know)[\s,!.]*)*"
    r"(?:(?:tell|talk|say)\s+(?:me\s+)?(?:more\s+|something\s+)?(?:about\s*)?"
    r"|(?:who|what)(?:\s+(?:is|was)|['’]s)\s+|what\s+about\s+|introduce\s+|describe\s+"
    r"|(?:give\s+me\s+)?(?:an?\s+)?(?:overview|summary|intro(?:duction)?)\s+(?:of\s+|about\s+)?|about\s+)?"
    r"(?:mr\.?\s*)?(?:saket(?:\s+deshmukh)?|sake|saked|sket|him|he|this\s+(?:guy|person|developer|engineer))?"
    r"(?:\s+(?:please|pls|thanks))?\s*[?!.]*$",
    re.IGNORECASE,
)
_OVERVIEW_HINT = re.compile(r"\b(?:saket|sake|saked|sket|him|he|this|more|summary|overview|intro)\b", re.IGNORECASE)
OVERVIEW_TERMS = "summary engineer experience bachelor profile"


def is_overview(query: str) -> bool:
    q = str(query).strip()
    return bool(q) and bool(_OVERVIEW.match(q)) and bool(_OVERVIEW_HINT.search(q))


_FOLLOW_UP = re.compile(
    r"^(?:(?:ok|okay|and|so|also|please)[\s,]+)*"
    r"(?:(?:tell|say|explain|show)\s+(?:me\s+)?(?:a\s+)?(?:little\s+|bit\s+)*more(?:\s+(?:about\s+(?:that|it|this)|details?))?"
    r"|more(?:\s+details?)?|go\s+on|continue|elaborate|what\s+else|anything\s+else|and\??|why\??|how\??)"
    r"\s*[?!.]*$",
    re.IGNORECASE,
)


_ORG_NOUN = re.compile(r"\b(?:company|companies|firm|organi[sz]ation|employer|startup|business)\b", re.IGNORECASE)
_ABOUT_SAKET = re.compile(r"\b(?:saket|he|his|him|himself|you|your|yours)\b", re.IGNORECASE)


def asks_about_organization(question: str) -> bool:
    """"tell me about KWAD company": about the company itself, not about Saket's work there.

    "which company does he work at" is about Saket (it mentions him) and does not count.
    """
    q = str(question)
    return bool(_ORG_NOUN.search(q)) and not _ABOUT_SAKET.search(q)


_REFERS_BACK = re.compile(
    r"\b(?:it|its|that|this|those|these|them|they|one|ones|first|second|third|last|other|another|more|else|also"
    r"|same|former|latter|there)\b",
    re.IGNORECASE,
)


def refers_back(question: str) -> bool:
    """Does the question point at something said earlier ("why did he choose it?", "the second one")?

    Needed so an off-topic question ("capital of France") can never borrow the previous topic.
    """
    return bool(_REFERS_BACK.search(str(question)))


def is_follow_up(question: str) -> bool:
    """Bare continuations ("tell me more", "go on", "what else") that only make sense after an earlier question."""
    return bool(_FOLLOW_UP.match(str(question).strip()))


@dataclass(frozen=True)
class Hit:
    chunk: KnowledgeChunk
    score: float
    matched: tuple[str, ...] = field(default_factory=tuple)


@dataclass
class _Doc:
    tf: Counter[str]
    length: int


class Retriever:
    """Immutable BM25 index over a list of chunks. Build once, search many times."""

    def __init__(self, chunks: list[KnowledgeChunk]):
        self.chunks = chunks
        self._docs: list[_Doc] = []
        for c in chunks:
            # the title counts double: "KWAD - Clinical Record Processing" should beat an incidental mention
            tokens = tokenize(f"{c.title} {c.title} {c.text}")
            self._docs.append(_Doc(Counter(tokens), len(tokens)))
        self._df: Counter[str] = Counter()
        for d in self._docs:
            self._df.update(d.tf.keys())
        self._avg_len = sum(d.length for d in self._docs) / max(1, len(self._docs))

    def search(self, query: str, k: int = 4) -> list[Hit]:
        asked = OVERVIEW_TERMS if is_overview(query) else query
        base = tokenize(asked)
        if not base or not self.chunks:
            return []
        weights: dict[str, float] = {}
        for w in re.split(r"[^a-z0-9]+", str(asked).lower()):
            for syn in SYNONYMS.get(w, ()):
                weights[stem(syn)] = SYNONYM_WEIGHT
        for t in base:
            weights[t] = 1.0
        n = len(self._docs)
        scored: list[Hit] = []
        for chunk, d in zip(self.chunks, self._docs):
            score = 0.0
            matched: list[str] = []
            for t, weight in weights.items():
                f = d.tf.get(t)
                if not f:
                    continue
                df = self._df.get(t, 0)
                idf = math.log(1 + (n - df + 0.5) / (df + 0.5))
                score += weight * (idf * (f * (K1 + 1))) / (f + K1 * (1 - B + B * d.length / self._avg_len))
                matched.append(t)
            if score > 0:
                scored.append(Hit(chunk, score, tuple(matched)))
        scored.sort(key=lambda h: h.score, reverse=True)
        return scored[:k]


def is_grounded(query: str, hits: list[Hit], min_score: float = 0.8) -> bool:
    """Is the retrieved context relevant enough to answer from?

    Off-topic questions ("capital of France", "write a poem") fail this and are refused
    without ever calling the LLM.
    """
    if not hits:
        return False
    q_tokens = set(tokenize(query))
    top = hits[0]
    coverage = len(top.matched) / max(1, len(q_tokens))
    return top.score >= min_score and (len(top.matched) >= 2 or coverage >= 0.5)


REFUSAL = (
    "The available portfolio documentation does not specify that detail, so I can't confirm it. "
    "Try asking about Saket's projects, skills, experience, or education."
)

_GREETING = re.compile(
    r"^(?:hi|hii+|hello|hey|heya|hiya|yo|sup|namaste|good\s+(?:morning|afternoon|evening))"
    r"(?:\s+(?:there|team|bot|saket|everyone|friend|buddy))?\s*[!.,?]*\s*$",
    re.IGNORECASE,
)
_THANKS = re.compile(
    r"^(?:thanks|thank\s+you|thx|ty|cheers)(?:\s+(?:a\s+lot|so\s+much|saket|bot))?\s*[!.,?]*\s*$", re.IGNORECASE
)
_BYE = re.compile(r"^(?:bye|goodbye|see\s+you|cya|good\s*night)(?:\s+(?:saket|bot))?\s*[!.,?]*\s*$", re.IGNORECASE)
_ABOUT_BOT = re.compile(
    r"^(?:who\s+are\s+you|what\s+are\s+you|what\s+can\s+you\s+do|what\s+can\s+i\s+ask|how\s+does\s+this\s+work)"
    r"\s*[!.,?]*$",
    re.IGNORECASE,
)

INTRO = (
    "I'm an assistant that only knows what's in Saket's resume and notes. Ask about his projects, skills, "
    'experience, or education — for example: "What did Saket build at KWAD?" or "Which cloud tools does he use?"'
)


def small_talk(question: str) -> str | None:
    """Friendly canned replies for greetings / thanks / "what are you" - no model call needed."""
    q = str(question).strip()
    if _GREETING.match(q):
        return f"Hi there! {INTRO}"
    if _ABOUT_BOT.match(q):
        return INTRO
    if _THANKS.match(q):
        return "You're welcome! Ask me anything else about Saket's work."
    if _BYE.match(q):
        return "Thanks for stopping by — the rest of the portfolio is just a scroll away."
    return None
