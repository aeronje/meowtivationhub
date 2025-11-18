// api/login.js
export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  // ALWAYS use PUBLIC_URL if set
  let baseUrl = process.env.PUBLIC_URL;

  // Fallback (rare): if PUBLIC_URL missing, fallback to VERCEL_URL
  if (!baseUrl) {
    baseUrl = process.env.VERCEL_URL;
  }

  // Fallback for local dev
  const redirectUri = baseUrl
    ? `https://${baseUrl}/api/callback`
    : `http://localhost:3000/api/callback`;

  const state = Math.random().toString(36).substring(2);
  const scope = "public_repo";

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&state=${state}`;

  res.writeHead(302, { Location: url });
  res.end();
}
