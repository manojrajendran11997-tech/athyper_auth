import { useRouter } from "next/router";
import { useState } from "react";

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = router.query;

  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setMsg("Verifying OTP...");

    const r = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const j = await r.json();

    if (!r.ok) return setMsg(j.message || "Invalid OTP ❌");

    setMsg("OTP verified ✓ Redirecting...");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form onSubmit={submit} className="auth-card animate-fadeIn w-[420px]">

        <h2 className="text-2xl font-semibold text-center mb-2">Enter OTP 🔐</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          OTP has been sent to <span className="text-white font-medium">{email}</span>
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input mb-4 text-center tracking-widest text-lg"
          placeholder="•••••"
        />

        <button className="btn-primary mb-3">Verify OTP</button>

        <p className="text-center text-sm opacity-70">{msg}</p>
      </form>
    </div>
  );
}
