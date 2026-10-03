# 0005 — Custom SVG charts instead of a charting library

## Status
Accepted

## Context
Issue #8 extends the Dark Factory overview with two charts: an Outcome Mix pie
and an Outcome Trend line. The obvious path is a React Native charting library
(`react-native-chart-kit`, `victory-native`, …). We chose to render both with
`react-native-svg` primitives instead.

## Decision
Implement `PieChart` and `LineChart` as small components using
`react-native-svg` (`Path`/`Circle`/`Polyline`), and keep the geometry math in
pure helpers (`computeOutcomeMix`, `getTrendPoints` in `overview.ts`). No charting
dependency is added; `react-native-svg` is the only new package (added via
`npx expo install` so the version matches Expo/RN).

## Consequences
- **No extra peer surface.** This repo's `npm ci` was already brittle (issue #9):
  React `19.2.3` + react-native `0.86.3` + Expo `57` made chart libs' peer ranges
  a real risk. Even with `legacy-peer-deps=true` in `.npmrc`, every dependency is
  incremental risk and bundle weight for a mobile app. Two simple mocked charts
  don't justify it (YAGNI — no tooltips, multi-series, zoom, or live updates).
- **Full control + easy tests.** Each region carries a `testID` for the RNTL
  tests, and the math is unit-tested directly.
- **Trade-off:** a library would be less code for richer visuals. If charts grow
  complex later (interactivity, many series), revisit this and adopt a library,
  verifying `npm ci` still passes.
