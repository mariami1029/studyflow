"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Sparkles } from "lucide-react";


const translations = {
  ka: {
    title: "ანგარიშის შექმნა",
    subtitle: "შემოუერთდი StudyFlow-ს და მოაწესრიგე შენი აკადემიური ცხოვრება",
    fullNameLabel: "სრული სახელი",
    emailLabel: "ელ-ფოსტა",
    passwordLabel: "პაროლი",
    confirmPasswordLabel: "დაადასტურეთ პაროლი",
    show: "ჩვენება",
    hide: "დამალვა",
    passMustContain: "პაროლი უნდა შეიცავდეს:",
    ruleMinLength: "სულ მცირე 8 სიმბოლო",
    ruleUpperLower: "დიდ და პატარა ასოებს",
    ruleNumSymbol: "სულ მცირე 1 ციფრსა და 1 სიმბოლოს",
    ruleLatin: "მხოლოდ ლათინურ ასოებს",
    submitBtn: "ანგარიშის შექმნა",
    loadingBtn: "ანგარიში იქმნება...",
    alreadyHaveAccount: "უკვე გაქვს ანგარიში?",
    loginLink: "შესვლა",
    backHome: "← მთავარ გვერდზე დაბრუნება",
    errPasswordMismatch: "პაროლები ერთმანეთს არ ემთხვევა",
    errGeneral: "შეცდომა რეგისტრაციისას",
  },
  en: {
    title: "Create Account",
    subtitle: "Join StudyFlow and organize your academic life",
    fullNameLabel: "Full Name",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    show: "Show",
    hide: "Hide",
    passMustContain: "Password must contain:",
    ruleMinLength: "At least 8 characters",
    ruleUpperLower: "Uppercase and lowercase letters",
    ruleNumSymbol: "At least 1 number and 1 symbol",
    ruleLatin: "Only Latin characters",
    submitBtn: "Create Account",
    loadingBtn: "Creating Account...",
    alreadyHaveAccount: "Already have an account?",
    loginLink: "Login",
    backHome: "← Back to Home",
    errPasswordMismatch: "Passwords do not match",
    errGeneral: "Registration failed",
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

export default function RegisterPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"ka" | "en">("ka");
  const t = translations[lang];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberAndSymbol = /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password);
  const isOnlyLatin =
    password.length > 0 &&
    /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t.errPasswordMismatch);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://studyflow-backend-wrat.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || t.errGeneral);
      }

      try {
        const mailRes = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            fullName: fullName,
          }),
        });

        const mailData = await mailRes.json();
        if (!mailRes.ok) {
          console.error("Email Error:", mailData);
        }
      } catch (e) {
        console.error("Email Fetch Error:", e);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || t.errGeneral);
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
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-semibold text-rose-600">
            {error}
          </div>
        )}

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              {t.fullNameLabel}
            </label>
            <input
              name="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              {t.emailLabel}
            </label>
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              {t.passwordLabel}
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 pr-10 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600"
              >
                {showPassword ? t.hide : t.show}
              </button>
            </div>

            <div className="mt-2.5 flex flex-col gap-1.5 rounded-xl bg-gray-50 p-3 text-xs">
              <p className="mb-0.5 font-semibold text-gray-500">
                {t.passMustContain}
              </p>

              <div
                className={`flex items-center gap-2 transition-colors ${
                  hasMinLength ? "font-medium text-emerald-600" : "text-gray-400"
                }`}
              >
                <span>{hasMinLength ? "✓" : "○"}</span>
                <span>{t.ruleMinLength}</span>
              </div>

              <div
                className={`flex items-center gap-2 transition-colors ${
                  hasUpperAndLower ? "font-medium text-emerald-600" : "text-gray-400"
                }`}
              >
                <span>{hasUpperAndLower ? "✓" : "○"}</span>
                <span>{t.ruleUpperLower}</span>
              </div>

              <div
                className={`flex items-center gap-2 transition-colors ${
                  hasNumberAndSymbol ? "font-medium text-emerald-600" : "text-gray-400"
                }`}
              >
                <span>{hasNumberAndSymbol ? "✓" : "○"}</span>
                <span>{t.ruleNumSymbol}</span>
              </div>

              <div
                className={`flex items-center gap-2 transition-colors ${
                  isOnlyLatin ? "font-medium text-emerald-600" : "text-gray-400"
                }`}
              >
                <span>{isOnlyLatin ? "✓" : "○"}</span>
                <span>{t.ruleLatin}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              {t.confirmPasswordLabel}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 pr-10 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? t.hide : t.show}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? t.loadingBtn : t.submitBtn}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          {t.alreadyHaveAccount}{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-600 hover:underline"
          >
            {t.loginLink}
          </Link>
        </div>
      </div>

      <Link
        href="/"
        className="mt-6 text-xs font-semibold text-gray-500 transition-colors hover:text-gray-700"
      >
        {t.backHome}
      </Link>
    </main>
  );
}