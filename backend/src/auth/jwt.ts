import jwt from "jsonwebtoken";
import { config } from "../config";
import { UserRole } from "../entities/enums";

export type JwtPayload = {
  sub: string;
  role: UserRole;
};

export function signAccessToken(userId: string, role: UserRole) {
  const payload: JwtPayload = { sub: userId, role };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}




