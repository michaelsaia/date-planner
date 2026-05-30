# Date Planner — Implementation TODO List

## Phase 1: Project Setup & Infrastructure
* [x] **Task 1: Initialize Next.js project** (done)
  - Create Next.js app with TypeScript, Tailwind CSS, and App Router
  - Configure ESLint, Prettier, and project structure (`/app`, `/components`, `/lib`, `/types`)
* [x] **Task 2: Set up database with Prisma ORM** (done)
  - Installed Prisma ORM with SQLite/libSQL adapter (works without external PostgreSQL)
  - Created prisma.config.ts, schema.prisma, and initial migration
  - Set up seed script with default interests
  - Note: Can switch to PostgreSQL later by changing datasource provider and DATABASE_URL
* [x] **Task 3: Set up backend API layer** (done)
  - Configure Next.js API routes (or separate Express/Fastify server)
  - Add request validation (zod)
  - Set up environment variable management (`.env.local`)
* [x] **Task 4: Configure CI/CD basics** (done)
  - Add linting and type-check scripts to `package.json`
  - Set up a basic test runner (Vitest or Jest)

## Phase 2: Data Modeling & Database Schema
* [x] **Task 5: Design and create User/Couple profile schema** (done)
  - User model: id, email, passwordHash, createdAt
  - Profile model: userId (unique), homeLat, homeLng, homeLabel, budgetMin, budgetMax, timestamps
  - Cascade delete from User to Profile
* [x] **Task 6: Create interests and preferences schema** (done)
  - Interest model: id, name (unique), category
  - UserInterest join model: composite key (userId, interestId)
  - Seeded 20 default interests across 6 categories
* [x] **Task 7: Create date ideas schema** (done)
  - DateIdea model: id, title, description, mood, estimatedCost, surprise, imageUrl
  - DateIdeaActivity model: dateIdeaId (indexed), name, venueName, venueUrl, mapsUrl, order
* [x] **Task 8: Create bookmarks schema** (done)
  - Bookmark model: id, userId (indexed), dateIdeaId, createdAt
  - Unique constraint on (userId, dateIdeaId) to prevent duplicates

## Phase 3: Authentication & Profile Onboarding
* [x] **Task 9: Implement authentication** (done)
  - Set up NextAuth.js v5 with email/password credentials provider
  - Created sign-up and login pages with shared AuthForm component
  - JWT session strategy with user ID in token
  - Protected route middleware for /explore, /saved, /onboarding, /profile
  - Signup API route with zod validation and bcrypt hashing
* [x] **Task 10: Build profile onboarding flow** (done)
  - Multi-step form: interests selection, budget range presets/sliders, location input
  - Browser geolocation detection for location step
  - Saves profile via POST /api/profile with zod validation
  - Progress bar showing current step
* [x] **Task 11: Build profile editing page** (done)
  - Profile page at /profile with all three sections (interests, budget, location)
  - Pre-populates form with existing profile data from GET /api/profile
  - Reuses onboarding step components for consistency
  - Success/error feedback on save

## Phase 4: Suggestion Engine
* [x] **Task 12: Build core suggestion algorithm** (done)
  - Added DateIdeaInterest join table and migration for interest-based matching
  - Seeded 20 curated date ideas across all 5 moods with activities and interest links
  - Built scoring engine (70% interest overlap, 30% budget fit) in `src/lib/scoring.ts`
  - Suggestion service in `src/lib/suggestions.ts` fetches, scores, and ranks ideas
  - GET /api/suggestions endpoint with mood/budget/limit query param filters
  - 8 unit tests for scoring logic (25 total tests passing)
* [!] **Task 13: Integrate Google Maps/Places API** (blocked)
  - Blocked on: GOOGLE_MAPS_API_KEY not provided (see NEEDS.md)
  - Fetch nearby restaurants and activity venues based on user home location
  - Pull venue details: name, address, rating, photos, maps link
  - Cache API responses to reduce quota usage
* [x] **Task 14: Implement "Small Surprises" generation** (done)
  - Curated library of 38 surprise ideas across 4 categories (conversation starters, gift ideas, songs, gestures) in `src/lib/surprises.ts`
  - Each surprise tagged with compatible moods for intelligent matching
  - GET /api/surprises endpoint with mood/category/count/exclude query params for refresh functionality
  - Suggestions service dynamically attaches mood-matched surprises (structured `{text, category, id}` object)
  - 17 unit tests for surprise logic (42 total tests passing)

## Phase 5: Filtering, Categories & Browse UI
* [x] **Task 15: Build the main suggestions feed page** (done)
  - Explore page at `/explore` with auth guard and onboarding redirect
  - Card-based responsive grid (1/2/3 cols) with mood badges, cost, activity preview, matched interests
  - SuggestionsFeed client component with `useReducer` for fetch state management
  - "Refresh" button to regenerate suggestions, loading skeletons, empty state, error handling
  - MoodBadge component with per-mood color theming
* [x] **Task 16: Implement mood and budget filters** (done)
  - FilterBar component wrapping MoodFilter and BudgetFilter with "Clear all" action
  - MoodFilter: toggle buttons for 5 moods with per-mood color theming and aria-pressed
  - BudgetFilter: preset tier buttons (Free/$/$$/$$$/$$$$) with toggle-to-deselect
  - Wired into SuggestionsFeed state for server-side filtering via existing API query params
* [x] **Task 17: Build date idea detail page** (done)
  - Full description of the date plan with activity steps
  - Embedded map showing venue locations
  - Links to restaurants/venues and placeholder booking links
  - Display the "Small Surprise" section (collapsible/spoiler)

## Phase 6: Save & Bookmark System
* [x] **Task 18: Implement bookmark/save functionality** (done)
  - Heart/bookmark icon on each date idea card and detail page
  - POST /api/bookmarks toggle endpoint with zod validation
  - GET /api/bookmarks returns user's bookmarked IDs
  - BookmarkButton component with optimistic UI and event propagation handling
  - Bookmark state wired into SuggestionsFeed and DateIdeaDetail
* [ ] **Task 19: Build saved dates page** (todo)
  - List of all bookmarked date ideas for the current user
  - Sort by date saved; option to remove bookmarks
  - Empty state with prompt to browse suggestions

## Phase 7: Polish, Mobile Responsiveness & UX
* [ ] **Task 20: Ensure full mobile responsiveness** (todo)
  - Test and refine all pages at mobile breakpoints
  - Touch-friendly interactions (swipe cards, tap targets)
  - Verify Google Maps embeds work well on mobile
* [ ] **Task 21: Add loading states and error handling** (todo)
  - Skeleton loaders for suggestion cards and detail pages
  - Friendly error pages (404, 500, no results found)
  - Toast notifications for bookmark actions
* [ ] **Task 22: Visual polish and branding** (todo)
  - Define color palette, typography, and component theme
  - Add subtle animations (card hover, page transitions)
  - Design and add a logo/favicon

## Phase 8: Testing & Launch Prep
* [ ] **Task 23: Write unit and integration tests** (todo)
  - Unit tests for suggestion algorithm scoring logic
  - Integration tests for API routes (auth, bookmarks, suggestions)
  - Component tests for key UI flows (onboarding, filtering)
* [ ] **Task 24: End-to-end testing** (todo)
  - E2E tests for critical paths: sign up → onboard → browse → bookmark
  - Test across Chrome, Firefox, Safari, and mobile browsers
* [ ] **Task 25: Performance and security review** (todo)
  - Audit API routes for input validation and auth checks
  - Rate-limit external API calls (Google Maps)
  - Optimize images, bundle size, and database queries
* [ ] **Task 26: Deploy to production** (todo)
  - Set up hosting (Vercel for frontend, managed PostgreSQL)
  - Configure production environment variables and secrets
  - Set up monitoring/logging (error tracking, basic analytics for success metrics)
