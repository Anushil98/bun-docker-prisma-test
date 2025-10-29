import { Router } from "express";
import { createPost, getPost } from "../controllers/post.controller";
import { jwtAuthMiddleware } from "../middleware/jwtAuth.middleware";

const postRouter = Router();

postRouter.post("/createPost", jwtAuthMiddleware, createPost);
postRouter.post("/getPostById", jwtAuthMiddleware, getPost);

export default postRouter;
