import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";

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
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/30 px-4 text-center">
      <div className="absolute top-12 left-12 h-24 w-24 rounded-full bg-emerald-200/40 blur-xl" />
      <div className="absolute bottom-16 left-8 h-16 w-16 rounded-full bg-yellow-200/50 blur-lg" />
      <div className="absolute top-20 right-16 h-12 w-12 rounded-lg bg-blue-200/40 blur-md rotate-12" />
      <div className="absolute bottom-24 right-12 h-20 w-20 rounded-xl bg-purple-200/40 blur-xl" />

      <div className="relative z-10 flex max-w-xl flex-col items-center">
        {/* ლოგო */}
        <div className="mb-4">
          <Logo size="lg" />
        </div>

        <h2 className="text-xl font-extrabold text-emerald-600 tracking-wide">
          StudyFlow
        </h2>

        <h1 className="mt-3 text-3xl font-black text-slate-800 sm:text-4xl leading-tight">
          Organize Your <br />
          Student Life With <br />
          <span className="text-emerald-500">StudyFlow</span>
        </h1>

        <p className="mt-4 max-w-md text-sm text-gray-500 leading-relaxed">
          Manage courses, assignments, exams, and track your academic progress in one place.
        </p>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:flex-row sm:max-w-none justify-center">
          <Link
            href="/register"
            className="w-full sm:w-auto rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all text-center"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-xl bg-blue-500 px-8 py-3 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all text-center"
          >
            Login
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            <span>📚</span> Subjects
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            <span>📅</span> Assignments
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            <span>📝</span> Exams
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            <span>📊</span> Progress
          </div>
        </div>
      </div>
    </main>
  );
}