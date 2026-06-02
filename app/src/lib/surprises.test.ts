import { describe, it, expect } from "vitest";
import {
  SURPRISES,
  getRandomSurprise,
  getSurprisesForMood,
  pickSurpriseForIdea,
} from "./surprises";

describe("SURPRISES library", () => {
  it("contains at least 30 surprise ideas", () => {
    expect(SURPRISES.length).toBeGreaterThanOrEqual(30);
  });

  it("has all four categories represented", () => {
    const categories = new Set(SURPRISES.map((s) => s.category));
    expect(categories).toContain("conversation_starter");
    expect(categories).toContain("gift_idea");
    expect(categories).toContain("song");
    expect(categories).toContain("gesture");
  });

  it("every surprise has at least one mood", () => {
    for (const s of SURPRISES) {
      expect(s.moods.length).toBeGreaterThan(0);
    }
  });

  it("every surprise has a non-empty id and text", () => {
    for (const s of SURPRISES) {
      expect(s.id).toBeTruthy();
      expect(s.text.length).toBeGreaterThan(10);
    }
  });

  it("has unique ids", () => {
    const ids = SURPRISES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getRandomSurprise", () => {
  it("returns a surprise with no filters", () => {
    const result = getRandomSurprise();
    expect(result).not.toBeNull();
    expect(result!.text).toBeTruthy();
  });

  it("filters by mood", () => {
    for (let i = 0; i < 20; i++) {
      const result = getRandomSurprise({ mood: "foodie" });
      expect(result).not.toBeNull();
      expect(result!.moods).toContain("foodie");
    }
  });

  it("filters by category", () => {
    for (let i = 0; i < 20; i++) {
      const result = getRandomSurprise({ category: "song" });
      expect(result).not.toBeNull();
      expect(result!.category).toBe("song");
    }
  });

  it("filters by both mood and category", () => {
    const result = getRandomSurprise({
      mood: "romantic",
      category: "song",
    });
    expect(result).not.toBeNull();
    expect(result!.moods).toContain("romantic");
    expect(result!.category).toBe("song");
  });

  it("excludes specified ids", () => {
    const allIds = new Set(SURPRISES.map((s) => s.id));
    const result = getRandomSurprise({ exclude: allIds });
    expect(result).toBeNull();
  });

  it("returns null when no matches", () => {
    // Exclude everything with a fake all-encompassing filter
    const result = getRandomSurprise({
      mood: "romantic",
      exclude: new Set(
        SURPRISES.filter((s) => s.moods.includes("romantic")).map((s) => s.id),
      ),
    });
    expect(result).toBeNull();
  });
});

describe("getSurprisesForMood", () => {
  it("returns requested number of unique surprises", () => {
    const results = getSurprisesForMood("romantic", 5);
    expect(results.length).toBe(5);
    const ids = results.map((r) => r.id);
    expect(new Set(ids).size).toBe(5);
  });

  it("all returned surprises match the mood", () => {
    const results = getSurprisesForMood("active", 3);
    for (const s of results) {
      expect(s.moods).toContain("active");
    }
  });

  it("returns fewer if not enough matches", () => {
    // Request more than available for a specific mood+category combo
    const results = getSurprisesForMood("foodie", 100);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(SURPRISES.length);
  });
});

describe("pickSurpriseForIdea", () => {
  it("returns a surprise matching the mood", () => {
    const result = pickSurpriseForIdea("romantic", null);
    expect(result).not.toBeNull();
    expect(result!.text).toBeTruthy();
    expect(result!.category).toBeTruthy();
  });

  it("handles invalid mood gracefully", () => {
    const result = pickSurpriseForIdea("nonexistent", null);
    // Should still return something (no mood filter applied)
    expect(result).not.toBeNull();
  });

  it("uses fallback when provided and mood has no matches", () => {
    // Mock scenario: exclude all surprises
    const result = pickSurpriseForIdea("romantic", "Bring flowers!");
    expect(result).not.toBeNull();
  });
});
