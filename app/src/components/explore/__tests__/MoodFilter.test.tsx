import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MoodFilter from "../MoodFilter";

describe("MoodFilter", () => {
  it("renders all five mood options as buttons", () => {
    const { container } = render(<MoodFilter selected={[]} onChange={vi.fn()} />);
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(5);
  });

  it("marks selected moods as pressed", () => {
    const { container } = render(
      <MoodFilter selected={["romantic", "foodie"]} onChange={vi.fn()} />,
    );
    const buttons = Array.from(container.querySelectorAll("button"));

    // Buttons are in order: romantic, adventurous, low-key, foodie, active
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true"); // romantic
    expect(buttons[1]).toHaveAttribute("aria-pressed", "false"); // adventurous
    expect(buttons[3]).toHaveAttribute("aria-pressed", "true"); // foodie
  });

  it("adds mood on click when not selected", () => {
    const onChange = vi.fn();
    const { container } = render(<MoodFilter selected={["romantic"]} onChange={onChange} />);
    const buttons = container.querySelectorAll("button");

    fireEvent.click(buttons[1]); // adventurous
    expect(onChange).toHaveBeenCalledWith(["romantic", "adventurous"]);
  });

  it("removes mood on click when already selected", () => {
    const onChange = vi.fn();
    const { container } = render(
      <MoodFilter selected={["romantic", "foodie"]} onChange={onChange} />,
    );
    const buttons = container.querySelectorAll("button");

    fireEvent.click(buttons[0]); // romantic
    expect(onChange).toHaveBeenCalledWith(["foodie"]);
  });

  it("has fieldset with legend", () => {
    const { container } = render(<MoodFilter selected={[]} onChange={vi.fn()} />);
    const fieldset = container.querySelector("fieldset");
    const legend = container.querySelector("legend");
    expect(fieldset).toBeInTheDocument();
    expect(legend?.textContent).toContain("Mood");
  });
});
