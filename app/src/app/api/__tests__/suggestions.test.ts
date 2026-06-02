// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock auth
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));

// Mock suggestions service
const mockGetSuggestions = vi.fn();
vi.mock("@/lib/suggestions", () => ({
  getSuggestionsForUser: (...args: unknown[]) => mockGetSuggestions(...args),
}));

const { GET } = await import("../suggestions/route");

function getRequest(params: Record<string, string> = {}) {
  const url = new URL("http://localhost/api/suggestions");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new Request(url.toString());
}

describe("GET /api/suggestions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET(getRequest());
    expect(res.status).toBe(401);
  });

  it("returns suggestions for authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockGetSuggestions.mockResolvedValue([
      { id: "idea-1", title: "Test Date", score: 85 },
    ]);

    const res = await GET(getRequest());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.suggestions).toHaveLength(1);
    expect(data.suggestions[0].title).toBe("Test Date");
  });

  it("passes mood filters to suggestion service", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockGetSuggestions.mockResolvedValue([]);

    await GET(getRequest({ moods: "romantic,adventurous" }));

    expect(mockGetSuggestions).toHaveBeenCalledWith(
      "user-1",
      { moods: ["romantic", "adventurous"] },
      10,
    );
  });

  it("passes budget filters to suggestion service", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockGetSuggestions.mockResolvedValue([]);

    await GET(getRequest({ budgetMin: "10", budgetMax: "100" }));

    expect(mockGetSuggestions).toHaveBeenCalledWith(
      "user-1",
      { budgetMin: 10, budgetMax: 100 },
      10,
    );
  });

  it("respects limit parameter capped at 50", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockGetSuggestions.mockResolvedValue([]);

    await GET(getRequest({ limit: "100" }));

    expect(mockGetSuggestions).toHaveBeenCalledWith("user-1", {}, 50);
  });

  it("enforces minimum limit of 1", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockGetSuggestions.mockResolvedValue([]);

    await GET(getRequest({ limit: "0" }));

    expect(mockGetSuggestions).toHaveBeenCalledWith("user-1", {}, 1);
  });

  it("returns 400 for invalid mood value", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await GET(getRequest({ moods: "invalid_mood" }));
    expect(res.status).toBe(400);
  });
});
