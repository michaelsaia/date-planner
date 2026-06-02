import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import MoodBadge from "../MoodBadge";

describe("MoodBadge", () => {
  it("renders mood label and emoji for known mood", () => {
    const { container } = render(<MoodBadge mood="romantic" />);
    expect(container.textContent).toContain("Romantic");
    expect(container.textContent).toContain("💕");
  });

  it("renders all five moods correctly", () => {
    const moods = ["romantic", "adventurous", "low-key", "foodie", "active"] as const;
    const labels = ["Romantic", "Adventurous", "Low-key", "Foodie", "Active"];

    moods.forEach((mood, i) => {
      const { container } = render(<MoodBadge mood={mood} />);
      expect(container.textContent).toContain(labels[i]);
    });
  });

  it("falls back gracefully for unknown mood", () => {
    const { container } = render(<MoodBadge mood="unknown" />);
    expect(container.textContent).toContain("unknown");
  });
});
