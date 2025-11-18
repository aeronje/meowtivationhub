// api/login.js
export default function handler(req, res) {
const clientId = process.env.GITHUB_CLIENT_ID;
const redirectUri = (process.env.PUBLIC_URL || process.env.VERCEL_URL) ? `https://${process.env.VERCEL_URL || process.env.PUBLIC_URL}/api/callback` : `http://localhost:3000/api/callback`;
const state = Math.random().toString(36).substring(2);
// NOTE: you may want to store state in a short-lived cookie to verify in callback (skipped for brevity)
const scope = 'public_repo';
const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
res.writeHead(302, { Location: url });
res.end();
}
