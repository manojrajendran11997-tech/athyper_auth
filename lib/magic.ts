import jwt from "jsonwebtoken";

export function generateMagicToken(userId: string) {
  return jwt.sign(
    { userId },
    process.env.MAGIC_LINK_SECRET!,
    { expiresIn: process.env.MAGIC_LINK_EXPIRES_IN || "15m" }
  );
}

export function verifyMagicToken(token: string) {
  return jwt.verify(token, process.env.MAGIC_LINK_SECRET!);
}
