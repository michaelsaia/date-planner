import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signUpSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

// 5 signup attempts per 15 minutes per IP
const SIGNUP_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 5 };

export async function POST(request: Request) {
  // Rate limit by IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`signup:${ip}`, SIGNUP_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const result = signUpSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 },
    );
  }

  const { password } = result.data;
  const email = result.data.email.toLowerCase().trim();

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, passwordHash },
    });

    return NextResponse.json(
      { id: user.id, email: user.email },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to create account. Please try again." },
      { status: 500 },
    );
  }
}
