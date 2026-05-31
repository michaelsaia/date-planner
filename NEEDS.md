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
