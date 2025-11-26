import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import redis from "../../../lib/redis";
import User from "../../../models/User";
import { connectDB } from "../../../lib/mongoose";
import { sendOTPEmail } from "../../../lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ message: "method_not_allowed" });

    await connectDB();

    const { token, password } = req.body;

    if (!token || !password)
      return res.status(400).json({ message: "missing_fields" });

    // read redis saved email
    const email = await redis.get(`forgot:${token}`);
    if (!email) return res.status(400).json({ message: "invalid_or_expired_token" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "user_not_found" });

    // update password
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    await user.save();

    // delete token
    await redis.del(`forgot:${token}`);

    // Send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${email}`, otp, { EX: 300 });
    await sendOTPEmail(String(email), `Your OTP code is: ${otp}`);
    res.status(200).json({ ok: true, email });
  } catch (err: any) {
    console.error("FORGOT SET PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
}
