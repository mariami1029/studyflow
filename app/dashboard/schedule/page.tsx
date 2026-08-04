"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  GraduationCap,
  X,
  BookOpen,
  LayoutDashboard,
  CheckCircle2,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0); // კვირების გადართვა
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // დღევანდელი თარიღის გამოთვლა დინამიურად
  const getWeekDays = () => {
    const today = new Date();
    // გადავწევთ დღეებს weekOffset-ის მიხედვით
    today.setDate(today.getDate() + weekOffset * 7);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = d.getDate();
      const fullDate = d.toISOString().split("T")[0]; // YYYY-MM-DD ფორმატი

      days.push({
        day: dayName,
        date: dayNum,
        fullDate: fullDate,
        isToday: new Date().toISOString().split("T")[0] === fullDate,
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const [selectedDate, setSelectedDate] = useState(weekDays[0].fullDate);

  // გამოცდებისა და ქვიზების დინამიური State
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: 1,
      title: "Data Structures Midterm Exam",
      type: "Exam",
      subject: "CS-201",
      date: weekDays[0].fullDate,
      time: "10:00 AM - 12:00 PM",
      location: "Auditorium 302",
      color: "rose",
    },
    {
      id: 2,
      title: "Linear Algebra Quiz",
      type: "Quiz",
      subject: "MA-101",
      date: weekDays[2].fullDate,
      time: "11:00 AM - 11:45 AM",
      location: "Online / LMS",
      color: "amber",
    },
  ]);

  const [newItem, setNewItem] = useState({
    title: "",
    type: "Quiz",
    subject: "",
    date: weekDays[0].fullDate,
    time: "",
    location: "",
  });

  // ახალი გამოცდის/ქვიზის დამატება (მონაცემები ეგრევე აისახება!)
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.date) return;

    const created = {
      id: Date.now(),
      title: newItem.title,
      type: newItem.type,
      subject: newItem.subject || "CS-101",
      date: newItem.date,
      time: newItem.time || "10:00 AM",
      location: newItem.location || "Main Hall",
      color: newItem.type === "Exam" ? "rose" : newItem.type === "Quiz" ? "amber" : "emerald",
    };

    setScheduleItems([created, ...scheduleItems]);
    setSelectedDate(newItem.date); // ავტომატურად გადაიყვანს დამატებულ თარიღზე
    setNewItem({ title: "", type: "Quiz", subject: "", date: weekDays[0].fullDate, time: "", location: "" });
    setIsExamModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 text-slate-800">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col border-r border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 px-2 pb-6 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-emerald-400 font-bold">
            <GraduationCap size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 leading-none">StudyFlow</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Academic Hub</p>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-1.5 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/dashboard/subjects" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            <BookOpen size={18} /> Subjects
          </Link>

          <Link href="/dashboard/assignments" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            <CheckCircle2 size={18} /> Assignments & Grades
          </Link>
          <Link href="/dashboard/schedule" className="flex items-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20">
            <CalendarIcon size={18} /> Schedule & Exams
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between pb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Schedule & Exam Calendar</h1>
            <p className="text-xs text-slate-500 mt-1">Starting today — manage your exams, quizzes, and classes.</p>
          </div>

          <button
            onClick={() => setIsExamModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
          >
            <Plus size={16} /> Add Exam / Quiz
          </button>
        </header>

        {/* WEEKLY CALENDAR WITH REAL DATES */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="text-emerald-500" size={20} />
              <h2 className="text-base font-bold text-slate-800">
                {weekOffset === 0 ? "Next 7 Days (Starting Today)" : weekOffset > 0 ? `+${weekOffset} Week` : `${weekOffset} Week`}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset(weekOffset - 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <ChevronLeft size={16} /> Prev Week
              </button>
              <button
                onClick={() => {
                  setWeekOffset(0);
                  setSelectedDate(weekDays[0].fullDate);
                }}
                className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Today
              </button>
              <button
                onClick={() => setWeekOffset(weekOffset + 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Next Week <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* 7 DAYS GRID WITH GREEN HIGHLIGHT FOR EVENTS */}
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((item) => {
              const eventsForDay = scheduleItems.filter((i) => i.date === item.fullDate);
              const hasEvents = eventsForDay.length > 0;
              const isSelected = selectedDate === item.fullDate;

              return (
                <button
                  key={item.fullDate}
                  onClick={() => setSelectedDate(item.fullDate)}
                  className={`flex flex-col items-center justify-between rounded-2xl p-4 transition-all border ${
                    isSelected
                      ? "border-emerald-600 bg-slate-900 text-white shadow-xl"
                      : hasEvents
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900 shadow-sm"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-bold ${isSelected ? "text-emerald-400" : hasEvents ? "text-emerald-700" : "text-slate-400"}`}>
                      {item.day}
                    </span>
                    {item.isToday && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Today" />
                    )}
                  </div>

                  <span className="my-2 text-xl font-black">{item.date}</span>

                  {hasEvents ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isSelected ? "bg-emerald-500 text-white" : "bg-emerald-200 text-emerald-800"
                      }`}
                    >
                      {eventsForDay.length} Event{eventsForDay.length > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-40">No events</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* EVENTS LIST FOR SELECTED DAY */}
        <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">
              Schedule for {selectedDate}
            </h3>
            <span className="text-xs font-medium text-slate-400">
              {scheduleItems.filter((i) => i.date === selectedDate).length} Items found
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {scheduleItems.filter((i) => i.date === selectedDate).length === 0 ? (
              <div className="p-8 text-center">
                <Sparkles size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-medium">No exams or quizzes added for this date.</p>
                <button
                  onClick={() => setIsExamModalOpen(true)}
                  className="mt-3 text-xs font-bold text-emerald-600 hover:underline"
                >
                  + Add one now
                </button>
              </div>
            ) : (
              scheduleItems
                .filter((i) => i.date === selectedDate)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 bg-slate-50/50 hover:bg-slate-100/80 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold text-xs ${
                          item.type === "Exam"
                            ? "bg-rose-100 text-rose-600"
                            : item.type === "Quiz"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {item.type}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                        <div className="mt-1 flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> {item.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13} /> {item.location}
                          </span>
                          <span className="font-bold text-emerald-600">{item.subject}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </main>

      {/* MODAL FOR ADDING EXAM/QUIZ */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add Exam or Quiz</h3>
              <button onClick={() => setIsExamModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calculus Final Quiz"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="Quiz">Quiz</option>
                    <option value="Exam">Exam</option>
                    <option value="Lecture">Lecture</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS-201"
                    value={newItem.subject}
                    onChange={(e) => setNewItem({ ...newItem, subject: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">Date</label>
                  <input
                    type="date"
                    required
                    value={newItem.date}
                    onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={newItem.time}
                    onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Location / Room</label>
                <input
                  type="text"
                  placeholder="e.g. Room 302 or Online"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                Save Event & Highlight Calendar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}