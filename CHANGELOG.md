# Changelog

## [0.1.0.3] - 2026-06-02

### Added
- 52 new unit/integration/component tests (94 total) covering API routes, filters, and onboarding
- Integration tests for signup, profile, bookmarks, and suggestions API routes
- Component tests for MoodFilter, BudgetFilter, MoodBadge, and InterestsStep

### Fixed
- Signup endpoint (`POST /api/auth/signup`) no longer returns 500 on malformed JSON input
- Profile endpoint (`POST /api/profile`) no longer returns 500 on malformed JSON input

### Changed
- Moved test dependencies to regular dependencies for container environment compatibility
- Test script now sets `NODE_ENV=test` for React 19 compatibility

## [0.1.0.2] - 2026-06-02

### Fixed
- Screen readers now announce form errors and error pages via `role="alert"` on AuthForm and error boundary
- Filter sections (Mood, Budget) no longer overflow on narrow viewports due to fieldset `min-width` default

## [0.1.0.1] - 2026-06-02

### Added
- Global keyboard focus indicators (`focus-visible` outlines) for WCAG 2.1 AA compliance
- `aria-label` attributes on icon-only buttons (BookmarkButton, RefreshButton, back navigation)
- `aria-live` regions for dynamic content updates (suggestions count, surprise reveal, saved dates)
- `aria-current="page"` on desktop navigation active links
- Semantic `fieldset`/`legend` grouping on mood and budget filter controls
- `aria-hidden="true"` on decorative SVG icons throughout the app

### Fixed
- Dark mode support for Logo component, MoodBadge, MoodFilter, and BookmarkButton
- Range input track styling uses CSS variables for dark mode
- BookmarkButton timer memory leak with `useEffect` cleanup
- Profile POST API error handling for invalid interest IDs
