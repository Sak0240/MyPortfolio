export const GITHUB_REPO_URL = "https://github.com/Sak0240";
export const SOURCE_REPO_URL = "https://github.com/Sak0240/MyPortfolio";

export const NAV_ITEMS = ["about", "ask", "projects", "experience", "systems", "skills", "contact"];

// Serverless endpoint (Vercel) that powers the "Ask Saket's AI" console. Override with VITE_CHAT_API.
export const CHAT_API_URL =
  import.meta.env.VITE_CHAT_API || "https://my-portfolio-fawn-kappa-86.vercel.app/api/chat";
