import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import type { AUTH_PAYLOAD } from "../types/auth.types";
import { getJWTTokenSet } from "../services/auth.service";
import bcrypt from "bcryptjs";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body, email);
    const user = await prisma.user.findFirst({
      where: { email },
      select: { id: true, email: true, password: true, name: true },
    });
    if (!user) {
      res.status(500).send("Invalid Credentials!");
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const tokenSet = getJWTTokenSet({ id: user.id });
      const result: AUTH_PAYLOAD = {
        user: { id: user.id, name: user.name },
        tokenSet: tokenSet,
      };
      res.status(200).send({ data: result, message: "Login Success!" });
      return;
    }
    res.status(500).send("Invalid Credentials!");
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error!");
    return;
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const isEmailAlreadyAvailable = await prisma.user.count({
      where: { email: (email as string).trim().toLowerCase() },
    });
    if (isEmailAlreadyAvailable > 0) {
      res.status(500).send("Email Already Registered!");
      return;
    }
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        phone,
        name,
      },
    });
    if (!user) {
      res.status(500).send("Could not create!");
      return;
    }
    const userCreated = await prisma.user.findFirst({
      where: { id: user.id },
      select: { id: true, name: true },
    });
    res.status(200).send({ data: userCreated });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error!");
    return;
  }
};
