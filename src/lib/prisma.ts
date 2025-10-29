import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"], // optional in dev
    omit: { user: { password: true, email: true } },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
