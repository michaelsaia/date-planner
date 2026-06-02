import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeScore } from "@/lib/scoring";
import { pickSurpriseForIdea } from "@/lib/surprises";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const idea = await prisma.dateIdea.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { order: "asc" } },
      interests: { include: { interest: true } },
    },
  });

  if (!idea) {
    return NextResponse.json({ error: "Date idea not found" }, { status: 404 });
  }

  // Load user data for scoring, interest matching, and bookmark status
  const [profile, userInterests, bookmark] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.userInterest.findMany({
      where: { userId: session.user.id },
      select: { interestId: true },
    }),
    prisma.bookmark.findUnique({
      where: { userId_dateIdeaId: { userId: session.user.id, dateIdeaId: id } },
      select: { id: true },
    }),
  ]);

  const userInterestIds = new Set(userInterests.map((ui) => ui.interestId));
  const ideaInterestIds = idea.interests.map((di) => di.interestId);
  const matchedIds = ideaInterestIds.filter((iid) => userInterestIds.has(iid));
  const matchedInterests = idea.interests
    .filter((di) => userInterestIds.has(di.interestId))
    .map((di) => di.interest.name);

  const score = computeScore({
    matchedCount: matchedIds.length,
    totalIdeaInterests: ideaInterestIds.length,
    estimatedCost: idea.estimatedCost,
    budgetMin: profile?.budgetMin ?? 0,
    budgetMax: profile?.budgetMax ?? 500,
  });

  return NextResponse.json({
    idea: {
      id: idea.id,
      title: idea.title,
      description: idea.description,
      mood: idea.mood,
      estimatedCost: idea.estimatedCost,
      surprise: pickSurpriseForIdea(idea.mood, idea.surprise),
      imageUrl: idea.imageUrl,
      activities: idea.activities.map((a) => ({
        name: a.name,
        venueName: a.venueName,
        venueUrl: a.venueUrl,
        mapsUrl: a.mapsUrl,
        order: a.order,
      })),
      score,
      matchedInterests,
      bookmarked: !!bookmark,
    },
  });
}
