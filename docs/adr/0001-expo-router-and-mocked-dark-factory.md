# ADR 0001 — Use Expo Router for navigation

- **Status:** Accepted
- **Date:** 2026-10-03
- **Context:** The mobile app had no navigation (a single `ChatScreen`). Issue #3 requires a
  global Menu present on every page plus sub-pages. The repo `AGENTS.md` mandates Expo Router
  (routes in `src/app/`).
- **Decision:** Adopt Expo Router. Routes live in `src/app/`; the root layout
  (`src/app/_layout.tsx`) is a `Drawer` navigator so the Menu (drawer) is present on every
  page. Child route files (`index.tsx` = Home, `dark-factory.tsx`) become drawer items
  automatically; their `options.title` sets the label.
- **Consequences:**
  - `+` Extensible for future Run-overview pages — add a route file under `src/app/` and an
    item in `getMenuItems()` (`src/app/menu.ts`).
  - `+` Aligns with the repo's documented convention.
  - `-` Slightly heavier native build (react-navigation drawer is vendored by expo-router).

## ADR 0002 — Dark Factory page renders mocked data first

- **Status:** Accepted
- **Date:** 2026-10-03
- **Context:** Issue #3 asks the `/dark-factory` sub-page to mirror the web app's Dark Factory
  default page, **with mocked data initially**.
- **Decision:** The page renders a local mock payload (`src/app/dark-factory/mockData.ts`).
  Live backend wiring is deferred (fail-open to live later).
- **Consequences:**
  - `+` The page is demonstrable without credentials/network in CI or on a device.
  - `+` Clear seam (`mockData.ts`) to swap in live data.
  - `-` When live data is added, the mock and live UIs must be kept in sync.
