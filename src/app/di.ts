import { UserRepoPrisma } from "@/infra/prisma/user-repo.prisma";
import { PostRepoPrisma } from "@/infra/prisma/post-repo.prisma";
import { AuthService } from "@/app/services/auth-service.impl";
import { PostService } from "@/app/services/post-service.impl";
import { AuthController, setAuthController } from "@/controllers/auth.controller";
import { PostController, setPostController } from "@/controllers/post.controller";
import { createPrismaClient } from "@/lib/prisma";

// Instantiate repos
export const prisma = createPrismaClient();
const userRepo = new UserRepoPrisma(prisma);
const postRepo = new PostRepoPrisma(prisma);

// Instantiate services
const authService = new AuthService(userRepo);
const postService = new PostService(postRepo);

// Instantiate controllers
export const authController = new AuthController(authService);
export const postController = new PostController(postService);

// Bridge to existing function exports in controllers
setAuthController(authController);
setPostController(postController);
