import React, { useState } from "react";

export default function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setMsg("Processing...");

    if (mode === "register") {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const j = await r.json();
      setMsg(j.message);
      return;
    }

    // Login mode (optional)
  }

  return (
    <div className="max-w-sm mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">{mode === "register" ? "Register" : "Login"}</h2>

      <form onSubmit={submit}>
        <label>Email</label>
        <input
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {mode === "login" && (
          <>
            <label>Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          {mode === "register" ? "Send Magic Link" : "Login"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-3">{msg}</p>
    </div>
  );
}
