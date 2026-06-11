import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// 30 requests per minute per user
const SAVED_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 30 };

/**
 * GET /api/bookmarks/saved — returns full date idea data for all user bookmarks,
 * ordered by most recently saved first.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`bookmarks-saved:${session.user.id}`, SAVED_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      dateIdea: {
        select: {
          id: true,
          title: true,
          description: true,
          mood: true,
          estimatedCost: true,
          imageUrl: true,
          activities: {
            orderBy: { order: "asc" },
            select: { name: true, venueName: true, order: true },
          },
          interests: {
            select: { interest: { select: { name: true } } },
          },
        },
      },
    },
  });

  const saved = bookmarks.map((b) => ({
    id: b.dateIdea.id,
    title: b.dateIdea.title,
    description: b.dateIdea.description,
    mood: b.dateIdea.mood,
    estimatedCost: b.dateIdea.estimatedCost,
    imageUrl: b.dateIdea.imageUrl,
    activities: b.dateIdea.activities.map((a) => ({
      name: a.name,
      venueName: a.venueName,
      order: a.order,
    })),
    interests: b.dateIdea.interests.map((di) => di.interest.name),
    savedAt: b.createdAt.toISOString(),
  }));

  return NextResponse.json({ saved });
}
