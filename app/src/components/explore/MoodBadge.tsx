import type { Mood } from "@/types";
import { MOOD_OPTIONS } from "@/lib/constants";

const moodColors: Record<Mood, string> = {
  romantic: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800",
  adventurous: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
  "low-key": "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800",
  foodie: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800",
  active: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800",
};

export default function MoodBadge({ mood }: { mood: string }) {
  const option = MOOD_OPTIONS.find((m) => m.value === mood);
  const colors = moodColors[mood as Mood] ?? "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}
    >
      {option?.emoji} {option?.label ?? mood}
    </span>
  );
}
