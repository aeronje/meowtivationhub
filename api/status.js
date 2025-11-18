import fetch from "node-fetch";

export default async function handler(req, res) {
  const { token } = req.query;
  const owner = process.env.REPO_OWNER;
  const repo = process.env.REPO_NAME;

  const response = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
    headers: {
      "Authorization": `token ${token}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "meowtivationhub-app"
    }
  });

  if (response.status === 204) {
    return res.status(200).json({ starred: true });
  } else {
    return res.status(200).json({ starred: false });
  }
}
