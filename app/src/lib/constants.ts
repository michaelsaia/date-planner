import type { Mood } from "@/types";

export const MOOD_OPTIONS: { value: Mood; label: string; emoji: string }[] = [
  { value: "romantic", label: "Romantic", emoji: "💕" },
  { value: "adventurous", label: "Adventurous", emoji: "🏔️" },
  { value: "low-key", label: "Low-key", emoji: "🛋️" },
  { value: "foodie", label: "Foodie", emoji: "🍽️" },
  { value: "active", label: "Active", emoji: "🏃" },
];

export const DEFAULT_INTERESTS = [
  { name: "Hiking", category: "Outdoor" },
  { name: "Fine Dining", category: "Food" },
  { name: "Live Music", category: "Entertainment" },
  { name: "Cooking", category: "Food" },
  { name: "Movies", category: "Entertainment" },
  { name: "Art Galleries", category: "Culture" },
  { name: "Board Games", category: "Indoor" },
  { name: "Wine Tasting", category: "Food" },
  { name: "Dancing", category: "Entertainment" },
  { name: "Photography", category: "Creative" },
  { name: "Yoga", category: "Wellness" },
  { name: "Beach", category: "Outdoor" },
  { name: "Cycling", category: "Outdoor" },
  { name: "Theater", category: "Culture" },
  { name: "Spa Day", category: "Wellness" },
  { name: "Bowling", category: "Indoor" },
  { name: "Karaoke", category: "Entertainment" },
  { name: "Farmers Market", category: "Outdoor" },
  { name: "Stargazing", category: "Outdoor" },
  { name: "Escape Room", category: "Indoor" },
];

export const BUDGET_PRESETS = [
  { label: "Free", min: 0, max: 0 },
  { label: "$", min: 1, max: 25 },
  { label: "$$", min: 25, max: 75 },
  { label: "$$$", min: 75, max: 150 },
  { label: "$$$$", min: 150, max: 500 },
];
