/* Shared logic for multi-page quiz app
   - stores questions in localStorage key: 'quiz_questions_v2'
   - scores stored in localStorage key: 'quiz_scores_v2'
   - session uses localStorage 'quiz_session'
   - last result saved to 'last_result' for result page
*/

// Storage keys
const Q_KEY = 'quiz_questions_v2';
const S_KEY = 'quiz_scores_v2';

// default questions fallback (used if no localStorage questions)
const defaultQuestions =   [
  {
    "q": "Who is known as the God of Cricket?",
    "a": ["Virat Kohli", "Ricky Ponting", "Sachin Tendulkar", "MS Dhoni"],
    "correct": 2,
    "tag": "cricket"
  },
  {
    "q": "Which country won the FIFA World Cup 2022?",
    "a": ["France", "Brazil", "Argentina", "Germany"],
    "correct": 2,
    "tag": "football"
  },
  {
    "q": "Who is known as the King of Bollywood?",
    "a": ["Aamir Khan", "Salman Khan", "Shah Rukh Khan", "Akshay Kumar"],
    "correct": 2,
    "tag": "bollywood"
  },
  {
    "q": "Which company created the iPhone?",
    "a": ["Samsung", "Apple", "Nokia", "Google"],
    "correct": 1,
    "tag": "tech"
  },
  {
    "q": "Who is the current Secretary-General of the United Nations?",
    "a": ["Ban Ki-moon", "António Guterres", "Kofi Annan", "Jim Yong Kim"],
    "correct": 1,
    "tag": "politics"
  },
  {
    "q": "Largest planet in our solar system?",
    "a": ["Mars", "Earth", "Jupiter", "Saturn"],
    "correct": 2,
    "tag": "space"
  },
  {
    "q": "Who invented the light bulb?",
    "a": ["Einstein", "Thomas Edison", "Newton", "Tesla"],
    "correct": 1,
    "tag": "science"
  },
  {
    "q": "Which metal is liquid at room temperature?",
    "a": ["Mercury", "Aluminium", "Copper", "Silver"],
    "correct": 0,
    "tag": "science"
  },
  {
    "q": "Which is the longest river in the world?",
    "a": ["Amazon", "Nile", "Ganga", "Yangtze"],
    "correct": 1,
    "tag": "geography"
  },
  {
    "q": "The smallest prime number is?",
    "a": ["0", "1", "2", "3"],
    "correct": 2,
    "tag": "math"
  },
  {
    "q": "Who was the first President of India?",
    "a": ["Rajendra Prasad", "APJ Abdul Kalam", "Pranab Mukherjee", "Jawaharlal Nehru"],
    "correct": 0,
    "tag": "history"
  },
  {
    "q": "Which country is known as the Land of the Rising Sun?",
    "a": ["China", "Japan", "Thailand", "South Korea"],
    "correct": 1,
    "tag": "general"
  },
  {
    "q": "Which city is the capital of Australia?",
    "a": ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    "correct": 2,
    "tag": "geography"
  },
  {
    "q": "Who is known as the Father of Computers?",
    "a": ["Charles Babbage", "Alan Turing", "Bill Gates", "Steve Jobs"],
    "correct": 0,
    "tag": "tech"
  },
  {
    "q": "What does RAM stand for?",
    "a": ["Read Access Memory", "Random Access Memory", "Run Active Memory", "Read And Manage"],
    "correct": 1,
    "tag": "tech"
  },
  {
    "q": "Which game is the National Sport of India?",
    "a": ["Cricket", "Hockey", "Kabaddi", "Football"],
    "correct": 1,
    "tag": "sports"
  },
  {
    "q": "Which is the largest continent?",
    "a": ["Africa", "Asia", "Europe", "Australia"],
    "correct": 1,
    "tag": "geography"
  },
  {
    "q": "What is the hardest natural substance?",
    "a": ["Gold", "Iron", "Diamond", "Platinum"],
    "correct": 2,
    "tag": "science"
  },
  {
    "q": "Which gas is released by plants during photosynthesis?",
    "a": ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
    "correct": 2,
    "tag": "science"
  },
  {
    "q": "Who directed the movie '3 Idiots'?",
    "a": ["Rajkumar Hirani", "Karan Johar", "Zoya Akhtar", "Anurag Kashyap"],
    "correct": 0,
    "tag": "bollywood"
  },
  {
    "q": "Which team has won the most IPL titles?",
    "a": ["CSK", "MI", "RCB", "KKR"],
    "correct": 1,
    "tag": "cricket"
  },
  {
    "q": "Which country invented pizza?",
    "a": ["USA", "France", "Italy", "Germany"],
    "correct": 2,
    "tag": "food"
  },
  {
    "q": "Who was the first person to step on the Moon?",
    "a": ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "Michael Collins"],
    "correct": 0,
    "tag": "space"
  },
  {
    "q": "Which animal is known as the Ship of the Desert?",
    "a": ["Camel", "Horse", "Goat", "Elephant"],
    "correct": 0,
    "tag": "general"
  },
  {
    "q": "Which Indian city is known as the Pink City?",
    "a": ["Delhi", "Mumbai", "Jaipur", "Kolkata"],
    "correct": 2,
    "tag": "geography"
  },
  {
    "q": "Which language is used to build Android apps?",
    "a": ["Python", "Java", "HTML", "Swift"],
    "correct": 1,
    "tag": "programming"
  },
  {
    "q": "Which company owns YouTube?",
    "a": ["Microsoft", "Apple", "Google", "Amazon"],
    "correct": 2,
    "tag": "tech"
  },
  {
    "q": "What is the chemical symbol for Gold?",
    "a": ["Ag", "Au", "Gd", "Go"],
    "correct": 1,
    "tag": "science"
  },
  {
    "q": "Who wrote the Indian National Anthem?",
    "a": ["Rabindranath Tagore", "Bankim Chandra", "Subhash Bose", "Gandhi"],
    "correct": 0,
    "tag": "history"
  },
  {
    "q": "Which game is known as the Game of Kings?",
    "a": ["Carrom", "Cricket", "Chess", "Badminton"],
    "correct": 2,
    "tag": "general"
  }
];


// helper: read questions (prefer localStorage; otherwise attempt fetch questions.json)
async function loadQuestions(){
  try {
    const raw = localStorage.getItem(Q_KEY);
    if(raw){
      const arr = JSON.parse(raw);
      if(Array.isArray(arr) && arr.length) return { questions: arr };
    }
    // try fetch questions.json (works when served over http)
    try {
      const resp = await fetch('questions.json?v=' + Date.now());
      if(resp.ok){
        const arr = await resp.json();
        if(Array.isArray(arr) && arr.length){
          // save a copy into localStorage for easy admin editing
          localStorage.setItem(Q_KEY, JSON.stringify(arr));
          return { questions: arr };
        }
      }
    } catch(e){
      // fetch failed (likely file://). We'll fallback to defaults
    }
    // fallback defaults
    localStorage.setItem(Q_KEY, JSON.stringify(defaultQuestions));
    return { questions: defaultQuestions };
  } catch (err){
    return { error: err.message || String(err) };
  }
}

// helper: get stored questions (sync)
function getStoredQuestions(){
  const raw = localStorage.getItem(Q_KEY);
  try {
    if(!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch(e){ return []; }
}

// admin functions to add/edit/delete questions
function addQuestion(obj){
  const arr = getStoredQuestions();
  arr.push(obj);
  localStorage.setItem(Q_KEY, JSON.stringify(arr));
}
function deleteQuestion(idx){
  const arr = getStoredQuestions();
  if(idx>=0 && idx < arr.length){
    arr.splice(idx,1);
    localStorage.setItem(Q_KEY, JSON.stringify(arr));
  }
}
function saveQuestionsToStorage(arr){
  localStorage.setItem(Q_KEY, JSON.stringify(arr));
}
function deleteAllQuestions(){
  localStorage.removeItem(Q_KEY);
  // re-seed with default questions
  localStorage.setItem(Q_KEY, JSON.stringify(defaultQuestions));
}

// Scores & leaderboard
function saveScoreEntry(entry){
  const raw = localStorage.getItem(S_KEY);
  const arr = raw ? JSON.parse(raw) : [];
  arr.push(entry);
  // keep last 200
  if(arr.length > 200) arr.splice(0, arr.length - 200);
  localStorage.setItem(S_KEY, JSON.stringify(arr));
  // store last result for result page
  localStorage.setItem('last_result', JSON.stringify(entry));
}

function getScores(){
  const raw = localStorage.getItem(S_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch(e){ return []; }
}

// helper: shuffle array
function shuffleArray(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------
   Quiz runtime (used by quiz.html)
   ------------------------------ */
let workingSet = [];
let currentIndex = 0;
let score = 0;
let timePerQuestion = 15;
let timeLeft = 0;
let timerId = null;
let selectedIndex = null;
let sessionName = 'Anonymous';

function startQuizWithSet(qset, timePerQ=15, name='Anonymous'){
  workingSet = [...qset];
  timePerQuestion = parseInt(timePerQ, 10) || 15;
  sessionName = name || 'Anonymous';
  currentIndex = 0; score = 0;
  // render first
  renderQuestion();
  startTimer();
}

function renderQuestion(){
  const total = workingSet.length;
  if(total === 0){
    alert('No questions to show. Add questions in Admin.');
    location.href = 'admin.html';
    return;
  }
  if(currentIndex >= total){
    finishQuiz();
    return;
  }

  const item = workingSet[currentIndex];
  document.getElementById('curIdx').innerText = currentIndex + 1;
  document.getElementById('totalQ').innerText = total;
  document.getElementById('questionText').innerText = item.q;

  // options
  const box = document.getElementById('options');
  box.innerHTML = '';
  item.a.forEach((txt, i) => {
    const d = document.createElement('div');
    d.className = 'option';
    d.innerText = txt;
    d.onclick = () => {
      selectedIndex = i;
      Array.from(box.children).forEach(ch => ch.classList.remove('selected'));
      d.classList.add('selected');
    };
    box.appendChild(d);
  });

  // progress bar
  updateProgress();
  document.getElementById('feedback').innerText = '';
  selectedIndex = null;
}

function updateProgress(){
  const total = workingSet.length || 1;
  const percent = Math.round((currentIndex / total) * 100);
  document.getElementById('progressBar').style.width = percent + '%';
}

function startTimer(){
  clearTimer();
  timeLeft = timePerQuestion;
  document.getElementById('timeLeft').innerText = timeLeft;
  timerId = setInterval(() => {
    timeLeft--;
    document.getElementById('timeLeft').innerText = timeLeft;
    if(timeLeft <= 3){
      const t = document.getElementById('tick');
      if(t) t.play().catch(()=>{});
    }
    if(timeLeft <= 0){
      clearTimer();
      autoSubmit();
    }
  }, 1000);
}

function clearTimer(){ if(timerId){ clearInterval(timerId); timerId = null; } }

function submitQ(){
  clearTimer();
  revealAnswer(false);
}

function autoSubmit(){
  revealAnswer(true);
}

function revealAnswer(isAuto){
  const item = workingSet[currentIndex];
  const correctIndex = item.correct;
  const optionElems = document.querySelectorAll('.option');
  optionElems.forEach((el, i) => {
    el.style.borderColor = 'transparent';
    if(i === correctIndex){
      el.style.background = 'linear-gradient(90deg,var(--correct),#66ffb3)';
    } else if(i === selectedIndex && i !== correctIndex){
      el.style.background = 'linear-gradient(90deg,var(--danger),#ff8a80)';
    } else {
      el.style.opacity = 0.95;
    }
  });

  if(selectedIndex === correctIndex){
    score++;
    document.getElementById('feedback').innerText = 'Correct! +1';
    const d = document.getElementById('ding'); if(d) d.play().catch(()=>{});
  } else {
    document.getElementById('feedback').innerText = isAuto ? "Time up — correct answer highlighted." : "Incorrect — correct answer highlighted.";
  }

  // next after short pause
  setTimeout(() => {
    currentIndex++;
    if(currentIndex < workingSet.length) {
      renderQuestion();
      startTimer();
    } else {
      finishQuiz();
    }
  }, 1100);
}

function skipQ(){
  clearTimer();
  currentIndex++;
  if(currentIndex < workingSet.length) {
    renderQuestion(); startTimer();
  } else finishQuiz();
}

function finishQuiz(){
  clearTimer();
  // save score and redirect to result.html
  const total = workingSet.length;
  const entry = { name: sessionName, score, total, when: new Date().toISOString() };
  saveScoreEntry(entry);
  // Also save 'last_result' for result.html
  localStorage.setItem('last_result', JSON.stringify(entry));
  // navigate
  location.href = 'result.html';
}

/* ------------------------------
   Result page helper
   ------------------------------ */
function renderLeaderboardOnPage(){
  const container = document.getElementById('leaderboard');
  if(!container) return;
  const scores = getScores().slice().sort((a,b) => (b.score/b.total) - (a.score/a.total));
  container.innerHTML = '';
  scores.slice(0, 20).forEach((s,i) => {
    const p = document.createElement('div');
    p.className = 'leader-item small muted';
    p.innerHTML = `${i+1}. <b>${escapeHtml(s.name)}</b> — ${s.score}/${s.total} <span style="color:var(--muted)">(${new Date(s.when).toLocaleString()})</span>`;
    container.appendChild(p);
  });
}

/* ------------------------------
   Export / Import helpers
   ------------------------------ */
function exportQuestions(){
  const arr = getStoredQuestions();
  const blob = new Blob([JSON.stringify(arr, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'questions.json'; a.click(); URL.revokeObjectURL(url);
}

function exportScores(){
  const arr = getScores();
  const blob = new Blob([JSON.stringify(arr, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'scores.json'; a.click(); URL.revokeObjectURL(url);
}

function importQuestionsFile(file, callback){
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const arr = JSON.parse(reader.result);
      if(!Array.isArray(arr)) throw new Error('Invalid format');
      saveQuestionsToStorage(arr);
      if(callback) callback(null);
    } catch(err){
      if(callback) callback(err);
    }
  };
  reader.readAsText(file);
}

/* ------------------------------
   small utilities
   ------------------------------ */
function getStoredQuestions(){ return JSON.parse(localStorage.getItem(Q_KEY) || 'null') || []; }
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* expose some functions to global for pages to call */
window.loadQuestions = loadQuestions;
window.shuffleArray = shuffleArray;
window.startQuizWithSet = startQuizWithSet;
window.addQuestion = addQuestion;
window.deleteQuestion = deleteQuestion;
window.deleteAllQuestions = deleteAllQuestions;
window.saveQuestionsToStorage = saveQuestionsToStorage;
window.getStoredQuestions = getStoredQuestions;
window.saveScoreEntry = saveScoreEntry;
window.getScores = getScores;
window.renderLeaderboardOnPage = renderLeaderboardOnPage;
window.exportQuestions = exportQuestions;
window.exportScores = exportScores;
window.importQuestionsFile = importQuestionsFile;
window.shuffleArray = shuffleArray;

// If loaded directly in index/admin pages, ensure defaults exist
(function ensureSeed(){
  if(!localStorage.getItem(Q_KEY)){
    localStorage.setItem(Q_KEY, JSON.stringify(defaultQuestions));
  }
})();
