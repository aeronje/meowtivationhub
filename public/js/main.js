// ==============================
// DOM REFS
// ==============================
const likeBtn = document.getElementById("likeBtn");
const commentToggle = document.getElementById("commentToggle");
const commentForm = document.getElementById("commentForm");
const commentText = document.getElementById("commentText");
const submitComment = document.getElementById("submitComment");
const cancelComment = document.getElementById("cancelComment");
const noticeBar = document.getElementById("notice");

// ==============================
// NOTICE SYSTEM
// ==============================
function setNotice(msg, timeout = 1500) {
  if (!noticeBar) return;
  noticeBar.textContent = msg;
  noticeBar.classList.remove("hidden");
  if (timeout) setTimeout(() => noticeBar.classList.add("hidden"), timeout);
}

// ==============================
// TOKEN STORAGE
// ==============================
function saveToken(token) {
  localStorage.setItem("meow_token", token);
}

function getToken() {
  return localStorage.getItem("meow_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { "x-meow-token": token } : {};
}

// ==============================
// RECEIVE OAUTH TOKEN FROM POPUP
// ==============================
window.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "meow_token") return;

  const token = event.data.token;
  if (token) {
    console.log("Received GitHub token:", token);
    saveToken(token);
    setNotice("Authenticated — welcome back!", 2000);
  }
});

// ==============================
// LOGIN FLOW (POPUP)
// ==============================
function promptLogin(reason) {
  const ok = confirm(
    reason + "\n\nYou will be redirected to GitHub to authorize."
  );
  if (!ok) return;

  const w = window.open(
    "/api/login",
    "github_login",
    "width=720,height=700"
  );

  const timer = setInterval(() => {
    if (w && w.closed) {
      clearInterval(timer);
      setNotice("Returning from GitHub — verifying session...");
    }
  }, 500);
}

// ==============================
// LIKE / STAR
// ==============================
if (likeBtn) {
  likeBtn.addEventListener("click", async () => {
    setNotice("Processing like...");

    const res = await fetch("/api/toggle-star", {
      method: "POST",
      credentials: "include",
      headers: authHeaders()
    });

    if (res.status === 401) {
      promptLogin("To star this repository, you must sign in with GitHub.");
      setNotice("Please login to continue.");
      return;
    }

    if (!res.ok) {
      setNotice("Error: " + (await res.text()));
      return;
    }

    const j = await res.json();
    likeBtn.textContent = j.starred ? "★ Starred" : "☆ Like";
    setNotice(j.starred ? "Repository starred ⭐" : "Repository unstarred");
  });
}

// ==============================
// COMMENT UI EVENTS
// ==============================
if (commentToggle) {
  commentToggle.addEventListener("click", () => {
    commentForm.classList.toggle("hidden");
  });
}

if (cancelComment) {
  cancelComment.addEventListener("click", () => {
    commentForm.classList.add("hidden");
    commentText.value = "";
  });
}

if (submitComment) {
  submitComment.addEventListener("click", async () => {
    const body = commentText.value.trim();
    if (!body) {
      setNotice("Comment cannot be empty");
      return;
    }

    setNotice("Posting comment...");

    const res = await fetch("/api/comment", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify({ body })
    });

    if (res.status === 401) {
      promptLogin("To post a comment you must sign in with GitHub.");
      return;
    }

    if (!res.ok) {
      setNotice("Error: " + (await res.text()));
      return;
    }

    setNotice("Comment posted — thanks!");
    commentForm.classList.add("hidden");
    commentText.value = "";
  });
}

// ==============================
// INIT
// ==============================
(async function init() {
  try {
    const token = getToken();
    if (!token) return; // user not logged in

    const res = await fetch("/api/status", {
      credentials: "include",
      headers: authHeaders()
    });

    if (!res.ok) return;

    const j = await res.json();

    if (likeBtn)
      likeBtn.textContent = j.starred ? "★ Starred" : "☆ Like";

    if (j.username)
      setNotice("Signed in as " + j.username, 2000);

  } catch (err) {
    console.warn("Init failed:", err);
  }
})();
