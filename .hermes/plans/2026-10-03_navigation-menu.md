# Plan: Navigation Implementation (#3)

- **Issue:** https://github.com/ricardoblackskye/eve-mobile/issues/3
- **Branch:** `feat/navigation-menu-3` (off `origin/main` @ `466fa98`)
- **Status:** GATE 1 — plan approval pending
- **Author:** senior-software-engineer

## 1. Goal
As a mobile user I want a **Menu present on all pages** that links back to **Home** and to the web app's **Run-overview pages**, plus an initial **`/dark-factory`** sub-page that renders the same as the web's Dark Factory default page (`ricardoblackskye/agent-eve` `/dark-factory`) **with mocked data**.

Decisions confirmed with user:
- **Navigation:** full **Expo Router** migration (per repo `AGENTS.md` mandate; routes in `src/app/`).
- **Scope:** build **Home + Dark Factory** only this issue; menu structured to add more Run-overview routes later.

## 2. Verified current state (root cause)
- The app has **no navigation**: `app/App.tsx` renders `<ChatScreen/>` directly; `app/ChatScreen.tsx` is the Eve chat UI using `useEveAgent`.
- No drawer/menu exists; there is no `src/app/` routes directory.
- `app.json` already sets `"scheme": "evemobile"` (required by Expo Router native linking).
- `package.json` scripts: `test` (jest-expo), `lint` (`tsc --noEmit && eslint .`), `e2e` (maestro).
- CI: `ci.yml` runs `lint` + `test` on PR/push; `e2e.yml` (the iOS-simulator Maestro job) runs only on `push:main` + `workflow_dispatch` (decoupled so it never blocks PRs — see PR #4).

## 3. Intended fix (vertical slices)
1. **Adopt Expo Router**
   - `npx expo install expo-router react-native-screens react-native-safe-area-context expo-linking expo-constants`.
   - Add `index.js` with `import 'expo-router/entry'`.
   - Routes live in `src/app/` (per `AGENTS.md`). If the installed Expo Router version defaults its root to `app/`, point the router app-root at `src/app` (entry/config).
2. **Global Menu (drawer) on all pages**
   - `src/app/_layout.tsx`: a React Navigation **Drawer** navigator that wraps the routes, so the Menu is available on every screen.
   - Drawer items: **Home** (`/`) and **Dark Factory** (`/dark-factory`). "Link back to Home" satisfied by the Home item + the drawer being reachable everywhere.
   - Extract a small `getMenuItems()` constant (`[{ label, href }]`) so the menu is testable and extensible (more Run-overview links added later as new routes).
3. **Home route**
   - `src/app/index.tsx` renders the existing `ChatScreen` (Eve chat). Relocate `app/ChatScreen.tsx` → `src/app/ChatScreen.tsx`; fix its `../config` import (root `config.ts` stays at repo root).
   - Delete `app/App.tsx` (replaced by Expo Router entry).
4. **Dark Factory sub-page (mocked data)**
   - `src/app/dark-factory.tsx`: renders the Dark Factory default-page UI, mirrored from the web app's `/dark-factory`, driven by **mocked data** initially.
   - `src/app/dark-factory/mockData.ts`: local mock Run-overview payload. Live-data wiring is **out of scope** for this issue (fail-open to live later).

## 4. TDD — RED → GREEN tracer bullets
- **B1 (unit):** `tests/menu.test.ts` — `getMenuItems()` returns `[Home, Dark Factory]`; RED: function missing/empty; GREEN: defined from the constant.
- **B2 (UI):** `tests/darkFactory.test.tsx` — render `DarkFactoryScreen` with mock data; assert key headings/text present (no router context needed — pure component). RED: component missing; GREEN: renders mocked data.
- **B3 (UI regression):** `tests/ChatScreen.test.tsx` — relocate existing test to new path; assert chat still renders inside the navigator context. RED→GREEN via path fix.
- After each bullet: `npm test` (jest-expo + RNTL) green; `npm run lint` (`tsc --noEmit && eslint .`) green.
- **Navigation wiring** verified by `npx expo start` dev run (drawer appears on all routes, Home ↔ Dark Factory navigate) — local/manual verification per your "provable on my laptop" rule.
- **E2E (Maestro):** optional new flow to open the drawer and navigate to Dark Factory; added to `maestro/flows` but runs only via `e2e.yml` (on-merge/manual) — not a PR gate.

## 5. Files likely to change
- `package.json` (+ deps), `package-lock.json` (generated).
- `index.js` (new — expo-router entry).
- `app.json` (router/app-root config if needed).
- `app/App.tsx` — **deleted** (replaced by Expo Router).
- `app/ChatScreen.tsx` → `src/app/ChatScreen.tsx`.
- `src/app/_layout.tsx` (new — Drawer).
- `src/app/index.tsx` (new — Home → ChatScreen).
- `src/app/dark-factory.tsx` (new).
- `src/app/dark-factory/mockData.ts` (new).
- `src/app/menu.ts` (new — `getMenuItems()`).
- `tests/menu.test.ts`, `tests/darkFactory.test.tsx`, `tests/ChatScreen.test.tsx` (relocated + updated imports).
- `jest.config.js` (testMatch unchanged; may need `src` included — already `tests/**`).

## 6. Validation (Definition of Done)
- `npm run lint` → exit 0.
- `npm test` → all suites green (menu unit, dark-factory UI, chat regression).
- `npx expo start` → drawer present on Home and Dark Factory; nav works both directions; Dark Factory shows mocked data.
- New PR against `main`; required status checks `lint` + `test` green.

## 7. ADRs (to be drafted as `docs/adr/NNNN-*.md` during implementation)
- **ADR-000X — Use Expo Router for navigation.** Aligns with repo `AGENTS.md`; routes as files in `src/app/`; drawer `_layout` gives the global Menu; extensible for future Run-overview pages.
- **ADR-000X — Dark Factory page uses mocked data first.** Live backend wiring deferred; page renders local mock payload so it is demonstrable without credentials/network.

## 8. Risks / open questions
- **Expo Router version vs Expo SDK 57 / RN 0.86:** install via `npx expo install` for SDK-matched versions; verify `expo-router/entry` + `src/app` root resolution.
- **`src/app` vs default `app/` root:** some Expo Router versions default to `app/`; may need an app-root config to honor `src/app` per `AGENTS.md`. Resolved during implementation.
- **React Navigation Drawer** is bundled with `expo-router` (it builds on `@react-navigation/native` + `drawer`); confirm the drawer navigator is available in the installed version.
- **Testing Expo Router navigators** in jest normally needs a `NavigationContainer` mock; mitigated by extracting `getMenuItems()` (pure unit) and keeping `dark-factory` a pure component (no router hooks), so RED/GREEN stay simple without heavy nav mocking.
- **Scope:** "Run overview pages" implemented as Dark Factory only this issue; menu designed to extend.
