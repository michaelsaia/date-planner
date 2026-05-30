# Needs

## Google Maps API Key

- **Title:** Location-based restaurant and venue suggestions won't work without a Google Maps key.
- **What this means:** The app can suggest date ideas, but it can't show real nearby restaurants or venues on a map until this key is provided. Everything else works fine without it.
- **Blocks:** Task 13 — Integrate Google Maps/Places API
- **Env var:** `GOOGLE_MAPS_API_KEY`
- **How to get it:**
  1. Go to https://console.cloud.google.com/ and sign in with your Google account
  2. Click "Select a project" at the top, then "New Project" — name it anything (e.g., "Date Planner")
  3. In the search bar at the top, search for "Places API" and click "Enable"
  4. Do the same for "Maps JavaScript API" — search and enable it
  5. In the left sidebar, go to "APIs & Services" then "Credentials"
  6. Click "Create Credentials" at the top, choose "API Key"
  7. Copy the key that appears
  8. Paste it into ShortestPath when prompted, or let us know and we'll add it for you
- **Technical detail:** Required for fetching nearby venues via the Places API and rendering embedded Google Maps on date idea detail pages.

## GitHub Repository

- **Title:** Code can't be published or shared online without a GitHub repository.
- **What this means:** All the code is saved locally and working, but it's not backed up online and we can't set up automatic deployments until a repository is connected.
- **Blocks:** Pushing code, creating pull requests, CI/CD, and deployment (Task 26)
- **Env var:** N/A (git remote configuration)
- **How to get it:**
  1. Go to https://github.com/new
  2. Name the repository (e.g., "date-planner"), set it to Private, and click "Create repository"
  3. In your ShortestPath project settings, connect the new repository
  4. The build system will automatically link it on the next run
- **Technical detail:** 10 commits exist locally on `main`. Cannot push, create PRs, or run CI without a configured git remote. Blocker since first session.
