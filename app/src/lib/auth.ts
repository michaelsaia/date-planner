import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import { rateLimit } from "@/lib/rate-limit";

// 10 login attempts per 15 minutes per email
const LOGIN_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 10 };

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase();
        const password = credentials.password as string;

        // Rate limit login attempts per email to prevent brute-force
        const rl = rateLimit(`login:${email}`, LOGIN_RATE_LIMIT);
        if (!rl.allowed) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        // Always run bcrypt.compare to prevent timing-based user enumeration.
        // The dummy hash is a valid bcrypt hash that will never match.
        const dummyHash =
          "$2a$12$000000000000000000000uGTWYJm1eY8E3WjO5L0qGJNqMTPG/xm";
        const hashToCompare = user?.passwordHash ?? dummyHash;
        const valid = await bcrypt.compare(password, hashToCompare);

        if (!user || !valid) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],
});
