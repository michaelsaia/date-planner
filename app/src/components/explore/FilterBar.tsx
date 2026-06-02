"use client";

import MoodFilter from "./MoodFilter";
import BudgetFilter from "./BudgetFilter";

type FilterBarProps = {
  moods: string[];
  onMoodsChange: (moods: string[]) => void;
  budgetMin?: number;
  budgetMax?: number;
  onBudgetChange: (min: number | undefined, max: number | undefined) => void;
  onClearAll: () => void;
};

export default function FilterBar({
  moods,
  onMoodsChange,
  budgetMin,
  budgetMax,
  onBudgetChange,
  onClearAll,
}: FilterBarProps) {
  const hasFilters = moods.length > 0 || budgetMin !== undefined || budgetMax !== undefined;

  return (
    <div className="rounded-xl border border-border bg-card p-3 space-y-3 sm:p-4 sm:space-y-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Filters</span>
        {hasFilters && (
          <button
            onClick={onClearAll}
            aria-label="Clear all filters"
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <MoodFilter selected={moods} onChange={onMoodsChange} />
      <BudgetFilter
        selectedMin={budgetMin}
        selectedMax={budgetMax}
        onChange={onBudgetChange}
      />
    </div>
  );
}
