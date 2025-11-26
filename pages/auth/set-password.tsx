// pages/auth/set-password.tsx

import { useRouter } from "next/router";
import { useState } from "react";

export default function SetPasswordPage() {
  const router = useRouter();
  const { userId } = router.query;

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: any) {
    e.preventDefault();

    if (!userId) {
      setMsg("Invalid or missing user ID");
      return;
    }

    setMsg("Saving...");

    const r = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, password })
    });

    const j = await r.json();

    if (!r.ok) return setMsg(j.message || "Failed to set password ❌");

    setMsg("Password saved ✓ Redirecting...");

    router.push(`/auth/verify-otp?email=${j.email}`);
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form onSubmit={submit} className="auth-card animate-fadeIn w-[420px]">
        
        <h2 className="text-2xl font-semibold text-center mb-2">
          Set your Password 🔐
        </h2>
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
