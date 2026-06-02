"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

type BookmarkButtonProps = {
  dateIdeaId: string;
  initialBookmarked: boolean;
  /** Size variant for card vs detail page usage */
  size?: "sm" | "md";
  onToggle?: (bookmarked: boolean) => void;
};

export default function BookmarkButton({
  dateIdeaId,
  initialBookmarked,
  size = "sm",
  onToggle,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, setPending] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const pulseTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, []);

  const triggerPulse = useCallback(() => {
    setPulsing(true);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulsing(false), 400);
  }, []);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      // Prevent navigation when inside a Link
      e.preventDefault();
      e.stopPropagation();

      if (pending) return;

      // Optimistic update
      const prev = bookmarked;
      setBookmarked(!prev);
      setPending(true);
      triggerPulse();

      try {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dateIdeaId }),
        });

        if (!res.ok) {
          setBookmarked(prev);
          toast.error("Failed to update bookmark");
        } else {
          const data = await res.json();
          setBookmarked(data.bookmarked);
          onToggle?.(data.bookmarked);
          toast.success(data.bookmarked ? "Saved to your dates" : "Removed from saved");
        }
      } catch {
        setBookmarked(prev);
        toast.error("Something went wrong");
      } finally {
        setPending(false);
      }
    },
    [dateIdeaId, bookmarked, pending, onToggle, triggerPulse],
  );

  const sizeClasses =
    size === "md"
      ? "h-10 w-10 text-xl"
      : "h-8 w-8 text-base";

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      aria-label={bookmarked ? "Remove bookmark" : "Save date idea"}
      aria-pressed={bookmarked}
      className={`${sizeClasses} inline-flex items-center justify-center rounded-full transition-all ${
        bookmarked
          ? "bg-rose-100 text-rose-500 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-900/70"
          : "bg-card/80 text-muted hover:bg-card hover:text-rose-400"
      } ${pending ? "opacity-60" : ""} ${pulsing ? "animate-heart-pulse" : ""} backdrop-blur-sm border border-border/50 shadow-sm`}
    >
      {bookmarked ? <HeartFilledIcon /> : <HeartOutlineIcon />}
    </button>
  );
}

function HeartFilledIcon() {
  return (
    <svg className="h-[1em] w-[1em]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

function HeartOutlineIcon() {
  return (
    <svg
      className="h-[1em] w-[1em]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}
