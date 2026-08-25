# saket-portfolio

Personal portfolio site — dark/terminal-themed, with a live retrieval + generation
demo built from an actual resume corpus.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer installed. Then, in this folder:

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`) — the site hot-reloads
as you edit files in `src/`.

To edit content: everything lives in `src/App.jsx` — the resume corpus (`CORPUS`),
experience cards, skills, and copy are all in that one file.

## Deploy to GitHub Pages

This repo already includes a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that builds and deploys automatically on every
push to `main`. Steps:

1. **Create a new repo on GitHub** (e.g. `saket-portfolio`) — don't initialize it
   with a README, since you already have one here.

2. **Push this project to it:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

3. **Turn on Pages for this repo:**
   - Go to your repo on GitHub → **Settings** → **Pages**
   - Under "Build and deployment" → **Source**, choose **GitHub Actions**

4. **Wait ~1 minute.** Go to the **Actions** tab in your repo — you'll see the
   "Deploy to GitHub Pages" workflow running. Once it's green, your site is live
   at:

   ```
   https://<your-username>.github.io/<your-repo>/
   ```

Every time you `git push` to `main` after that, it redeploys automatically.

## Update your "view source" link

`src/App.jsx` has a constant near the top:

```js
const GITHUB_REPO_URL = "https://github.com/saket-deshmukh/portfolio";
```

Change this to your actual repo URL once you've created it, so the "view
source" link on the site points to the right place.

## About the terminal demo

The hero section includes a live retrieval demo: it scores your resume content
against whatever a visitor types, shows the top matches with similarity-style
scores, then tries to generate a grounded answer using the Claude API.

That live generation call only works from Claude.ai's own artifact preview,
which proxies it. On a plain static deploy (like GitHub Pages), there's no
backend to safely hold an API key, so the browser can't call
`api.anthropic.com` directly — the code already handles this gracefully and
falls back to an **extractive answer** built straight from the retrieved
resume chunks, so the demo still works end-to-end without needing a server.

If you'd like genuine live LLM generation on the deployed site later, that
needs a small serverless backend (e.g. a Cloudflare Worker or Vercel function)
to hold the API key server-side — GitHub Pages alone can't do this since it
only serves static files. Happy to help set that up if you want it.
