// api/comment.js
import fetch from 'node-fetch';
export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).send('Method not allowed');
  const token = req.headers['x-meow-token'];
  if(!token) return res.status(401).send('Not authenticated');
  const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
  if(!body || !body.body) return res.status(400).send('Missing comment body');
  const owner = process.env.REPO_OWNER || 'aeronje';
  const repo = process.env.REPO_NAME || 'meowtivationhub';
  const issue = process.env.ISSUE_NUMBER || '1';
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue}/comments`;
  const r = await fetch(url, {method:'POST', headers:{'Authorization': `token ${token}`, 'User-Agent':'meow-client', 'Content-Type':'application/json'}, body: JSON.stringify({body: body.body})});
  if(!r.ok){ const t = await r.text(); return res.status(500).send(t); }
  const j = await r.json();
  return res.json(j);
}
