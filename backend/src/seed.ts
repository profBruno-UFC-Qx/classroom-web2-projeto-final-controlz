import "reflect-metadata";
import bcrypt from "bcryptjs";
import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { UserRole } from "./entities/enums";

async function main() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

  const email = (process.env.ADMIN_EMAIL || "admin@local.test").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Administrador";

  const existing = await userRepo.findOne({ where: { email } });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log(`Admin já existe: ${email} (id=${existing.id})`);
    await AppDataSource.destroy();
    return;
  }

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



