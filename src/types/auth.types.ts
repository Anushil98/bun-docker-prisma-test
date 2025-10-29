import type { User } from "../generated/prisma/client";

export interface UserOutput
  extends Omit<User, "email" | "password" | "phone"> {}

export interface TOKEN_PAYLOAD {
  accessToken: String;
  refreshToken: String;
}
export interface AUTH_PAYLOAD {
  tokenSet: TOKEN_PAYLOAD;
  user: UserOutput;
}
