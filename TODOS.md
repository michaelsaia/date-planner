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
* [x] **Task 19: Build saved dates page** (done)
  - GET /api/bookmarks/saved endpoint returning full date idea data with activities and interests
  - SavedDatesList client component with loading skeletons, error state, and empty state CTA
  - Reuses DateIdeaCard from explore page for consistent UI
  - Optimistic removal when un-bookmarking (card disappears immediately)
  - Sorted by most recently saved first

## Phase 7: Polish, Mobile Responsiveness & UX

### Task 20: Mobile-First Responsive Layout Overhaul
* [ ] **20a: Navigation & layout shell** (todo)
  - Add a sticky mobile bottom navigation bar (Explore, Saved, Profile) visible below `md` breakpoint
  - Convert existing desktop nav to a top header bar hidden on mobile (or hamburger menu)
  - Ensure root layout uses proper viewport meta and `safe-area-inset` padding for notched devices
* [ ] **20b: Explore page mobile refinements** (todo)
  - Switch suggestion grid to single-column stack on `< sm` breakpoints
  - Increase tap target size on MoodFilter toggle buttons and BudgetFilter presets to ≥ 44px
  - Make FilterBar horizontally scrollable on narrow screens instead of wrapping
  - Ensure DateIdeaCard content doesn't overflow on small screens (truncate long titles/descriptions)
* [ ] **20c: Date idea detail page mobile layout** (todo)
  - Stack activity timeline vertically with full-width cards on mobile
  - Make SurpriseReveal spoiler button large and thumb-friendly
  - Ensure any embedded map iframe is responsive (`w-full aspect-video`) and doesn't break scroll
  - Add a sticky bottom CTA bar with bookmark action on mobile detail view
* [ ] **20d: Onboarding flow mobile UX** (todo)
  - Ensure InterestsStep pill/chip buttons wrap cleanly and have adequate spacing on small screens
  - Make BudgetStep slider/presets thumb-friendly with larger hit areas
  - Test LocationStep geolocation prompt and input field on mobile browsers (Safari, Chrome)
  - Verify progress bar is visible and doesn't crowd the header on short viewports
* [ ] **20e: Auth & profile pages mobile polish** (todo)
  - Center AuthForm card vertically on mobile with proper padding
  - Ensure profile editing form inputs are full-width on mobile with adequate font size (≥ 16px to prevent iOS zoom)
  - Add `inputmode` attributes to numeric fields (budget) for correct mobile keyboard

### Task 21: Loading States, Error Handling & Feedback
* [ ] **21a: Install and configure toast notification system** (todo)
  - Add `sonner` (lightweight toast library) as a dependency
  - Add `<Toaster />` to root layout
  - Wire toast notifications for: bookmark added/removed, profile saved, suggestion refresh, errors
* [ ] **21b: Skeleton loaders for all data-fetching views** (todo)
  - Review existing skeleton in SuggestionsFeed; ensure it matches final card dimensions
  - Add skeleton loader for DateIdeaDetail page (activity timeline, surprise section)
  - Add skeleton loader for SavedDatesList
  - Add skeleton for profile page data pre-population
* [ ] **21c: Error and empty state pages** (todo)
  - Create a custom `not-found.tsx` (404) page with illustration and "Go to Explore" CTA
  - Create a custom `error.tsx` (500) boundary with retry button
  - Improve empty state on SavedDatesList (friendly copy + CTA to explore)
  - Improve empty state on SuggestionsFeed when no ideas match filters (suggest clearing filters)
* [ ] **21d: Form validation feedback** (todo)
  - Add inline field-level error messages on AuthForm (email format, password length)
  - Add inline validation to onboarding steps (e.g., "Select at least 3 interests")
  - Show loading/disabled state on submit buttons during API calls to prevent double-submits

### Task 22: Visual Polish, Animations & Branding
* [ ] **22a: Logo, favicon & meta tags** (todo)
  - Design a simple logo mark (heart + calendar motif) and wordmark
  - Generate favicon set (favicon.ico, apple-touch-icon, og-image)
  - Add Open Graph and Twitter meta tags to root layout for link previews
  - Set `<title>` and `<meta description>` on each page route
* [ ] **22b: Typography & spacing consistency pass** (todo)
  - Audit heading hierarchy across all pages (consistent h1/h2/h3 sizing)
  - Standardize card padding, gap, and margin spacing using Tailwind spacing scale
  - Ensure consistent font weights and text color usage (foreground vs muted)
* [ ] **22c: Micro-interactions & animations** (todo)
  - Add CSS transition on DateIdeaCard hover (subtle lift/shadow, scale)
  - Animate BookmarkButton heart icon on toggle (fill animation or pulse)
  - Add fade-in transition when suggestion cards load (staggered with `animation-delay`)
  - Smooth expand/collapse on SurpriseReveal spoiler
  - Add subtle page transition or content fade on route changes
* [ ] **22d: Dark mode verification & refinement** (todo)
  - Test every page in dark mode; fix any hardcoded colors that don't respect CSS variables
  - Ensure MoodBadge color variants have adequate contrast in dark mode
  - Verify skeleton loader shimmer effect works in both light and dark themes
  - Check FilterBar selected/unselected states are clearly distinguishable in dark mode
* [ ] **22e: Accessibility (a11y) audit** (todo)
  - Run axe or Lighthouse accessibility audit on all pages
  - Ensure all interactive elements have visible focus rings (`:focus-visible` outlines)
  - Add `aria-label` to icon-only buttons (BookmarkButton, nav icons)
  - Verify color contrast ratios meet WCAG AA (especially muted text on card backgrounds)
  - Add `role` and `aria-live` attributes to toast notifications and dynamic content regions
  - Ensure onboarding and filter controls are fully keyboard-navigable

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
