import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ForgotVerifyOTP() {
  const router = useRouter();
  const { email } = router.query;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [msg, setMsg] = useState("");
  const [time, setTime] = useState(900); // 15 minutes = 900 sec
  const [resendAvailable, setResendAvailable] = useState(false);

  // Countdown
  useEffect(() => {
    if (time <= 0) return setResendAvailable(true);
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time]);

  // Format MM:SS
  const format = (s:number) =>
    `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // OTP input change
  function updateOtp(index:number, value:string) {
    if (!/^[0-9]*$/.test(value)) return; // only numbers
    const next=[...otp];
    next[index]=value;
    setOtp(next);

    if(value && index<5){
      const nextBox=document.getElementById(`otp-${index+1}`) as HTMLInputElement;
      nextBox?.focus();
    }
  }

  async function submit(e:any){
    e.preventDefault();
    const code=otp.join("");
    if(code.length<6) return setMsg("Enter complete OTP");

    setMsg("Verifying...");

    const r=await fetch("/api/auth/forgot-verify-otp",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ email, otp:code })
    });

    const j=await r.json();
    if(!r.ok) return setMsg(j.message);

    router.push("/auth/login");
  }

  async function resendOtp(){
    if(!resendAvailable) return;
    setMsg("Sending OTP...");
    await fetch("/api/auth/forgot-password",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ email })
    });
    setTime(900);
    setResendAvailable(false);
    setMsg("OTP resent to email");
  }

  return (
    <div className="auth-bg flex justify-center items-center min-h-screen p-4">
      <form onSubmit={submit} 
        className="auth-card animate-fadeIn p-10 w-[420px] space-y-8 text-center shadow-2xl">

        <h1 className="text-3xl font-semibold">Verify OTP</h1>
        <p className="text-gray-300 text-sm leading-relaxed -mt-3">
          Enter the 6-digit code sent to<br/>
          <span className="text-white font-medium">{email}</span>
        </p>

        {/* OTP BOXES */}
        <div className="flex justify-between gap-2">
          {otp.map((d,i)=>(
            <input key={i} id={`otp-${i}`}
              value={d}
              onChange={e=>updateOtp(i,e.target.value)}
              maxLength={1}
              className="w-12 h-12 text-center text-lg font-semibold rounded-lg bg-[#0E1014] border border-[#2B2B2B]
              focus:border-white focus:shadow-[0_0_8px_rgba(255,255,255,0.6)] outline-none
              transition-all duration-200"
            />
          ))}
        </div>

        <button className="btn-primary py-3 text-[15px] font-semibold shadow hover:scale-[1.02]">
          Verify OTP
        </button>

        {/* TIMER + RESEND */}
        <div className="text-sm pt-2 text-gray-300">
          {resendAvailable ? (
            <span onClick={resendOtp} className="text-white underline cursor-pointer">
              Resend OTP
            </span>
          ) : (
            <>OTP expires in <span className="text-white font-medium">{format(time)}</span></>
          )}
        </div>

        <p className="text-xs opacity-75">{msg}</p>
      </form>
    </div>
  );
}
