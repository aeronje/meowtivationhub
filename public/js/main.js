// === Initialize Plyr ===

document.addEventListener("DOMContentLoaded", () => {
    new Plyr('#player');

    setupButtons();
    fetchStars();
    fetchComments();
});

// === BUTTON POPUP HANDLERS ===
function setupButtons() {
    const likeBtn = document.getElementById("likeBtn");
    const commentToggle = document.getElementById("commentToggle");

    likeBtn.addEventListener("click", () => {
        showPopup(
            "Login to GitHub so you can star the repo for this content.",
            "https://github.com/aeronje/meowtivationhub"
        );
    });

    commentToggle.addEventListener("click", () => {
        showPopup(
            "Login to GitHub so you can post your thoughts on the issue.",
            "https://github.com/aeronje/meowtivationhub/issues/1"
        );
    });
}

// === POPUP UI (simple markdown-style overlay) ===
function showPopup(message, link) {
    const div = document.createElement("div");
    div.className = "popup-overlay";

    div.innerHTML = `
        <div class="popup-card">
            <p>${message}</p>
            <a href="${link}" target="_blank" class="popup-link">Go to GitHub</a>
            <button class="popup-close">Close</button>
        </div>
    `;

    document.body.appendChild(div);
    div.querySelector(".popup-close").onclick = () => div.remove();
}



// === FETCH STAR COUNT FROM GITHUB ===
async function fetchStars() {
    try {
        const res = await fetch("https://api.github.com/repos/aeronje/meowtivationhub");
        const data = await res.json();

        const count = data.stargazers_count || 0;

        document.getElementById("starCount").textContent =
            `⭐ Repo Stars: ${count}`;
    } catch (err) {
        console.error("Error fetching stars:", err);
    }
}



// === FETCH LATEST 5 COMMENTS FROM ISSUE #1 ===
async function fetchComments() {
    try {
        const res = await fetch("https://api.github.com/repos/aeronje/meowtivationhub/issues/1/comments");
        const comments = await res.json();

        const latest = comments.slice(-5).reverse(); // latest first

        const container = document.getElementById("commentList");
        container.innerHTML = "";

        latest.forEach(c => {
            const div = document.createElement("div");
            div.className = "comment-item";
            div.innerHTML = `
                <p class="comment-author">🐱 ${c.user?.login}</p>
                <p class="comment-body">${c.body}</p>
                <hr/>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        console.error("Error fetching comments:", err);
    }
}
