import path from "path";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function resolveDbUrl(raw: string): string {
  // Resolve relative file: URLs against the project root
  if (raw.startsWith("file:./") || raw.startsWith("file:../")) {
    const relPath = raw.slice("file:".length);
    return `file:${path.resolve(process.cwd(), relPath)}`;
  }
  return raw;
}

function createPrismaClient() {
  const rawUrl =
    process.env.DATABASE_URL ??
    `file:${path.resolve(process.cwd(), "prisma", "dev.db")}`;
  const adapter = new PrismaLibSql({ url: resolveDbUrl(rawUrl) });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
