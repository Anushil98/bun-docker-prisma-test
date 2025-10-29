export interface IPostRepo {
  findById(postId: string): Promise<{
    id: string;
    text: string;
    author: { id: string; name: string };
  } | null>;
  create(data: { text: string; authorId: string }): Promise<{ postId: string }>;
}
