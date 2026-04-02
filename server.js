const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

// ✅ CORS (important for frontend connection)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

let logs = [];

// ✅ LOAD DATA
if (fs.existsSync("data.json")) {
  logs = JSON.parse(fs.readFileSync("data.json"));
}

// ✅ HOME ROUTE
app.get("/", (req, res) => {
  res.send("🚀 BhaktiPulse Backend Running Online");
});

// ✅ SUBMIT DATA
app.post("/submit", (req, res) => {
  const { name, date, count } = req.body;

  if (!name || !count || count <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  logs.push({
    name,
    count,
    date,
    time: new Date().toLocaleTimeString()
  });

  fs.writeFileSync("data.json", JSON.stringify(logs, null, 2));

  res.json({ message: "Saved successfully ✅" });
});

// ✅ DASHBOARD DATA
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

// ✅ TODAY LOGS (WITH INDEX)
app.get("/logs", (req, res) => {
  let today = new Date().toISOString().split("T")[0];

  let todayLogs = logs
    .map((log, index) => ({ ...log, index }))
    .filter(log => log.date === today);

  res.json(todayLogs);
});

// ✅ DELETE ENTRY
app.delete("/delete/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (logs[index] !== undefined) {
    logs.splice(index, 1);

    fs.writeFileSync("data.json", JSON.stringify(logs, null, 2));

    res.json({ message: "Deleted successfully 🗑️" });
  } else {
    res.status(404).json({ error: "Entry not found ❌" });
  }
});

// ✅ DEPLOY PORT (IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
