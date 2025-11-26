import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MagicPage() {
  const router = useRouter();
  const { token } = router.query;
  const [msg, setMsg] = useState("Verifying magic link...");

  useEffect(() => {
    if (!token) return;

    async function verify() {
      const r = await fetch(`/api/auth/magic-verify?token=${token}`);
      const j = await r.json();

      if (!r.ok) {
        setMsg(j.message || "Invalid / expired magic link ❌");
        return;
      }
      setMsg("Magic link verified ✔ Redirecting...");
      setTimeout(() => router.push(`/auth/set-password?userId=${j.userId}`), 1200);
    }

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="auth-card animate-fadeIn w-[380px] text-center">
        <h1 className="text-2xl font-semibold mb-4">Magic Link Verification</h1>
        <p className="text-gray-300 text-sm">{msg}</p>
      </div>
    </div>
  );
}
