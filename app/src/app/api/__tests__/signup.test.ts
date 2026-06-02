// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
  },
}));

// Mock prisma
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};
vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));

// Import after mocks
const { POST } = await import("../auth/signup/route");

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new user with valid data", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: "user-1",
      email: "new@example.com",
    });

    const res = await POST(jsonRequest({ email: "new@example.com", password: "password123" }));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.id).toBe("user-1");
    expect(data.email).toBe("new@example.com");
    expect(mockPrisma.user.create).toHaveBeenCalledOnce();
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(jsonRequest({ email: "not-an-email", password: "password123" }));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBeTruthy();
  });

  it("returns 400 for short password", async () => {
    const res = await POST(jsonRequest({ email: "test@example.com", password: "short" }));
    expect(res.status).toBe(400);
  });

  it("returns 409 when email already exists", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "existing", email: "taken@example.com" });

    const res = await POST(jsonRequest({ email: "taken@example.com", password: "password123" }));
    expect(res.status).toBe(409);

    const data = await res.json();
    expect(data.error).toContain("already exists");
  });

  it("returns 400 for missing fields", async () => {
    const res = await POST(jsonRequest({}));
    expect(res.status).toBe(400);
  });
});
