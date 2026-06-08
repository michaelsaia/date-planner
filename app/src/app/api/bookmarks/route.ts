import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

// 60 bookmark toggles per minute per user
const BOOKMARK_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 60 };

const toggleSchema = z.object({
  dateIdeaId: z.string().min(1, "dateIdeaId is required"),
});

/**
 * GET /api/bookmarks — list all bookmark IDs for the current user
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    select: { dateIdeaId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    bookmarkedIds: bookmarks.map((b) => b.dateIdeaId),
  });
}

/**
 * POST /api/bookmarks — toggle bookmark for a date idea
 * Returns { bookmarked: true/false } indicating new state
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`bookmarks:${session.user.id}`, BOOKMARK_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { dateIdeaId } = parsed.data;

  // Verify the date idea exists
  const idea = await prisma.dateIdea.findUnique({
    where: { id: dateIdeaId },
    select: { id: true },
  });
  if (!idea) {
    return NextResponse.json({ error: "Date idea not found" }, { status: 404 });
  }

  // Check if already bookmarked
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_dateIdeaId: {
        userId: session.user.id,
        dateIdeaId,
      },
    },
  });

  if (existing) {
    // Remove bookmark
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  } else {
    // Add bookmark
    await prisma.bookmark.create({
      data: { userId: session.user.id, dateIdeaId },
    });
    return NextResponse.json({ bookmarked: true }, { status: 201 });
  }
}
