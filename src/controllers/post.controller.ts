import type { IPostService } from "@/domain/services/post-service";
import type {
  AuthenticatedRequest,
  AuthenticatedResponse,
} from "@/types/express.types";

const handleError = (err: Error, res: AuthenticatedResponse) => {
  console.error(err);
  res.status(500).send("Internal Server Error!");
};

export class PostController {
  constructor(private postService: IPostService) {}

  createPost = async (req: AuthenticatedRequest, res: AuthenticatedResponse) => {
    try {
      const { text } = req.body;
      const post = await this.postService.createPost(req.user!.id, text);
      res.status(200).send({ data: post });
    } catch (err) {
      handleError(err as Error, res);
    }
  };

  getPost = async (req: AuthenticatedRequest, res: AuthenticatedResponse) => {
    try {
      const { postId } = req.body;
      const post = await this.postService.getPost(postId);
      res.status(200).send({ data: post });
    } catch (err) {
      handleError(err as Error, res);
    }
  };
}

// DI compatibility: allow existing imports of functions
let _postController: PostController | null = null;
export const setPostController = (c: PostController) => {
  _postController = c;
};
export const createPost = (req: AuthenticatedRequest, res: AuthenticatedResponse) =>
  _postController!.createPost(req, res);
export const getPost = (req: AuthenticatedRequest, res: AuthenticatedResponse) =>
  _postController!.getPost(req, res);
