import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile, userInterests] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.userInterest.findMany({
      where: { userId: session.user.id },
      select: { interestId: true },
    }),
  ]);

  return NextResponse.json({
    profile,
    interests: userInterests.map((ui) => ui.interestId),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const result = profileSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 },
    );
  }

  const { interests, budgetRange, homeLocation } = result.data;
  const userId = session.user.id;

  try {
    // Upsert profile and replace interests in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.profile.upsert({
        where: { userId },
        create: {
          userId,
          budgetMin: budgetRange.min,
          budgetMax: budgetRange.max,
          homeLat: homeLocation?.lat ?? null,
          homeLng: homeLocation?.lng ?? null,
          homeLabel: homeLocation?.label ?? null,
        },
        update: {
          budgetMin: budgetRange.min,
          budgetMax: budgetRange.max,
          homeLat: homeLocation?.lat ?? null,
          homeLng: homeLocation?.lng ?? null,
          homeLabel: homeLocation?.label ?? null,
        },
      });

      await tx.userInterest.deleteMany({ where: { userId } });
      if (interests.length > 0) {
        await tx.userInterest.createMany({
          data: interests.map((interestId) => ({ userId, interestId })),
        });
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 },
    );
  }
}
