"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function Logo({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 p-0.5 shadow-md ${sizeClasses[size]}`}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-white">
        <GraduationCap size={20} className="text-emerald-400" />
      </div>
      <div className="absolute -top-0.5 -right-0.5 rounded-full bg-emerald-400 p-0.5 text-slate-900">
        <Sparkles size={10} />
      </div>
    </div>
  );
}

export default function SubjectsPage() {
  const supabase = createClient();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [newSubject, setNewSubject] = useState({
    subject_code: "",
    subject_title: "",
    lecturer: "",
  });

  
  const fetchSubjects = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUser(user);

    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subjects:", error);
    } else {
      setSubjects(data || []);
    }
  }, [supabase]);

  
  useEffect(() => {
    fetchSubjects();

    const channel = supabase
      .channel("realtime_user_subjects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subjects" },
        () => {
          fetchSubjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSubjects, supabase]);

  
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSubject.subject_title || !newSubject.subject_code) {
      alert("გთხოვთ შეავსოთ საგნის დასახელება და კოდი!");
      return;
    }

    
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData?.user;

    if (authError || !user) {
      alert("ავტორიზაცია არ არის გავლილი! გთხოვთ ხელახლა შეხვიდეთ სისტემაში.");
      return;
    }

    
    const { data, error } = await supabase
      .from("subjects")
      .insert([
        {
          subject_code: newSubject.subject_code,
          subject_title: newSubject.subject_title,
          lecturer: newSubject.lecturer || "Prof. Unknown",
          user_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      alert("ბაზაში ჩაწერის შეცდომა: " + error.message);
    } else {
      alert("საგანთა წარმატებით დაემატა ბაზაში!");
      setNewSubject({ subject_code: "", subject_title: "", lecturer: "" });
      setIsModalOpen(false);
      fetchSubjects();
    }
  };

  
  const handleDeleteSubject = async (id: string) => {
    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", id)
      .eq("user_id", currentUser?.id);

    if (error) {
      console.error("Error deleting subject:", error);
    } else {
      fetchSubjects();
    }
  };

  const filteredSubjects = subjects.filter(
    (s) =>
      s.subject_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subject_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lecturer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50 text-slate-800">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col border-r border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 px-2 pb-6 border-b border-slate-100">
          <Logo size="sm" />
          <div>
            <h2 className="text-lg font-black text-slate-800 leading-none">
              StudyFlow
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              Student Academic Hub
            </p>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-1.5 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/subjects"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
          >
            <BookOpen size={18} />
            Subjects
          </Link>

          <Link
            href="/dashboard/assignments"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all"
          >
            <CheckCircle2 size={18} />
            Assignments
          </Link>

          <Link
            href="/dashboard/schedule"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all"
          >
            <CalendarIcon size={18} />
            Schedule & Exams
          </Link>
        </nav>

        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
              {currentUser?.email?.substring(0, 2).toUpperCase() || "US"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">
                {currentUser?.email || "Student"}
              </p>
              <p className="text-[10px] text-slate-400">User</p>
            </div>
          </div>
          <Link
            href="/login"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-500 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between pb-8 border-b border-slate-200/60">
          <div>
            <h1 className="text-2xl font-black text-slate-800">My Subjects</h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage and track your enrolled courses for this semester.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
            >
              <Plus size={16} /> Add Subject
            </button>
          </div>
        </header>

        {/* SUBJECTS GRID */}
        <section className="mt-8">
          {filteredSubjects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <BookOpen className="mx-auto text-slate-300 mb-3" size={40} />
              <h3 className="text-sm font-bold text-slate-700">
                No subjects found
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {searchQuery
                  ? "Try searching for something else."
                  : "Get started by adding your first subject!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects.map((subj) => (
                <div
                  key={subj.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600 border border-emerald-100">
                        {subj.subject_code}
                      </span>
                      <button
                        onClick={() => handleDeleteSubject(subj.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Subject"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      {subj.subject_title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <User size={14} className="text-slate-400" />
                      <span>{subj.lecturer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* MODAL: ADD NEW SUBJECT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                Add New Subject
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleAddSubject}
              className="mt-4 flex flex-col gap-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-600">
                  Subject Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-201"
                  value={newSubject.subject_code}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, subject_code: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">
                  Subject Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms"
                  value={newSubject.subject_title}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, subject_title: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">
                  Lecturer / Professor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Sarah Jenkins"
                  value={newSubject.lecturer}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, lecturer: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                Save Subject
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}