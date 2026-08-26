"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Sparkles, ArrowLeft, Mail } from "lucide-react";


const translations = {
  ka: {
    title: "პაროლის აღდგენა",
    subtitle: "შეიყვანეთ ელ-ფოსტის მისამართი და ჩვენ გამოგიგზავნით პაროლის აღდგენის ბმულს.",
    emailLabel: "ელ-ფოსტა",
    submitBtn: "ბმულის გაგზავნა",
    sendingBtn: "იგზავნება...",
    checkEmailTitle: "შეამოწმეთ ელ-ფოსტა",
    checkEmailDesc: "პაროლის აღდგენის ბმული გაიგზავნა მისამართზე:",
    resendOrChange: "ხელახლა გაგზავნა ან მეილის შეცვლა",
    rememberPassword: "გახსოვთ პაროლი?",
    loginLink: "შესვლა",
    backToLogin: "ავტორიზაციაზე დაბრუნება",
  },
  en: {
    title: "Reset Password",
    subtitle: "Enter your email address and we'll send you a link to reset your password.",
    emailLabel: "Email Address",
    submitBtn: "Send Reset Link",
    sendingBtn: "Sending...",
    checkEmailTitle: "Check your email",
    checkEmailDesc: "We have sent a password reset link to:",
    resendOrChange: "Resend link or change email",
    rememberPassword: "Remember your password?",
    loginLink: "Login",
    backToLogin: "Back to Login",
  },
};


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
  const [lang, setLang] = useState<"ka" | "en">("ka");
  const t = translations[lang];

  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "შეცდომა მეილის გაგზავნისას");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/30 p-4 text-slate-800">
      {/* ენის გადამრთველი ღილაკი */}
      <div className="absolute top-6 right-6 z-20 flex gap-1 rounded-full border border-gray-200 bg-white/80 p-1 shadow-sm backdrop-blur-md">
        <button
          onClick={() => setLang("ka")}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
            lang === "ka"
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          GE
        </button>
        <button
          onClick={() => setLang("en")}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
            lang === "en"
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          EN
        </button>
      </div>

      {/* ფონური დეკორაციები */}
      <div className="absolute top-10 left-10 h-28 w-28 rounded-full bg-emerald-200/40 blur-xl" />
      <div className="absolute bottom-12 right-10 h-32 w-32 rounded-full bg-purple-200/40 blur-xl" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-xl backdrop-blur-md sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">{t.title}</h1>
          <p className="mt-1 text-xs text-gray-500">{t.subtitle}</p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {!submitted ? (
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                {t.emailLabel}
              </label>
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
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? t.sendingBtn : t.submitBtn}
            </button>
          </form>
        ) : (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Mail size={24} />
            </div>
            <h3 className="text-sm font-bold text-emerald-900">
              {t.checkEmailTitle}
            </h3>
            <p className="mt-1 text-xs text-emerald-700">
              {t.checkEmailDesc} <br />
              <span className="font-semibold text-slate-800">{email}</span>
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-xs font-bold text-emerald-600 hover:underline"
            >
              {t.resendOrChange}
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          {t.rememberPassword}{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-600 hover:underline"
          >
            {t.loginLink}
          </Link>
        </div>
      </div>

      <Link
        href="/login"
        className="mt-6 flex items-center gap-2 text-xs font-semibold text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft size={14} /> {t.backToLogin}
      </Link>
    </main>
  );
}