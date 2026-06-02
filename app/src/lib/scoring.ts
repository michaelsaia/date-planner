/**
 * Pure scoring logic for date idea relevance.
 * No database dependencies — safe for unit testing and reuse.
 */

/**
 * Compute a 0-100 relevance score for a date idea.
 *
 * Weights:
 * - Interest overlap: 70% (ratio of matched interests to total idea interests)
 * - Budget fit: 30% (how well the cost fits within user budget range)
 */
export function computeScore(params: {
  matchedCount: number;
  totalIdeaInterests: number;
  estimatedCost: number;
  budgetMin: number;
  budgetMax: number;
}): number {
  const { matchedCount, totalIdeaInterests, estimatedCost, budgetMin, budgetMax } = params;

  // Interest score: ratio of matched interests (0–1)
  const interestScore =
    totalIdeaInterests > 0 ? matchedCount / totalIdeaInterests : 0;

  // Budget score: 1.0 if within range, decay outside
  let budgetScore: number;
  if (estimatedCost >= budgetMin && estimatedCost <= budgetMax) {
    budgetScore = 1.0;
  } else {
    const range = budgetMax - budgetMin || 1;
    const distance =
      estimatedCost < budgetMin
        ? budgetMin - estimatedCost
        : estimatedCost - budgetMax;
    budgetScore = Math.max(0, 1 - distance / range);
  }

  const INTEREST_WEIGHT = 0.7;
  const BUDGET_WEIGHT = 0.3;

  return Math.round(
    (interestScore * INTEREST_WEIGHT + budgetScore * BUDGET_WEIGHT) * 100,
  );
}
