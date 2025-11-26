import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongoose";
import User from "../../../models/User";
import redis from "../../../lib/redis";
import { signAccess, signRefresh } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "method_not_allowed" });

    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "email_and_otp_required" });

    await connectDB();

    const emailLC = email.toLowerCase();

    const stored = await redis.get(`otp:${emailLC}`);
    if (!stored) return res.status(400).json({ message: "OTP expired" });
    if (stored !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOne({ email: emailLC });
    if (!user) return res.status(404).json({ message: "User not found" });

    await redis.del(`otp:${emailLC}`);

    const payload = { sub: user._id.toString(), email: user.email };
    const access = signAccess(payload);
    const refresh = signRefresh(payload);

    await redis.set(`refresh:${user._id}`, refresh, { EX: 604800 }); // 7 days

    return res.status(200).json({ access, refresh });

  } catch (err: any) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
}
