# Date Planner
## Vision
To provide a simple, delightful tool that helps couples break out of their routine by discovering and planning creative, personalized date nights.

## Target Users
Couples in established relationships (living together or married) who are looking for new and interesting ways to spend quality time together. They are comfortable with technology but want a straightforward, non-intrusive planning experience.

## Core Features
- **Profile Onboarding:** Users can specify their shared interests (e.g., hiking, fine dining, live music), typical budget per date, and home location.
- **Suggestion Engine:** Generates date night ideas based on user profiles. Each suggestion is a complete package (e.g., "Dinner at a new Italian place, followed by a walk in the park with a surprise stop for gelato").
- **Filtering & Categories:** Allow users to filter suggestions by mood (e.g., "Romantic," "Adventurous," "Low-key") or budget.
- **Date Details:** Each idea includes links to restaurants, activity locations (with maps), and placeholder booking links.
- **Small Surprises:** Each plan includes an optional, low-cost idea for a small surprise (e.g., a specific conversation starter, a small thoughtful gift idea, a song to play).
- **Save/Bookmark:** Users can save their favorite date ideas for future planning.

## Out of Scope (for V1)
- In-app payments or direct booking integrations.
- Social features for sharing date ideas with other couples.
- User-generated content or reviews.
- A dedicated mobile app (the web app will be mobile-friendly).

## Tech Stack (Assumed)
- **Frontend:** React (Next.js) for a responsive, modern web application.
- **Backend:** Node.js (Express/Fastify) for the API.
- **Database:** PostgreSQL for storing user profiles and date ideas.
- **External APIs:** Google Maps/Places API for location-based suggestions and details.

## Success Metrics
- **Activation:** Percentage of new users who complete their profile.
- **Engagement:** Number of date ideas saved or "planned" per week.
- **Retention:** Percentage of users who return to the app within 30 days.
