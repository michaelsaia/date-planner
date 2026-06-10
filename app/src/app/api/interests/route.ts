import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// 30 requests per minute per IP (public endpoint)
const INTERESTS_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 30 };

export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`interests:${ip}`, INTERESTS_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 },
    );
  }

  const interests = await prisma.interest.findMany({
    orderBy: { category: "asc" },
  });

  // Group by category
  const grouped: Record<string, { id: string; name: string }[]> = {};
  for (const interest of interests) {
    if (!grouped[interest.category]) {
      grouped[interest.category] = [];
    }
    grouped[interest.category].push({ id: interest.id, name: interest.name });
  }

  const response = NextResponse.json(grouped);
  // Interests rarely change — allow client caching
  response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  return response;
}
