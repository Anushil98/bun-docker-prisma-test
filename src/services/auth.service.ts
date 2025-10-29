import jwt from "jsonwebtoken";
import type { TOKEN_PAYLOAD } from "../types/auth.types";

export const getJWTTokenSet = (user: { id: string }): TOKEN_PAYLOAD => {
  const accessToken = jwt.sign({ ...user }, process.env.ACCESS_JWT_TOKEN!, {
    expiresIn: "15Min",
  });
  const refreshToken = jwt.sign({ ...user }, process.env.REFRESH_JWT_TOKEN!, {
    expiresIn: "30Days",
  });
  return { accessToken, refreshToken };
};
