// api/callback.js
// Exchanges code for token and sets a short-lived cookie (no storage)
import fetch from 'node-fetch';
export default async function handler(req, res){
const { code, state } = req.query;
if(!code) return res.status(400).send('Missing code');
const tokenRes = await fetch('https://github.com/login/oauth/access_token',{
method:'POST',
headers:{'Accept':'application/json','Content-Type':'application/json'},
body: JSON.stringify({client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code})
});
const tokenJson = await tokenRes.json();
if(tokenJson.error) return res.status(500).send(JSON.stringify(tokenJson));
const access_token = tokenJson.access_token;
// set a short-lived cookie so front-end can call server endpoints with credentials
res.setHeader('Set-Cookie', `meow_token_present=1; HttpOnly; Path=/; Max-Age=3600; Secure`);
// store the token **temporarily** by proxying all GitHub calls through the server using Authorization: bearer ${access_token}
// For a simple approach we encode the token and return it in the body (developer note: returning token in body is less secure — for production, use safer session handling)
res.writeHead(200, {'Content-Type':'text/html'});
res.end(`<html><body><script>window.opener && window.opener.postMessage({type:'meow_token', token:'${access_token}'}, '*');window.close();</script><p>Authenticated — you can close this window.</p></body></html>`);
}
