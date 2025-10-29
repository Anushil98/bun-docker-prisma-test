export interface IAuthService {
  login(
    email: string,
    password: string
  ): Promise<{
    user: { id: string; name: string };
    tokenSet: { accessToken: string; refreshToken: string };
  }>;
  signUp(input: {
    email: string;
    password: string;
    name: string;
    phone?: number;
  }): Promise<{ id: string; name: string }>;
}
