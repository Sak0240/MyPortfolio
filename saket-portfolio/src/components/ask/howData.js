// The journey of one question, in plain words, shared by the ring around the orb (desktop) and the list (small screens).
// What lights up is the path the question REALLY took: the backend reports it as `route`.
export const STEPS = [
  {
    title: "You type a question",
    where: "your browser",
    short: "sent over HTTPS to Saket's server",
    body: "Your question leaves this page over HTTPS. Only the question goes (plus your previous one, so “tell me more” makes sense).",
  },
  {
    title: "Saket's server gets it",
    where: "Python · FastAPI · Vercel",
    short: "checks it's a normal question",
    body: "A small Python program Saket wrote checks the question is a normal length, comes from this site, and isn't being spammed.",
  },
  {
    title: "It searches his files",
    where: "resume + project notes",
    short: "picks the best-matching paragraphs",
    body: "The server picks the few most relevant paragraphs from his resume and notes. Think Ctrl+F, but smarter. It never browses the web.",
  },
  {
    title: "Is the answer in them?",
    where: "the gatekeeper",
    short: "if not, it stops: the AI isn't asked",
    body: "If nothing relevant turns up (like “capital of France?”), it stops here and says so. The AI is never even asked.",
  },
  {
    title: "DeepSeek writes the answer",
    where: "DeepSeek AI model",
    short: "told: use only those paragraphs",
    body: "Only your question and those paragraphs are sent to DeepSeek, with one strict rule: answer only from them, or say you don't know.",
  },
  {
    title: "The answer is double-checked",
    where: "back on Saket's server",
    short: "it must cite a real paragraph",
    body: "Every answer must point to a real paragraph it was given. If it doesn't, it's thrown away and replaced with a safe reply.",
  },
  {
    title: "You see the answer",
    where: "this window",
    short: "with the files it came from",
    body: "Shown here together with the files it came from, so you can tell it isn't made up.",
  },
];

// How each route ends, step by step: done | stop (the journey ends here) | skip (not needed)
const ROUTES = {
  answered: ["done", "done", "done", "done", "done", "done", "done"],
  smalltalk: ["done", "done", "skip", "skip", "skip", "skip", "done"],
  refused_retrieval: ["done", "done", "done", "stop", "skip", "skip", "done"],
  refused_model: ["done", "done", "done", "done", "done", "stop", "done"],
  unreachable: ["done", "stop", "skip", "skip", "skip", "skip", "skip"],
  rate_limited: ["done", "stop", "skip", "skip", "skip", "skip", "skip"],
};

/** idle | active | done | stop | skip for every step. `demo` is the step the idle animation is on. */
export function statesFor(trace, demo) {
  const idle = STEPS.map(() => "idle");
  if (trace.phase === "idle") return idle.map((_, i) => (i === demo ? "active" : "idle"));
  if (trace.phase === "local") return idle;
  if (trace.phase === "running") return idle.map((_, i) => (i + 1 < trace.step ? "done" : i + 1 === trace.step ? "active" : "idle"));
  return ROUTES[trace.route] || ROUTES.answered;
}

function sourceNames(sources) {
  return [
    ...new Set((sources || []).map((s) => (s.source === "Resume" ? "Resume" : s.source.replace(/\.(md|txt|pdf|docx)$/i, "").replace(/[_-]+/g, " ")))),
  ].slice(0, 3);
}

/** A short live detail for a step ("Picked from: Resume · companies"), or null. */
export function noteFor(index, trace, state) {
  if (trace.phase !== "done" && trace.phase !== "running") return null;
  const route = trace.route;
  const seconds = trace.ms ? `${(trace.ms / 1000).toFixed(1)}s` : null;
  const q = trace.question && trace.question.length > 48 ? `${trace.question.slice(0, 45)}…` : trace.question;
  switch (index) {
    case 0:
      return q ? `“${q}”` : null;
    case 1:
      if (route === "unreachable") return "Couldn't reach the server just now.";
      if (route === "rate_limited") return "Too many questions in a minute: asked to wait.";
      return null;
    case 2:
      if (route === "smalltalk") return "A greeting: no search needed.";
      if (route === "refused_retrieval") return "Found nothing relevant.";
      if (trace.sources && trace.sources.length && state === "done") return `Picked from: ${sourceNames(trace.sources).join(" · ")}`;
      return null;
    case 3:
      return route === "refused_retrieval" ? "Stopped here: not in his files. DeepSeek was never called." : null;
    case 4:
      if (state === "skip") return "Not needed: DeepSeek wasn't called.";
      if (state === "done" || route === "refused_model") return "Model: deepseek-chat";
      return null;
    case 5:
      if (route === "refused_model") return "Rejected: no citation, so a safe reply was used.";
      if (route === "answered") return "Passed: it cites his files.";
      return null;
    case 6:
      if (route === "smalltalk") return "A friendly canned reply.";
      if (route === "refused_retrieval") return "A polite “not in his files”.";
      return seconds && route === "answered" ? `Round trip: ${seconds}` : null;
    default:
      return null;
  }
}

export function statusLine(trace) {
  if (trace.phase === "idle") return "Ask something and watch it travel around the circle.";
  if (trace.phase === "local") return "That was a command: it ran in your browser. No server, no AI.";
  if (trace.phase === "running") return "Working… your question is on its way.";
  switch (trace.route) {
    case "answered":
      return "✓ Answered from Saket's files, written by DeepSeek and double-checked.";
    case "smalltalk":
      return "✓ A simple greeting, so no search and no AI.";
    case "refused_retrieval":
      return "Stopped early: not in Saket's files, so DeepSeek was never called.";
    case "refused_model":
      return "DeepSeek's draft didn't pass the check, so a safe reply was shown.";
    case "rate_limited":
      return "Paused: too many questions in a minute.";
    default:
      return "Couldn't reach the server this time.";
  }
}
