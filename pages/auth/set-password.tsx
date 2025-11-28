// pages/auth/set-password.tsx

import { useRouter } from "next/router";
import { useState } from "react";

export default function SetPasswordPage() {
  const router = useRouter();
  const { userId, email } = router.query; // <--- important if email is passed

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setMsg("Saving...");

    // Must include email OR userId based on flow
    const payload: any = { password };

    if (email) payload.email = email; // Forgot password flow
    if (userId) payload.userId = userId; // Invite link flow

    const res = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) return setMsg(data.message || "Failed to set password ❌");

    setMsg("Password saved ✓ Sending OTP...");

    // 🔥 redirect with returned email
    router.push(`/auth/verify-otp?email=${data.email}`);
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form onSubmit={submit} className="auth-card animate-fadeIn w-[420px]">
        
        <h2 className="text-2xl font-semibold text-center mb-2">Set Password 🔐</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Create your secure login password
        </p>

        <input
          type="password"
          placeholder="Enter new password"
          className="input mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-primary mb-3">Save Password</button>
        <p className="text-center text-sm opacity-70">{msg}</p>
      </form>
    </div>
  );
}
