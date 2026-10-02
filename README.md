# eve-mobile

Expo / React Native mobile client for the **Eve** agent
([ricardoblackskye/agent-eve](https://github.com/ricardoblackskye/agent-eve)).

It reuses the same `eve/react` `useEveAgent` hook the web app uses
(`app/chat.tsx`), pointed at the deployment's proxy (`/api/eve/v1`).

## How it connects

| Piece | Detail |
| --- | --- |
| Client | `useEveAgent` from `eve/react` (NDJSON over `fetch` + `ReadableStream`) |
| Host | `EXPO_PUBLIC_EVE_API_URL` — the proxy base, e.g. `https://<deploy>/api` |
| Route | hook appends `/eve/v1` → `https://<deploy>/api/eve/v1/session` + `/stream` |
| Auth | `Authorization: Bearer <EXPO_PUBLIC_EVE_API_KEY>` when the proxy enforces it |

React Native's `fetch` does **not** enforce CORS, so the app talks to the
deployed proxy cross-origin with no CORS configuration needed. (CORS would only
matter for a web/Capacitor build.)

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in your values
npx expo start
```

Run on a device/simulator via the Expo dev menu (`npm run android` / `npm run ios`),
or build/sign/submit with EAS:

```bash
npx eas-cli@latest build --profile preview
```

## Auth note

The scaffold supports a static `EVE_API_KEY` bearer for quick local testing.
For production, replace this with a per-user session token (the web app already
implements Google OAuth → session). The `evemobile` deep-link scheme is reserved
in `app.json` for that OAuth redirect.

## Project layout

- `App.tsx` — chat screen (single-screen app, no router needed yet)
- `config.ts` — env-based config (`EXPO_PUBLIC_EVE_API_URL`, `EXPO_PUBLIC_EVE_API_KEY`)
