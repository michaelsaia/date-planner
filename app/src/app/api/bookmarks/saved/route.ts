import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/bookmarks/saved — returns full date idea data for all user bookmarks,
 * ordered by most recently saved first.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      dateIdea: {
        include: {
          activities: { orderBy: { order: "asc" } },
          interests: { include: { interest: true } },
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
