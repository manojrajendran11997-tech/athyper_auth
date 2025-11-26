// lib/email.ts
const RESEND_URL = "https://api.resend.com/emails";
const API_KEY = process.env.EMAIL_API_KEY || process.env.EMAIL_PASS; // support both env names
const FROM = process.env.EMAIL_FROM || "no-reply@example.com";

if (!API_KEY) {
  console.warn("EMAIL API KEY missing - emails will fail");
}

function sendEmailBackground(to: string, subject: string, html: string) {
  // fire-and-forget: schedule async send
  (async () => {
    try {
      await fetch(RESEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM,
          to,
          subject,
          html,
        }),
      });
    } catch (err) {
      console.error("Failed to send email (background):", err);
    }
  })();
}

export function sendMagicLinkEmail(to: string, magicUrl: string) {
  const html = `<p>Click to continue: <a href="${magicUrl}">${magicUrl}</a></p>
    <p>Link expires in ${Number(process.env.MAGIC_TTL || 900) / 60} minutes.</p>`;
  sendEmailBackground(to, "Your sign-in link", html);
}

export function sendOTPEmail(to: string, otp: string) {
  const html = `<p>Your OTP code: <strong>${otp}</strong></p>
    <p>It will expire in ${Number(process.env.OTP_TTL || 300) / 60} minutes.</p>`;
  sendEmailBackground(to, "Your verification code", html);
}
