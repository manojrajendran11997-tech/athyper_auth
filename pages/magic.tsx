import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MagicPage() {
  const router = useRouter();
  const { token } = router.query;
  const [msg, setMsg] = useState("Verifying...");

  useEffect(() => {
    if (!token) return;

    async function verify() {
      const r = await fetch(`/api/auth/magic-verify?token=${token}`);
      const j = await r.json();

      if (!r.ok) {
        setMsg(j.message || "Invalid link");
        return;
      }

      // redirect to set-password with userId
      router.push(`/auth/set-password?userId=${j.userId}`);
    }

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>{msg}</p>
    </div>
  );
}
