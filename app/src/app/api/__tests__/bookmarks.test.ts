// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock auth
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));

// Mock prisma
const mockPrisma = {
  bookmark: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  dateIdea: {
    findUnique: vi.fn(),
  },
};
vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

const { GET, POST } = await import("../bookmarks/route");

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("GET /api/bookmarks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns bookmarked IDs for authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.bookmark.findMany.mockResolvedValue([
      { dateIdeaId: "idea-1", createdAt: new Date() },
      { dateIdeaId: "idea-2", createdAt: new Date() },
    ]);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.bookmarkedIds).toEqual(["idea-1", "idea-2"]);
  });

  it("returns empty array when no bookmarks", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.bookmark.findMany.mockResolvedValue([]);

    const res = await GET();
    const data = await res.json();
    expect(data.bookmarkedIds).toEqual([]);
  });
});

describe("POST /api/bookmarks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(jsonRequest({ dateIdeaId: "idea-1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid body", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const res = await POST(jsonRequest({ dateIdeaId: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 404 when date idea does not exist", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.dateIdea.findUnique.mockResolvedValue(null);

    const res = await POST(jsonRequest({ dateIdeaId: "nonexistent" }));
    expect(res.status).toBe(404);
  });

  it("adds a bookmark when not already bookmarked", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.dateIdea.findUnique.mockResolvedValue({ id: "idea-1" });
    mockPrisma.bookmark.findUnique.mockResolvedValue(null);
    mockPrisma.bookmark.create.mockResolvedValue({ id: "bm-1" });

    const res = await POST(jsonRequest({ dateIdeaId: "idea-1" }));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.bookmarked).toBe(true);
    expect(mockPrisma.bookmark.create).toHaveBeenCalledOnce();
  });

  it("removes a bookmark when already bookmarked", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.dateIdea.findUnique.mockResolvedValue({ id: "idea-1" });
    mockPrisma.bookmark.findUnique.mockResolvedValue({ id: "bm-1" });
    mockPrisma.bookmark.delete.mockResolvedValue({});

    const res = await POST(jsonRequest({ dateIdeaId: "idea-1" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.bookmarked).toBe(false);
    expect(mockPrisma.bookmark.delete).toHaveBeenCalledOnce();
  });

  it("returns 400 for invalid JSON body", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const req = new Request("http://localhost/api/bookmarks", {
      method: "POST",
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
