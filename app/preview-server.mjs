// Lightweight preview server for environments where `next dev` cannot persist.
// Serves a pre-rendered HTML version of the landing page.
import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";

const port = parseInt(process.env.PORT || "3000", 10);

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Date Planner</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #faf7f5; --fg: #1c1917; --primary: #e11d48;
      --muted: #78716c; --card: #ffffff; --border: #e7e5e4;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #1c1917; --fg: #faf7f5; --primary: #fb7185;
        --muted: #a8a29e; --card: #292524; --border: #44403c;
      }
    }
    body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--fg); min-height: 100vh; display: flex; flex-direction: column; }
    main { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2rem; text-align: center; max-width: 42rem; margin: 0 auto; padding: 6rem 1rem; }
    h1 { font-size: 3rem; font-weight: 700; letter-spacing: -0.025em; line-height: 1.1; }
    @media (min-width: 640px) { h1 { font-size: 3.75rem; } }
    .subtitle { font-size: 1.25rem; color: var(--muted); max-width: 32rem; line-height: 1.6; }
    .buttons { display: flex; flex-direction: column; gap: 0.75rem; }
    @media (min-width: 640px) { .buttons { flex-direction: row; } }
    .btn { display: inline-flex; height: 3rem; align-items: center; justify-content: center; border-radius: 9999px; padding: 0 2rem; font-size: 1rem; font-weight: 500; text-decoration: none; transition: opacity 0.15s; }
    .btn-primary { background: var(--primary); color: white; border: none; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-secondary { background: transparent; color: var(--fg); border: 1px solid var(--border); }
    .btn-secondary:hover { background: var(--card); }
    .features { display: grid; grid-template-columns: 1fr; gap: 1.5rem; width: 100%; margin-top: 3rem; }
    @media (min-width: 640px) { .features { grid-template-columns: repeat(3, 1fr); } }
    .card { border-radius: 0.75rem; border: 1px solid var(--border); background: var(--card); padding: 1.5rem; text-align: left; }
    .card h3 { font-size: 1.125rem; font-weight: 600; }
    .card p { margin-top: 0.5rem; font-size: 0.875rem; color: var(--muted); line-height: 1.6; }
  </style>
</head>
<body>
  <main>
    <h1>Date Planner</h1>
    <p class="subtitle">Discover creative, personalized date nights tailored to your interests, budget, and location. Break out of the routine together.</p>
    <div class="buttons">
      <a href="/explore" class="btn btn-primary">Explore Date Ideas</a>
      <a href="/onboarding" class="btn btn-secondary">Set Up Profile</a>
    </div>
    <div class="features">
      <div class="card">
        <h3>Personalized</h3>
        <p>Get suggestions based on your shared interests and budget</p>
      </div>
      <div class="card">
        <h3>Complete Plans</h3>
        <p>Each idea is a full date night with activities, venues, and surprises</p>
      </div>
      <div class="card">
        <h3>Save Favorites</h3>
        <p>Bookmark the best ideas and plan them when you're ready</p>
      </div>
    </div>
  </main>
</body>
</html>`;

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", "http://localhost:" + port);

  // API health endpoint
  if (url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
    return;
  }

  // Static files from public/
  const publicPath = join(process.cwd(), "public", url.pathname);
  if (existsSync(publicPath) && !url.pathname.endsWith("/")) {
    const ext = extname(publicPath);
    const mime = MIME_TYPES[ext] || "application/octet-stream";
    try {
      const content = readFileSync(publicPath);
      res.writeHead(200, { "Content-Type": mime });
      res.end(content);
      return;
    } catch {
      // fall through to landing page
    }
  }

  // All other routes serve the landing page
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(LANDING_HTML);
});

server.listen(port, "0.0.0.0", () => {
  console.log("> Date Planner preview ready on http://0.0.0.0:" + port);
});
