/**
 * Curated library of low-cost surprise ideas for date nights.
 * Organized by category and tagged with compatible moods.
 */

import type { Mood } from "@/types";

export type SurpriseCategory =
  | "conversation_starter"
  | "gift_idea"
  | "song"
  | "gesture";

export type Surprise = {
  id: string;
  text: string;
  category: SurpriseCategory;
  moods: Mood[]; // which moods this surprise fits well with
};

const ALL_MOODS: Mood[] = [
  "romantic",
  "adventurous",
  "low-key",
  "foodie",
  "active",
];

export const SURPRISES: Surprise[] = [
  // ── Conversation Starters ──
  {
    id: "cs-1",
    text: "Ask each other: 'What's one thing on your bucket list we could do together this year?'",
    category: "conversation_starter",
    moods: ALL_MOODS,
  },
  {
    id: "cs-2",
    text: "Take turns sharing your favorite memory from the past month.",
    category: "conversation_starter",
    moods: ALL_MOODS,
  },
  {
    id: "cs-3",
    text: "Play '20 Questions' but only about dreams and future plans.",
    category: "conversation_starter",
    moods: ["romantic", "low-key"],
  },
  {
    id: "cs-4",
    text: "Each share three things you're grateful for about each other right now.",
    category: "conversation_starter",
    moods: ["romantic", "low-key"],
  },
  {
    id: "cs-5",
    text: "Describe your perfect weekend together — no budget limits.",
    category: "conversation_starter",
    moods: ["adventurous", "romantic"],
  },
  {
    id: "cs-6",
    text: "Ask: 'If we could live anywhere in the world for a month, where would you pick?'",
    category: "conversation_starter",
    moods: ["adventurous", "romantic", "low-key"],
  },
  {
    id: "cs-7",
    text: "Share the meal that reminds you most of home or childhood.",
    category: "conversation_starter",
    moods: ["foodie", "low-key"],
  },
  {
    id: "cs-8",
    text: "Each pick a song that reminds you of the other person and explain why.",
    category: "conversation_starter",
    moods: ALL_MOODS,
  },
  {
    id: "cs-9",
    text: "Take turns finishing the sentence: 'I knew I loved you when...'",
    category: "conversation_starter",
    moods: ["romantic"],
  },
  {
    id: "cs-10",
    text: "Ask: 'What's something new you'd like us to try together?'",
    category: "conversation_starter",
    moods: ["adventurous", "active"],
  },

  // ── Gift Ideas ──
  {
    id: "gi-1",
    text: "Bring a small succulent or potted plant as a surprise gift.",
    category: "gift_idea",
    moods: ["romantic", "low-key"],
  },
  {
    id: "gi-2",
    text: "Write a short handwritten note listing five things you love about them.",
    category: "gift_idea",
    moods: ["romantic"],
  },
  {
    id: "gi-3",
    text: "Pick up their favorite candy or snack on the way.",
    category: "gift_idea",
    moods: ALL_MOODS,
  },
  {
    id: "gi-4",
    text: "Surprise them with a small journal or notebook for capturing memories together.",
    category: "gift_idea",
    moods: ["romantic", "adventurous"],
  },
  {
    id: "gi-5",
    text: "Get a pair of matching keychains or simple bracelets.",
    category: "gift_idea",
    moods: ["romantic", "adventurous"],
  },
  {
    id: "gi-6",
    text: "Bring a scratch-off card — split any winnings on the next date.",
    category: "gift_idea",
    moods: ["adventurous", "active", "low-key"],
  },
  {
    id: "gi-7",
    text: "Pick up a postcard of your city and write a love note on the back.",
    category: "gift_idea",
    moods: ["romantic", "adventurous"],
  },
  {
    id: "gi-8",
    text: "Bring a small bag of specialty coffee beans or loose-leaf tea they haven't tried.",
    category: "gift_idea",
    moods: ["foodie", "low-key"],
  },
  {
    id: "gi-9",
    text: "Surprise them with a new recipe card for something to cook together next time.",
    category: "gift_idea",
    moods: ["foodie"],
  },
  {
    id: "gi-10",
    text: "Gift a fun pair of novelty socks related to their hobby.",
    category: "gift_idea",
    moods: ["low-key", "active"],
  },

  // ── Songs to Play ──
  {
    id: "sg-1",
    text: "Play 'At Last' by Etta James during a quiet moment together.",
    category: "song",
    moods: ["romantic"],
  },
  {
    id: "sg-2",
    text: "Queue up 'Best Part' by Daniel Caesar & H.E.R. on the drive there.",
    category: "song",
    moods: ["romantic", "low-key"],
  },
  {
    id: "sg-3",
    text: "Create a 5-song playlist of songs from the year you met.",
    category: "song",
    moods: ["romantic", "low-key"],
  },
  {
    id: "sg-4",
    text: "Play 'Don't Stop Me Now' by Queen to set an energetic vibe.",
    category: "song",
    moods: ["adventurous", "active"],
  },
  {
    id: "sg-5",
    text: "Put on a lo-fi beats playlist for a chill, relaxed atmosphere.",
    category: "song",
    moods: ["low-key", "foodie"],
  },
  {
    id: "sg-6",
    text: "Play 'Lovely Day' by Bill Withers to start the date with good energy.",
    category: "song",
    moods: ALL_MOODS,
  },
  {
    id: "sg-7",
    text: "Queue up 'Electric Feel' by MGMT for an adventurous vibe.",
    category: "song",
    moods: ["adventurous", "active"],
  },
  {
    id: "sg-8",
    text: "Play 'La Vie en Rose' by Edith Piaf during dinner.",
    category: "song",
    moods: ["romantic", "foodie"],
  },

  // ── Gestures ──
  {
    id: "ge-1",
    text: "Open the car door for them — old school, but always appreciated.",
    category: "gesture",
    moods: ALL_MOODS,
  },
  {
    id: "ge-2",
    text: "Take a candid photo of them during the date and send it later with a sweet caption.",
    category: "gesture",
    moods: ALL_MOODS,
  },
  {
    id: "ge-3",
    text: "Leave a sticky note with a compliment somewhere they'll find it later (pocket, bag, car).",
    category: "gesture",
    moods: ["romantic", "low-key"],
  },
  {
    id: "ge-4",
    text: "Offer to handle all the planning so they can just show up and enjoy.",
    category: "gesture",
    moods: ALL_MOODS,
  },
  {
    id: "ge-5",
    text: "Warm up the car or have their favorite drink ready before you leave.",
    category: "gesture",
    moods: ["romantic", "low-key"],
  },
  {
    id: "ge-6",
    text: "Challenge them to a playful bet — loser plans the next date.",
    category: "gesture",
    moods: ["adventurous", "active"],
  },
  {
    id: "ge-7",
    text: "Take a selfie together at the start and end of the date to compare smiles.",
    category: "gesture",
    moods: ALL_MOODS,
  },
  {
    id: "ge-8",
    text: "Cook or bring a homemade treat as an unexpected addition to the date.",
    category: "gesture",
    moods: ["foodie", "romantic"],
  },
  {
    id: "ge-9",
    text: "Rate the date together on the way home: best moment, funniest moment, and 'next time' idea.",
    category: "gesture",
    moods: ALL_MOODS,
  },
  {
    id: "ge-10",
    text: "Send a 'thank you for tonight' text the morning after the date.",
    category: "gesture",
    moods: ALL_MOODS,
  },
];

/**
 * Get a random surprise, optionally filtered by mood and/or category.
 * Excludes any surprise IDs in the `exclude` set to avoid repeats.
 */
export function getRandomSurprise(options: {
  mood?: Mood;
  category?: SurpriseCategory;
  exclude?: Set<string>;
} = {}): Surprise | null {
  const { mood, category, exclude } = options;

  let pool = SURPRISES;

  if (mood) {
    pool = pool.filter((s) => s.moods.includes(mood));
  }
  if (category) {
    pool = pool.filter((s) => s.category === category);
  }
  if (exclude && exclude.size > 0) {
    pool = pool.filter((s) => !exclude.has(s.id));
  }

  if (pool.length === 0) return null;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

/**
 * Get multiple unique surprises for a date idea.
 * Returns one from each category when possible, filtered by mood.
 */
export function getSurprisesForMood(
  mood: Mood,
  count = 1,
): Surprise[] {
  const results: Surprise[] = [];
  const used = new Set<string>();

  for (let i = 0; i < count; i++) {
    const surprise = getRandomSurprise({ mood, exclude: used });
    if (!surprise) break;
    results.push(surprise);
    used.add(surprise.id);
  }

  return results;
}

/**
 * Attach a dynamic surprise to a date idea, using the idea's mood
 * to pick a relevant surprise. Falls back to the idea's built-in
 * surprise if no mood match is found.
 */
export function pickSurpriseForIdea(
  mood: string,
  fallbackSurprise: string | null,
): { text: string; category: SurpriseCategory; id: string } | null {
  const validMoods: Mood[] = [
    "romantic",
    "adventurous",
    "low-key",
    "foodie",
    "active",
  ];
  const moodTyped = validMoods.includes(mood as Mood)
    ? (mood as Mood)
    : undefined;

  const surprise = getRandomSurprise({ mood: moodTyped });

  if (surprise) {
    return { text: surprise.text, category: surprise.category, id: surprise.id };
  }

  if (fallbackSurprise) {
    return { text: fallbackSurprise, category: "gesture", id: "fallback" };
  }

  return null;
}
