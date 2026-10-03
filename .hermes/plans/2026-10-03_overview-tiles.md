# Plan: Overview page — extend tiles & charts (#8)

- **Issue:** https://github.com/ricardoblackskye/eve-mobile/issues/8
- **Branch:** `feat/overview-tiles-8` (off `origin/main`)
- **Status:** GATE 1 (awaiting approval)
- **Assumption:** "Overview page" == the existing Dark Factory page (`src/app/dark-factory.tsx`), which currently only lists two mock runs. We extend it to match the described Dark Factory screen. *(If you intended a separate Overview/Home page instead, say so and I'll adjust.)*

## Intent
Add to the Dark Factory overview, all with **mocked values**:
- Heading **'Factory Status'** + subheading **'Persisted outcomes · current run load · recent activity'**
- Four status tiles: **Active, Blocked, Completed, Failed**
- **Outcome Mix**: a pie chart of the 4 status percentages
- **Recent Executions**: a list of runs; tapping one navigates to a **detail page**
- **Resource Snapshot**: Mean latency, recorded cost, Unmeasured
- **Outcome Trend**: a line chart

## Approach
- **Mock data** (`dark-factory/mockData.ts`): add status counts, outcome mix, richer recent-execution rows, resource snapshot, and a trend series; extend types.
- **Pure helpers** (`dark-factory/overview.ts`): `getStatusCounts()`, `computeOutcomeMix()` (percentages summing to 100), `getTrendPoints()` (scales series → SVG coords). These are unit-testable.
- **Charts via `react-native-svg`** (added with `npx expo install react-native-svg` — Expo-managed, npm-ci safe): small `PieChart.tsx` and `LineChart.tsx` components. No charting library → avoids the peer-dep churn fixed in #9.
- **Overview screen** (`dark-factory.tsx`): heading/subheading, 4 status tiles, `PieChart`, Recent Executions list (rows are `Link`s to `/dark-factory/[id]`), Resource Snapshot, `LineChart`. Each region gets a `testID`.
- **Detail route** (`dark-factory/[id].tsx`): renders mocked run detail looked up by id (generic mock when unknown).
- Menu unchanged (Dark Factory is already a menu item).

## TDD (RED → GREEN)
- **RED:** tests that fail because tiles/charts/detail don't exist yet.
- **GREEN:** implement; tests pass.
- **Tests:**
  - `tests/overview.test.ts` — `computeOutcomeMix` sums to 100 & matches counts; `getTrendPoints` scales within bounds; mock data has all required fields.
  - `tests/darkFactory.test.tsx` (extend existing) — renders 4 status tiles (`status-tile-Active` …), `outcome-mix-pie`, `outcome-trend-line`, recent-execution rows are pressable links, resource-snapshot values present.
  - `tests/darkFactoryDetail.test.tsx` — `[id]` page renders mocked detail for a known id.

## Files
- **create:** `src/app/dark-factory/overview.ts`, `PieChart.tsx`, `LineChart.tsx`, `src/app/dark-factory/[id].tsx`, `tests/overview.test.ts`, `tests/darkFactoryDetail.test.tsx`
- **modify:** `src/app/dark-factory.tsx`, `src/app/dark-factory/mockData.ts`, `tests/darkFactory.test.tsx`
- **add dep:** `react-native-svg` (via `npx expo install`)

## Validation
- `npm run lint` + `npm test` green; `npx expo export` compiles the new `/dark-factory/[id]` route.
- Optional later: a Maestro flow that taps a recent execution → detail (no backend needed).

## ADR (draft 0005)
Custom SVG charts via `react-native-svg` instead of a charting library → zero extra peer deps (keeps `npm ci` clean after the #9 fixes), full control, small bundle.

## Risks
- `react-native-svg` must be Expo-compatible (`npx expo install` selects the right version). If it triggers a peer conflict, fall back to pure-`View` charts (horizontal bars) — still conveys outcome mix / trend.
- Nested dynamic route `dark-factory/[id].tsx` under `dark-factory.tsx` is a supported Expo Router pattern.
