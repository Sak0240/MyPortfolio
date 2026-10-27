import { CHAT_API_URL } from "../data/links";

const TIMEOUT_MS = 25000;

/** kind: "rate" (HTTP 429) | "unreachable" (network error, timeout or any other failure) */
export class ChatError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind;
  }
}

/**
 * Sends a question to the Python backend, which does retrieval, the refusal gate, the model call and
 * citation checks. `previous` is the visitor's last question so "tell me more" can be understood.
 * Resolves to { answer, sources, grounded, suggestions }.
 */
export async function askQuestion(question, previous) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body = { question: question.slice(0, 300) };
    if (previous) body.previous = previous.slice(0, 300);
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (response.status === 429) throw new ChatError("rate");
    if (!response.ok) throw new ChatError("unreachable");
    const data = await response.json();
    return {
      answer: String(data.answer || "").trim(),
      sources: Array.isArray(data.sources) ? data.sources : [],
      grounded: Boolean(data.grounded),
      suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
      route: typeof data.route === "string" ? data.route : "",
    };
  } catch (e) {
    throw e instanceof ChatError ? e : new ChatError("unreachable");
  } finally {
    clearTimeout(timer);
  }
}

export const RATE_LIMITED_TEXT = "Too many questions in a short time — please wait a minute and try again.";
export const UNREACHABLE_TEXT =
  "I can't reach the chat backend right now. Please try again in a moment — or browse the sections below, they have the same information.";
