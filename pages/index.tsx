import React from "react";
import Link from "next/link";
import AuthForm from "../components/AuthForm";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div>
        <AuthForm mode="login" />
        <div className="text-center mt-4">
          <Link href="/register" className="text-blue-600">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
