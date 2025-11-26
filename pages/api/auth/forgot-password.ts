// pages/api/auth/forgot-password.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongoose";
import User from "../../../models/User";
import { sendOTPEmail } from "../../../lib/email";
import crypto from "crypto";
import redis from "../../../lib/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "method_not_allowed" });

  try {
    await connectDB();

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "email_required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "user_not_found" });

    // Create token
    const token = crypto.randomBytes(20).toString("hex");

    // Save email → token for 10 minutes
    await redis.set(`forgot:${token}`, user.email, { EX: 600 });

    // Base URL from .env.local
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      return res.status(500).json({ message: "BASE_URL_not_set" });
    }

    // Final correct link
    const link = `${baseUrl}/auth/forgot-set-password?token=${token}`;

    // Send reset email
    await sendOTPEmail(
      user.email,
      `Click the link below to reset your password:\n\n${link}`
    );

    return res.json({
      ok: true,
      message: "reset_link_sent",
    });

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}
