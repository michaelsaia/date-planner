import { describe, it, expect } from "vitest";
import { computeScore } from "./scoring";

describe("computeScore", () => {
  it("returns 100 when all interests match and cost is within budget", () => {
    const score = computeScore({
      matchedCount: 3,
      totalIdeaInterests: 3,
      estimatedCost: 50,
      budgetMin: 25,
      budgetMax: 75,
    });
    expect(score).toBe(100);
  });

  it("returns 0 when no interests match and cost is way out of budget", () => {
    const score = computeScore({
      matchedCount: 0,
      totalIdeaInterests: 3,
      estimatedCost: 500,
      budgetMin: 25,
      budgetMax: 75,
    });
    expect(score).toBe(0);
  });

  it("gives 70 for perfect interest match but out-of-budget cost", () => {
    // All interests match (70 pts), cost is way over budget (0 pts)
    const score = computeScore({
      matchedCount: 2,
      totalIdeaInterests: 2,
      estimatedCost: 1000,
      budgetMin: 0,
      budgetMax: 50,
    });
    expect(score).toBe(70);
  });

  it("gives 30 for no interest match but perfect budget fit", () => {
    const score = computeScore({
      matchedCount: 0,
      totalIdeaInterests: 2,
      estimatedCost: 50,
      budgetMin: 25,
      budgetMax: 75,
    });
    expect(score).toBe(30);
  });

  it("handles partial interest overlap", () => {
    // 1 of 2 interests matched = 0.5 * 70 = 35 interest pts
    // Cost in budget = 30 budget pts
    const score = computeScore({
      matchedCount: 1,
      totalIdeaInterests: 2,
      estimatedCost: 50,
      budgetMin: 25,
      budgetMax: 75,
    });
    expect(score).toBe(65);
  });

  it("decays budget score proportionally outside range", () => {
    // Cost is 100, budget max is 75, range is 50
    // Distance = 25, decay = 1 - 25/50 = 0.5
    // Budget score = 0.5 * 30 = 15
    // Interest: 2/2 = 70
    const score = computeScore({
      matchedCount: 2,
      totalIdeaInterests: 2,
      estimatedCost: 100,
      budgetMin: 25,
      budgetMax: 75,
    });
    expect(score).toBe(85);
  });

  it("handles zero total interests gracefully", () => {
    const score = computeScore({
      matchedCount: 0,
      totalIdeaInterests: 0,
      estimatedCost: 50,
      budgetMin: 25,
      budgetMax: 75,
    });
    // 0 interest score, full budget score = 30
    expect(score).toBe(30);
  });

  it("handles cost below budget minimum", () => {
    // Cost is 10, min is 50, range is 50
    // Distance = 40, decay = 1 - 40/50 = 0.2
    const score = computeScore({
      matchedCount: 1,
      totalIdeaInterests: 1,
      estimatedCost: 10,
      budgetMin: 50,
      budgetMax: 100,
    });
    // Interest: 70, budget: 0.2 * 30 = 6
    expect(score).toBe(76);
  });
});
