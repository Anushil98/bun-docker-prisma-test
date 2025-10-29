import type { IUserRepo } from "@/domain/repos/user-repo";
import type { Prisma as PrismaInstance } from "@/lib/prisma";

export class UserRepoPrisma implements IUserRepo {
  constructor(private prisma: PrismaInstance) {}

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });
  }

  async create(data: { email: string; name: string; password: string; phone: number }) {
    const user = await this.prisma.user.create({ data });
    return { id: user.id };
  }
}
