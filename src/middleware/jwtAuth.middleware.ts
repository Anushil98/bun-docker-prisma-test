import {
  AuthenticatedRequest,
  AuthenticatedResponse,
} from "@/types/express.types";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const jwtAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: AuthenticatedResponse,
  next: NextFunction
): Promise<void> => {
  const token = req.headers["authorization"]?.split("Bearer ")[1];
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_TOKEN!);
    req.user = { id: (decoded as jwt.JwtPayload).id };
    res.locals.user = { id: (decoded as jwt.JwtPayload).id };
    next();
    return;
  } catch (err) {
    console.error(err);
    res.status(401).send("Unauthorized");
    return;
  }
};
