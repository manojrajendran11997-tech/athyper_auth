// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import { connectDB } from "../../../lib/mongoose";
import { setCookie } from "cookies-next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message:"method_not_allowed" });

    await connectDB();

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message:"user_not_found" });

    const validPass = await bcrypt.compare(password, user.password || "");
    if (!validPass) return res.status(400).json({ message:"wrong_password" });

    // 🔥 Set login session cookie (the missing part in your setup)
    setCookie("session_token", user._id.toString(), {
      req, res, maxAge: 60*60*24*7, path:"/"
    });

    return res.status(200).json({ ok:true, message:"login_success" });

  } catch (err:any) {
    return res.status(500).json({ message:err.message });
  }
}
