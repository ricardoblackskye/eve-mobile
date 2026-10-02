// Runtime configuration for the Eve mobile client.
//
// Values come from EXPO_PUBLIC_* env vars, which Expo inlines at build time.
// Provide them in `.env.local` (gitignored) — see `.env.example` for the shape.

export const EVE_API_URL: string =
  process.env.EXPO_PUBLIC_EVE_API_URL ?? "";

export const EVE_API_KEY: string =
  process.env.EXPO_PUBLIC_EVE_API_KEY ?? "";

export type EveHeaders = Record<string, string>;

/**
 * Build the request headers sent to the Eve proxy.
 *
 * The proxy (`app/api/eve/v1`) requires `Authorization: Bearer <EVE_API_KEY>`
 * when EVE_API_KEY is configured server-side, and returns 401 otherwise.
 * In local dev (Eve dev server accepting unauthenticated `localDev()` requests)
 * you can omit the key and leave this undefined.
 */
export function buildEveHeaders(): EveHeaders | undefined {
  if (!EVE_API_KEY) return undefined;
  return { authorization: `Bearer ${EVE_API_KEY}` };
}
