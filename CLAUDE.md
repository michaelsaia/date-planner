# Date Planner
**Tech Stack:** Help couples plan creative date nights based on interests, budget, and location. Suggest restaurants, activities, small surprises.

## Testing

Run tests before committing:
```bash
# If the project has a test script in package.json:
npm test

# For browser-based QA testing (gstack):
# /qa — run full QA test suite against the running app
# /qa-only — report bugs without fixing them
# /review — code review the current diff
# /ship — create PR with changelog

# For Python projects:
# pytest
```

## Dev Commands
```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

## Architecture

This project is managed by ShortestPath's autonomous builder.
- **AUTONOMOUS.md** — the builder's workflow instructions
- **TODO.md** — task list with checkbox progress tracking
- **NEEDS.md** — items blocked on user input
- **notes/** — session summaries from each build run
