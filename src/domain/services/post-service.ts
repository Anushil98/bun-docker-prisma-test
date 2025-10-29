export interface IPostService {
  getPost(postId: string): Promise<{
    id: string;
    text: string;
    author: { id: string; name: string };
  } | null>;
  createPost(authorId: string, text: string): Promise<{ postId: string }>;
}
