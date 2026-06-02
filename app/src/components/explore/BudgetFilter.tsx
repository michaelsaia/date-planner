"use client";

import { BUDGET_PRESETS } from "@/lib/constants";

type BudgetFilterProps = {
  selectedMin?: number;
  selectedMax?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
};

export default function BudgetFilter({
  selectedMin,
  selectedMax,
  onChange,
}: BudgetFilterProps) {
  function isActive(preset: { min: number; max: number }) {
    return selectedMin === preset.min && selectedMax === preset.max;
  }

  function selectPreset(preset: { min: number; max: number }) {
    if (isActive(preset)) {
      onChange(undefined, undefined);
    } else {
      onChange(preset.min, preset.max);
    }
  }

  const hasSelection = selectedMin !== undefined || selectedMax !== undefined;

  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
        Budget
      </legend>
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0" role="group" aria-label="Budget filters">
        {BUDGET_PRESETS.map((preset) => {
          const active = isActive(preset);
          return (
            <button
              key={preset.label}
              onClick={() => selectPreset(preset)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-all sm:px-3 sm:py-1.5 ${
                active
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "border-border bg-card text-foreground hover:bg-card/80"
              }`}
              aria-pressed={active}
            >
              {preset.label}
              <span className="ml-1 text-xs text-muted">
                {preset.max === 0
                  ? ""
                  : preset.max >= 500
                    ? `$${preset.min}+`
                    : `$${preset.min}–${preset.max}`}
              </span>
            </button>
          );
        })}
        {hasSelection && (
          <button
            onClick={() => onChange(undefined, undefined)}
            className="shrink-0 rounded-full border border-border px-4 py-2.5 text-sm text-muted hover:bg-card transition-colors sm:px-3 sm:py-1.5"
          >
            Clear
          </button>
        )}
      </div>
    </fieldset>
  );
}
