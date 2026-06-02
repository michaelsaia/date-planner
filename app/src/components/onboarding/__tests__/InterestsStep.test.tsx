import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import InterestsStep from "../InterestsStep";

const grouped = {
  Outdoor: [
    { id: "hiking", name: "Hiking" },
    { id: "beach", name: "Beach" },
  ],
  Food: [
    { id: "dining", name: "Fine Dining" },
    { id: "cooking", name: "Cooking" },
  ],
};

describe("InterestsStep", () => {
  it("renders categories and interests", () => {
    const { container } = render(
      <InterestsStep grouped={grouped} selected={[]} onToggle={vi.fn()} />,
    );

    expect(container.textContent).toContain("Outdoor");
    expect(container.textContent).toContain("Food");
    expect(container.textContent).toContain("Hiking");
    expect(container.textContent).toContain("Fine Dining");
  });

  it("highlights selected interests with primary style", () => {
    const { container } = render(
      <InterestsStep grouped={grouped} selected={["hiking"]} onToggle={vi.fn()} />,
    );

    const buttons = Array.from(container.querySelectorAll("button"));
    const hikingBtn = buttons.find((b) => b.textContent === "Hiking")!;
    const beachBtn = buttons.find((b) => b.textContent === "Beach")!;

    expect(hikingBtn.className).toContain("border-primary");
    expect(beachBtn.className).toContain("border-border");
  });

  it("calls onToggle when interest clicked", () => {
    const onToggle = vi.fn();
    const { container } = render(
      <InterestsStep grouped={grouped} selected={[]} onToggle={onToggle} />,
    );

    const buttons = Array.from(container.querySelectorAll("button"));
    const hikingBtn = buttons.find((b) => b.textContent === "Hiking")!;
    fireEvent.click(hikingBtn);
    expect(onToggle).toHaveBeenCalledWith("hiking");
  });

  it("shows selection count when interests selected", () => {
    const { container } = render(
      <InterestsStep grouped={grouped} selected={["hiking", "dining"]} onToggle={vi.fn()} />,
    );
    expect(container.textContent).toContain("2 interests selected");
  });

  it("shows validation error when showValidation is true and none selected", () => {
    const { container } = render(
      <InterestsStep grouped={grouped} selected={[]} onToggle={vi.fn()} showValidation={true} />,
    );
    const alert = container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert!.textContent).toContain("Please select at least 1 interest");
  });

  it("does not show validation error when interests are selected", () => {
    const { container } = render(
      <InterestsStep
        grouped={grouped}
        selected={["hiking"]}
        onToggle={vi.fn()}
        showValidation={true}
      />,
    );
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeNull();
  });

  it("supports custom minRequired", () => {
    const { container } = render(
      <InterestsStep
        grouped={grouped}
        selected={["hiking"]}
        onToggle={vi.fn()}
        showValidation={true}
        minRequired={3}
      />,
    );
    const alert = container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert!.textContent).toContain("Please select at least 3 interests");
  });
});
