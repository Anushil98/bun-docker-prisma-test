import { describe, it, expect, beforeEach, mock } from "bun:test";
import { AuthService } from "../../app/services/auth-service.impl";
import type { IUserRepo } from "../../domain/repos/user-repo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("AuthService", () => {
  let service: AuthService;
  let userRepo: IUserRepo;

  beforeEach(() => {
    // Mock repo
    userRepo = {
      findByEmail: mock(async (_email: string) => ({
        id: "user_1",
        name: "Test User",
        email: "test@example.com",
        password: "$2a$10$hash",
      })),
      create: mock(async (_data: any) => ({ id: "user_1" })),
    } as any;

    // Mock libs
    (bcrypt as any).compare = mock(async () => true);
    (bcrypt as any).hash = mock(async () => "hashed");
    (jwt as any).sign = mock((payload: any, _secret: string, _opts?: any) => {
      return payload?.id ? `token-${payload.id}` : "token";
    });

    // Ensure env
    process.env.ACCESS_JWT_TOKEN = process.env.ACCESS_JWT_TOKEN || "access_secret";
    process.env.REFRESH_JWT_TOKEN = process.env.REFRESH_JWT_TOKEN || "refresh_secret";

    service = new AuthService(userRepo);
  });

  it("login: returns user and tokenSet on valid credentials", async () => {
    const result = await service.login("test@example.com", "password123");
    expect(result.user).toEqual({ id: "user_1", name: "Test User" });
    expect(result.tokenSet.accessToken).toContain("token-");
    expect(result.tokenSet.refreshToken).toContain("token-");
    expect((bcrypt.compare as any)).toHaveBeenCalled();
    expect((userRepo.findByEmail as any)).toHaveBeenCalledWith("test@example.com");
  });

  it("login: throws on unknown email", async () => {
    (userRepo.findByEmail as any) = mock(async () => null);
    await expect(service.login("nope@example.com", "x")).rejects.toThrow("Invalid Credentials");
  });

  it("login: throws on invalid password", async () => {
    (bcrypt as any).compare = mock(async () => false);
    await expect(service.login("test@example.com", "bad"))
      .rejects.toThrow("Invalid Credentials");
  });

  it("signUp: hashes password and creates user with lowercased email", async () => {
    const input = { email: "TEST@Example.com", password: "pass", name: "Test User", phone: 1234567890 };
    const out = await service.signUp(input);
    expect(out).toEqual({ id: "user_1", name: "Test User" });
    expect((bcrypt.hash as any)).toHaveBeenCalledWith("pass", 10);

    const call = (userRepo.create as any).mock.calls[0][0];
    expect(call.email).toBe("test@example.com");
    expect(call.password).toBe("hashed");
    expect(call.name).toBe("Test User");
    expect(call.phone).toBe(1234567890);
  });
});
