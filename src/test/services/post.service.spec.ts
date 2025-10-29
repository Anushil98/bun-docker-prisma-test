import { describe, it, expect, beforeEach, mock } from "bun:test";
import { PostService } from "../../app/services/post-service.impl";
import type { IPostRepo } from "../../domain/repos/post-repo";

describe("PostService", () => {
  let service: PostService;
  let postRepo: IPostRepo;

  beforeEach(() => {
    postRepo = {
      findById: mock(async (postId: string) => ({
        id: postId,
        text: "hello",
        author: { id: "user_1", name: "Author" },
      })),
      create: mock(async (_data: { text: string; authorId: string }) => ({
        postId: "post_1",
      })),
    } as any;

    service = new PostService(postRepo);
  });

  it("getPost: returns post with author", async () => {
    const out = await service.getPost("post_123");
    expect(out).toEqual({
      id: "post_123",
      text: "hello",
      author: { id: "user_1", name: "Author" },
    });
    expect(postRepo.findById as any).toHaveBeenCalledWith("post_123");
  });

  it("createPost: creates and returns id", async () => {
    const out = await service.createPost("user_1", "new post");
    expect(out).toEqual({ postId: "post_1" });
    expect(postRepo.create as any).toHaveBeenCalledWith({
      authorId: "user_1",
      text: "new post",
    });
  });
});
