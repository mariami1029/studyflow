"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  LayoutDashboard, 
  LogOut, 
  Plus,
  Sparkles,
  X,
  Flame,
  Calendar as CalendarIcon,
  Award,
  Trash2,
  MapPin,
  Check,
  XCircle,
  FileCheck,
  Bot,
  Globe,
  Send
} from "lucide-react";


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

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [lang, setLang] = useState<"GE" | "EN">("GE");
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("სტუდენტი");

  
  const t = (ge: string, en: string) => (lang === "GE" ? ge : en);

  
  const [subjects, setSubjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);

  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  
  const [newTask, setNewTask] = useState({ title: "", subject: "", date: "", time: "", status: "Pending", grade: "" });
  const [newSubject, setNewSubject] = useState({ code: "", title: "", teacher: "" });
  const [newScheduleItem, setNewScheduleItem] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    subject: "",
    room: "",
    type: "Lecture",
  });
  const [newExam, setNewExam] = useState({
    subject: "",
    type: "Midterm Exam",
    date: "",
    time: "10:00",
    room: "",
  });
const router = useRouter();

  
  const getUserStorageKey = (keyName: string) => {
    if (typeof window === "undefined") return null;
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;
    try {
      const parsed = JSON.parse(savedUser);
      const identifier = parsed.email || parsed.id || "guest";
      return `studyflow_${identifier}_${keyName}`;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.name) setUserName(parsedUser.name);
      } catch (e) {
        console.error("User reading error:", e);
      }
    }

    const assignKey = getUserStorageKey("assignments");
    setAssignments(assignKey && localStorage.getItem(assignKey) ? JSON.parse(localStorage.getItem(assignKey)!) : []);

    const subjKey = getUserStorageKey("subjects");
    setSubjects(subjKey && localStorage.getItem(subjKey) ? JSON.parse(localStorage.getItem(subjKey)!) : []);

    const schedKey = getUserStorageKey("schedule");
    setSchedule(schedKey && localStorage.getItem(schedKey) ? JSON.parse(localStorage.getItem(schedKey)!) : []);

    const examKey = getUserStorageKey("exams");
    setExams(examKey && localStorage.getItem(examKey) ? JSON.parse(localStorage.getItem(examKey)!) : []);
  }, []);

  
  const updateAssignments = (newList: any[]) => {
    setAssignments(newList);
    const key = getUserStorageKey("assignments");
    if (key) localStorage.setItem(key, JSON.stringify(newList));
  };

  const updateSubjects = (newList: any[]) => {
    setSubjects(newList);
    const key = getUserStorageKey("subjects");
    if (key) localStorage.setItem(key, JSON.stringify(newList));
  };

  const updateSchedule = (newList: any[]) => {
    setSchedule(newList);
    const key = getUserStorageKey("schedule");
    if (key) localStorage.setItem(key, JSON.stringify(newList));
  };

  const updateExams = (newList: any[]) => {
    setExams(newList);
    const key = getUserStorageKey("exams");
    if (key) localStorage.setItem(key, JSON.stringify(newList));
  };

  
  const handleStatusChange = (id: number, newStatus: string) => {
    const updated = assignments.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          completed: newStatus === "Completed",
        };
      }
      return item;
    });
    updateAssignments(updated);
  };

  const handleGradeChange = (id: number, newGrade: string) => {
    const updated = assignments.map((item) => {
      if (item.id === id) {
        return { ...item, grade: newGrade };
      }
      return item;
    });
    updateAssignments(updated);
  };

  const deleteTask = (id: number) => {
    const updated = assignments.filter((item) => item.id !== id);
    updateAssignments(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.subject || !newTask.date) return;

    const task = {
      id: Date.now(),
      title: newTask.title,
      subject: newTask.subject,
      code: newTask.subject.substring(0, 3).toUpperCase(),
      date: newTask.date,
      time: newTask.time || "12:00",
      status: newTask.status,
      completed: newTask.status === "Completed",
      grade: newTask.grade || "",
    };

    updateAssignments([task, ...assignments]);
    setNewTask({ title: "", subject: "", date: "", time: "", status: "Pending", grade: "" });
    setIsTaskModalOpen(false);
  };

  
  const handleAttendanceChange = (id: number, attendanceStatus: string) => {
    const updated = schedule.map((item) => {
      if (item.id === id) {
        return { ...item, attendance: attendanceStatus };
      }
      return item;
    });
    updateSchedule(updated);
  };

  const handleAddScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleItem.subject) return;

    const item = {
      id: Date.now(),
      day: newScheduleItem.day,
      startTime: newScheduleItem.startTime,
      endTime: newScheduleItem.endTime,
      subject: newScheduleItem.subject,
      room: newScheduleItem.room || "Room Not Specified",
      type: newScheduleItem.type,
      attendance: "Pending",
    };

    updateSchedule([...schedule, item]);
    setNewScheduleItem({
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      subject: "",
      room: "",
      type: "Lecture",
    });
    setIsScheduleModalOpen(false);
  };

  const deleteScheduleItem = (id: number) => {
    const updated = schedule.filter((item) => item.id !== id);
    updateSchedule(updated);
  };

  
  const handleExamAttendanceChange = (id: number, attendanceStatus: string) => {
    const updated = exams.map((item) => {
      if (item.id === id) {
        return { ...item, attendance: attendanceStatus };
      }
      return item;
    });
    updateExams(updated);
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.subject || !newExam.date) return;

    const examItem = {
      id: Date.now(),
      subject: newExam.subject,
      type: newExam.type,
      date: newExam.date,
      time: newExam.time || "10:00",
      room: newExam.room || "Main Hall",
      attendance: "Pending",
    };

    updateExams([...exams, examItem]);
    setNewExam({ subject: "", type: "Midterm Exam", date: "", time: "10:00", room: "" });
    setIsExamModalOpen(false);
  };

  const deleteExam = (id: number) => {
    const updated = exams.filter((item) => item.id !== id);
    updateExams(updated);
  };

  
 const handleAiAsk = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!aiPrompt.trim() || isAiLoading) return;

  setIsAiLoading(true);
  setAiResponse(null);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: aiPrompt }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "შეცდომა პასუხის მიღებისას");
    }

    setAiResponse(data.reply);
  } catch (err: any) {
    setAiResponse(err.message || "შეცდომა მოხდა. სცადეთ მოგვიანებით.");
  } finally {
    setIsAiLoading(false);
  }
};
  
  const getDaysRemaining = (examDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(examDateStr);
    examDate.setHours(0, 0, 0, 0);

    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: t("გასულია", "Passed"), color: "bg-slate-100 text-slate-500" };
    if (diffDays === 0) return { label: t("დღეს!", "Today!"), color: "bg-rose-100 text-rose-700 animate-pulse" };
    if (diffDays === 1) return { label: t("ხვალ", "Tomorrow"), color: "bg-amber-100 text-amber-700" };
    return { label: t(`${diffDays} დღეში`, `In ${diffDays} days`), color: "bg-indigo-100 text-indigo-700" };
  };

  
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.title || !newSubject.code) return;

    const subj = {
      id: Date.now(),
      code: newSubject.code,
      title: newSubject.title,
      teacher: newSubject.teacher || "Unknown Professor",
      progress: 0,
    };

    updateSubjects([...subjects, subj]);
    setNewSubject({ code: "", title: "", teacher: "" });
    setIsSubjectModalOpen(false);
  }; 

  
  const deleteSubject = (id: number) => {
    const updated = subjects.filter((s) => s.id !== id);
    updateSubjects(updated);
  };

  
  const completedTasks = assignments.filter((item) => item.status === "Completed");
  const inProgressTasks = assignments.filter((item) => item.status === "In Progress");
  const pendingTasks = assignments.filter((item) => item.status === "Pending");

  const studyStreak = completedTasks.length;

  const calculateGPA = () => {
    const graded = assignments.filter((item) => item.grade && item.grade.trim() !== "");
    if (graded.length === 0) return "N/A";

    let totalScore = 0;
    let count = 0;

    graded.forEach((item) => {
      const match = item.grade.match(/(\d+)/);
      if (match) {
        totalScore += parseInt(match[0], 10);
        count++;
      }
    });

    if (count === 0) return "N/A";
    const avgScore = totalScore / count;
    const gpa = (avgScore / 100) * 4.0;
    return gpa.toFixed(2);
  };

  const currentDayName = DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todayClasses = schedule.filter((s) => s.day === currentDayName);

  return (
  <div className="flex min-h-screen bg-slate-50/60 text-slate-800 font-sans flex-col md:flex-row">
    
    {/* 📱 1. მობილურის ზედა ზოლი (ჩნდება მხოლოდ ტელეფონზე) */}
    <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2.5">
        <Logo size="sm" />
        <span className="font-black text-slate-800 text-base">StudyFlow</span>
      </div>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
      >
        {isSidebarOpen ? <X size={22} /> : <BookOpen size={22} />}
      </button>
    </div>

    {/* 🌫 2. მობილურზე მენიუს გახსნისას ფონის გამუქება */}
    {isSidebarOpen && (
      <div
        onClick={() => setIsSidebarOpen(false)}
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity"
      />
    )}

    {/* 📐 3. SIDEBAR (მობილურზე გამოდის მარცხნიდან, დესკტოპზე ფიქსირებულია) */}
    <aside
      className={`fixed top-0 left-0 z-50 h-screen w-64 flex-col justify-between border-r border-slate-200/80 bg-white p-5 shadow-sm overflow-y-auto transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0 flex" : "-translate-x-full md:translate-x-0 md:flex"
      }`}
    >
      <div className="flex items-center justify-between px-2 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div>
            <h2 className="text-lg font-black text-slate-800 leading-none">StudyFlow</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{t("სტუდენტის პორტალი", "Student Portal")}</p>
          </div>
        </div>
        {/* მობილურის დახურვის X ღილაკი */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="mt-6 flex flex-col gap-1.5 flex-1">
        <button
          onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all w-full text-left ${
            activeTab === "dashboard"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
          }`}
        >
          <LayoutDashboard size={18} />
          {t("მართვის პანელი", "Dashboard")}
        </button>

        <button
          onClick={() => { setActiveTab("subjects"); setIsSidebarOpen(false); }}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all w-full text-left ${
            activeTab === "subjects"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
          }`}
        >
          <BookOpen size={18} />
          {t("საგნები", "Subjects")}
        </button>

        <button
          onClick={() => { setActiveTab("assignments_grades"); setIsSidebarOpen(false); }}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all w-full text-left ${
            activeTab === "assignments_grades"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
          }`}
        >
          <Award size={18} />
          {t("დავალებები & ნიშნები", "Assignments & Grades")}
        </button>

        <button
          onClick={() => { setActiveTab("schedule"); setIsSidebarOpen(false); }}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all w-full text-left ${
            activeTab === "schedule"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
          }`}
        >
          <CalendarIcon size={18} />
          {t("ცხრილი", "Schedule")}
        </button>

        <button
          onClick={() => { setActiveTab("exams"); setIsSidebarOpen(false); }}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all w-full text-left ${
            activeTab === "exams"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
          }`}
        >
          <FileCheck size={18} />
          {t("გამოცდები", "Exams")}
        </button>

        {/* AI ASSISTANT BUTTON */}
        <button
          onClick={() => { setIsAIModalOpen(true); setIsSidebarOpen(false); }}
          className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all w-full text-left bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:opacity-95"
        >
          <Sparkles size={18} className="animate-spin-slow" />
          {t("AI ასისტენტი", "AI Assistant")}
        </button>
      </nav>

      <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
        <Link href="/dashboard/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
            {userName ? userName[0].toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{userName || "User"}</p>
            <p className="text-[10px] text-slate-400">{user?.email || "Student Portal"}</p>
          </div>
        </Link>
        <button
          onClick={() => {
            if (confirm(t("ნამდვილად გსურთ გამოსვლა?", "Are you sure you want to log out?"))) {
              localStorage.removeItem("user");
              router.push("/login");
            }
          }}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-500 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>

      {/* MAIN CONTENT AREA */}
<main className="ml-0 md:ml-64 min-h-screen flex-1 p-4 md:p-8 overflow-y-auto">
  {/* HEADER */}
  <header className="flex items-center justify-between pb-8">
    <div>
      <h1 className="text-2xl font-black text-slate-800">
        {activeTab === "dashboard" && t(`მოგესალმებით, ${userName}! 👋`, `Welcome back, ${userName}! 👋`)}
        {activeTab === "subjects" && t("საგნები", "Subjects")}
        {activeTab === "assignments_grades" && t("დავალებები & ნიშნები", "Assignments & Grades")}
        {activeTab === "schedule" && t("აკადემიური ცხრილი", "Academic Schedule")}
        {activeTab === "exams" && t("გამოცდების ტრეკერი", "Exams Tracker")}
      </h1>
      <p className="text-xs text-slate-500 mt-1">{t("მართეთ თქვენი აკადემიური პროგრესი მარტივად.", "Manage your academic progress seamlessly.")}</p>
    </div>
          <div className="flex items-center gap-3">
            {/* LANGUAGE TOGGLE BUTTON */}
            <button
              onClick={() => setLang(lang === "GE" ? "EN" : "GE")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
            >
              <Globe size={15} className="text-emerald-500" />
              <span>{lang}</span>
            </button>

            {activeTab === "assignments_grades" && (
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                <Plus size={16} /> {t("დავალების / ნიშნის დამატება", "Add Assignment / Grade")}
              </button>
            )}

            {activeTab === "schedule" && (
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                <Plus size={16} /> {t("ლექციის დამატება", "Add Class")}
              </button>
            )}

            {activeTab === "exams" && (
              <button
                onClick={() => setIsExamModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                <Plus size={16} /> {t("გამოცდის დამატება", "Add Exam")}
              </button>
            )}

            {activeTab === "subjects" && (
              <button
                onClick={() => setIsSubjectModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                <Plus size={16} /> {t("საგნის დამატება", "Add Subject")}
              </button>
            )}
          </div>
        </header>

  {/* ----------------- TAB 1: DASHBOARD ----------------- */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-8">
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{t("აქტიური საგნები", "Active Subjects")}</span>
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                    <BookOpen size={18} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-800">{subjects.length}</p>
                <p className="mt-1 text-[11px] text-emerald-600 font-medium">{t("გაზაფხულის სემესტრი", "Spring Semester")}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{t("მიმდინარე დავალებები", "Pending Tasks")}</span>
                  <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                    <Clock size={18} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-800">{pendingTasks.length + inProgressTasks.length}</p>
                <p className="mt-1 text-[11px] text-amber-600 font-medium">{t("მოლოდინში & პროცესში", "Pending & In Progress")}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{t("დასრულებული დავალებები", "Completed Tasks")}</span>
                  <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-800">{completedTasks.length}</p>
                <p className="mt-1 text-[11px] text-slate-400 font-medium">{t("წარმატებით შესრულებული", "Successfully Finished")}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{t("საშუალო GPA", "Average GPA")}</span>
                  <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                    <GraduationCap size={18} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-800">{calculateGPA()}</p>
                <p className="mt-1 text-[11px] text-emerald-600 font-medium">{t("გამოთვლილია ნიშნებიდან", "Calculated from grades")}</p>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-800">{t("ბოლო დავალებები & ნიშნები", "Recent Assignments & Grades")}</h3>
                  <button onClick={() => setActiveTab("assignments_grades")} className="text-xs font-semibold text-emerald-600 hover:underline">
                    {t("ყველას ნახვა", "View All")}
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {assignments.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 p-4 hover:border-slate-200 transition-all">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">
                          {item.code || "CS"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 break-words">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 break-words">
                            {item.subject} • {item.date} ({item.time})
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2 mt-2 sm:mt-0">
                        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                          {item.grade || t("ნიშანი არაა", "No Grade")}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold whitespace-nowrap ${
                            item.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.status === "Completed"
                            ? t("შესრულებული", "Completed")
                            : item.status === "In Progress"
                            ? t("მიმდინარე", "In Progress")
                            : t("მოლოდინში", "Pending")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shrink-0">
                    <Flame size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("სწავლის სტრიქი", "Study Streak")}</h4>
                    <p className="text-xl font-black text-slate-800 mt-0.5">
                      {studyStreak} {t("შესრულებული დავალება 🔥", "Task Completed 🔥")}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-800 mb-1">{t(`დღევანდელი ლექციები (${currentDayName})`, `Today's Classes (${currentDayName})`)}</h4>
                  <p className="text-[10px] text-slate-400 mb-3">{t("დინამიურად განახლებადი განრიგი", "Dynamically tracked for today")}</p>
                  
                  <div className="flex flex-col gap-2">
                    {todayClasses.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">{t("დღეს ლექციები არ გაქვთ.", "No classes scheduled for today.")}</p>
                    ) : (
                      todayClasses.map((item) => (
                        <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.subject}</p>
                            <p className="text-[10px] text-slate-500 mt-1">{item.startTime} - {item.endTime} | {item.room}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.attendance === "Attended" ? "bg-emerald-100 text-emerald-700" :
                            item.attendance === "Missed" ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-600"
                          }`}>
                            {item.attendance || "Pending"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: SUBJECTS ----------------- */}
{activeTab === "subjects" && (
  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
      <div>
        <h3 className="text-base font-bold text-slate-800">{t("არჩეული საგნები", "Enrolled Subjects")}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{t("მიმდინარე სემესტრის საგნების სია", "List of active courses for this semester")}</p>
      </div>
      <button
        onClick={() => setIsSubjectModalOpen(true)}
        className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-all"
      >
        <Plus size={14} /> {t("საგნის დამატება", "Add Subject")}
      </button>
    </div>

    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subj) => (
        <div key={subj.id} className="rounded-2xl border border-slate-100 p-5 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
              {subj.code}
            </span>
            <button
              onClick={() => deleteSubject(subj.id)}
              className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
              title="Delete Subject"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <h4 className="mt-4 text-sm font-bold text-slate-800">{subj.title}</h4>
          <p className="text-[11px] text-slate-400 mt-1">{subj.teacher}</p>
        </div>
      ))}
    </div>
  </div>
)}

     {/* ----------------- TAB 3: ASSIGNMENTS & GRADES ----------------- */}
{activeTab === "assignments_grades" && (
  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
      <div>
        <h3 className="text-base font-bold text-slate-800">{t("დავალებები & ნიშნები", "Assignments & Grades")}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{t("შეცვალეთ სტატუსი ან შეიყვანეთ ქულები პირდაპირ ცხრილში", "Edit status and input scores/grades directly in the table")}</p>
      </div>
      <button
        onClick={() => setIsTaskModalOpen(true)}
        className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-all"
      >
        <Plus size={14} /> {t("ახალი დავალება / ნიშანი", "New Assignment / Grade")}
      </button>
    </div>

    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th className="pb-3 pl-2">{t("დავალების დასახელება", "Assignment Title")}</th>
            <th className="pb-3">{t("საგანი", "Subject")}</th>
            <th className="pb-3">{t("ბოლო ვადა", "Due Date")}</th>
            <th className="pb-3 min-w-[160px]">{t("სტატუსი", "Status")}</th>
            <th className="pb-3 min-w-[160px]">{t("ნიშანი / ქულა", "Grade / Score")}</th>
            <th className="pb-3 text-right pr-2">{t("მოქმედება", "Action")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-medium">
          {assignments.map((item) => {
            // 🚨 ითვლის დარჩენილ საათებს დედლაინამდე
            const dueDateTime = new Date(`${item.date}T${item.time || "23:59"}`).getTime();
            const now = new Date().getTime();
            const diffInHours = (dueDateTime - now) / (1000 * 60 * 60);
            const isUrgentTask = item.status !== "Completed" && diffInHours > 0 && diffInHours <= 24;

            return (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 pl-2 font-bold text-slate-800">
                  <div>{item.title}</div>
                  {/* 🚨 24 საათიანი გადაუდებელი ინდიკატორი */}
                  {isUrgentTask && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-200 animate-pulse">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
                      </span>
                      🚨 {t("დარჩა 24 საათზე ნაკლები!", "Less than 24h left!")}
                    </div>
                  )}
                </td>
                <td className="py-4 text-slate-600 font-semibold">{item.subject}</td>
                <td className="py-4 text-slate-500">{item.date} ({item.time})</td>
                
                <td className="py-4">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className={`rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold outline-none cursor-pointer transition-all ${
                      item.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : item.status === "In Progress"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-amber-50 text-amber-700 border-amber-300"
                    }`}
                  >
                    <option value="Pending">⏳ {t("მოლოდინში", "Pending")}</option>
                    <option value="In Progress">🔄 {t("პროცესშია", "In Progress")}</option>
                    <option value="Completed">✅ {t("შესრულებულია", "Completed")}</option>
                  </select>
                </td>

                <td className="py-4">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    disabled={item.status !== "Completed"}
                    placeholder={t("მაგ: 95", "e.g. 95")}
                    value={item.grade}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        handleGradeChange(item.id, "");
                        return;
                      }
                      const num = Number(val);
                      if (num >= 0 && num <= 100) {
                        handleGradeChange(item.id, val);
                      }
                    }}
                    className="w-28 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </td>

                <td className="py-4 text-right pr-2">
                  <button
  onClick={() => deleteTask(item.id)}
  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
>
  <Trash2 size={16} />
</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}
        {/* ----------------- TAB 4: SCHEDULE ----------------- */}
        {activeTab === "schedule" && (
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">{t("აკადემიური განრიგი", "Academic Schedule")}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t("მართეთ თქვენი ყოველკვირეული ლექციები და დასწრება", "Manage your weekly classes and attendance")}</p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-all"
              >
                <Plus size={14} /> {t("ლექციის დამატება", "Add Class")}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-6">
              {DAYS_OF_WEEK.map((day) => {
                const dayClasses = schedule.filter((s) => s.day === day);
                if (dayClasses.length === 0) return null;

                return (
                  <div key={day} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">{day}</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {dayClasses.map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm relative group">
                          <button
                            onClick={() => deleteScheduleItem(item.id)}
                            className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {item.type}
                          </span>
                          <h5 className="mt-2 text-xs font-bold text-slate-800">{item.subject}</h5>
                          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                            <Clock size={12} /> {item.startTime} - {item.endTime}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <MapPin size={12} /> {item.room}
                          </p>

                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-slate-400">{t("დასწრება:", "Attendance:")}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleAttendanceChange(item.id, "Attended")}
                                className={`p-1 rounded-lg ${item.attendance === "Attended" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 hover:bg-emerald-100"}`}
                              >
                                <Check size={12} />
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(item.id, "Missed")}
                                className={`p-1 rounded-lg ${item.attendance === "Missed" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400 hover:bg-rose-100"}`}
                              >
                                <XCircle size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------- TAB 5: EXAMS ----------------- */}
        {activeTab === "exams" && (
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">{t("გამოცდების ტრეკერი", "Exams Tracker")}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t("ადევნეთ თვალი შუალედურ და დასკვნით გამოცდებს", "Track your midterms and final exams easily")}</p>
              </div>
              <button
                onClick={() => setIsExamModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-all"
              >
                <Plus size={14} /> {t("გამოცდის დამატება", "Add Exam")}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => {
                const countdown = getDaysRemaining(exam.date);
                return (
                  <div key={exam.id} className="rounded-2xl border border-slate-100 p-5 bg-white shadow-sm relative group hover:border-emerald-200 transition-all">
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${countdown.color}`}>
                        {countdown.label}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{exam.type}</span>
                    </div>

                    <h4 className="mt-3 text-sm font-bold text-slate-800">{exam.subject}</h4>

                    <div className="mt-4 flex flex-col gap-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon size={14} className="text-slate-400" />
                        <span>{exam.date} ({exam.time})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-slate-400" />
                        <span>{exam.room}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

     {/* ----------------- AI ASSISTANT MODAL ----------------- */}
{isAIModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
    {/* დაემატა max-h-[85vh] flex flex-col */}
    <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{t("AI სწავლის ასისტენტი", "AI Study Assistant")}</h3>
            <p className="text-[11px] text-slate-400">{t("მიიღეთ რჩევები და დაშალეთ დავალებები", "Get recommendations and task breakdowns")}</p>
          </div>
        </div>
        <button onClick={() => setIsAIModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleAiAsk} className="mt-4 flex flex-col gap-3 shrink-0">
        <textarea
          rows={3}
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder={t("მაგ: როგორ მოვემზადო მონაცემთა სტრუქტურების გამოცდისთვის?", "e.g. How should I break down my Data Structures project?")}
          className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={isAiLoading}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isAiLoading ? t("ფიქრობს...", "Thinking...") : <><Send size={14} /> {t("კითხვა AI-ს", "Ask AI")}</>}
        </button>
      </form>

      {/* დაემატა overflow-y-auto max-h-[350px] */}
      {aiResponse && (
        <div className="mt-4 overflow-y-auto max-h-[350px] rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
          {aiResponse}
        </div>
      )}
    </div>
  </div>
)}

      {/* ----------------- MODAL: ADD TASK ----------------- */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">{t("დავალების დამატება", "Add Assignment")}</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("სათაური", "Title")}</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("საგანის სახელი", "Subject Name")}</label>
                <input
                  type="text"
                  required
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("თარიღი", "Date")}</label>
                  <input
                    type="date"
                    required
                    value={newTask.date}
                    onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("დრო", "Time")}</label>
                  <input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                {t("შენახვა", "Save Task")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: ADD SUBJECT ----------------- */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">{t("საგნის დამატება", "Add Subject")}</h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("საგნის კოდი (მაგ: CS-101)", "Subject Code (e.g. CS-101)")}</label>
                <input
                  type="text"
                  required
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("საგნის დასახელება", "Subject Title")}</label>
                <input
                  type="text"
                  required
                  value={newSubject.title}
                  onChange={(e) => setNewSubject({ ...newSubject, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("ლექტორი", "Lecturer / Teacher")}</label>
                <input
                  type="text"
                  value={newSubject.teacher}
                  onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                {t("შენახვა", "Save Subject")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: ADD SCHEDULE ITEM ----------------- */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">{t("ცხრილში დამატება", "Add Class to Schedule")}</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddScheduleItem} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("კვირის დღე", "Day of Week")}</label>
                <select
                  value={newScheduleItem.day}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, day: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("საგანის დასახელება", "Subject Title")}</label>
                <input
                  type="text"
                  required
                  value={newScheduleItem.subject}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, subject: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("დაწყება", "Start Time")}</label>
                  <input
                    type="time"
                    value={newScheduleItem.startTime}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, startTime: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("დასრულება", "End Time")}</label>
                  <input
                    type="time"
                    value={newScheduleItem.endTime}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, endTime: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("აუდიტორია / ლოკაცია", "Room / Location")}</label>
                <input
                  type="text"
                  value={newScheduleItem.room}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, room: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                {t("შენახვა", "Save Class")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: ADD EXAM ----------------- */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">{t("გამოცდის დამატება", "Add Exam")}</h3>
              <button onClick={() => setIsExamModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddExam} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("საგანის დასახელება", "Subject Title")}</label>
                <input
                  type="text"
                  required
                  value={newExam.subject}
                  onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("გამოცდის ტიპი", "Exam Type")}</label>
                <select
                  value={newExam.type}
                  onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                >
                  <option value="Midterm Exam">{t("შუალედური გამოცდა", "Midterm Exam")}</option>
                  <option value="Final Exam">{t("დასკვნითი გამოცდა", "Final Exam")}</option>
                  <option value="Quiz">{t("ქვიზი", "Quiz")}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("თარიღი", "Date")}</label>
                  <input
                    type="date"
                    required
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">{t("დრო", "Time")}</label>
                  <input
                    type="time"
                    value={newExam.time}
                    onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">{t("აუდიტორია / დარბაზი", "Room / Hall")}</label>
                <input
                  type="text"
                  value={newExam.room}
                  onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                {t("შენახვა", "Save Exam")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}