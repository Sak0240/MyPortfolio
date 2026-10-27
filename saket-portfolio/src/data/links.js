export const GITHUB_REPO_URL = "https://github.com/Sak0240";
export const SOURCE_REPO_URL = "https://github.com/Sak0240/MyPortfolio";

export const NAV_ITEMS = ["about", "projects", "experience", "systems", "skills", "contact"];

// The Python backend (Vercel function) that powers the "Ask Saket's AI" console.
//  - on any *.vercel.app address the site and the backend are the same deployment, so a relative URL always works,
//    even if the project is renamed or gets a new domain
//  - GitHub Pages and local development call the production deployment directly
//  - VITE_CHAT_API overrides both (e.g. a backend running on localhost:8000)
const PRODUCTION_API = "https://saket-deshmukh-portfolio.vercel.app/api/chat";
const onVercel = typeof window !== "undefined" && window.location.hostname.endsWith(".vercel.app");
export const CHAT_API_URL = import.meta.env.VITE_CHAT_API || (onVercel ? "/api/chat" : PRODUCTION_API);
