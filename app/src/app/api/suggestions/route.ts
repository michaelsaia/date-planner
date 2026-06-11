import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSuggestionsForUser } from "@/lib/suggestions";
import { filterSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

// 30 suggestion requests per minute per user
const SUGGESTIONS_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 30 };

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`suggestions:${session.user.id}`, SUGGESTIONS_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  // Parse optional query params for filters
  const { searchParams } = new URL(request.url);
  const moodsParam = searchParams.get("moods");
  const budgetMinParam = searchParams.get("budgetMin");
  const budgetMaxParam = searchParams.get("budgetMax");
  const limitParam = searchParams.get("limit");

  const filterInput = {
    moods: moodsParam ? moodsParam.split(",") : undefined,
    budgetMin: budgetMinParam ? Number(budgetMinParam) : undefined,
    budgetMax: budgetMaxParam ? Number(budgetMaxParam) : undefined,
  };

  const parsed = filterSchema.safeParse(filterInput);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const limit = limitParam ? Math.min(Math.max(Number(limitParam), 1), 50) : 10;

  const suggestions = await getSuggestionsForUser(
    session.user.id,
    parsed.data,
    limit,
  );

  return NextResponse.json({ suggestions });
}
