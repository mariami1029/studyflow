const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JSON ფაილის გზა
const USERS_FILE = path.join(__dirname, 'users.json');

// Helper: მომხმარებლების წაკითხვა ფაილიდან
const getUsersFromFile = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
};

// Helper: მომხმარებლების ჩაწერა ფაილში
const saveUsersToFile = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// ==========================================
// 1. IN-MEMORY DATA (ASSIGNMENTS, SCHEDULE, ETC.)
// ==========================================

let subjects = [
  { id: 1, code: "CS-201", title: "Data Structures", teacher: "Prof. Giorgi Beridze", progress: 65 },
  { id: 2, code: "WEB-302", title: "Web Architecture", teacher: "Prof. Aleks Nozadze", progress: 40 },
  { id: 3, code: "MATH-101", title: "Linear Algebra", teacher: "Prof. Elene Dolidze", progress: 85 }
];

let assignments = [
  { id: 1, title: "Midterm Exam Project", subject: "Data Structures", code: "CS", date: "2026-08-05", time: "10:00", status: "Pending", completed: false, grade: "" },
  { id: 2, title: "Assignment #4 - Matrices", subject: "Linear Algebra", code: "MA", date: "2026-08-10", time: "14:00", status: "Pending", completed: false, grade: "" },
  { id: 3, title: "Next.js Project Submission", subject: "Web Architecture", code: "WEB", date: "2026-08-15", time: "23:59", status: "In Progress", completed: false, grade: "" }
];

let schedule = [
  { id: 1, day: "Monday", startTime: "09:00", endTime: "10:30", subject: "Data Structures", room: "Auditorium 302", type: "Lecture", attendance: "Pending" },
  { id: 2, day: "Monday", startTime: "11:00", endTime: "12:30", subject: "Linear Algebra", room: "Building B, Hall 2", type: "Seminar", attendance: "Pending" },
  { id: 3, day: "Tuesday", startTime: "10:00", endTime: "11:30", subject: "Web Architecture", room: "Lab 105", type: "Lab", attendance: "Pending" }
];

let exams = [
  { id: 1, subject: "Data Structures", type: "Midterm Exam", date: "2026-08-05", time: "10:00", room: "Auditorium 302", attendance: "Pending" },
  { id: 2, subject: "Linear Algebra", type: "Final Exam", date: "2026-08-12", time: "14:00", room: "Hall B", attendance: "Pending" }
];

// ==========================================
// 2. AUTH ENDPOINTS (REGISTER & LOGIN)
// ==========================================

// რეგისტრაცია
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const users = getUsersFromFile();

  // შემოწმება, ხომ არ არსებობს უკვე ეს იუზერი
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = { id: Date.now(), name: name || "Student", email, password };
  users.push(newUser);
  saveUsersToFile(users);

  res.status(201).json({ message: "Registration successful", user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// ავტორიზაცია (Login)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const users = getUsersFromFile();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
});

// ==========================================
// 3. OTHER API ENDPOINTS
// ==========================================

// --- SUBJECTS ---
app.get('/api/subjects', (req, res) => res.json(subjects));

// --- ASSIGNMENTS ---
app.get('/api/assignments', (req, res) => res.json(assignments));

app.post('/api/assignments', (req, res) => {
  const newAssignment = { id: Date.now(), ...req.body, status: req.body.status || "Pending", grade: req.body.grade || "" };
  assignments.push(newAssignment);
  res.status(201).json(newAssignment);
});

app.patch('/api/assignments/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = assignments.find(a => a.id === id);
  if (!task) return res.status(404).json({ error: "Assignment not found" });

  if (req.body.status !== undefined) task.status = req.body.status;
  if (req.body.grade !== undefined) task.grade = req.body.grade;
  res.json(task);
});

app.delete('/api/assignments/:id', (req, res) => {
  const id = Number(req.params.id);
  assignments = assignments.filter(item => item.id !== id);
  res.json({ message: "Assignment deleted successfully" });
});

// --- SCHEDULE ---
app.get('/api/schedule', (req, res) => res.json(schedule));

app.post('/api/schedule', (req, res) => {
  const newItem = { id: Date.now(), ...req.body, attendance: "Pending" };
  schedule.push(newItem);
  res.status(201).json(newItem);
});

app.patch('/api/schedule/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = schedule.find(s => s.id === id);
  if (!item) return res.status(404).json({ error: "Schedule item not found" });

  if (req.body.attendance !== undefined) item.attendance = req.body.attendance;
  res.json(item);
});

app.delete('/api/schedule/:id', (req, res) => {
  const id = Number(req.params.id);
  schedule = schedule.filter(item => item.id !== id);
  res.json({ message: "Schedule item deleted successfully" });
});

// --- EXAMS ---
app.get('/api/exams', (req, res) => res.json(exams));

app.post('/api/exams', (req, res) => {
  const newExam = { id: Date.now(), ...req.body };
  exams.push(newExam);
  res.status(201).json(newExam);
});

app.delete('/api/exams/:id', (req, res) => {
  const id = Number(req.params.id);
  exams = exams.filter(item => item.id !== id);
  res.json({ message: "Exam deleted successfully" });
});

// --- AI ASSISTANT ---
app.post('/api/ai/ask', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const aiResponse = `🤖 AI ასისტენტი:\n\nთქვენი შეკითხვა იყო: "${prompt}"\n\n💡 რჩევა: დაყავით დავალება მცირე ეტაპებად, გამოიყენეთ 25-წუთიანი კონცენტრაციის ინტერვალები (Pomodoro) და ყოველდღიურად გადახედეთ განვლილ მასალას!`;
  res.json({ response: aiResponse });
});

// ==========================================
// 4. SERVER START
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:5000`);
});