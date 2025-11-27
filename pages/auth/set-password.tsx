import { useRouter } from "next/router";
import { useState } from "react";

export default function SetPasswordPage() {
  const router = useRouter();
  const { userId } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: any) {
    e.preventDefault();

    if (!userId) return setMsg("Invalid or missing user ID");
    if (!password || !confirm) return setMsg("Both fields required ❗");
    if (password !== confirm) return setMsg("Passwords do not match ❗");

    setMsg("Saving...");

    const r = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password })
    });

    const j = await r.json();

    if (!r.ok) return setMsg(j.message || "Failed to set password ❌");

    setMsg("Password saved ✓ Redirecting...");
    router.push(`/auth/verify-otp?email=${j.email}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] px-4">
      <div className="w-[430px] p-10 rounded-2xl shadow-lg bg-[#121826] border border-white/10 backdrop-blur-md animate-fadeIn">

        <h2 className="text-2xl font-semibold text-center text-white mb-2">
          Set New Password 🔐
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Secure your account with a fresh new password
        </p>

        <label className="text-sm text-gray-300 font-medium">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full px-4 py-3 rounded-md bg-[#1B2334] text-white outline-none mt-1 
                     focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="text-sm text-gray-300 font-medium">Confirm Password</label>
        <input
          type="password"
          placeholder="Re-enter password"
          className="w-full px-4 py-3 rounded-md bg-[#1B2334] text-white outline-none mt-1 
                     focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-blue-500 mb-6"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button className="w-full bg-white text-black font-semibold py-3 rounded-md hover:opacity-90 transition">
          Update Password
        </button>

        {msg && <p className="text-center text-gray-300 text-sm mt-4">{msg}</p>}
      </div>
    </div>
  );
}
