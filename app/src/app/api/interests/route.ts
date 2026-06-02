import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
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

  return NextResponse.json(grouped);
}
