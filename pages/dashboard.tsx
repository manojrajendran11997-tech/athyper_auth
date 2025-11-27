// pages/dashboard.tsx
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

function getSessionFromCookie(rawCookie: string | undefined): string | null {
  if (!rawCookie) return null;

  const parts = rawCookie.split(";");
  for (const part of parts) {
    const [key, ...rest] = part.trim().split("=");
    if (key === "session_token") {
      return decodeURIComponent(rest.join("=") || "");
    }
  }
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = getSessionFromCookie(req.headers.cookie);

  if (!token) {
    // ⛔ No session → redirect to login BEFORE rendering dashboard
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default function Dashboard() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      // client redirect after cookie is cleared on server
      router.replace("/auth/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 border-r border-white/10 backdrop-blur-md p-6">
        <h2 className="text-xl font-bold mb-6">📊 Dashboard</h2>
        <ul className="space-y-4 text-gray-300">
          <li className="hover:text-white cursor-pointer">Home</li>
          <li className="hover:text-white cursor-pointer">Analytics</li>
          <li className="hover:text-white cursor-pointer">Users</li>
          <li className="hover:text-white cursor-pointer">Settings</li>
          <li
            onClick={handleLogout}
            className="text-red-400 font-semibold cursor-pointer hover:text-red-500"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-6">Welcome back 👋</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-white/10 border border-white/10 shadow-lg hover:scale-[1.02] transition">
            <p className="text-sm text-gray-300">Total Users</p>
            <h2 className="text-3xl font-bold mt-2">2,430</h2>
          </div>

          <div className="p-6 rounded-lg bg-white/10 border border-white/10 shadow-lg hover:scale-[1.02] transition">
            <p className="text-sm text-gray-300">Monthly Revenue</p>
            <h2 className="text-3xl font-bold mt-2">$12,850</h2>
          </div>

          <div className="p-6 rounded-lg bg-white/10 border border-white/10 shadow-lg hover:scale:[1.02] transition">
            <p className="text-sm text-gray-300">Active Sessions</p>
            <h2 className="text-3xl font-bold mt-2">183</h2>
          </div>
        </div>

        <div className="mt-10 bg-white/10 p-6 rounded-xl border border-white/10 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">📅 Recent Activity</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="border-b border-white/10 pb-2">New user registered - 2m ago</li>
            <li className="border-b border-white/10 pb-2">Payment received - ₹5,200 - 45m ago</li>
            <li className="border-b border-white/10 pb-2">Account password changed - 1h ago</li>
            <li>Server backup completed - 3h ago</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
