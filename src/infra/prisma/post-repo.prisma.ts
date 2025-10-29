import type { IPostRepo } from "@/domain/repos/post-repo";
import type { Prisma as PrismaInstance } from "@/lib/prisma";

export class PostRepoPrisma implements IPostRepo {
  constructor(private prisma: PrismaInstance) {}

  async findById(postId: string) {
    return this.prisma.post.findFirst({
      where: { postId },
      include: { author: { select: { id: true, name: true } } },
    }) as any;
  }

  async create(data: { text: string; authorId: string }) {
    const post = await this.prisma.post.create({
      data: { text: data.text, author: { connect: { id: data.authorId } } },
    });
    return { postId: post.postId };
  }
}
