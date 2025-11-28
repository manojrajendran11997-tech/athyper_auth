// pages/api/auth/set-password.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongoose"; 
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import redis from "../../../lib/redis";
import { sendOTPEmail } from "../../../lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ message: "method_not_allowed" });

    await connectDB();

    const { email, userId, password } = req.body;

    if (!password) return res.status(400).json({ message: "missing_password" });

    // Identify user (either invite or forgot)
    const user = email
      ? await User.findOne({ email: email.toLowerCase() })
      : await User.findById(userId);

    if (!user) return res.status(404).json({ message: "user_not_found" });

    // Save password
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Always send OTP after setting password!
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${user.email}`, otp, { EX: 600 }); // valid 10 min
    await sendOTPEmail(user.email, otp);

    return res.status(200).json({
      ok: true,
      email: user.email,
      message: "Password updated. OTP sent successfully."
    });

  } catch (err:any) {
    console.error("SET PASSWORD ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
}
