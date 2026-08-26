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
  Clock,
  Check,
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

export default function AssignmentsPage() {
  const supabase = createClient();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subject_name: "",
    date: "",
    time: "",
  });

  
  const fetchAssignments = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUser(user);

    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching assignments:", error);
    } else {
      setAssignments(data || []);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAssignments();

    const channel = supabase
      .channel("realtime_user_assignments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assignments" },
        () => fetchAssignments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAssignments, supabase]);

  
  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.subject_name || !currentUser) return;

    const { error } = await supabase.from("assignments").insert([
      {
        title: newAssignment.title,
        subject_name: newAssignment.subject_name,
        date: newAssignment.date,
        time: newAssignment.time || "23:59",
        status: "pending",
        user_id: currentUser.id,
      },
    ]);

    if (error) {
      console.error("Error adding assignment:", error);
    } else {
      setNewAssignment({ title: "", subject_name: "", date: "", time: "" });
      setIsModalOpen(false);
      fetchAssignments();
    }
  };

  
  const toggleAssignmentStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    const { error } = await supabase
      .from("assignments")
      .update({ status: newStatus })
      .eq("id", id)
      .eq("user_id", currentUser?.id);

    if (error) {
      console.error("Error updating status:", error);
    } else {
      fetchAssignments();
    }
  };

  
  const handleDeleteAssignment = async (id: string) => {
    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", id)
      .eq("user_id", currentUser?.id);

    if (error) {
      console.error("Error deleting assignment:", error);
    } else {
      fetchAssignments();
    }
  };

  const filteredAssignments = assignments.filter(
    (a) =>
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50 text-slate-800">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col border-r border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 px-2 pb-6 border-b border-slate-100">
          <Logo size="sm" />
          <div>
            <h2 className="text-lg font-black text-slate-800 leading-none">StudyFlow</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Student Academic Hub</p>
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
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all"
          >
            <BookOpen size={18} />
            Subjects
          </Link>

          <Link
            href="/dashboard/assignments"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
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
              <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.email || "Student"}</p>
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
            <h1 className="text-2xl font-black text-slate-800">Assignments</h1>
            <p className="text-xs text-slate-500 mt-1">Keep track of your tasks and upcoming deadlines.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-800 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
            >
              <Plus size={16} /> Add Assignment
            </button>
          </div>
        </header>

        {/* ASSIGNMENTS LIST */}
        <section className="mt-8 flex flex-col gap-3">
          {filteredAssignments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <CheckCircle2 className="mx-auto text-slate-300 mb-3" size={40} />
              <h3 className="text-sm font-bold text-slate-700">No assignments found</h3>
              <p className="text-xs text-slate-400 mt-1">Add your first assignment to stay organized!</p>
            </div>
          ) : (
            filteredAssignments.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleAssignmentStatus(item.id, item.status)}
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${
                      item.status === "completed"
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 hover:border-emerald-500"
                    }`}
                  >
                    {item.status === "completed" && <Check size={14} />}
                  </button>

                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        item.status === "completed"
                          ? "line-through text-slate-400"
                          : "text-slate-800"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-xs text-emerald-600 font-semibold">
                      {item.subject_name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock size={14} className="text-slate-400" />
                    <span>
                      {item.date} {item.time ? `(${item.time})` : ""}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteAssignment(item.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add New Assignment</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAssignment} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Research Paper"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-201 Data Structures"
                  value={newAssignment.subject_name}
                  onChange={(e) => setNewAssignment({ ...newAssignment, subject_name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.date}
                    onChange={(e) => setNewAssignment({ ...newAssignment, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600">Due Time</label>
                  <input
                    type="time"
                    value={newAssignment.time}
                    onChange={(e) => setNewAssignment({ ...newAssignment, time: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                Save Assignment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}