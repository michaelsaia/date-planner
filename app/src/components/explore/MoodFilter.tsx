"use client";

import type { Mood } from "@/types";
import { MOOD_OPTIONS } from "@/lib/constants";

const moodColors: Record<Mood, { active: string; inactive: string }> = {
  romantic: {
    active: "bg-pink-100 text-pink-700 border-pink-300 ring-1 ring-pink-300 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-700 dark:ring-pink-700",
    inactive: "bg-card text-pink-600 border-pink-200 hover:bg-pink-50 dark:text-pink-400 dark:border-pink-800 dark:hover:bg-pink-900/30",
  },
  adventurous: {
    active: "bg-amber-100 text-amber-700 border-amber-300 ring-1 ring-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700 dark:ring-amber-700",
    inactive: "bg-card text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/30",
  },
  "low-key": {
    active: "bg-sky-100 text-sky-700 border-sky-300 ring-1 ring-sky-300 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-700 dark:ring-sky-700",
    inactive: "bg-card text-sky-600 border-sky-200 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-800 dark:hover:bg-sky-900/30",
  },
  foodie: {
    active: "bg-orange-100 text-orange-700 border-orange-300 ring-1 ring-orange-300 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700 dark:ring-orange-700",
    inactive: "bg-card text-orange-600 border-orange-200 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/30",
  },
  active: {
    active: "bg-green-100 text-green-700 border-green-300 ring-1 ring-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 dark:ring-green-700",
    inactive: "bg-card text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30",
  },
};

type MoodFilterProps = {
  selected: string[];
  onChange: (moods: string[]) => void;
};

export default function MoodFilter({ selected, onChange }: MoodFilterProps) {
  function toggle(mood: string) {
    if (selected.includes(mood)) {
      onChange(selected.filter((m) => m !== mood));
    } else {
      onChange([...selected, mood]);
    }
  }

  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
        Mood
      </legend>
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0" role="group" aria-label="Mood filters">
        {MOOD_OPTIONS.map((option) => {
          const isActive = selected.includes(option.value);
          const colors = moodColors[option.value];
          return (
            <button
              key={option.value}
              onClick={() => toggle(option.value)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-all sm:px-3 sm:py-1.5 ${
                isActive ? colors.active : colors.inactive
              }`}
              aria-pressed={isActive}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
