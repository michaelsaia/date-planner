// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import path from "path";
import { mkdtempSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient, type Client } from "@libsql/client";

describe("database schema", () => {
  let prisma: PrismaClient;
  let libsql: Client;
  let tmpDir: string;

  beforeAll(async () => {
    // Use a temp file-based SQLite so both raw client and Prisma share the same db
    tmpDir = mkdtempSync(path.join(tmpdir(), "dp-test-"));
    const dbPath = path.join(tmpDir, "test.db");
    const dbUrl = `file:${dbPath}`;

    // Create raw client to apply migrations
    libsql = createClient({ url: dbUrl });

    const migrationDir = path.resolve(process.cwd(), "prisma/migrations");
    const sql = readFileSync(
      path.join(migrationDir, "20260523200229_init/migration.sql"),
      "utf8",
    );
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const stmt of statements) {
      await libsql.execute(stmt);
    }

    // Connect Prisma to the same db file
    const adapter = new PrismaLibSql({ url: dbUrl });
    prisma = new PrismaClient({ adapter });
  });

  afterAll(() => {
    try {
      rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // cleanup is best-effort
    }
  });

  it("creates a user with profile", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        passwordHash: "hashed",
        profile: {
          create: {
            homeLat: 40.7128,
            homeLng: -74.006,
            homeLabel: "New York, NY",
            budgetMin: 25,
            budgetMax: 100,
          },
        },
      },
      include: { profile: true },
    });

    expect(user.email).toBe("test@example.com");
    expect(user.profile).not.toBeNull();
    expect(user.profile!.homeLat).toBe(40.7128);
    expect(user.profile!.budgetMin).toBe(25);
  });

  it("creates interests and links to user", async () => {
    const interest = await prisma.interest.create({
      data: { name: "Hiking", category: "Outdoor" },
    });

    const user = await prisma.user.findFirst();
    await prisma.userInterest.create({
      data: { userId: user!.id, interestId: interest.id },
    });

    const userWithInterests = await prisma.user.findFirst({
      include: { interests: { include: { interest: true } } },
    });

    expect(userWithInterests!.interests).toHaveLength(1);
    expect(userWithInterests!.interests[0].interest.name).toBe("Hiking");
  });

  it("creates a date idea with activities and bookmark", async () => {
    const idea = await prisma.dateIdea.create({
      data: {
        title: "Italian Evening",
        description: "A cozy Italian dinner followed by a walk",
        mood: "romantic",
        estimatedCost: 80,
        surprise: "Bring a handwritten note",
        activities: {
          create: [
            {
              name: "Dinner",
              venueName: "Pasta Place",
              venueUrl: "https://example.com",
              order: 1,
            },
            {
              name: "Walk",
              venueName: "Central Park",
              mapsUrl: "https://maps.example.com",
              order: 2,
            },
          ],
        },
      },
      include: { activities: true },
    });

    expect(idea.title).toBe("Italian Evening");
    expect(idea.activities).toHaveLength(2);
    expect(idea.activities[0].order).toBe(1);

    // Bookmark it
    const user = await prisma.user.findFirst();
    const bookmark = await prisma.bookmark.create({
      data: { userId: user!.id, dateIdeaId: idea.id },
    });
    expect(bookmark.userId).toBe(user!.id);
  });

  it("enforces unique bookmark constraint", async () => {
    const user = await prisma.user.findFirst();
    const idea = await prisma.dateIdea.findFirst();

    await expect(
      prisma.bookmark.create({
        data: { userId: user!.id, dateIdeaId: idea!.id },
      }),
    ).rejects.toThrow();
  });
});
