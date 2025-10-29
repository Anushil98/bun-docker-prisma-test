import { Router } from "express";
import { login, signUp } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/signUp", signUp);

export default authRouter;
