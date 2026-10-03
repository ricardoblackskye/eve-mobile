# 0004 — E2E builds Release, not Debug

## Status
Accepted

## Context
The original E2E used `expo run:ios`, which launches the app as an Expo dev
client and opens the `expo-development-client://` Metro deep link. On CI this
`xcrun simctl openurl` timed out (NSPOSIXErrorDomain code 60) and hung the
pipeline. A Debug build also expects a running Metro bundler to load JS.

## Decision
Build a **Release** iOS simulator app with `xcodebuild` and install it via
`xcrun simctl`, then launch with Maestro. Release bundles the JS into the app,
so no Metro/dev-client connection is required and the app runs headless.
We also pass `CODE_SIGNING_ALLOWED=NO` because a simulator Release build needs
no cert/profile (the runner lacks signing identities; Debug signed fine but
Release otherwise fails).

## Consequences
- The app launches directly from the installed binary — deterministic, no
  Metro dependency, no dev-client deep link.
- Release compiles slower than Debug; mitigated by DerivedData caching (ADR-0003).
- Maestro flows must assert UI-only behaviour (e.g. the composer placeholder
  reappears on send) because there is no live Eve backend in CI.
