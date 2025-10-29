import type { IAuthService } from "@/domain/services/auth-service";
import type { Request, Response } from "express";

const handleError = (err: Error, res: Response) => {
  console.error(err);
  res.status(500).send("Internal Server Error!");
};

export class AuthController {
  constructor(private authService: IAuthService) {}

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const result = await this.authService.login(email, password);
      res.status(200).send({ data: result, message: "Login Success!" });
    } catch (err) {
      handleError(err as Error, res);
    }
  };

  signUp = async (req: Request, res: Response) => {
    try {
      const { email, password, name, phone } = req.body;
      const result = await this.authService.signUp({ email, password, name, phone });
      res.status(200).send({ data: result });
    } catch (err) {
      handleError(err as Error, res);
    }
  };
}

// DI compatibility: allow existing imports of functions
let _authController: AuthController | null = null;
export const setAuthController = (c: AuthController) => {
  _authController = c;
};
export const login = (req: Request, res: Response) => _authController!.login(req, res);
export const signUp = (req: Request, res: Response) => _authController!.signUp(req, res);
