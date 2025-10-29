import { PrismaClient } from "../generated/prisma/client";

export type { PrismaClient };

export const createPrismaClient = () =>
  new PrismaClient({
    log: ["query", "error", "warn"],
    omit: { user: { password: true, email: true } },
  });

export type Prisma = ReturnType<typeof createPrismaClient>;
