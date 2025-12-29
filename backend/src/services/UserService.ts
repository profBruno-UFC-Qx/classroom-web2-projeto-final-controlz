import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserRole } from "../entities/enums";
import { HttpError } from "../http/httpErrors";

type UserSafe = { id: string; name: string; email: string; role: UserRole };

type AdminCreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type AdminUpdateUserInput = Partial<{
  name: string;
  email: string;
  password: string;
  role: UserRole;
}>;

type UpdateMeInput = Partial<{
  name: string;
  email: string;
  password: string;
}>;

export class UserService {
  private repo = AppDataSource.getRepository(User);

  safe(user: User): UserSafe {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async adminList(query: { page?: number; limit?: number; role?: UserRole; email?: string }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 10));
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder("u").where("1=1");
    if (query.role) qb.andWhere("u.role = :role", { role: query.role });
    if (query.email) qb.andWhere("u.email LIKE :email", { email: `%${query.email.toLowerCase()}%` });

    qb.orderBy("u.createdAt", "DESC").skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return {
      data: data.map((u) => this.safe(u)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async adminGetById(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    return this.safe(user);
  }

  async adminCreate(input: AdminCreateUserInput) {
    const email = input.email.trim().toLowerCase();
    const exists = await this.repo.findOne({ where: { email } });
    if (exists) throw new HttpError(409, "E-mail já cadastrado");

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = this.repo.create({
      name: input.name.trim(),
      email,
      passwordHash,
      role: input.role,
    });
    await this.repo.save(user);
    return this.safe(user);
  }

  async adminUpdate(id: string, input: AdminUpdateUserInput) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new HttpError(404, "Usuário não encontrado");

    if (typeof input.name === "string") user.name = input.name.trim();
    if (typeof input.email === "string") user.email = input.email.trim().toLowerCase();
    if (typeof input.role === "string") user.role = input.role;
    if (typeof input.password === "string" && input.password.length > 0) {
      user.passwordHash = await bcrypt.hash(input.password, 10);
    }

    // garante unicidade de email (mensagem melhor)
    if (typeof input.email === "string") {
      const other = await this.repo.findOne({ where: { email: user.email } });
      if (other && other.id !== user.id) throw new HttpError(409, "E-mail já cadastrado");
    }

    await this.repo.save(user);
    return this.safe(user);
  }

  async adminDelete(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    await this.repo.delete({ id });
    return { ok: true };
  }

  async getMe(userId: string) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    return this.safe(user);
  }

  async updateMe(userId: string, input: UpdateMeInput) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new HttpError(404, "Usuário não encontrado");

    if (typeof input.name === "string") user.name = input.name.trim();
    if (typeof input.email === "string") user.email = input.email.trim().toLowerCase();
    if (typeof input.password === "string" && input.password.length > 0) {
      user.passwordHash = await bcrypt.hash(input.password, 10);
    }

    if (typeof input.email === "string") {
      const other = await this.repo.findOne({ where: { email: user.email } });
      if (other && other.id !== user.id) throw new HttpError(409, "E-mail já cadastrado");
    }

    await this.repo.save(user);
    return this.safe(user);
  }

  async deleteMe(userId: string) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    await this.repo.delete({ id: userId });
    return { ok: true };
  }
}



