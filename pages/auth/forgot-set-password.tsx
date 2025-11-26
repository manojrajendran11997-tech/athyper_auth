import { useRouter } from "next/router";
import { useState } from "react";

export default function ForgotSetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: any) {
    e.preventDefault();

    if (password.length < 6) return setMsg("Password must be at least 6 characters");
    if (password !== confirm) return setMsg("Passwords do not match");

    setMsg("Updating...");

    const r = await fetch("/api/auth/forgot-set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });

    const j = await r.json();
    if (!r.ok) return setMsg(j.message);

    router.push(`/auth/forgot-verify-otp?email=${j.email}`);
  }

  /* Password Strength UI calculation */
  const strength = 
      password.length > 10 ? "strong" :
      password.length > 6  ? "medium" : "weak";

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form onSubmit={submit} className="auth-card space-y-7">

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-[26px] font-semibold">Set New Password 🔐</h1>
          <p className="text-[14px] text-gray-400">
            Secure your account with a fresh new password
          </p>
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm text-gray-300">New Password</label>
          <input
            type="password"
            className="input mt-1"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Strength bar */}
          <div className="h-2 mt-2 rounded-full transition-all"
            style={{
              width: strength === "strong" ? "100%" : strength === "medium" ? "60%" : "30%",
              background: strength === "strong" ? "#00e676" : strength === "medium" ? "#ffeb3b" : "#ff5252"
            }}
          ></div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-gray-300">Confirm Password</label>
          <input
            type="password"
            className="input mt-1"
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <button className="btn-primary hover:scale-[1.02] active:scale-[0.98]">
          Update Password
        </button>

        {/* Response text */}
        <p className="text-center text-xs opacity-80">{msg}</p>
      </form>
    </div>
  );
}
