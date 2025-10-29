import { prisma } from "@/lib/prisma";
import {
  AuthenticatedRequest,
  AuthenticatedResponse,
} from "@/types/express.types";

export const createPost = async (
  req: AuthenticatedRequest,
  res: AuthenticatedResponse
) => {
  try {
    const { text } = req.body;
    const post = await prisma.post.create({
      data: {
        text,
        author: {
          connect: { id: req.user?.id },
        },
      },
    });
    const postSaved = await prisma.post.findFirst({
      where: { postId: post.postId },
      include: { author: true },
    });
    res.status(200).send({ data: postSaved });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error!");
    return;
  }
};

export const getPost = async (
  req: AuthenticatedRequest,
  res: AuthenticatedResponse
) => {
  try {
    const { postId } = req.body;
    const post = await prisma.post.findFirst({
      where: { postId },
      include: { author: { select: { id: true, name: true } } },
    });
    res.status(200).send({ data: post });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error!");
    return;
  }
};
