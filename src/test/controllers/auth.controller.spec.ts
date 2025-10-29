import { Request, Response } from "express";
import { AuthController } from "../../controllers/auth.controller";
import type { IAuthService } from "../../domain/services/auth-service";
import { describe, it, expect, beforeEach, mock } from "bun:test";

describe("AuthController", () => {
  let controller: AuthController;
  let service: IAuthService;

  beforeEach(() => {
    service = {
      login: mock(async () => ({
        user: { id: "user_1", name: "Test User" },
        tokenSet: { accessToken: "access", refreshToken: "refresh" },
      })),
      signUp: mock(async () => ({ id: "user_1", name: "Test User" })),
    } as any;

    controller = new AuthController(service);
  });

  describe("login()", () => {
    it("should return 200 and auth token if correct credentials are provided", async () => {
      const req: Request = {
        body: { email: "test@example.com", password: "password123" },
      } as Request;
      const res: Response = {
        status: mock(() => res as Response),
        send: mock(() => {}),
      } as unknown as Response;

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tokenSet: expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          }),
          user: expect.objectContaining({ id: expect.any(String), name: expect.any(String) }),
        }),
        message: "Login Success!",
      });
    });

    it("should return 500 when service throws (current behavior)", async () => {
      (service.login as any) = mock(async () => {
        throw new Error("Invalid Credentials");
      });
      const req: Request = {
        body: { email: "test@example.com", password: "wrongpassword" },
      } as Request;
      const res: Response = {
        status: mock(() => res as Response),
        send: mock(() => {}),
      } as unknown as Response;

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Internal Server Error!");
    });
  });
});
