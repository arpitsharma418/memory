const EMOJIS = [
  "🦊",
  "🐼",
  "🐸",
  "🦋",
  "🐙",
  "🦁",
  "🐳",
  "🦄",
  "🌵",
  "🍄",
  "🌸",
  "⚡",
  "🔥",
  "🌙",
  "🍕",
  "🎸",
  "🚀",
  "🎯",
  "💎",
  "🧲",
  "🍦",
  "🎲",
  "🏆",
  "🦀",
];

let cols = 4,
  pairs = 8;
let cards = [],
  flipped = [],
  matched = 0,
  moves = 0;
let lockBoard = false,
  timerInterval = null,
  seconds = 0,
  gameStarted = false;

const grid = document.getElementById("grid");
const movesVal = document.getElementById("movesVal");
const matchesVal = document.getElementById("matchesVal");
const timerVal = document.getElementById("timerVal");
const overlay = document.getElementById("overlay");
const finalMoves = document.getElementById("finalMoves");
const finalTime = document.getElementById("finalTime");

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  timerVal.textContent = "0s";
  timerVal.classList.remove("timer-warn");
  timerInterval = setInterval(() => {
    seconds++;
    timerVal.textContent = seconds + "s";
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function newGame() {
  clearInterval(timerInterval);
  seconds = 0;
  moves = 0;
  matched = 0;
  flipped = [];
  lockBoard = false;
  gameStarted = false;
  movesVal.textContent = "0";
  matchesVal.textContent = "0";
  timerVal.textContent = "0s";
  timerVal.classList.remove("timer-warn");
  overlay.classList.remove("show");

  const chosen = shuffle([...EMOJIS]).slice(0, pairs);
  cards = shuffle([...chosen, ...chosen].map((emoji, i) => ({ id: i, emoji })));

  grid.className = `grid cols-${cols}`;
  grid.innerHTML = "";

  cards.forEach((card, i) => {
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.index = i;
    el.dataset.emoji = card.emoji;
    el.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-back">◆</div>
          <div class="card-face card-front">${card.emoji}</div>
        </div>`;
    el.addEventListener("click", () => flipCard(el));
    grid.appendChild(el);
  });
}

function flipCard(el) {
  if (lockBoard) return;
  if (el.classList.contains("flipped") || el.classList.contains("matched"))
    return;

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  el.classList.add("flipped");
  flipped.push(el);

  if (flipped.length === 2) {
    lockBoard = true;
    moves++;
    movesVal.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flipped;
  if (a.dataset.emoji === b.dataset.emoji) {
    a.classList.add("matched");
    b.classList.add("matched");
    matched++;
    matchesVal.textContent = matched;
    flipped = [];
    lockBoard = false;
    if (matched === pairs) {
      stopTimer();
      setTimeout(showWin, 500);
    }
  } else {
    a.classList.add("wrong");
    b.classList.add("wrong");
    setTimeout(() => {
      a.classList.remove("flipped", "wrong");
      b.classList.remove("flipped", "wrong");
      flipped = [];
      lockBoard = false;
    }, 900);
  }
}

function showWin() {
  finalMoves.textContent = moves;
  finalTime.textContent = seconds + "s";
  overlay.classList.add("show");
}

// Difficulty
document.querySelectorAll(".diff-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".diff-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    cols = +btn.dataset.cols;
    pairs = +btn.dataset.pairs;
    newGame();
  });
});

document.getElementById("btnNew").addEventListener("click", newGame);
document.getElementById("btnPlayAgain").addEventListener("click", newGame);

newGame();
