"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Sparkles, ArrowLeft, Mail } from "lucide-react";

// CSS ლოგოს კომპონენტი
function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  };

  const iconSizes = {
    sm: 24,
    md: 38,
    lg: 52,
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-purple-500/20 transition-transform hover:scale-105 ${sizeClasses[size]}`}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-white">
        <GraduationCap size={iconSizes[size]} className="text-emerald-400" />
      </div>

      <div className="absolute -top-1 -right-1 rounded-full bg-emerald-400 p-1 text-slate-900 shadow-sm">
        <Sparkles size={size === "sm" ? 10 : size === "md" ? 14 : 18} />
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/30 p-4 text-slate-800">
      {/* ფონური დეკორაციები */}
      <div className="absolute top-10 left-10 h-28 w-28 rounded-full bg-emerald-200/40 blur-xl" />
      <div className="absolute bottom-12 right-10 h-32 w-32 rounded-full bg-purple-200/40 blur-xl" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-xl backdrop-blur-md sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">Reset Password</h1>
          <p className="mt-1 text-xs text-gray-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!submitted ? (
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 active:scale-[0.99]"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="mt-6 flex flex-col items-center text-center rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Mail size={24} />
            </div>
            <h3 className="text-sm font-bold text-emerald-900">Check your email</h3>
            <p className="mt-1 text-xs text-emerald-700">
              We have sent a password reset link to <br />
              <span className="font-semibold text-slate-800">{email}</span>
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-xs font-bold text-emerald-600 hover:underline"
            >
              Resend link or change email
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          Remember your password?{" "}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Login
          </Link>
        </div>
      </div>

      <Link href="/login" className="mt-6 flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft size={14} /> Back to Login
      </Link>
    </main>
  );
}