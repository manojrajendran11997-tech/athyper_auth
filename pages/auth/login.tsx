"use client";

import { useRouter } from "next/navigation";
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

    if (!r.ok) return setMsg(j.message || "Invalid credentials ❌");

    localStorage.setItem("access-token", j.access);
    localStorage.setItem("refresh-token", j.refresh);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center 
      bg-gradient-to-br from-black via-gray-900 to-gray-800">

      <div className="w-full max-w-md p-10 rounded-2xl shadow-2xl bg-black/30 
        backdrop-blur-xl border border-gray-800 animate-fadeIn text-center">

        {/* 🔥 HIGH RES LOGO (4K/8K scalable) */}
        <img 
          src="/atlas-logo.svg" 
          alt="Atlas Logo"
          className="w-52 mx-auto mb-6 drop-shadow-lg"
        />

        <h1 className="text-3xl font-semibold text-white mb-6">Welcome Back</h1>

        <form onSubmit={submit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white 
              border border-gray-700 focus:border-gray-400 outline-none placeholder-gray-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white 
              border border-gray-700 focus:border-gray-400 outline-none placeholder-gray-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password */}
          <p 
            onClick={() => router.push("/auth/forgot-password")}
            className="text-sm text-gray-400 hover:text-white cursor-pointer text-right"
          >
            Forgot password?
          </p>

          {/* Login Button */}
          <button className="w-full py-3 rounded-xl bg-white text-black font-semibold 
            hover:bg-gray-200 transition shadow-xl">
            Login
          </button>

          {msg && <p className="text-sm text-gray-400">{msg}</p>}

          {/* Create Account */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <span 
              className="text-white cursor-pointer hover:underline"
              onClick={() => router.push("/auth/register")}
            >
              Create account
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}
