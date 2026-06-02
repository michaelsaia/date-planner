// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock auth
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));

// Mock prisma
const mockTx = {
  profile: { upsert: vi.fn() },
  userInterest: { deleteMany: vi.fn(), createMany: vi.fn() },
};
const mockPrisma = {
  profile: { findUnique: vi.fn() },
  userInterest: { findMany: vi.fn() },
  $transaction: vi.fn((fn: (tx: typeof mockTx) => Promise<void>) => fn(mockTx)),
};
vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

const { GET, POST } = await import("../profile/route");

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("GET /api/profile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns profile and interests for authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.profile.findUnique.mockResolvedValue({
      budgetMin: 10,
      budgetMax: 100,
      homeLat: 40.7,
      homeLng: -74.0,
      homeLabel: "NYC",
    });
    mockPrisma.userInterest.findMany.mockResolvedValue([
      { interestId: "int-1" },
      { interestId: "int-2" },
    ]);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.profile.budgetMin).toBe(10);
    expect(data.interests).toEqual(["int-1", "int-2"]);
  });

  it("returns null profile for user without one", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.profile.findUnique.mockResolvedValue(null);
    mockPrisma.userInterest.findMany.mockResolvedValue([]);

    const res = await GET();
    const data = await res.json();

    expect(data.profile).toBeNull();
    expect(data.interests).toEqual([]);
  });
});

describe("POST /api/profile", () => {
  beforeEach(() => vi.clearAllMocks());

  const validProfile = {
    interests: ["int-1", "int-2"],
    budgetRange: { min: 10, max: 100 },
    homeLocation: { lat: 40.7, lng: -74.0, label: "NYC" },
  };

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(jsonRequest(validProfile));
    expect(res.status).toBe(401);
  });

  it("saves profile with valid data", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await POST(jsonRequest(validProfile));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockTx.profile.upsert).toHaveBeenCalledOnce();
    expect(mockTx.userInterest.deleteMany).toHaveBeenCalledOnce();
    expect(mockTx.userInterest.createMany).toHaveBeenCalledOnce();
  });

  it("accepts null location", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await POST(jsonRequest({ ...validProfile, homeLocation: null }));
    expect(res.status).toBe(200);
  });

  it("returns 400 for empty interests", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await POST(jsonRequest({ ...validProfile, interests: [] }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid budget range (max < min)", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await POST(
      jsonRequest({
        ...validProfile,
        budgetRange: { min: 200, max: 50 },
      }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 500 when database transaction fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.$transaction.mockRejectedValueOnce(new Error("DB error"));

    const res = await POST(jsonRequest(validProfile));
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.error).toContain("Failed to save profile");
  });
});
