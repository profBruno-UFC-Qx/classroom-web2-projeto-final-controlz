import * as dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

// Converte variavel de ambiente para inteiro com fallback seguro
function envInt(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  // Porta do servidor HTTP
  port: envInt("PORT", 3333),
  // Segredo e expiracao do JWT usados na autenticacao
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ||
    "1d") as SignOptions["expiresIn"],
};
