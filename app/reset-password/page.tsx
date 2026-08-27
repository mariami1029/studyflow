"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus({ type: "error", msg: "ელ-ფოსტის მისამართი არასწორია ან აკლია ბმულს." });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: "error", msg: "პაროლები ერთმანეთს არ ემთხვევა" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // 🚀 მოთხოვნა იგზავნება Backend API-ზე (სესია აღარ არის საჭირო)
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "შეცდომა პაროლის განახლებისას");
      }

      setStatus({ type: "success", msg: "პაროლი წარმატებით შეიცვალა! გადადიხართ შესვლის გვერდზე..." });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-xl backdrop-blur-md">
      <h1 className="text-2xl font-black text-slate-800 text-center mb-2">ახალი პაროლის დაყენება</h1>
      <p className="text-xs text-gray-500 text-center mb-6">შეიყვანეთ ახალი პაროლი თქვენი ანგარიშისთვის</p>

      {status && (
        <div className={`mb-4 p-3 rounded-xl text-xs font-semibold text-center ${status.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">ახალი პაროლი</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">დაადასტურეთ ახალი პაროლი</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? "ახლდება..." : "პაროლის განახლება"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/30 p-4">
      <Suspense fallback={<div>იტვირთება...</div>}>
        <ResetForm />
      </Suspense>
    </main>
  );
}