// app.js - clean shared logic
const KEY_Q = 'aq_questions';
const KEY_USERS = 'aq_users';
const KEY_CURRENT = 'aq_currentUser';
const KEY_BOARD = 'leaderboard';
const KEY_LAST = 'aq_lastResult';

/* -------- seed defaults (only first time) -------- */
function seedDefaults(){
  if(localStorage.getItem(KEY_Q)) return;
  const defaultQuestions = {
    science:[ {question:"Which planet is known as the Red Planet?",options:["Earth","Mars","Jupiter","Venus"],answer:"Mars"},
      {question:"Water boils at what temperature at sea level?",options:["90°C","100°C","110°C","120°C"],answer:"100°C"},
      {question:"Which gas do plants absorb for photosynthesis?",options:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"],answer:"Carbon Dioxide"},
      {question:"What is the chemical symbol for water?",options:["H2O","O2","CO2","NaCl"],answer:"H2O"},
      {question:"Which organ pumps blood around the body?",options:["Liver","Lungs","Heart","Kidneys"],answer:"Heart"},
      {question:"Which force keeps us on the ground?",options:["Magnetism","Gravity","Friction","Inertia"],answer:"Gravity"},
      {question:"What is the center of an atom called?",options:["Electron","Nucleus","Proton","Orbit"],answer:"Nucleus"},
      {question:"Which particle has a negative charge?",options:["Proton","Neutron","Electron","Photon"],answer:"Electron"} ],
    maths:[ {question:"What is 12 × 8?",options:["96","84","108","92"],answer:"96"},
      {question:"Square root of 144?",options:["10","14","12","8"],answer:"12"},
      {question:"15% of 200 is?",options:["20","25","30","35"],answer:"30"},
      {question:"What is 7 + 9 × 2 ? (use order of operations)",options:["25","32","26","34"],answer:"25"},
      {question:"What is 9² ?",options:["18","81","72","27"],answer:"81"},
      {question:"Perimeter of square side 5?",options:["10","15","20","25"],answer:"20"},
      {question:"What is 1/2 + 1/4 ?",options:["3/4","2/3","4/5","1/4"],answer:"3/4"},
      {question:"If x=3, evaluate 2x+5",options:["11","10","8","9"],answer:"11"} ],
    computers:[ {question:"CPU stands for?",options:["Central Position Unit","Central Processing Unit","Computer Power Unit","Control Panel Utility"],answer:"Central Processing Unit"},
      {question:"1 Byte equals how many bits?",options:["4 bits","8 bits","16 bits","32 bits"],answer:"8 bits"},
      {question:"HTML is primarily used for?",options:["Styling pages","Structuring content","Programming logic","Databases"],answer:"Structuring content"},
      {question:"Which language runs in the browser?",options:["Python","JavaScript","C++","Swift"],answer:"JavaScript"},
      {question:"What is an algorithm?",options:["A recipe/steps to solve a problem","A storage device","A programming language","A graphic"],answer:"A recipe/steps to solve a problem"},
      {question:"Which is non-volatile memory?",options:["RAM","ROM","Cache","Register"],answer:"ROM"},
      {question:"Which of these is a database?",options:["MySQL","HTML","CSS","HTTP"],answer:"MySQL"},
      {question:"What does API stand for?",options:["Application Programming Interface","Applied Program Instruction","Auto Program Integration","Active Process Index"],answer:"Application Programming Interface"} ],
    gk:[ {question:"Capital of France?",options:["Rome","Berlin","Madrid","Paris"],answer:"Paris"},
      {question:"Who wrote 'Hamlet'?",options:["Charles Dickens","William Shakespeare","Mark Twain","Leo Tolstoy"],answer:"William Shakespeare"},
      {question:"Which is the largest ocean?",options:["Atlantic","Indian","Arctic","Pacific"],answer:"Pacific"},
      {question:"Which country is known as Land of Rising Sun?",options:["China","Japan","South Korea","Thailand"],answer:"Japan"},
      {question:"Which year did India gain independence?",options:["1945","1947","1950","1952"],answer:"1947"},
      {question:"Capital city of India?",options:["Mumbai","Kolkata","New Delhi","Chennai"],answer:"New Delhi"},
      {question:"Who painted the Mona Lisa?",options:["Van Gogh","Leonardo da Vinci","Pablo Picasso","Claude Monet"],answer:"Leonardo da Vinci"},
      {question:"How many continents are there?",options:["5","6","7","8"],answer:"7"} ],
    english:[ {question:"Synonym of 'Happy'?",options:["Sad","Joyful","Angry","Lazy"],answer:"Joyful"},
      {question:"Opposite of 'Brave'?",options:["Coward","Smart","Fearless","Bold"],answer:"Coward"},
      {question:"Choose the correct article: '___ apple a day...'",options:["A","An","The","No article"],answer:"An"},
      {question:"Plural of 'Child'?",options:["Childs","Children","Childes","Childer"],answer:"Children"},
      {question:"Pick the verb: 'She quickly ran home.'",options:["She","Quickly","Ran","Home"],answer:"Ran"},
      {question:"Fill: 'He is ___ tallest boy.'",options:["a","an","the","-"],answer:"the"},
      {question:"Synonym of 'Begin'?",options:["Start","End","Finish","Close"],answer:"Start"},
      {question:"Which is a noun?",options:["Run","Beautiful","Apple","Quickly"],answer:"Apple"} ]
  };
  localStorage.setItem(KEY_Q, JSON.stringify(defaultQuestions));
}

/* helpers */
function readDB(){ return JSON.parse(localStorage.getItem(KEY_Q) || '{}'); }
function saveDB(db){ localStorage.setItem(KEY_Q, JSON.stringify(db)); }
function getUsers(){ return JSON.parse(localStorage.getItem(KEY_USERS) || '[]'); }
function saveUsers(u){ localStorage.setItem(KEY_USERS, JSON.stringify(u)); }
function currentUser(){ return JSON.parse(localStorage.getItem(KEY_CURRENT) || 'null'); }
function setCurrentUser(u){ localStorage.setItem(KEY_CURRENT, JSON.stringify(u)); }
function clearCurrentUser(){ localStorage.removeItem(KEY_CURRENT); }

/* init */
document.addEventListener('DOMContentLoaded', ()=>{
  seedDefaults();
  const page = document.body.dataset.page || '';
  if(page==='index') initLogin();
  if(page==='signup') initSignup();
  if(page==='dashboard') initDashboard();
  if(page==='quiz') initQuiz();
  if(page==='result') initResult();
  if(page==='leaderboard') initLeaderboard();
  if(page==='admin') initAdmin();
});

/* ---------- LOGIN ---------- */
function initLogin(){
  const loginBtn = document.getElementById('loginBtn');
  const form = document.getElementById('loginForm');

  // wire UI form submit if present
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      handleLogin(document.getElementById('username').value.trim(), document.getElementById('password').value.trim());
    });
  }

  if(loginBtn){
    loginBtn.addEventListener('click', ()=>{
      handleLogin(document.getElementById('username').value.trim(), document.getElementById('password').value.trim());
    });
  }

  function handleLogin(ident, pwd){
    if(!ident || !pwd){ alert('Enter username/email and password'); return; }
    const users = getUsers();
    // find by username or email
    const user = users.find(u => u.name === ident || (u.email && u.email === ident));
    if(!user){ alert('User not registered. Please sign up.'); return; }
    if(user.pwd !== pwd){ alert('Wrong credentials!'); return; }
    // success
    setCurrentUser({ name: user.name, email: user.email || null });
    location.href = 'dashboard.html';
  }
}

/* ---------- SIGNUP ---------- */
function initSignup(){
  const createBtn = document.getElementById('createBtn');
  const form = document.getElementById('signupForm');

  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      handleSignup();
    });
  }
  if(createBtn) createBtn.addEventListener('click', handleSignup);

  function handleSignup(){
    const name = document.getElementById('su_name').value.trim();
    const email = document.getElementById('su_email').value.trim();
    const pass = document.getElementById('su_pass').value.trim();
    if(!name || !pass){ alert('Username & password required'); return; }
    let users = getUsers();
    if(users.find(u=>u.name===name || (email && u.email===email))){ alert('User exists — choose another username/email'); return; }
    users.push({ name, email: email || null, pwd: pass });
    saveUsers(users);
    alert('Account created. Please login.');
    // redirect to login page
    location.href = 'index.html';
  }
}

/* ---------- DASHBOARD ---------- */
function initDashboard(){
  const user = currentUser();
  document.getElementById('welcomeText').innerHTML = `<div style="font-size:18px">${user?user.name:'Guest'}</div><div style="opacity:.85;margin-top:6px">Choose a subject and start</div>`;
  document.getElementById('startQuiz').addEventListener('click', ()=> location.href='quiz.html');
  document.getElementById('goLeaderboard').addEventListener('click', ()=> location.href='leaderboard.html');
  document.getElementById('logoutBtn').addEventListener('click', ()=> { clearCurrentUser(); location.href='index.html'; });
  const qdb = readDB();
  const qcount = Object.values(qdb).reduce((s,a)=>s+a.length,0);
  document.getElementById('qcount').textContent = qcount;
  const attempts = JSON.parse(localStorage.getItem(KEY_BOARD) || '[]').length;
  document.getElementById('attempts').textContent = attempts;
}

/* ---------- QUIZ ---------- */
function initQuiz(){
  const subjectsGrid = document.getElementById('subjectsGrid');
  const subjectTitle = document.getElementById('subjectTitle');
  const qEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const timeInfo = document.getElementById('timeInfo');
  const negMarkEl = document.getElementById('negMark');
  const liveScoreEl = document.getElementById('liveScore');
  const qnIndex = document.getElementById('qnIndex');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const btnRestart = document.getElementById('btnRestart');
  const btnFinish = document.getElementById('btnFinish');

  let qdb = readDB();
  let subjects = Object.keys(qdb);
  let currentSubject = null, currentList = [], currentIndex = 0, score = 0;
  let timePerQuestion = 10, timeLeft = timePerQuestion, timer = null, userAnswers = [];

  function iconUrlFor(name){
    const map = { science:'https://img.icons8.com/fluency/96/000000/atom.png',
      maths:'https://img.icons8.com/fluency/96/000000/math.png',
      computers:'https://img.icons8.com/fluency/96/000000/artificial-intelligence.png',
      gk:'https://img.icons8.com/fluency/96/000000/worldwide-location.png',
      english:'https://img.icons8.com/fluency/96/000000/book.png' };
    return map[name] || 'https://img.icons8.com/fluency/96/000000/question-mark.png';
  }

  function renderSubjects(){
    qdb = readDB();
    subjects = Object.keys(qdb);
    subjectsGrid.innerHTML = '';
    subjects.forEach(s=>{
      const card = document.createElement('div'); card.className='subjectCard';
      card.innerHTML = `<div class="iconWrapper"><img src="${iconUrlFor(s)}" width="44" height="44" alt="${s}"/></div>
        <div style="flex:1"><div style="font-weight:800;text-transform:capitalize">${s}</div><div class="kv" style="margin-top:6px">Questions: ${(qdb[s]||[]).length}</div></div>`;
      card.addEventListener('click', ()=> startSubject(s));
      subjectsGrid.appendChild(card);
    });
  }
  renderSubjects();
  window.addEventListener('focus', ()=> renderSubjects());

  function updateMeta(){ liveScoreEl.textContent=Math.max(0,Math.round((score+Number.EPSILON)*100)/100); qnIndex.textContent=`${currentIndex+1}/${currentList.length}`; timeInfo.textContent=timePerQuestion; negMarkEl.textContent=(-0.25).toString(); }

  function clearTimer(){ if(timer) clearInterval(timer); timer=null; }
  function startTimer(){ clearTimer(); timeLeft=timePerQuestion; timeInfo.textContent=timeLeft; timer=setInterval(()=>{ timeLeft--; timeInfo.textContent=timeLeft; if(timeLeft<=0){ clearTimer(); handleTimeout(); } },1000); }

  function startSubject(sub){
    qdb = readDB(); currentSubject=sub; currentList = JSON.parse(JSON.stringify(qdb[sub]||[])); currentIndex=0; score=0; userAnswers=[];
    subjectTitle.textContent = `${sub.toUpperCase()} QUIZ`; loadQuestion(); updateMeta();
  }

  function loadQuestion(){
    clearTimer();
    const q = currentList[currentIndex];
    qEl.textContent = q.question;
    optionsEl.innerHTML = '';
    q.options.forEach(opt=>{
      const b = document.createElement('div'); b.className='option'; b.textContent=opt;
      b.addEventListener('click', ()=> selectAnswer(b,opt,q.answer));
      optionsEl.appendChild(b);
    });
    if(userAnswers[currentIndex]){ markChosen(userAnswers[currentIndex].chosen, userAnswers[currentIndex].correct); nextBtn.classList.remove('hide'); } else nextBtn.classList.add('hide');
    prevBtn.classList.toggle('hide', currentIndex===0);
    startTimer();
  }

  function handleTimeout(){ const q=currentList[currentIndex]; Array.from(optionsEl.children).forEach(b=>{ if(b.textContent===q.answer) b.classList.add('correct'); b.style.pointerEvents='none'; }); userAnswers[currentIndex]={chosen:null,correct:q.answer}; nextBtn.classList.remove('hide'); }

  function selectAnswer(el, chosen, correct){ Array.from(optionsEl.children).forEach(b=> b.style.pointerEvents='none'); clearTimer(); if(chosen===correct){ el.classList.add('correct'); score+=1; } else { el.classList.add('wrong'); Array.from(optionsEl.children).forEach(b=>{ if(b.textContent===correct) b.classList.add('correct'); }); score+=-0.25; } userAnswers[currentIndex]={chosen,correct}; updateMeta(); nextBtn.classList.remove('hide'); }

  function markChosen(chosen, correct){ Array.from(optionsEl.children).forEach(b=>{ if(b.textContent===chosen){ b.style.pointerEvents='none'; if(chosen===correct) b.classList.add('correct'); else b.classList.add('wrong'); } else { if(b.textContent===correct) b.classList.add('correct'); b.style.pointerEvents='none'; } }); }

  nextBtn.addEventListener('click', ()=>{ clearTimer(); if(currentIndex < currentList.length-1){ currentIndex++; loadQuestion(); } else finishQuiz(); });
  prevBtn.addEventListener('click', ()=>{ if(currentIndex>0){ currentIndex--; loadQuestion(); } });

  btnRestart.addEventListener('click', ()=>{ clearTimer(); currentSubject=null; currentList=[]; currentIndex=0; userAnswers=[]; score=0; subjectTitle.textContent='Choose Subject'; qEl.textContent='Select a subject to start'; optionsEl.innerHTML=''; nextBtn.classList.add('hide'); prevBtn.classList.add('hide'); renderSubjects(); updateMeta(); });

  btnFinish.addEventListener('click', finishQuiz);

  function finishQuiz(){
    clearTimer();
    const finalScore = Math.max(0, Math.round((score+Number.EPSILON)*100)/100);
    const user = currentUser() ? currentUser().name : 'Guest';
    const rec = {name:user, subject:currentSubject || 'unknown', score:finalScore, total: currentList.length, date: new Date().toLocaleString()};
    const board = JSON.parse(localStorage.getItem(KEY_BOARD) || '[]'); board.push(rec); localStorage.setItem(KEY_BOARD, JSON.stringify(board)); localStorage.setItem(KEY_LAST, JSON.stringify(rec));
    renderSubjects(); location.href = 'result.html';
  }
}

/* ---------- RESULT ---------- */
function initResult(){
  const rec = JSON.parse(localStorage.getItem(KEY_LAST) || 'null'); const box = document.getElementById('resBox');
  if(!rec){ box.innerHTML = '<div>No result found. Start a quiz.</div>'; return; }
  box.innerHTML = `<div style="font-size:18px;font-weight:800">${rec.name}</div><div style="margin-top:8px">Subject: <b style="text-transform:capitalize">${rec.subject}</b></div><div style="margin-top:8px">Score: <b>${rec.score} / ${rec.total}</b></div><div style="margin-top:12px;color:rgba(255,255,255,0.85)">AI Analysis: ${rec.score >= rec.total*0.7 ? 'Great job — you know this subject well!' : (rec.score >= rec.total*0.4 ? 'Good — a bit more practice will help.' : 'Keep practicing — focus on fundamentals.')}</div>`;
}

/* ---------- LEADERBOARD ---------- */
function initLeaderboard(){
  function renderBoard(){
    const board = JSON.parse(localStorage.getItem(KEY_BOARD) || '[]').slice().reverse();
    const wrap = document.getElementById('tableWrap');
    if(!board.length){ wrap.innerHTML='<div>No attempts yet.</div>'; return; }
    let html = `<table class="table"><thead><tr><th>Name</th><th>Subject</th><th>Score</th><th>Date</th></tr></thead><tbody>`;
    board.forEach(r=> html += `<tr><td>${r.name}</td><td style="text-transform:capitalize">${r.subject}</td><td>${r.score}/${r.total}</td><td>${r.date}</td></tr>`);
    html += '</tbody></table>'; wrap.innerHTML = html;
  }
  renderBoard();
  window.clearBoard = function(){ if(confirm('Clear all leaderboard entries?')){ localStorage.removeItem(KEY_BOARD); renderBoard(); } };
}

/* ---------- ADMIN ---------- */
function initAdmin(){
  const ADMIN_USER='admin', ADMIN_PASS='Admin2004';
  const loginCard=document.getElementById('adminLoginCard'), panel=document.getElementById('adminPanel');
  document.getElementById('adminLoginBtn').addEventListener('click', ()=>{ const u=document.getElementById('adminUser').value.trim(), p=document.getElementById('adminPass').value.trim(); if(u===ADMIN_USER && p===ADMIN_PASS){ loginCard.classList.add('hide'); panel.classList.remove('hide'); loadExisting(); } else alert('Invalid admin credentials'); });
  document.getElementById('signoutBtn').addEventListener('click', ()=>{ panel.classList.add('hide'); loginCard.classList.remove('hide'); });

  if(!localStorage.getItem(KEY_Q)) localStorage.setItem(KEY_Q, JSON.stringify({}));
  function loadExisting(){ const qdb=readDB(); const wrap=document.getElementById('existingList'); wrap.innerHTML=''; Object.keys(qdb).forEach(subj=>{ const h=document.createElement('div'); h.innerHTML=`<div style="font-weight:800;text-transform:capitalize;margin-top:8px">${subj} (${qdb[subj].length})</div>`; wrap.appendChild(h); qdb[subj].forEach((q,i)=>{ const el=document.createElement('div'); el.style.marginTop='6px'; el.style.padding='8px'; el.style.border='1px solid rgba(255,255,255,0.03)'; el.style.borderRadius='8px'; el.innerHTML = `<div style="font-weight:700">${q.question}</div><div style="font-size:13px;opacity:.8">${q.options.join(' | ')}</div><div style="margin-top:6px"><button class="small" onclick="editQ('${subj}',${i})">Edit</button> <button class="small secondary" onclick="deleteQ('${subj}',${i})">Delete</button></div>`; wrap.appendChild(el); }); }); }
  document.getElementById('addQBtn').addEventListener('click', ()=>{ const subj=document.getElementById('adm_subject').value.trim().toLowerCase(); const question=document.getElementById('adm_question').value.trim(); const opts=document.getElementById('adm_options').value.split(',').map(s=>s.trim()).filter(Boolean); const ans=document.getElementById('adm_answer').value.trim(); if(!subj||!question||opts.length<2||!ans){ alert('Fill all fields with at least 2 options'); return; } const qdb=readDB(); if(!qdb[subj]) qdb[subj]=[]; qdb[subj].push({question, options:opts, answer:ans}); saveDB(qdb); alert('Question added to '+subj); document.getElementById('adm_question').value=''; document.getElementById('adm_options').value=''; document.getElementById('adm_answer').value=''; loadExisting(); });
  document.getElementById('genQBtn').addEventListener('click', ()=>{ const subj=document.getElementById('adm_subject').value.trim().toLowerCase(); if(!subj){ alert('Enter a subject'); return; } let q,opts,ans; if(subj.includes('math')){ const a=Math.floor(Math.random()*20)+2, b=Math.floor(Math.random()*12)+2; q=`What is ${a} × ${b}?`; ans=String(a*b); opts=[ans,String(a*b+3),String(a*b-2),String(a*b+7)]; } else if(subj.includes('english')){ const w=['Happy','Begin','Large','Quick'][Math.floor(Math.random()*4)]; q=`Choose synonym of '${w}'`; opts = w==='Happy' ? ['Joyful','Sad','Angry','Tired'] : w==='Begin' ? ['Start','End','Stop','Close'] : ['Big','Tiny','Small','Huge']; ans=opts[0]; } else { const samples=[{q:"Which planet is known as the Red Planet?",opts:["Earth","Mars","Venus","Jupiter"],a:"Mars"},{q:"Who discovered gravity (legend)?",opts:["Newton","Einstein","Galileo","Tesla"],a:"Newton"}]; const pick=samples[Math.floor(Math.random()*samples.length)]; q=pick.q; opts=pick.opts; ans=pick.a; } document.getElementById('adm_question').value=q; document.getElementById('adm_options').value=opts.join(', '); document.getElementById('adm_answer').value=ans; });

  window.editQ = function(subj, idx){ const qdb=readDB(); const q=qdb[subj][idx]; document.getElementById('adm_subject').value=subj; document.getElementById('adm_question').value=q.question; document.getElementById('adm_options').value=q.options.join(', '); document.getElementById('adm_answer').value=q.answer; if(confirm('Load this question for editing? Original will be deleted now.')) deleteQ(subj, idx); };
  window.deleteQ = function(subj, idx){ if(!confirm('Delete this question?')) return; const qdb=readDB(); qdb[subj].splice(idx,1); if(qdb[subj].length===0) delete qdb[subj]; saveDB(qdb); loadExisting(); };
  loadExisting();
}

