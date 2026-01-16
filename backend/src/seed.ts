import bcrypt from "bcryptjs";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { UserRole } from "./entities/enums";

// Seed basico para criar um usuario admin se ainda nao existir
async function main() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

  // Le credenciais do admin via env com valores padrao para desenvolvimento
  const email = (process.env.ADMIN_EMAIL || "admin@local.test")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Administrador";

  // Evita duplicar admin caso ja exista
  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log(`Admin já existe: ${email} (id=${existing.id})`);
    await AppDataSource.destroy();
    return;
  }

  // Cria hash seguro e persiste o admin
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = userRepo.create({
    name,
    email,
    passwordHash,
    role: UserRole.ADMIN,
  });

  await userRepo.save(admin);

  // eslint-disable-next-line no-console
  console.log(`Admin criado: ${email} (senha: ${password})`);
  await AppDataSource.destroy();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
