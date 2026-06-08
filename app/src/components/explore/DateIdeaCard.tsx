"use client";

import Image from "next/image";
import Link from "next/link";
import MoodBadge from "./MoodBadge";
import BookmarkButton from "./BookmarkButton";

export type DateIdeaCardData = {
  id: string;
  title: string;
  description: string;
  mood: string;
  estimatedCost: number;
  imageUrl: string | null;
  activities: {
    name: string;
    venueName: string;
    order: number;
  }[];
  score: number;
  matchedInterests: string[];
  bookmarked?: boolean;
};

function formatCost(cost: number): string {
  if (cost === 0) return "Free";
  return `$${cost}`;
}

export default function DateIdeaCard({
  idea,
  onBookmarkToggle,
}: {
  idea: DateIdeaCardData;
  onBookmarkToggle?: (id: string, bookmarked: boolean) => void;
}) {
  return (
    <Link
      href={`/explore/${idea.id}`}
      aria-label={`View date idea: ${idea.title}`}
      className="group flex flex-col rounded-xl border border-border bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image placeholder */}
      <div className="relative h-40 overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/10 to-primary/5">
        {idea.imageUrl ? (
          <Image
            src={idea.imageUrl}
            alt={idea.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl opacity-50">
            {idea.mood === "romantic"
              ? "💕"
              : idea.mood === "adventurous"
                ? "🏔️"
                : idea.mood === "low-key"
                  ? "🛋️"
                  : idea.mood === "foodie"
                    ? "🍽️"
                    : "🏃"}
          </div>
        )}
        <div className="absolute right-2 top-2 flex items-center gap-1.5">
          <BookmarkButton
            dateIdeaId={idea.id}
            initialBookmarked={idea.bookmarked ?? false}
            size="sm"
            onToggle={(b) => onBookmarkToggle?.(idea.id, b)}
          />
          <MoodBadge mood={idea.mood} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {idea.title}
        </h3>

        <p className="mt-1 sm:mt-1.5 text-sm text-muted line-clamp-2 leading-relaxed">
          {idea.description}
        </p>

        {/* Activities preview */}
        {idea.activities.length > 0 && (
          <div className="mt-3 space-y-1">
            {idea.activities.slice(0, 2).map((activity) => (
              <div key={activity.order} className="flex items-center gap-2 text-xs text-muted">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                  {activity.order}
                </span>
                <span className="truncate">{activity.name}</span>
              </div>
            ))}
            {idea.activities.length > 2 && (
              <p className="text-xs text-muted pl-6 opacity-60">
                +{idea.activities.length - 2} more
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:pt-4 border-t border-border/50">
          <span className="shrink-0 text-sm font-semibold text-foreground">
            {formatCost(idea.estimatedCost)}
          </span>

          {idea.matchedInterests.length > 0 && (
            <div className="flex flex-wrap justify-end gap-1 min-w-0">
              {idea.matchedInterests.slice(0, 2).map((interest) => (
                <span
                  key={interest}
                  className="truncate rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary max-w-[100px]"
                >
                  {interest}
                </span>
              ))}
              {idea.matchedInterests.length > 2 && (
                <span className="text-[10px] text-muted">
                  +{idea.matchedInterests.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
