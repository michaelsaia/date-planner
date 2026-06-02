# Changelog

## v0.1.0.1 — 2026-06-02

### Dark Mode & Polish
- Fixed Logo component hardcoded `fill="white"` to use CSS variable for dark mode support
- Added `dark:` variants to MoodBadge, MoodFilter, and BookmarkButton components
- Added range input track styling using CSS variables for dark mode
- Replaced dead `surprise-collapse` animation with `prefers-reduced-motion` media query (WCAG 2.1 AA)
- Fixed BookmarkButton timer memory leak with `useEffect` cleanup

### Bug Fixes
- Added error handling to profile POST API route — invalid interest IDs no longer cause empty 500 responses
