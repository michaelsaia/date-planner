"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InterestsStep from "@/components/onboarding/InterestsStep";
import BudgetStep from "@/components/onboarding/BudgetStep";
import LocationStep from "@/components/onboarding/LocationStep";

const STEPS = ["interests", "budget", "location"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("interests");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [attemptedAdvance, setAttemptedAdvance] = useState(false);

  // Form state
  const [grouped, setGrouped] = useState<Record<string, { id: string; name: string }[]>>({});
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState(25);
  const [budgetMax, setBudgetMax] = useState(75);
  const [location, setLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);

  useEffect(() => {
    fetch("/api/interests")
      .then((res) => res.json())
      .then((data) => {
        setGrouped(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stepIndex = STEPS.indexOf(step);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  function canAdvance() {
    if (step === "interests") return selectedInterests.length > 0;
    return true;
  }

  function handleNext() {
    if (!canAdvance()) {
      setAttemptedAdvance(true);
      return;
    }
    setAttemptedAdvance(false);
    if (isLast) {
      handleSubmit();
    } else {
      setStep(STEPS[stepIndex + 1]);
    }
  }

  function handleBack() {
    if (!isFirst) {
      setStep(STEPS[stepIndex - 1]);
    }
  }

  function toggleInterest(id: string) {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: selectedInterests,
          budgetRange: { min: budgetMin, max: budgetMax },
          homeLocation: location,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      router.push("/explore");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col px-4 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-6 sm:mb-8 flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= stepIndex ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        {step === "interests" && (
          <InterestsStep
            grouped={grouped}
            selected={selectedInterests}
            onToggle={toggleInterest}
            showValidation={attemptedAdvance}
          />
        )}
        {step === "budget" && (
          <BudgetStep
            min={budgetMin}
            max={budgetMax}
            onChange={(min, max) => {
              setBudgetMin(min);
              setBudgetMax(max);
            }}
          />
        )}
        {step === "location" && (
          <LocationStep location={location} onChange={setLocation} />
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-destructive-border bg-destructive-light px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 sm:mt-8 flex justify-between pb-4 sm:pb-0">
          <button
            type="button"
            onClick={handleBack}
            disabled={isFirst}
            className="rounded-full border border-border px-6 py-3 sm:py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card disabled:invisible min-h-[44px] sm:min-h-0"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="rounded-full bg-primary px-6 py-3 sm:py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 min-h-[44px] sm:min-h-0"
          >
            {saving ? "Saving..." : isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
