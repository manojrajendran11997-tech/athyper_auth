import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongoose"; 
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import redis from "../../../lib/redis";
import { sendOTPEmail } from "../../../lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "method_not_allowed" });
    }

    await connectDB();

    // Accept email for forgot flow (or userId for invite flow)
    const { email, userId, password, flow } = req.body;

    if (!password) {
      return res.status(400).json({ message: "missing_fields" });
    }

    // Forgot-password: use email
    let user;
    if (flow === "forgot") {
      if (!email) return res.status(400).json({ message: "missing_fields" });
      user = await User.findOne({ email: String(email).toLowerCase() });
    } else {
      // Invite / other flows: support userId if provided
      if (!userId) return res.status(400).json({ message: "missing_fields" });
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: "user_not_found" });
    }

    // Save new password
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    await user.save();

    // If this is forgot flow, optionally send OTP to confirm change
    // You said you wanted OTP after set-password — we'll generate and send it here.
    if (flow === "forgot") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await redis.set(`otp:${user.email}`, otp, { EX: 600 }); // 10 minutes
      await sendOTPEmail(user.email, otp);
      return res.status(200).json({
        ok: true,
        message: "Password updated. OTP sent to email.",
        email: user.email
      });
    }

    // For invite flow we might do different behaviour (not covered here)
    return res.status(200).json({ ok: true, message: "Password updated successfully." });

  } catch (err: any) {
    console.error("SET PASSWORD ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
}
