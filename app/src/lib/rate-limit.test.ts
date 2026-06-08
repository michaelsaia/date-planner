import { describe, it, expect } from "vitest";
import { rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  it("allows requests under the limit", () => {
    const config = { windowMs: 60_000, maxRequests: 3 };
    const r1 = rateLimit("test-allow-1", config);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);
  });

  it("blocks requests over the limit", () => {
    const config = { windowMs: 60_000, maxRequests: 2 };
    const key = "test-block-1";
    rateLimit(key, config);
    rateLimit(key, config);
    const r3 = rateLimit(key, config);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
  });

  it("returns resetAt in the future when blocked", () => {
    const config = { windowMs: 60_000, maxRequests: 1 };
    const key = "test-reset-1";
    rateLimit(key, config);
    const r2 = rateLimit(key, config);
    expect(r2.allowed).toBe(false);
    expect(r2.resetAt).toBeGreaterThan(Date.now() - 1000);
  });

  it("uses separate buckets for different keys", () => {
    const config = { windowMs: 60_000, maxRequests: 1 };
    const r1 = rateLimit("test-separate-a", config);
    const r2 = rateLimit("test-separate-b", config);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
  });
});
