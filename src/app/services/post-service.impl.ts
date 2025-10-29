import type { IPostService } from "@/domain/services/post-service";
import type { IPostRepo } from "@/domain/repos/post-repo";

export class PostService implements IPostService {
  constructor(private postRepo: IPostRepo) {}

  getPost(postId: string) {
    return this.postRepo.findById(postId);
  }

  createPost(authorId: string, text: string) {
    return this.postRepo.create({ authorId, text });
  }
}
