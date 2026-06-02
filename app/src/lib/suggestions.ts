import { prisma } from "@/lib/db";
import { computeScore } from "@/lib/scoring";
import { pickSurpriseForIdea } from "@/lib/surprises";
import type { Mood } from "@/types";
import type { SurpriseCategory } from "@/lib/surprises";

export type SuggestionFilters = {
  moods?: Mood[];
  budgetMin?: number;
  budgetMax?: number;
};

export type ScoredDateIdea = {
  id: string;
  title: string;
  description: string;
  mood: string;
  estimatedCost: number;
  surprise: {
    text: string;
    category: SurpriseCategory;
    id: string;
  } | null;
  imageUrl: string | null;
  activities: {
    name: string;
    venueName: string;
    venueUrl: string | null;
    mapsUrl: string | null;
    order: number;
  }[];
  score: number;
  matchedInterests: string[];
};

/**
 * Score and rank date ideas for a given user based on:
 * - Interest overlap (primary signal)
 * - Budget fit (secondary signal)
 * - Mood filter (hard filter when specified)
 */
export async function getSuggestionsForUser(
  userId: string,
  filters: SuggestionFilters = {},
  limit = 10,
): Promise<ScoredDateIdea[]> {
  // Load user profile and interests in parallel
  const [profile, userInterests] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.userInterest.findMany({
      where: { userId },
      select: { interestId: true },
    }),
  ]);

  const userInterestIds = new Set(userInterests.map((ui) => ui.interestId));
  const budgetMin = filters.budgetMin ?? profile?.budgetMin ?? 0;
  const budgetMax = filters.budgetMax ?? profile?.budgetMax ?? 500;

  // Build where clause for date ideas
  const whereClause: Record<string, unknown> = {};

  if (filters.moods && filters.moods.length > 0) {
    whereClause.mood = { in: filters.moods };
  }

  // Fetch date ideas with their interests and activities
  const ideas = await prisma.dateIdea.findMany({
    where: whereClause,
    include: {
      activities: { orderBy: { order: "asc" } },
      interests: { include: { interest: true } },
    },
  });

  // Score each idea
  const scored: ScoredDateIdea[] = ideas.map((idea) => {
    const ideaInterestIds = idea.interests.map((di) => di.interestId);
    const matchedIds = ideaInterestIds.filter((id) => userInterestIds.has(id));
    const matchedInterests = idea.interests
      .filter((di) => userInterestIds.has(di.interestId))
      .map((di) => di.interest.name);

    const score = computeScore({
      matchedCount: matchedIds.length,
      totalIdeaInterests: ideaInterestIds.length,
      estimatedCost: idea.estimatedCost,
      budgetMin,
      budgetMax,
    });

    return {
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
    };
  });

  // Sort by score descending, then shuffle ties for variety
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

// Re-export for convenience
export { computeScore } from "@/lib/scoring";
