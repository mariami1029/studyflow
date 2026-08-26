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
  Sparkles,
  Trash2,
  X,
  MapPin,
  Clock,
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

export default function SchedulePage() {
  const supabase = createClient();

  const [schedules, setSchedules] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [isScheduleModal, setIsScheduleModal] = useState(false);
  const [isExamModal, setIsExamModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [newSchedule, setNewSchedule] = useState({
    day_of_week: "Monday",
    subject_title: "",
    start_time: "",
    end_time: "",
    room_location: "",
  });

  const [newExam, setNewExam] = useState({
    subject_title: "",
    exam_type: "Midterm",
    date: "",
    time: "",
    room_hall: "",
  });

  
  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUser(user);

    const [schedRes, examRes] = await Promise.all([
      supabase.from("schedules").select("*").eq("user_id", user.id),
      supabase.from("exams").select("*").eq("user_id", user.id).order("date", { ascending: true }),
    ]);

    if (schedRes.data) setSchedules(schedRes.data);
    if (examRes.data) setExams(examRes.data);
  }, [supabase]);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("realtime_user_schedule")
      .on("postgres_changes", { event: "*", schema: "public", table: "schedules" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "exams" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, supabase]);

  
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedule.subject_title || !currentUser) return;

    await supabase.from("schedules").insert([
      {
        ...newSchedule,
        user_id: currentUser.id,
      },
    ]);

    setNewSchedule({ day_of_week: "Monday", subject_title: "", start_time: "", end_time: "", room_location: "" });
    setIsScheduleModal(false);
    fetchData();
  };

 
  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.subject_title || !currentUser) return;

    await supabase.from("exams").insert([
      {
        ...newExam,
        user_id: currentUser.id,
      },
    ]);

    setNewExam({ subject_title: "", exam_type: "Midterm", date: "", time: "", room_hall: "" });
    setIsExamModal(false);
    fetchData();
  };

  
  const handleDeleteSchedule = async (id: string) => {
    await supabase.from("schedules").delete().eq("id", id).eq("user_id", currentUser?.id);
    fetchData();
  };

  const handleDeleteExam = async (id: string) => {
    await supabase.from("exams").delete().eq("id", id).eq("user_id", currentUser?.id);
    fetchData();
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all"
          >
            <CheckCircle2 size={18} />
            Assignments
          </Link>

          <Link
            href="/dashboard/schedule"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
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
            <h1 className="text-2xl font-black text-slate-800">Schedule & Exams</h1>
            <p className="text-xs text-slate-500 mt-1">Manage your weekly class timetable and upcoming exam dates.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsScheduleModal(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-900 transition-all"
            >
              <Plus size={16} /> Add Class
            </button>
            <button
              onClick={() => setIsExamModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
            >
              <Plus size={16} /> Add Exam
            </button>
          </div>
        </header>

        {/* WEEKLY TIMETABLE */}
        <section className="mt-8">
          <h2 className="text-base font-bold text-slate-800 mb-4">Weekly Timetable</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((day) => {
              const dayClasses = schedules.filter((s) => s.day_of_week === day);
              return (
                <div key={day} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                  <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">{day}</span>
                  <div className="mt-3 flex flex-col gap-2">
                    {dayClasses.length === 0 ? (
                      <p className="text-xs text-slate-400 font-medium italic">No classes scheduled</p>
                    ) : (
                      dayClasses.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.subject_title}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                              <Clock size={10} /> {item.start_time} - {item.end_time} | <MapPin size={10} /> {item.room_location}
                            </p>
                          </div>
                          <button onClick={() => handleDeleteSchedule(item.id)} className="text-slate-300 hover:text-rose-500">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* UPCOMING EXAMS */}
        <section className="mt-10">
          <h2 className="text-base font-bold text-slate-800 mb-4">Upcoming Exams</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exams.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium italic">No upcoming exams added yet.</p>
            ) : (
              exams.map((exam) => (
                <div key={exam.id} className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="rounded-lg bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">{exam.exam_type}</span>
                    <h4 className="text-xs font-bold text-slate-800 mt-2">{exam.subject_title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <Clock size={10} /> {exam.date} @ {exam.time}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> Room: {exam.room_hall}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteExam(exam.id)} className="text-slate-300 hover:text-rose-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* MODAL CLASS */}
      {isScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add Class Schedule</h3>
              <button onClick={() => setIsScheduleModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSchedule} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Day of Week</label>
                <select
                  value={newSchedule.day_of_week}
                  onChange={(e) => setNewSchedule({ ...newSchedule, day_of_week: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                >
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Subject</label>
                <input
                  type="text" required placeholder="e.g. Web Architecture"
                  value={newSchedule.subject_title}
                  onChange={(e) => setNewSchedule({ ...newSchedule, subject_title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time" required value={newSchedule.start_time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                />
                <input
                  type="time" required value={newSchedule.end_time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                />
              </div>
              <input
                type="text" placeholder="Room/Location (e.g. Hall B)"
                value={newSchedule.room_location}
                onChange={(e) => setNewSchedule({ ...newSchedule, room_location: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
              />
              <button type="submit" className="mt-2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white">Save Class</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EXAM */}
      {isExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add Exam</h3>
              <button onClick={() => setIsExamModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddExam} className="mt-4 flex flex-col gap-3">
              <input
                type="text" required placeholder="Subject Title"
                value={newExam.subject_title}
                onChange={(e) => setNewExam({ ...newExam, subject_title: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
              />
              <select
                value={newExam.exam_type}
                onChange={(e) => setNewExam({ ...newExam, exam_type: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
              >
                <option value="Midterm">Midterm</option>
                <option value="Final">Final Exam</option>
                <option value="Quiz">Quiz</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date" required value={newExam.date}
                  onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                />
                <input
                  type="time" required value={newExam.time}
                  onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                />
              </div>
              <input
                type="text" placeholder="Exam Hall / Room"
                value={newExam.room_hall}
                onChange={(e) => setNewExam({ ...newExam, room_hall: e.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
              />
              <button type="submit" className="mt-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white">Save Exam</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}