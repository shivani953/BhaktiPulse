const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 ONLY MEMORY STORAGE
let logs = [];

// HOME
app.get("/", (req, res) => {
  res.send("🚀 BhaktiPulse Backend Running");
});

// SUBMIT
app.post("/submit", (req, res) => {
  const { name, date, count } = req.body;

  let time = new Date().toLocaleTimeString();

  logs.push({ name, count, date, time });

  res.json({ message: "Saved" });
});

// DASHBOARD (DYNAMIC CALCULATION)
app.get("/data", (req, res) => {
  let today = new Date().toISOString().split("T")[0];

  let todayTotal = logs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.count, 0);

  let total = logs.reduce((sum, log) => sum + log.count, 0);

  let users = new Set(logs.map(log => log.name));

  res.json({
    total,
    todayTotal,
    users: users.size
  });
});

// TODAY LOGS
app.get("/logs", (req, res) => {
  let today = new Date().toISOString().split("T")[0];

  let todayLogs = logs.filter(log => log.date === today);

  res.json(todayLogs);
});

// START SERVER
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});