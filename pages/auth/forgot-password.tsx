import { useState } from "react";
import { useRouter } from "next/router";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e:any){
    e.preventDefault();
    setMsg("Sending...");

    const r = await fetch("/api/auth/forgot-password",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({email})
    });

    const j = await r.json();
    setMsg(j.message);
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={submit} className="auth-card text-center space-y-5">

        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <p className="text-sm text-gray-300">Enter your email to receive reset link</p>

        <input
          className="input"
          placeholder="Email address"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />

        <button className="btn-primary">Send Reset Link</button>

        <p className="text-xs text-gray-300">
          Remember password?
          <span className="link ml-1" onClick={()=>router.push('/auth/login')}>
            Login
          </span>
        </p>

        {msg && <p className="text-xs opacity-80">{msg}</p>}
      </form>
    </div>
  );
}