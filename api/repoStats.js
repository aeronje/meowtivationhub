// Ron Penones | November 20th 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

export default async function handler(req, res) {
  try {
    const owner = "aeronje"; // Pangalan ng repository owner.
    const repo = "meowtivationhub"; // Pangalan ng repository.
    const issueNumber = 1; // Iyong issue number sa repository.

    // Ito iyong magbibilang ng stars.
    const repoResp = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoResp.ok) {
      const text = await repoResp.text();
      throw new Error(`GitHub repo fetch failed: ${repoResp.status} ${text}`);
    }
    const repoData = await repoResp.json();
    const totalStars = repoData.stargazers_count || 0;

    // Ito iyong kukuha ng issue comments.
    const commentsResp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`
    );
    if (!commentsResp.ok) {
      const text = await commentsResp.text();
      throw new Error(`GitHub comments fetch failed: ${commentsResp.status} ${text}`);
    }
    const comments = await commentsResp.json();
    const totalComments = Array.isArray(comments) ? comments.length : 0;

    // Magbibilang ng comments per date for last 14 days.
    const today = new Date();
    const cutOff = new Date(today);
    cutOff.setDate(cutOff.getDate() - 14);
    const commentStatsMap = {};

    if (Array.isArray(comments)) {
      comments.forEach((c) => {
        const d = new Date(c.created_at);
        if (d >= cutOff) {
          // Bale iyong format nito ay MonthName Day, Year (e.g., November 20, 2025).
          const key = d.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          commentStatsMap[key] = (commentStatsMap[key] || 0) + 1;
        }
      });
    }

    // Tapos ni-convert ko by most recent date descending.
    const commentStats = Object.keys(commentStatsMap)
      .sort((a, b) => new Date(b) - new Date(a))
      .reduce((acc, k) => {
        acc[k] = commentStatsMap[k];
        return acc;
      }, {});

    return res.status(200).json({
      totalStars,
      totalComments,
      commentStats
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "unknown error" });
  }
}
