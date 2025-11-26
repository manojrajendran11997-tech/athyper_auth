import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../lib/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ message: "method_not_allowed" });

    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "missing_fields" });

    const saved = await redis.get(`otp:${email}`);
    if (!saved) return res.status(400).json({ message: "otp_expired" });

    if (saved !== otp) return res.status(400).json({ message: "invalid_otp" });

    await redis.del(`otp:${email}`);

    res.status(200).json({ ok: true, message: "verified" });
  } catch (err: any) {
    console.error("FORGOT VERIFY OTP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
}
