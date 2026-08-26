"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";

// თარგმანების ობიექტი
const translations = {
  ka: {
    heroTitle1: "დააორგანიზეთ",
    heroTitle2: "სტუდენტური ცხოვრება",
    heroTitle3: "StudyFlow-სთან ერთად",
    description: "მართეთ საგნები, დავალებები, გამოცდები და ადევნეთ თვალი თქვენს აკადემიურ პროგრესს ერთ სივრცეში.",
    registerBtn: "ანგარიშის შექმნა",
    loginBtn: "შესვლა",
    badgeSubjects: "საგნები",
    badgeAssignments: "დავალებები",
    badgeExams: "გამოცდები",
    badgeProgress: "პროგრესი",
  },
  en: {
    heroTitle1: "Organize Your",
    heroTitle2: "Student Life With",
    heroTitle3: "StudyFlow",
    description: "Manage courses, assignments, exams, and track your academic progress in one place.",
    registerBtn: "Create Account",
    loginBtn: "Login",
    badgeSubjects: "Subjects",
    badgeAssignments: "Assignments",
    badgeExams: "Exams",
    badgeProgress: "Progress",
  },
};

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

export default function Home() {
  const [lang, setLang] = useState<"ka" | "en">("ka");
  const t = translations[lang];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/30 px-4 text-center">
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

      {/* დეკორატიული ფონები */}
      <div className="absolute top-12 left-12 h-24 w-24 rounded-full bg-emerald-200/40 blur-xl" />
      <div className="absolute bottom-16 left-8 h-16 w-16 rounded-full bg-yellow-200/50 blur-lg" />
      <div className="absolute top-20 right-16 h-12 w-12 rotate-12 rounded-lg bg-blue-200/40 blur-md" />
      <div className="absolute bottom-24 right-12 h-20 w-20 rounded-xl bg-purple-200/40 blur-xl" />

      <div className="relative z-10 flex max-w-xl flex-col items-center">
        {/* ლოგო */}
        <div className="mb-4">
          <Logo size="lg" />
        </div>

        <h2 className="text-xl font-extrabold tracking-wide text-emerald-600">
          StudyFlow
        </h2>

        <h1 className="mt-3 text-3xl font-black leading-tight text-slate-800 sm:text-4xl">
          {t.heroTitle1} <br />
          {t.heroTitle2} <br />
          <span className="text-emerald-500">{t.heroTitle3}</span>
        </h1>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
          {t.description}
        </p>

        <div className="mt-8 flex w-full max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-xl bg-emerald-500 px-6 py-3 text-center font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 sm:w-auto"
          >
            {t.registerBtn}
          </Link>
          <Link
            href="/login"
            className="w-full rounded-xl bg-blue-500 px-8 py-3 text-center font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 sm:w-auto"
          >
            {t.loginBtn}
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            <span>📚</span> {t.badgeSubjects}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            <span>📅</span> {t.badgeAssignments}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            <span>📝</span> {t.badgeExams}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            <span>📊</span> {t.badgeProgress}
          </div>
        </div>
      </div>
    </main>
  );
}