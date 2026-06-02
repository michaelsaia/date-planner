"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DateIdeaCard, { type DateIdeaCardData } from "../explore/DateIdeaCard";
import SkeletonCard from "../skeletons/SkeletonCard";

type SavedIdea = DateIdeaCardData & { savedAt: string };

export default function SavedDatesList() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/bookmarks/saved")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load saved dates");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          const mapped: SavedIdea[] = (data.saved ?? []).map(
            (s: SavedIdea & { interests?: string[] }) => ({
              ...s,
              score: 0,
              matchedInterests: s.interests ?? [],
              bookmarked: true,
            }),
          );
          setIdeas(mapped);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBookmarkToggle = useCallback(
    (id: string, bookmarked: boolean) => {
      if (!bookmarked) {
        // Remove from list when un-bookmarked
        setIdeas((prev) => prev.filter((idea) => idea.id !== id));
      }
    },
    [],
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert">
        <div className="text-5xl">😕</div>
        <h3 className="text-lg font-semibold text-foreground">
          Couldn&apos;t load saved dates
        </h3>
        <p className="max-w-sm text-sm text-muted">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="text-5xl">💝</div>
        <h3 className="text-lg font-semibold text-foreground">
          No saved dates yet
        </h3>
        <p className="max-w-sm text-sm text-muted">
          Browse date ideas and tap the heart to save your favorites for later.
        </p>
        <Link
          href="/explore"
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Explore Ideas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted" role="status" aria-live="polite">
        {ideas.length} saved date{ideas.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {ideas.map((idea, index) => (
          <div
            key={idea.id}
            className="animate-card-in"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <DateIdeaCard
              idea={idea}
              onBookmarkToggle={handleBookmarkToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

