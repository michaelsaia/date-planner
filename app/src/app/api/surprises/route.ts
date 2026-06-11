import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getRandomSurprise,
  getSurprisesForMood,
  type SurpriseCategory,
} from "@/lib/surprises";
import type { Mood } from "@/types";
import { moodSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

// 30 surprise requests per minute per user
const SURPRISES_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 30 };

/**
 * GET /api/surprises
 *
 * Get random surprise(s) for a date idea.
 * Query params:
 *   - mood: filter by mood (romantic, adventurous, low-key, foodie, active)
 *   - category: filter by category (conversation_starter, gift_idea, song, gesture)
 *   - count: number of surprises to return (default 1, max 5)
 *   - exclude: comma-separated surprise IDs to exclude (for "refresh" functionality)
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`surprises:${session.user.id}`, SURPRISES_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  const { searchParams } = new URL(request.url);
  const moodParam = searchParams.get("mood");
  const categoryParam = searchParams.get("category");
  const countParam = searchParams.get("count");
  const excludeParam = searchParams.get("exclude");

  // Validate mood if provided
  if (moodParam) {
    const parsed = moodSchema.safeParse(moodParam);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid mood. Must be one of: romantic, adventurous, low-key, foodie, active" },
        { status: 400 },
      );
    }
  }

  // Validate category if provided
  const validCategories = [
    "conversation_starter",
    "gift_idea",
    "song",
    "gesture",
  ];
  if (categoryParam && !validCategories.includes(categoryParam)) {
    return NextResponse.json(
      { error: `Invalid category. Must be one of: ${validCategories.join(", ")}` },
      { status: 400 },
    );
  }

  const count = Math.min(Math.max(Number(countParam) || 1, 1), 5);

  // Cap exclude list to prevent abuse with huge payloads
  let exclude: Set<string> | undefined;
  if (excludeParam) {
    const ids = excludeParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 50);
    exclude = new Set(ids);
  }

  const mood = moodParam as Mood | undefined;
  const category = categoryParam as SurpriseCategory | undefined;

  if (count === 1) {
    const surprise = getRandomSurprise({ mood, category, exclude });

    if (!surprise) {
      return NextResponse.json(
        { error: "No surprises available for the given filters" },
        { status: 404 },
      );
    }

    return NextResponse.json({ surprise });
  }

  // Multiple surprises with mood filter
  if (mood) {
    const surprises = getSurprisesForMood(mood, count);
    return NextResponse.json({ surprises });
  }

  // No mood filter, return random unique surprises
  const results = [];
  const used = new Set(exclude || []);
  for (let i = 0; i < count; i++) {
    const s = getRandomSurprise({ category, exclude: used });
    if (!s) break;
    results.push(s);
    used.add(s.id);
  }

  return NextResponse.json({ surprises: results });
}
