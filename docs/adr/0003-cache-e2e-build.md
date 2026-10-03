# 0003 — Cache CocoaPods + DerivedData in E2E

## Status
Accepted

## Context
The post-merge E2E workflow builds a full React Native / Expo iOS app with
`xcodebuild -configuration Release`. A cold build on the CI macOS runner takes
15–40 minutes (CocoaPods install + native compile + Hermes). This made every
merge to `main` trigger a multi-hour, often-failing pipeline.

## Decision
Cache two directories across runs in `e2e.yml` via `actions/cache`, keyed on
`package.json` + `package-lock.json`:
- `~/.cocoapods` — CocoaPods specs cache (speeds `pod install` inside prebuild).
- `ios/build` — the Xcode DerivedData (set via `-derivedDataPath ios/build`), so
  compiled native artifacts are reused and only changed inputs recompile.

## Consequences
- First run after a dependency change is still cold (cache miss) but subsequent
  runs drop to minutes.
- Cache is invalidated automatically when `package.json`/`package-lock.json`
  change (the native dependency set), avoiding stale artifacts.
- Uses more GitHub Actions cache storage; acceptable trade-off for speed.
