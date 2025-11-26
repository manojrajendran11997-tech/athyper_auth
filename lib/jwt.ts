// lib/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_me";
const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "7d";

export function signAccess(payload: Record<string, any>) {
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefresh(payload: Record<string, any>) {
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
