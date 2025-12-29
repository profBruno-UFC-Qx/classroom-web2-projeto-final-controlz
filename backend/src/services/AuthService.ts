import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserRole } from "../entities/enums";
import { HttpError } from "../http/httpErrors";
import { signAccessToken } from "../auth/jwt";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole.STUDENT | UserRole.INSTITUTION;
};

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async register(input: RegisterInput) {
    const email = input.email.trim().toLowerCase();
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new HttpError(409, "E-mail já cadastrado");

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = this.userRepo.create({
      name: input.name.trim(),
      email,
      passwordHash,
      role: input.role,
    });

    await this.userRepo.save(user);

    const accessToken = signAccessToken(user.id, user.role);
    return { user: this.safeUser(user), accessToken };
  }

  async login(emailRaw: string, password: string) {
    const email = emailRaw.trim().toLowerCase();
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new HttpError(401, "Credenciais inválidas");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Credenciais inválidas");

    const accessToken = signAccessToken(user.id, user.role);
    return { user: this.safeUser(user), accessToken };
  }

  async me(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    return this.safeUser(user);
  }

  private safeUser(user: User) {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}




