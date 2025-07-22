// Load entries from localStorage
function loadEntries() {
  return JSON.parse(localStorage.getItem("dailyEntries") || "[]");
}

// Save entries to localStorage
function saveEntries(entries) {
  localStorage.setItem("dailyEntries", JSON.stringify(entries));
}

// Add entry
document.getElementById("appForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const event = document.getElementById("event").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if (!date || !event) {
    alert("Date and Event are required!");
    return;
  }

  const newEntry = { date, event, notes };
  const entries = loadEntries();
  entries.push(newEntry);
  saveEntries(entries);

  document.getElementById("appForm").reset();
  alert("✅ Entry added successfully!");
  window.location.href = "view.html";
});

// Display entries
function displayEntries(filteredEntries = null) {
  const list = document.getElementById("appList");
  if (!list) return;

  const entries = filteredEntries || loadEntries();
  list.innerHTML = "";

  if (entries.length === 0) {
    list.innerHTML = "<p>No entries found.</p>";
    return;
  }

  entries.forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "entry";

    div.innerHTML = `
      <strong>${entry.date}</strong> – ${entry.event}<br>
      ${entry.notes ? `<small>🗒️ ${entry.notes}</small><br>` : ""}
      <button onclick="deleteEntry(${index})">🗑 Delete</button>
    `;

    list.appendChild(div);
  });
}

// Delete entry
function deleteEntry(index) {
  if (!confirm("Are you sure you want to delete this entry?")) return;

  const entries = loadEntries();
  entries.splice(index, 1);
  saveEntries(entries);
  displayEntries();
}

// Search entries by date, event, or notes
document.getElementById("searchInput")?.addEventListener("input", function (e) {
  const term = e.target.value.toLowerCase();
  const entries = loadEntries();

  const filtered = entries.filter(entry =>
    entry.date.includes(term) ||
    entry.event.toLowerCase().includes(term) ||
    entry.notes.toLowerCase().includes(term)
  );

  displayEntries(filtered);
});

// Sort entries by date
function sortEntries() {
  const entries = loadEntries();
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveEntries(entries);
  displayEntries();
}

// ✅ Export as human-readable TXT (NOT JSON)
function exportData() {
  const entries = loadEntries();

  if (entries.length === 0) {
    alert("No entries to export!");
    return;
  }

  let content = "📦 My Daily Tracker - Exported Data\n-------------------------------------\n\n";

  entries.forEach(entry => {
    content += `📅 ${entry.date}\n✍️ ${entry.event}\n`;
    if (entry.notes) {
      content += `🗒️ ${entry.notes}\n`;
    }
    content += `\n`; // blank line between entries
  });

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "my_daily_tracker_entries.txt";
  a.click();

  URL.revokeObjectURL(url);
}

// Run on page load
window.onload = function () {
  displayEntries();
};
