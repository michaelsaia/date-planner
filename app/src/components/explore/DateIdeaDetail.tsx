"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MoodBadge from "./MoodBadge";
import BookmarkButton from "./BookmarkButton";
import ActivityTimeline from "./ActivityTimeline";
import SurpriseReveal from "./SurpriseReveal";

type Activity = {
  name: string;
  venueName: string;
  venueUrl: string | null;
  mapsUrl: string | null;
  order: number;
};

type SurpriseData = {
  text: string;
  category: string;
  id: string;
};

type IdeaDetail = {
  id: string;
  title: string;
  description: string;
  mood: string;
  estimatedCost: number;
  imageUrl: string | null;
  activities: Activity[];
  surprise: SurpriseData | null;
  score: number;
  matchedInterests: string[];
  bookmarked: boolean;
};

function formatCost(cost: number): string {
  if (cost === 0) return "Free";
  return `$${cost}`;
}

const moodEmoji: Record<string, string> = {
  romantic: "💕",
  adventurous: "🏔️",
  "low-key": "🛋️",
  foodie: "🍽️",
  active: "🏃",
};

export default function DateIdeaDetail({ id }: { id: string }) {
  const router = useRouter();
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surprise, setSurprise] = useState<SurpriseData | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/suggestions/${id}`)
      .then((res) => {
        if (res.status === 404) throw new Error("not_found");
        if (!res.ok) throw new Error("Failed to load date idea");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setIdea(data.idea);
          setSurprise(data.idea.surprise);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleRefreshSurprise = () => {
    if (!idea) return;
    const excludeParam = surprise ? `&exclude=${surprise.id}` : "";
    fetch(`/api/surprises?mood=${idea.mood}&count=1${excludeParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.surprises?.length > 0) {
          const s = data.surprises[0];
          setSurprise({ text: s.text, category: s.category, id: s.id });
        }
      })
      .catch(() => {
        // silently fail — keep existing surprise
      });
  };

  if (loading) return <DetailSkeleton />;

  if (error === "not_found") {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-bold text-foreground">
          Date idea not found
        </h2>
        <p className="text-sm text-muted">
          This idea may have been removed or doesn&apos;t exist.
        </p>
        <button
          onClick={() => router.push("/explore")}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="rounded-lg border border-destructive-border bg-destructive-light p-4 text-sm text-destructive" role="alert">
        {error ?? "Something went wrong"}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 sm:space-y-8">
        {/* Back link */}
        <button
          onClick={() => router.push("/explore")}
          aria-label="Back to Explore"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ChevronLeftIcon />
          Back to Explore
        </button>

        {/* Hero section */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex h-40 items-center justify-center text-5xl opacity-50 sm:h-56 sm:text-6xl">
            {moodEmoji[idea.mood] ?? "💫"}
          </div>
          {/* Desktop bookmark — hidden on mobile where sticky bar is used */}
          <div className="absolute right-3 top-3 flex items-center gap-2 sm:right-4 sm:top-4">
            <span className="hidden sm:inline-flex">
              <BookmarkButton
                dateIdeaId={idea.id}
                initialBookmarked={idea.bookmarked}
                size="md"
              />
            </span>
            <MoodBadge mood={idea.mood} />
          </div>
        </div>

        {/* Title and meta */}
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {idea.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-3 sm:gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-card border border-border px-3 py-1 text-sm font-semibold text-foreground">
              {formatCost(idea.estimatedCost)}
            </span>
            {idea.matchedInterests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {idea.matchedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            About this date
          </h2>
          <p className="mt-2 leading-relaxed text-muted">
            {idea.description}
          </p>
        </div>

        {/* Activity timeline */}
        {idea.activities.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground sm:mb-4">
              The Plan ({idea.activities.length} step
              {idea.activities.length !== 1 ? "s" : ""})
            </h2>
            <ActivityTimeline activities={idea.activities} />
          </div>
        )}

        {/* Surprise section */}
        {surprise && (
          <SurpriseReveal surprise={surprise} onRefresh={handleRefreshSurprise} />
        )}
      </div>

      {/* Sticky bottom bookmark bar — mobile only */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3 sm:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {idea.title}
            </p>
            <p className="text-xs text-muted">{formatCost(idea.estimatedCost)}</p>
          </div>
          <BookmarkButton
            dateIdeaId={idea.id}
            initialBookmarked={idea.bookmarked}
            size="md"
          />
        </div>
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-4 w-24 rounded bg-border/50" />
      <div className="h-48 rounded-2xl bg-border/30 sm:h-56" />
      <div className="space-y-3">
        <div className="h-8 w-3/4 rounded bg-border/50" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-border/40" />
          <div className="h-6 w-20 rounded-full bg-border/30" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-5 w-40 rounded bg-border/50" />
        <div className="h-4 w-full rounded bg-border/30" />
        <div className="h-4 w-5/6 rounded bg-border/30" />
      </div>
      <div className="space-y-4">
        <div className="h-5 w-32 rounded bg-border/50" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-border/40" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-2/3 rounded bg-border/40" />
              <div className="h-3 w-1/3 rounded bg-border/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
