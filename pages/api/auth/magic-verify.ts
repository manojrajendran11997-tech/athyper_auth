import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongoose";
import { verifyMagicToken } from "../../../lib/magic";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "token required" });

    await connectDB();

    let decoded;
    try {
      decoded = verifyMagicToken(String(token));
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      ok: true,
      userId: user._id.toString(),
      email: user.email,
    });

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}
