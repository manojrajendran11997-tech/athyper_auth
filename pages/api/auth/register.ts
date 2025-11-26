// pages/api/auth/register.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongoose";
import User from "../../../models/User";
import { generateMagicToken } from "../../../lib/magic";
import { sendMagicLinkEmail } from "../../../lib/email";
import redis from "../../../lib/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "method_not_allowed" });
    }

    await connectDB();

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email_required" });
    }

    const emailLC = email.toLowerCase().trim();

    // ⭐ ADDED: confirm email dynamically
    console.log("📩 Register request for:", emailLC); 

    // existing user?
    const existing = await User.findOne({ email: emailLC });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user
    const user = await User.create({
      email: emailLC,
      invited: false,
      twoFactorEnabled: false
    });

    // generate magic token
    const token = generateMagicToken(user._id.toString());

    // store token in redis - Redis v4 syntax
    await redis.set(`magic:${token}`, user._id.toString(), { EX: 900 });

    // magic link
    const link = `${process.env.APP_URL}/magic?token=${token}`;

    // send email to **different email ID every time**
    await sendMagicLinkEmail(emailLC, link); // ⬅ works dynamically

    return res.status(200).json({ ok: true, message: "Magic link sent." });

  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
}
