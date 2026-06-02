"use client";

import { useState } from "react";

type SurpriseData = {
  text: string;
  category: string;
  id: string;
};

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  conversation_starter: { label: "Conversation Starter", emoji: "💬" },
  gift_idea: { label: "Gift Idea", emoji: "🎁" },
  song: { label: "Song to Play", emoji: "🎵" },
  gesture: { label: "Sweet Gesture", emoji: "✨" },
};

export default function SurpriseReveal({
  surprise,
  onRefresh,
}: {
  surprise: SurpriseData;
  onRefresh?: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const catInfo = CATEGORY_LABELS[surprise.category] ?? {
    label: "Surprise",
    emoji: "🎉",
  };

  return (
    <div className="rounded-xl border border-dashed border-accent/50 bg-accent/5 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="text-lg">{catInfo.emoji}</span>
          Small Surprise: {catInfo.label}
        </h3>
        {onRefresh && revealed && (
          <button
            onClick={onRefresh}
            aria-label="Get another surprise"
            className="rounded-md px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors sm:px-2 sm:py-1"
          >
            Get another
          </button>
        )}
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent/10 px-5 py-3 text-sm font-medium text-accent transition-all duration-200 hover:bg-accent/20 hover:scale-[1.02] active:scale-95 sm:w-auto sm:px-4 sm:py-2"
        >
          <span className="text-base">🎉</span>
          Tap to reveal surprise
        </button>
      ) : (
        <div className="animate-surprise-reveal mt-3" aria-live="polite">
          <p className="text-sm leading-relaxed text-muted">
            {surprise.text}
          </p>
        </div>
      )}
    </div>
  );
}
