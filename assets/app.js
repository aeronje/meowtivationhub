// MeowtivationHub front-end logic
try{
const res = await fetch('/api/session', {credentials:'include'});
if(!res.ok) return null;
const j = await res.json();
return j; // {loggedIn: true, username: '...'}
}catch(e){ return null; }
}


// Login popup flow
function promptLogin(reason){
// show modal-like popup: simple confirm for now
const ok = confirm(reason + '\n\nYou will be redirected to GitHub to authorize. (serverless exchange on Vercel)');
if(!ok) return;
// open auth flow in popup
const w = window.open('/api/login','github_login','width=720,height=700');
// try to detect when popup closed
const timer = setInterval(()=>{
if(w && w.closed){
clearInterval(timer);
// try to refresh session
setNotice('Returning from GitHub — verifying session...');
}
},500);
}


// Like (star) toggle
likeBtn.addEventListener('click', async ()=>{
setNotice('Processing like...');
// call server to toggle star
const res = await fetch('/api/toggle-star', {method:'POST', credentials:'include'});
if(res.status===401){
promptLogin('To like/star this repository you must sign in with GitHub.');
setNotice('Please login to continue.');
return;
}
if(!res.ok){
const t = await res.text();
setNotice('Error: ' + t);
return;
}
const j = await res.json();
likeBtn.textContent = j.starred ? '★ Starred' : '☆ Like';
setNotice(j.starred ? 'Repository starred ✅' : 'Repository unstarred');
});


// Comment UI
commentToggle.addEventListener('click', ()=>{ commentForm.classList.toggle('hidden'); });
cancelComment.addEventListener('click', ()=>{ commentForm.classList.add('hidden'); commentText.value=''; });


submitComment.addEventListener('click', async ()=>{
const body = commentText.value.trim();
if(!body) { setNotice('Comment cannot be empty'); return; }
setNotice('Posting comment...');
const res = await fetch('/api/comment', {method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({body})});
if(res.status===401){ promptLogin('To post a comment you must sign in with GitHub.'); return; }
if(!res.ok){ const t = await res.text(); setNotice('Error: '+t); return; }
setNotice('Comment posted — thanks!');
commentForm.classList.add('hidden'); commentText.value='';
});


// On load, try to query session to update like button state
(async function init(){
try{
const res = await fetch('/api/status', {credentials:'include'});
if(res.ok){
const j = await res.json();
likeBtn.textContent = j.starred ? '★ Starred' : '☆ Like';
if(j.username) setNotice('Signed in as ' + j.username, 3000);
}
}catch(e){ console.warn(e); }
})();
