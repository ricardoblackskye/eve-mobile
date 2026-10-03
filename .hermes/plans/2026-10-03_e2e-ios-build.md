# Plan: Fix post-merge E2E — make the iOS build fast & reliable (#9)

- **Issue:** https://github.com/ricardoblackskye/eve-mobile/issues/9
- **Branch:** `fix/e2e-ios-build-9` (off `origin/main`)
- **Status:** GATE 1 — plan approval pending
- **Author:** senior-software-engineer

## 1. Goal
Keep E2E running on `push: main` (your post-merge verification) but make it **fast and reliably green** by (a) caching CocoaPods + DerivedData, and (b) hardening the build/install/Maestro steps so the run no longer fails or hangs without a live backend.

## 2. Verified current state (root cause)
- `e2e.yml` builds a **Release** iOS simulator app via `expo prebuild` + `xcodebuild -derivedDataPath ios/build`, installs via `xcrun simctl`, and launches via Maestro. The earlier `expo run:ios` hang is already gone (PR #4).
- Via API I confirmed the two prior e2e runs on `main` (heads `466fa98`, `acc8ec4`) **FAILED**, and the latest run on `7461813` was cancelled by you during the slow Release build.
- Once the build finishes, the most likely failure points are:
  - **Release signing** — Debug signed fine; a Release simulator build may want a cert/profile the runner lacks.
  - **Product-path mismatch** for `simctl install`.
  - **`send_message` Maestro flow** asserts the "Hello Eve" bubble, which only appears with a live Eve backend (the optimistic message may not render without the API) → fails in CI.
  - **Slow cold Release build (15–40 min)** plus the macOS runner queue.

## 3. Intended fix
1. **Caching (speed):** add `actions/cache` steps to `e2e.yml`:
   - CocoaPods cache (Pods / `~/.cocoapods`), keyed on a hash of `package.json` + the Expo/iOS dependency set.
   - DerivedData cache (`ios/build`), keyed on the same hash, so `xcodebuild` reuses compiled artifacts → repeat runs drop to minutes.
2. **Build hardening (reliability):**
   - Add `CODE_SIGNING_ALLOWED=NO` to the `xcodebuild` invocation (simulator builds need no signing; avoids missing-cert failures).
   - Keep `-derivedDataPath ios/build`; install path `ios/build/Build/Products/Release-iphonesimulator/evemobile.app`.
   - Robust simulator selection: extract the first available iPhone UDID with `grep -oE '[0-9A-Fa-f-]{36}'`.
3. **Maestro hardening (backend-independent):**
   - `maestro/flows/send_message.yaml`: after tapping send, assert the composer **placeholder reappears** (`Type your message…`) — proves the input cleared (pure UI state) — instead of asserting the "Hello Eve" bubble (which needs a backend). `launch.yaml` already asserts the always-present "Eve Agent" header.
4. Triggers unchanged: keep `push: main` + `workflow_dispatch` (manual).

## 4. TDD / verification
This is CI-config + Maestro flows (no unit-testable app code), so RED→GREEN is demonstrated by the E2E workflow itself:
- **RED (current):** e2e runs on `main` fail / are very slow.
- **GREEN (after):** trigger `e2e.yml` via `workflow_dispatch` (or next `push: main`) → completes **green and faster** (cache warm after the first run).
- What we can verify locally here (no iOS toolchain): `npm run lint` + `npm test` stay green (no app-source change); `npx expo export` still compiles `src/app` routes (unchanged). The Maestro YAML edits are validated by the e2e run.

## 5. Files likely to change
- `.github/workflows/e2e.yml` — caching steps; `CODE_SIGNING_ALLOWED=NO`; robust sim UDID extraction.
- `maestro/flows/send_message.yaml` — UI-only assertion (placeholder reappears).
- **No app source changes** (`src/app` untouched).

## 6. Validation (Definition of Done)
- `e2e.yml` runs on `workflow_dispatch` (and `push: main`) and **passes**.
- Build time reduced via cache (second run much faster than first).
- `send_message` flow passes with **no Eve backend configured**.

## 7. ADRs (to draft as `docs/adr/NNNN-*.md` during implementation)
- **ADR-0003 — Cache CocoaPods + DerivedData in E2E.** Cold RN iOS Release build is the dominant cost (15–40 min); caching artifacts cuts repeat runs to minutes. Keyed on dependency hash to avoid stale artifacts; first run stays cold (cache miss) and is safely reset on dependency changes.
- **ADR-0004 — E2E builds Release, not Debug.** Release bundles JS so the app needs no Metro/dev-client connection and runs headless under Maestro; Debug would hang waiting on Metro (the original `expo run:ios` failure). `CODE_SIGNING_ALLOWED=NO` keeps simulator signing out of the way.

## 8. Risks / open questions
- DerivedData cache across commits: keyed on dependency hash; an RN/Expo upgrade changes the key and safely resets the cache.
- macOS runner queue still applies, but caching shrinks the in-run build window.
- If `CODE_SIGNING_ALLOWED=NO` is insufficient for a Release simulator build, fall back to `CODE_SIGN_IDENTITY=""` / self-signed — verified in the e2e run.
