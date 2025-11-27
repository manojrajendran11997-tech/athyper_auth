// pages/api/auth/logout.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "method_not_allowed" });
  }

  // 🔑 This must match the cookie name you set in login API
  const cookie = serialize("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // delete cookie
  });

  res.setHeader("Set-Cookie", cookie);

  return res.status(200).json({ ok: true, message: "logged_out" });
}
