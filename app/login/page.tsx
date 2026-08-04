"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ავტორიზაციის ფუნქცია
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ავტორიზაცია ვერ მოხერხდა");
      }

      // ლოგინით მიღებული user-ის შენახვა localStorage-ში (სახელის ჩათვლით)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // გადამისამართება დეშბორდზე
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "შეცდომა ავტორიზაციისას");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/30 p-4 text-slate-800">
      {/* დეკორატიული ფონები */}
      <div className="absolute top-10 left-10 h-28 w-28 rounded-full bg-emerald-200/40 blur-xl" />
      <div className="absolute bottom-12 right-10 h-32 w-32 rounded-full bg-purple-200/40 blur-xl" />

      {/* ავტორიზაციის ბარათი */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-xl backdrop-blur-md sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">Welcome Back</h1>
          <p className="mt-1 text-xs text-gray-500">
            Log in to manage your StudyFlow account
          </p>
        </div>

        {/* შეცდომის შეტყობინება */}
        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-center text-xs font-semibold text-rose-600 border border-rose-200">
            {error}
          </div>
        )}

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Email Address</label>
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

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-medium text-emerald-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-blue-500 py-3 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* გადასვლა რეგისტრაციაზე */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-emerald-600 hover:underline">
            Create Account
          </Link>
        </div>
      </div>

      {/* უკან დაბრუნება */}
      <Link href="/" className="mt-6 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">
        ← Back to Home
      </Link>
    </main>
  );
}