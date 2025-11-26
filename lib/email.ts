import nodemailer from "nodemailer";

const HOST = process.env.EMAIL_HOST;
const PORT = Number(process.env.EMAIL_PORT || 587);
const USER = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;
const FROM = process.env.EMAIL_FROM || USER;

if (!HOST || !USER || !PASS) {
  console.warn("⚠ SMTP ENV MISSING — Email sending will fail!");
}

// reusable SMTP transport
const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  auth: { user: USER, pass: PASS },
});

function sendEmailBackground(to: string, subject: string, html: string) {
  (async () => {
    try {
      const res = await transporter.sendMail({ from: FROM, to, subject, html });
      console.log("📩 Email sent to:", res.accepted); // <— SUCCESS LOG
    } catch (err) {
      console.error("❌ Email send failed:", err); // <— DEBUG ERROR IF ANY
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
