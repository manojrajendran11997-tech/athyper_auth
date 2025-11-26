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
      body: JSON.stringify({ email, password }),
    });

    const j = await r.json();

    if (!r.ok) {
      setMsg(j.message || "Invalid email or password");
      return;
    }

    localStorage.setItem("access-token", j.access);
    localStorage.setItem("refresh-token", j.refresh);

    setMsg("Login successful! Redirecting...");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center px-4">
      <div className="max-w-5xl w-full bg-white shadow-xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src="/illustrations/login-dark.svg"
            alt="Login Illustration"
            className="w-3/4 opacity-90"
          />
        </div>

        {/* RIGHT Login Panel */}
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-6">Please login to your account</p>

          <form onSubmit={submit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full py-3 px-4 rounded-lg border border-gray-300 outline-none focus:border-gray-600 transition-all bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full py-3 px-4 rounded-lg border border-gray-300 outline-none focus:border-gray-600 transition-all bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <p
              className="text-sm text-gray-600 hover:text-black cursor-pointer transition"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Forgot password?
            </p>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-red-500 mt-3">{msg}</p>

          <p className="text-sm text-gray-600 mt-5">
            Don’t have an account?
            <span
              className="text-black font-medium cursor-pointer ml-1 hover:underline"
              onClick={() => router.push("/auth/register")}
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
