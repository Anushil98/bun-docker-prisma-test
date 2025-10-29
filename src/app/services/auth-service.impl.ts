import type { IAuthService } from "@/domain/services/auth-service";
import type { IUserRepo } from "@/domain/repos/user-repo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService implements IAuthService {
  constructor(private userRepo: IUserRepo) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid Credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid Credentials");

    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_JWT_TOKEN!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_JWT_TOKEN!, { expiresIn: "30d" });

    return {
      user: { id: user.id, name: user.name },
      tokenSet: { accessToken, refreshToken },
    };
  }

  async signUp({ email, password, name, phone }: { email: string; password: string; name: string; phone: number }) {
    const hash = await bcrypt.hash(password, 10);
    const { id } = await this.userRepo.create({ email: email.trim().toLowerCase(), password: hash, name, phone });
    return { id, name };
  }
}
