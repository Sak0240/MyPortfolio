// Anything on the page can open the "Ask Saket's AI" console, optionally with a question to run:
//   openAsk()   or   openAsk("What did Saket build at KWAD?", clickedElement)
// The element is where the orange circle grows from when the hero sphere is not on screen.
export const OPEN_ASK_EVENT = "open-ask";

export function openAsk(question, trigger) {
  window.dispatchEvent(new CustomEvent(OPEN_ASK_EVENT, { detail: { question, trigger } }));
}

// The questions behind the starter chips and the console's welcome screen.
// (Each one is checked against the knowledge base by the backend test suite.)
export const STARTERS = [
  "What did Saket build at KWAD?",
  "Tell me about CatalogSage",
  "Which cloud tools does he use?",
  "Where did he study?",
];
