"use client";

import { BUDGET_PRESETS } from "@/lib/constants";

type BudgetStepProps = {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
};

export default function BudgetStep({ min, max, onChange }: BudgetStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What&apos;s your budget?</h2>
        <p className="mt-1 text-sm text-muted">
          Set your typical per-date budget range. You can always change this later.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {BUDGET_PRESETS.map((preset) => {
            const isActive = min === preset.min && max === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.min, preset.max)}
                className={`rounded-full border px-5 py-2.5 sm:py-2 text-sm font-medium transition-colors min-h-[44px] sm:min-h-0 ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-border bg-card px-4 py-5 sm:py-4">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Min: ${min}</span>
            <span>Max: ${max}</span>
          </div>
          <div className="mt-4 space-y-5 sm:mt-3 sm:space-y-3">
            <div>
              <label htmlFor="budget-min" className="text-xs text-muted">
                Minimum ($)
              </label>
              <input
                id="budget-min"
                type="range"
                min={0}
                max={500}
                step={5}
                value={min}
                onChange={(e) => {
                  const newMin = Number(e.target.value);
                  onChange(newMin, Math.max(newMin, max));
                }}
                className="w-full accent-primary h-6 sm:h-4 touch-pan-x"
              />
            </div>
            <div>
              <label htmlFor="budget-max" className="text-xs text-muted">
                Maximum ($)
              </label>
              <input
                id="budget-max"
                type="range"
                min={0}
                max={500}
                step={5}
                value={max}
                onChange={(e) => {
                  const newMax = Number(e.target.value);
                  onChange(Math.min(min, newMax), newMax);
                }}
                className="w-full accent-primary h-6 sm:h-4 touch-pan-x"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
