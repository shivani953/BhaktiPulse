// ✅ AUTO LOAD (SET TODAY DATE + LOAD DATA)
window.onload = function () {
  let today = new Date().toISOString().split("T")[0];
  document.getElementById("date").value = today;

  fetchData();
  fetchLogs();
};

// ✅ SUBMIT DATA
function submitData() {
  let name = document.getElementById("name").value.trim();
  let date = document.getElementById("date").value;
  let count = parseInt(document.getElementById("count").value);

  // 🔴 VALIDATION
  if (!name || !date || isNaN(count) || count <= 0) {
    alert("Please enter valid details ❌");
    return;
  }

  fetch("http://localhost:5000/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, date, count })
  })
    .then(res => res.json())
    .then(() => {
      // ✅ Update Individual Count
      document.getElementById("individual").innerText = count;

      // ✅ Refresh Dashboard + Logs
      fetchData();
      fetchLogs();

      // ✅ Clear inputs (keep date)
      document.getElementById("name").value = "";
      document.getElementById("count").value = "";
    })
    .catch(() => {
      alert("Backend connection failed ❌");
    });
}

// ✅ FETCH DASHBOARD DATA
function fetchData() {
  fetch("http://localhost:5000/data")
    .then(res => res.json())
    .then(data => {
      document.getElementById("total").innerText = data.total || 0;
      document.getElementById("today").innerText = data.todayTotal || 0;
      document.getElementById("users").innerText = data.users || 0;
    })
    .catch(err => {
      console.log(err);
    });
}

// ✅ FETCH TODAY ACTIVITY + LEADERBOARD
function fetchLogs() {
  fetch("http://localhost:5000/logs")
    .then(res => res.json())
    .then(data => {
      let list = document.getElementById("logList");
      list.innerHTML = "";

      let today = new Date().toISOString().split("T")[0];

      // 🔥 FILTER ONLY TODAY DATA
      let todayData = data.filter(item => item.date === today);

      // ❌ NO DATA CASE
      if (todayData.length === 0) {
        let li = document.createElement("li");
        li.innerText = "No activity today 🙏";
        list.appendChild(li);
        return;
      }

      // 🔥 GROUP BY USER
      let userTotals = {};

      todayData.forEach(item => {
        if (!userTotals[item.name]) {
          userTotals[item.name] = 0;
        }
        userTotals[item.name] += item.count;
      });

      // 🔥 SORT + DISPLAY (LEADERBOARD)
      let rank = 1;

      Object.entries(userTotals)
        .sort((a, b) => b[1] - a[1]) // highest first
        .forEach(([name, total]) => {
          let li = document.createElement("li");
          li.innerText = `${rank}. ${name} → ${total} `;
          list.appendChild(li);
          rank++;
        });
    })
    .catch(err => {
      console.log(err);
    });
}