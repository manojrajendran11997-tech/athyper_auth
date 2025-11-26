import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongoose";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import redis from "../../../lib/redis";
import { signAccess, signRefresh } from "../../../lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ message: "method_not_allowed" });

    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email_and_password_required" });
    }

    const emailLC = email.toLowerCase().trim();

    const user = await User.findOne({ email: emailLC });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password || "");
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const payload = { sub: user._id.toString(), email: user.email };

    const access = signAccess(payload);
    const refresh = signRefresh(payload);

    await redis.set(`refresh:${user._id}`, refresh, {
      EX: Number(process.env.REFRESH_TTL_SECONDS || 604800)
    });

    return res.status(200).json({ access, refresh });

  } catch (err: any) {
    console.error("LOGIN API ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
}
