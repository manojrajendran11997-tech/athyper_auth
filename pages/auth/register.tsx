import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setMsg("Sending...");

    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const j = await r.json();
    if (!r.ok) return setMsg(j.error || "Something went wrong ❌");

    setMsg("✨ Magic link sent — Check your email!");
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form onSubmit={submit} className="auth-card animate-fadeIn w-[420px]">
        
        <h2 className="text-2xl font-semibold text-center mb-2">
          Create an Account
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          We will send you a login magic link
        </p>

        <input
          type="email"
          className="input mb-4"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn-primary mb-2">Send Magic Link</button>

        <p className="text-sm text-center text-gray-400 mt-2">{msg}</p>
      </form>
    </div>
  );
}
