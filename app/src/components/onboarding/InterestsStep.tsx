"use client";

type InterestsStepProps = {
  grouped: Record<string, { id: string; name: string }[]>;
  selected: string[];
  onToggle: (id: string) => void;
  /** When true, shows validation error if no interests selected */
  showValidation?: boolean;
  /** Minimum interests required (default 1) */
  minRequired?: number;
};

export default function InterestsStep({
  grouped,
  selected,
  onToggle,
  showValidation = false,
  minRequired = 1,
}: InterestsStepProps) {
  const categories = Object.keys(grouped);
  const needsMore = selected.length < minRequired;
  const showError = showValidation && needsMore;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What do you enjoy?</h2>
        <p className="mt-1 text-sm text-muted">
          Pick at least {minRequired} interest{minRequired !== 1 ? "s" : ""} to get personalized
          date ideas.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {grouped[category].map((interest) => {
              const isSelected = selected.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => onToggle(interest.id)}
                  className={`rounded-full border px-4 py-2.5 sm:py-2 text-sm font-medium transition-colors min-h-[44px] sm:min-h-0 ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  {interest.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {showError && (
        <p className="text-sm text-destructive" role="alert">
          Please select at least {minRequired} interest{minRequired !== 1 ? "s" : ""} to continue.
        </p>
      )}

      {!showError && selected.length > 0 && (
        <p className="text-sm text-muted">
          {selected.length} interest{selected.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
