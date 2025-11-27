import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setMsg("Processing...");

    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const j = await r.json();

    if (!r.ok) {
      setMsg(j.message || "Login failed");
      return;
    }

    // save tokens
    localStorage.setItem("access-token", j.access);
    localStorage.setItem("refresh-token", j.refresh);

    setMsg("Login successful! Redirecting...");

    // redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="p-6 border rounded w-96">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-600 text-white w-full p-2 rounded">
          Login
        </button>

        <p className="text-sm mt-2">{msg}</p>
      </form>
    </div>
  );
}
