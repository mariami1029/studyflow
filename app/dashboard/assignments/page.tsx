"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Plus,
  BookOpen,
  Calendar as CalendarIcon,
  LayoutDashboard,
  GraduationCap,
  X,
  Edit2,
  Trash2,
} from "lucide-react";

export default function AssignmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);

  // საწყისი მონაცემები
  const initialAssignments = [
    {
      id: 1,
      title: "Data Structures Midterm Quiz",
      subject: "CS-201",
      dueDate: "2026-05-18",
      grade: "95/100",
      status: "Graded",
    },
    {
      id: 2,
      title: "React Architecture Project",
      subject: "WEB-302",
      dueDate: "2026-05-22",
      grade: "Not Graded",
      status: "Pending",
    },
    {
      id: 3,
      title: "Linear Algebra Homework #3",
      subject: "MA-101",
      dueDate: "2026-05-25",
      grade: "88/100",
      status: "Graded",
    },
  ];

  const [assignments, setAssignments] = useState<any[]>([]);
  const [gradeInput, setGradeInput] = useState("");
  const [newTask, setNewTask] = useState({ title: "", subject: "", dueDate: "" });

  // 1. ჩატვირთვა localStorage-იდან
  useEffect(() => {
    const saved = localStorage.getItem("studyflow_assignments");
    if (saved) {
      setAssignments(JSON.parse(saved));
    } else {
      setAssignments(initialAssignments);
      localStorage.setItem("studyflow_assignments", JSON.stringify(initialAssignments));
    }
  }, []);

  // 2. შენახვა localStorage-ში ყოველ ცვლილებაზე
  const updateAssignments = (newList: any[]) => {
    setAssignments(newList);
    localStorage.setItem("studyflow_assignments", JSON.stringify(newList));
  };

  // ახალი დავალების დამატება
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.dueDate) return;

    const item = {
      id: Date.now(),
      title: newTask.title,
      subject: newTask.subject || "CS-101",
      dueDate: newTask.dueDate,
      grade: "Not Graded",
      status: "Pending",
    };

    updateAssignments([item, ...assignments]);
    setNewTask({ title: "", subject: "", dueDate: "" });
    setIsModalOpen(false);
  };

  // სტატუსის ცვლილება
  const handleStatusChange = (id: number, newStatus: string) => {
    const updated = assignments.map((item) => {
      if (item.id === id) {
        const updatedGrade =
          newStatus !== "Graded" && item.grade !== "Not Graded"
            ? item.grade
            : newStatus === "Graded" && item.grade === "Not Graded"
            ? "0/100"
            : item.grade;

        return { ...item, status: newStatus, grade: updatedGrade };
      }
      return item;
    });
    updateAssignments(updated);
  };

  // ქულის შენახვა
  const handleSaveGrade = (id: number) => {
    const updated = assignments.map((item) =>
      item.id === id ? { ...item, grade: gradeInput || "Not Graded", status: "Graded" } : item
    );
    updateAssignments(updated);
    setEditingGradeId(null);
    setGradeInput("");
  };

  // დავალების წაშლა
  const handleDelete = (id: number) => {
    const updated = assignments.filter((item) => item.id !== id);
    updateAssignments(updated);
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
          <Link href="/dashboard/assignments" className="flex items-center gap-3 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={18} /> Assignments & Grades
          </Link>
          <Link href="/dashboard/schedule" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            <CalendarIcon size={18} /> Schedule & Exams
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between pb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Assignments & Grades</h1>
            <p className="text-xs text-slate-500 mt-1">Change status directly or update grades in real-time.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
          >
            <Plus size={16} /> Add Assignment
          </button>
        </header>

        {/* ASSIGNMENTS TABLE */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400">
                  <th className="pb-3 pl-2">Task Title</th>
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Grade</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {assignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-2 font-bold text-slate-800">{item.title}</td>
                    <td className="py-4 font-semibold text-slate-500">{item.subject}</td>
                    <td className="py-4 text-slate-500">{item.dueDate}</td>

                    <td className="py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-[11px] font-bold outline-none cursor-pointer transition-all border ${
                          item.status === "Graded"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                            : item.status === "Submitted"
                            ? "bg-blue-100 text-blue-700 border-blue-300"
                            : item.status === "Late"
                            ? "bg-rose-100 text-rose-700 border-rose-300"
                            : "bg-amber-100 text-amber-700 border-amber-300"
                        }`}
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="Submitted">🚀 Submitted</option>
                        <option value="Graded">✅ Graded</option>
                        <option value="Late">⚠️ Late</option>
                      </select>
                    </td>

                    <td className="py-4">
                      {editingGradeId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g. 95/100"
                            value={gradeInput}
                            onChange={(e) => setGradeInput(e.target.value)}
                            className="w-24 rounded-lg border border-emerald-500 px-2 py-1 text-xs outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveGrade(item.id)}
                            className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              item.grade !== "Not Graded" ? "text-emerald-600" : "text-slate-400"
                            }`}
                          >
                            {item.grade}
                          </span>
                          <button
                            onClick={() => {
                              setEditingGradeId(item.id);
                              setGradeInput(item.grade !== "Not Graded" ? item.grade : "");
                            }}
                            className="text-slate-300 hover:text-emerald-600 transition-colors"
                            title="Edit Grade"
                          >
                            <Edit2 size={13} />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-4 pr-2 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                        title="Delete Assignment"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ADD ASSIGNMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add New Assignment</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600">Task Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Homework"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Subject Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS-201"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Due Date</label>
                <input
                  type="date"
                  required
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                Create Assignment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}