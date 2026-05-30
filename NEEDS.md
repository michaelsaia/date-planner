# Needs

## Google Maps API Key

- **Blocks:** Task 13 — Integrate Google Maps/Places API
- **Env var:** `GOOGLE_MAPS_API_KEY`
- **How to get it:**
  1. Go to https://console.cloud.google.com/
  2. Create or select a project
  3. Enable the "Places API" and "Maps JavaScript API"
  4. Go to APIs & Services → Credentials → Create Credentials → API Key
  5. Restrict the key to the Places API and Maps JavaScript API
  6. Add the key to `app/.env.local` as `GOOGLE_MAPS_API_KEY=your_key_here`
- **Details:** Required to fetch nearby restaurants and activity venues based on user home location, pull venue details (name, address, rating, photos, maps link), and display embedded maps on date idea detail pages.

## GitHub Repository

- **Blocks:** Pushing code, creating PRs, CI/CD
- **Env var:** N/A (git remote configuration)
- **How to get it:**
  1. Create a new GitHub repository (e.g., `michaelsaia/date-planner`)
  2. Grant the ShortestPath GitHub App access to the repository
  3. The build agent will configure the remote automatically on the next credential refresh, or manually run: `git remote add origin https://github.com/<owner>/date-planner.git`
- **Details:** All code is committed locally on `main` (9 commits). Cannot push, create PRs, or run CI without a configured remote. This has been a blocker since the first session.
