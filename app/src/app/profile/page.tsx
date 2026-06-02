"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InterestsStep from "@/components/onboarding/InterestsStep";
import BudgetStep from "@/components/onboarding/BudgetStep";
import LocationStep from "@/components/onboarding/LocationStep";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [grouped, setGrouped] = useState<Record<string, { id: string; name: string }[]>>({});
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState(25);
  const [budgetMax, setBudgetMax] = useState(75);
  const [location, setLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/interests").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
    ])
      .then(([interestsData, profileData]) => {
        setGrouped(interestsData);
        if (profileData.interests) {
          setSelectedInterests(profileData.interests);
        }
        if (profileData.profile) {
          setBudgetMin(profileData.profile.budgetMin ?? 25);
          setBudgetMax(profileData.profile.budgetMax ?? 75);
          if (profileData.profile.homeLat != null && profileData.profile.homeLng != null) {
            setLocation({
              lat: profileData.profile.homeLat,
              lng: profileData.profile.homeLng,
              label: profileData.profile.homeLabel ?? "",
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function toggleInterest(id: string) {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  async function handleSave() {
    if (selectedInterests.length === 0) {
      toast.error("Select at least one interest");
      return;
    }

    setSaving(true);

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

      toast.success("Profile updated!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col px-4 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-lg space-y-8 sm:space-y-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Your Profile</h1>
          <p className="mt-1 text-sm text-muted">
            Update your preferences to get better date suggestions.
          </p>
        </div>

        <InterestsStep
          grouped={grouped}
          selected={selectedInterests}
          onToggle={toggleInterest}
          showValidation={selectedInterests.length === 0}
        />

        <BudgetStep
          min={budgetMin}
          max={budgetMax}
          onChange={(min, max) => {
            setBudgetMin(min);
            setBudgetMax(max);
          }}
        />

        <LocationStep location={location} onChange={setLocation} />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || selectedInterests.length === 0}
            className="rounded-full bg-primary px-8 py-3 sm:py-2.5 min-h-[44px] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/explore")}
            className="rounded-full border border-border px-6 py-3 sm:py-2.5 min-h-[44px] text-sm font-medium text-foreground transition-colors hover:bg-card"
          >
            Back to Explore
          </button>
        </div>
      </div>
    </div>
  );
}
