// Ron Penones | November 20th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

(async function () {
  const starsEl = document.getElementById("stars");
  const commentsEl = document.getElementById("comments");
  const tableBody = document.getElementById("commentTableBody");

  function showError(msg) {
    if (starsEl) starsEl.innerText = "Error";
    if (commentsEl) commentsEl.innerText = "Error";
    if (tableBody) {
      tableBody.innerHTML = "<tr><td colspan='2'>Error loading data</td></tr>";
    }
    console.error(msg);
  }

  try {
    const resp = await fetch("/api/repoStats", { cache: "no-store" });
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`API returned ${resp.status}: ${t}`);
    }
    const data = await resp.json();

    starsEl.innerText = data.totalStars ?? 0;
    commentsEl.innerText = data.totalComments ?? 0;

    const stats = data.commentStats || {};
    const entries = Object.entries(stats);

    if (entries.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='2'>No comments in the last 14 days</td></tr>";
    } else {
      tableBody.innerHTML = "";
      
      entries.forEach(([date, count]) => {
        const tr = document.createElement("tr");
        const tdDate = document.createElement("td");
        const tdCount = document.createElement("td");
        tdDate.textContent = date;
        tdCount.textContent = count;
        tr.appendChild(tdDate);
        tr.appendChild(tdCount);
        tableBody.appendChild(tr);
      });
    }
  } catch (err) {
    showError(err.message || err);
  }
})();
