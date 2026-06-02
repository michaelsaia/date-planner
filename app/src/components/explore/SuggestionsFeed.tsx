"use client";

import { useState, useEffect, useReducer, useCallback } from "react";
import { toast } from "sonner";
import DateIdeaCard, { type DateIdeaCardData } from "./DateIdeaCard";
import SkeletonCard from "../skeletons/SkeletonCard";
import FilterBar from "./FilterBar";

type SuggestionsFeedProps = {
  initialMoods?: string[];
  initialBudgetMin?: number;
  initialBudgetMax?: number;
};

type FeedState = {
  ideas: DateIdeaCardData[];
  loading: boolean;
  error: string | null;
};

type FeedAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; ideas: DateIdeaCardData[] }
  | { type: "FETCH_ERROR"; error: string };

function feedReducer(state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ideas: action.ideas, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.error };
  }
}

export default function SuggestionsFeed({
  initialMoods,
  initialBudgetMin,
  initialBudgetMax,
}: SuggestionsFeedProps) {
  const [state, dispatch] = useReducer(feedReducer, {
    ideas: [],
    loading: true,
    error: null,
  });
  const [moods, setMoods] = useState<string[]>(initialMoods ?? []);
  const [budgetMin, setBudgetMin] = useState<number | undefined>(initialBudgetMin);
  const [budgetMax, setBudgetMax] = useState<number | undefined>(initialBudgetMax);
  const [refreshKey, setRefreshKey] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Fetch user's bookmarked IDs on mount
  useEffect(() => {
    fetch("/api/bookmarks")
      .then((res) => (res.ok ? res.json() : { bookmarkedIds: [] }))
      .then((data) => setBookmarkedIds(new Set(data.bookmarkedIds)))
      .catch(() => {});
  }, []);

  const handleBookmarkToggle = useCallback((id: string, bookmarked: boolean) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (bookmarked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    dispatch({ type: "FETCH_START" });

    const params = new URLSearchParams();
    if (moods.length > 0) params.set("moods", moods.join(","));
    if (budgetMin !== undefined) params.set("budgetMin", String(budgetMin));
    if (budgetMax !== undefined) params.set("budgetMax", String(budgetMax));
    params.set("limit", "12");

    fetch(`/api/suggestions?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return res.json().catch(() => ({})).then((body: Record<string, string>) => {
          throw new Error(body.error || "Failed to load suggestions");
        });
        return res.json();
      })
      .then((data) => {
        if (!cancelled) dispatch({ type: "FETCH_SUCCESS", ideas: data.suggestions ?? [] });
      })
      .catch((err) => {
        if (!cancelled && err instanceof Error && err.name !== "AbortError") {
          dispatch({ type: "FETCH_ERROR", error: err.message });
          toast.error("Failed to load suggestions");
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [moods, budgetMin, budgetMax, refreshKey]);

  const { ideas, loading, error } = state;

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <FilterBar
        moods={moods}
        onMoodsChange={setMoods}
        budgetMin={budgetMin}
        budgetMax={budgetMax}
        onBudgetChange={(min, max) => {
          setBudgetMin(min);
          setBudgetMax(max);
        }}
        onClearAll={() => {
          setMoods([]);
          setBudgetMin(undefined);
          setBudgetMax(undefined);
        }}
      />

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted" role="status" aria-live="polite">
          {loading
            ? "Finding ideas..."
            : `${ideas.length} date idea${ideas.length !== 1 ? "s" : ""} found`}
        </p>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          disabled={loading}
          aria-label="Refresh suggestions"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card disabled:opacity-50"
        >
          <RefreshIcon className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert">
          <div className="text-5xl">😕</div>
          <h3 className="text-lg font-semibold text-foreground">
            Couldn&apos;t load suggestions
          </h3>
          <p className="max-w-sm text-sm text-muted">{error}</p>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Ideas grid */}
      {!loading && ideas.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {ideas.map((idea, index) => (
            <div
              key={idea.id}
              className="animate-card-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <DateIdeaCard
                idea={{ ...idea, bookmarked: bookmarkedIds.has(idea.id) }}
                onBookmarkToggle={handleBookmarkToggle}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && ideas.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="text-5xl">🌙</div>
          <h3 className="text-lg font-semibold text-foreground">No ideas found</h3>
          <p className="max-w-sm text-sm text-muted">
            Try adjusting your filters or updating your profile interests to discover more date
            ideas.
          </p>
          <button
            onClick={() => {
              setMoods([]);
              setBudgetMin(undefined);
              setBudgetMax(undefined);
            }}
            className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

function RefreshIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}
