export interface IUserRepo {
  findByEmail(email: string): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
  } | null>;
  create(data: {
    email: string;
    name: string;
    password: string;
    phone: number;
  }): Promise<{ id: string }>;
}
