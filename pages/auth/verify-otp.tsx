import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = router.query;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [msg, setMsg] = useState("");
  const [timer, setTimer] = useState(900); // 15 min countdown

  // Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;

  async function submit(e: any) {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) return setMsg("Enter full 6-digit OTP ❗");

    setMsg("Verifying OTP...");

    const r = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, otp: code })
    });

    const j = await r.json();
    if (!r.ok) return setMsg(j.message || "Invalid OTP ❌");

    setMsg("OTP verified ✓ Redirecting...");
    router.push("/dashboard");
  }

  function handleInput(value: string, index: number) {
    if (/^[0-9]?$/.test(value)) {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);

      if (value && index < 5) {
        (document.getElementById(`otp-${index + 1}`) as HTMLElement)?.focus();
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] px-4">
      <div className="w-[450px] p-10 rounded-2xl shadow-lg bg-[#121826] border border-white/10 backdrop-blur-md animate-fadeIn">

        <h1 className="text-3xl font-semibold text-center text-white mb-4">Verify OTP</h1>
        <p className="text-gray-400 text-center mb-6">
          Enter the 6-digit code sent to <br />
          <span className="text-white font-medium">{email}</span>
        </p>

        {/* OTP Input Boxes */}
        <form onSubmit={submit}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(e.target.value, i)}
                className="w-12 h-12 rounded-md text-center text-xl text-white bg-[#1B2334] 
                          border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ))}
          </div>

          <button className="w-full bg-white text-black font-semibold py-3 rounded-md hover:opacity-90 transition">
            Verify OTP
          </button>

          {msg && <p className="text-center text-gray-300 text-sm mt-4">{msg}</p>}

          {/* Timer */}
          <p className="text-center text-gray-300 text-sm mt-4">
            OTP expires in <span className="font-semibold text-white">{formattedTime}</span>
          </p>
        </form>

      </div>
    </div>
  );
}
