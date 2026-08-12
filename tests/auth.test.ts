import test, { afterEach, describe } from "node:test";
import assert from "node:assert/strict";
import {
  createSessionToken,
  getAuthConfig,
  readBearerToken,
  safeRedirectPath,
  verifyApiToken,
  verifyPassword,
  verifySessionToken,
} from "../src/lib/auth";

const ORIGINAL_ENV = { ...process.env };

function setEnv(values: Record<string, string | undefined>) {
  for (const key of ["MEISHI_PASSWORD", "MEISHI_SESSION_SECRET", "MEISHI_API_TOKEN", "MEISHI_SESSION_DAYS", "NODE_ENV"]) {
    delete process.env[key];
  }
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) process.env[key] = value;
  }
}

afterEach(() => {
  setEnv({});
  Object.assign(process.env, ORIGINAL_ENV);
});

function enabledConfig(overrides: Record<string, string> = {}) {
  setEnv({ MEISHI_PASSWORD: "correct-horse", ...overrides });
  const config = getAuthConfig();
  assert.equal(config.mode, "enabled");
  return config;
}

describe("auth configuration", () => {
  test("is disabled outside production when no password is set", () => {
    setEnv({ NODE_ENV: "development" });
    assert.equal(getAuthConfig().mode, "disabled");
  });

  test("refuses to run in production without a password", () => {
    setEnv({ NODE_ENV: "production" });
    const config = getAuthConfig();
    assert.equal(config.mode, "misconfigured");
    assert.match(config.mode === "misconfigured" ? config.reason : "", /MEISHI_PASSWORD/);
  });

  test("rejects a password shorter than 8 characters, in any environment", () => {
    setEnv({ MEISHI_PASSWORD: "short", NODE_ENV: "development" });
    assert.equal(getAuthConfig().mode, "misconfigured");
    setEnv({ MEISHI_PASSWORD: "short", NODE_ENV: "production" });
    assert.equal(getAuthConfig().mode, "misconfigured");
  });

  test("picks up a changed password instead of serving a cached config", () => {
    enabledConfig();
    setEnv({ MEISHI_PASSWORD: "a-different-password" });
    const config = getAuthConfig();
    assert.equal(verifyPassword("a-different-password", config), true);
    assert.equal(verifyPassword("correct-horse", config), false);
  });
});

describe("password check", () => {
  test("accepts only the exact password", () => {
    const config = enabledConfig();
    assert.equal(verifyPassword("correct-horse", config), true);
    assert.equal(verifyPassword("correct-hors", config), false);
    assert.equal(verifyPassword("correct-horse ", config), false);
    assert.equal(verifyPassword("", config), false);
  });

  test("never authenticates while auth is disabled", () => {
    setEnv({ NODE_ENV: "development" });
    assert.equal(verifyPassword("anything", getAuthConfig()), false);
  });
});

describe("session tokens", () => {
  test("round-trip a freshly issued token", () => {
    const config = enabledConfig();
    assert.equal(verifySessionToken(createSessionToken(config), config), true);
  });

  test("reject an expired token", () => {
    const config = enabledConfig({ MEISHI_PASSWORD: "correct-horse", MEISHI_SESSION_DAYS: "1" });
    const token = createSessionToken(config, 0);
    const twoDaysLater = 2 * 24 * 60 * 60 * 1000;
    assert.equal(verifySessionToken(token, config, twoDaysLater), false);
  });

  test("reject a tampered expiry", () => {
    const config = enabledConfig();
    const token = createSessionToken(config);
    const [, signature] = token.split(".");
    const forged = `${Date.now() + 10_000_000}.${signature}`;
    assert.equal(verifySessionToken(forged, config), false);
  });

  test("reject a tampered signature", () => {
    const config = enabledConfig();
    const [payload] = createSessionToken(config).split(".");
    assert.equal(verifySessionToken(`${payload}.deadbeef`, config), false);
  });

  test("reject malformed and empty tokens", () => {
    const config = enabledConfig();
    for (const token of [undefined, "", "nodot", ".", ".sig"]) {
      assert.equal(verifySessionToken(token, config), false, `accepted ${JSON.stringify(token)}`);
    }
  });

  test("a token stops working once the password changes", () => {
    const first = enabledConfig();
    const token = createSessionToken(first);
    setEnv({ MEISHI_PASSWORD: "a-different-password" });
    assert.equal(verifySessionToken(token, getAuthConfig()), false);
  });

  test("an explicit session secret keeps sessions alive across a password change", () => {
    const first = enabledConfig({ MEISHI_SESSION_SECRET: "stable-secret" });
    const token = createSessionToken(first);
    setEnv({ MEISHI_PASSWORD: "a-different-password", MEISHI_SESSION_SECRET: "stable-secret" });
    assert.equal(verifySessionToken(token, getAuthConfig()), true);
  });
});

describe("API token", () => {
  test("is refused unless explicitly configured", () => {
    const config = enabledConfig();
    assert.equal(verifyApiToken("", config), false);
    assert.equal(verifyApiToken("anything", config), false);
  });

  test("accepts only the configured token", () => {
    const config = enabledConfig({ MEISHI_PASSWORD: "correct-horse", MEISHI_API_TOKEN: "tok_abc" });
    assert.equal(verifyApiToken("tok_abc", config), true);
    assert.equal(verifyApiToken("tok_abd", config), false);
  });
});

describe("readBearerToken", () => {
  test("extracts the token regardless of header casing", () => {
    assert.equal(readBearerToken("Bearer abc"), "abc");
    assert.equal(readBearerToken("bearer  abc  "), "abc");
  });

  test("ignores other schemes and missing headers", () => {
    assert.equal(readBearerToken("Basic abc"), "");
    assert.equal(readBearerToken(null), "");
    assert.equal(readBearerToken(""), "");
  });
});

describe("safeRedirectPath", () => {
  test("keeps same-origin paths", () => {
    assert.equal(safeRedirectPath("/cards/1"), "/cards/1");
    assert.equal(safeRedirectPath("/?q=%E5%B1%B1%E7%94%B0"), "/?q=%E5%B1%B1%E7%94%B0");
  });

  test("refuses anything that could leave the site", () => {
    for (const value of ["//evil.example", "https://evil.example", "/\\evil.example", "evil", "", null, undefined]) {
      assert.equal(safeRedirectPath(value), "/", `allowed ${JSON.stringify(value)}`);
    }
  });
});
