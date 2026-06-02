import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import BudgetFilter from "../BudgetFilter";

function getButtons(container: HTMLElement) {
  return Array.from(container.querySelectorAll("button"));
}

describe("BudgetFilter", () => {
  it("renders all budget presets", () => {
    const { container } = render(<BudgetFilter onChange={vi.fn()} />);
    expect(getButtons(container)).toHaveLength(5);
  });

  it("selects a budget preset on click", () => {
    const onChange = vi.fn();
    const { container } = render(<BudgetFilter onChange={onChange} />);
    const buttons = getButtons(container);

    fireEvent.click(buttons[2]); // $$ preset (index 2)
    expect(onChange).toHaveBeenCalledWith(25, 75);
  });

  it("deselects when clicking the active preset", () => {
    const onChange = vi.fn();
    const { container } = render(
      <BudgetFilter selectedMin={25} selectedMax={75} onChange={onChange} />,
    );
    const buttons = getButtons(container);

    fireEvent.click(buttons[2]); // $$ preset
    expect(onChange).toHaveBeenCalledWith(undefined, undefined);
  });

  it("marks active preset as pressed", () => {
    const { container } = render(
      <BudgetFilter selectedMin={25} selectedMax={75} onChange={vi.fn()} />,
    );
    const buttons = getButtons(container);

    expect(buttons[2]).toHaveAttribute("aria-pressed", "true"); // $$
    expect(buttons[1]).toHaveAttribute("aria-pressed", "false"); // $
  });

  it("shows clear button when a selection is active", () => {
    const { container } = render(
      <BudgetFilter selectedMin={25} selectedMax={75} onChange={vi.fn()} />,
    );
    // 5 presets + 1 clear
    expect(getButtons(container)).toHaveLength(6);
  });

  it("hides clear button when no selection", () => {
    const { container } = render(<BudgetFilter onChange={vi.fn()} />);
    expect(getButtons(container)).toHaveLength(5);
  });

  it("clear button resets selection", () => {
    const onChange = vi.fn();
    const { container } = render(
      <BudgetFilter selectedMin={25} selectedMax={75} onChange={onChange} />,
    );
    const buttons = getButtons(container);

    fireEvent.click(buttons[5]); // Clear button (last)
    expect(onChange).toHaveBeenCalledWith(undefined, undefined);
  });
});
