import { buildEveHeaders } from "../config";

describe("buildEveHeaders", () => {
  const ORIGINAL = process.env.EXPO_PUBLIC_EVE_API_KEY;

  afterEach(() => {
    process.env.EXPO_PUBLIC_EVE_API_KEY = ORIGINAL;
  });

  it("returns undefined when no API key is set", () => {
    delete process.env.EXPO_PUBLIC_EVE_API_KEY;
    expect(buildEveHeaders()).toBeUndefined();
  });

  it("returns a bearer header when the API key is set", () => {
    process.env.EXPO_PUBLIC_EVE_API_KEY = "test-key-123";
    expect(buildEveHeaders()).toEqual({ authorization: "Bearer test-key-123" });
  });
});
