const playableGames = [
  {
    id: "tic-tac-toe",
    name: "Tic Tac Toe",
    category: "strategy",
    difficulty: "easy",
    playable: true,
    description: "Klasik XOX oyunu. 3x3 tahtada üçü tamamla.",
  },
  {
    id: "memory-match",
    name: "Memory Match",
    category: "puzzle",
    difficulty: "easy",
    playable: true,
    description: "Kart eşleştirme oyunu. Hafızanı test et.",
  },
  {
    id: "snake",
    name: "Snake Arena",
    category: "arcade",
    difficulty: "medium",
    playable: true,
    description: "Yılanı kontrol et, yemleri topla, duvara çarpma.",
  },
  {
    id: "rock-paper-scissors",
    name: "Rock Paper Scissors",
    category: "casual",
    difficulty: "easy",
    playable: true,
    description: "Taş-Kağıt-Makas; bilgisayara karşı seri maç.",
  },
  {
    id: "number-guess",
    name: "Number Guess",
    category: "math",
    difficulty: "easy",
    playable: true,
    description: "1-100 arası sayıyı en az denemede tahmin et.",
  },
];

const categories = ["arcade", "strategy", "puzzle", "casual", "math", "race", "sports", "adventure"];
const allGames = [...playableGames];

for (let i = 1; i <= 95; i++) {
  allGames.push({
    id: `coming-${i}`,
    name: `Talons Game #${i}`,
    category: categories[i % categories.length],
    difficulty: ["easy", "medium", "hard"][i % 3],
    playable: false,
    description: `Bu oyun Talons Game yol haritasında yer alıyor. (Slot ${i})`,
  });
}

const gameGrid = document.getElementById("gameGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const gameCount = document.getElementById("gameCount");
const playableCount = document.getElementById("playableCount");
const comingSoonCount = document.getElementById("comingSoonCount");
const modal = document.getElementById("gameModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalBody = document.getElementById("modalBody");

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function setupFilters() {
  [...new Set(allGames.map((g) => g.category))].sort().forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
  searchInput.addEventListener("input", render);
  categoryFilter.addEventListener("change", render);
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const cat = categoryFilter.value;

  const filtered = allGames.filter((g) => {
    const matchesQ = !q || `${g.name} ${g.description} ${g.category}`.toLowerCase().includes(q);
    const matchesC = cat === "all" || g.category === cat;
    return matchesQ && matchesC;
  });

  gameGrid.innerHTML = "";
  filtered.forEach((game) => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.innerHTML = `
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      <div class="badges">
        <span class="badge">${game.category}</span>
        <span class="badge">${game.difficulty}</span>
        <span class="badge ${game.playable ? "playable" : ""}">${game.playable ? "Oynanabilir" : "Yakında"}</span>
      </div>
      <button ${game.playable ? "" : "disabled"} data-id="${game.id}">
        ${game.playable ? "Hemen Oyna" : "Yakında"}
      </button>
    `;

    card.querySelector("button")?.addEventListener("click", () => openGame(game.id));
    gameGrid.appendChild(card);
  });

  gameCount.textContent = allGames.length;
  playableCount.textContent = allGames.filter((g) => g.playable).length;
  comingSoonCount.textContent = allGames.filter((g) => !g.playable).length;
}

function openGame(id) {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  modalBody.innerHTML = "";

  const game = allGames.find((g) => g.id === id);
  modalTitle.textContent = game.name;
  modalDescription.textContent = game.description;

  if (id === "tic-tac-toe") return mountTicTacToe();
  if (id === "memory-match") return mountMemory();
  if (id === "snake") return mountSnake();
  if (id === "rock-paper-scissors") return mountRPS();
  if (id === "number-guess") return mountNumberGuess();
}

function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  modalBody.innerHTML = "";
}

function mountTicTacToe() {
  const status = document.createElement("p");
  let board = Array(9).fill("");
  let player = "X";
  let done = false;

  const grid = document.createElement("div");
  grid.className = "board-3x3";

  const wins = [
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6],
  ];

  const checkWinner = () => wins.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);

  const refresh = () => {
    status.textContent = done ? status.textContent : `Sıra: ${player}`;
    [...grid.children].forEach((btn, i) => { btn.textContent = board[i]; });
  };

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("button");
    cell.addEventListener("click", () => {
      if (board[i] || done) return;
      board[i] = player;
      const win = checkWinner();
      if (win) {
        done = true;
        status.textContent = `${player} kazandı!`;
      } else if (board.every(Boolean)) {
        done = true;
        status.textContent = "Berabere!";
      } else {
        player = player === "X" ? "O" : "X";
      }
      refresh();
    });
    grid.appendChild(cell);
  }

  const reset = document.createElement("button");
  reset.textContent = "Yeniden Başlat";
  reset.addEventListener("click", () => {
    board = Array(9).fill(""); player = "X"; done = false; status.textContent = "Sıra: X"; refresh();
  });

  status.textContent = "Sıra: X";
  modalBody.append(status, grid, reset);
  refresh();
}

function mountMemory() {
  const icons = ["🍒","🍋","🍇","🍉","🍓","🥝","🍑","🍍"];
  let cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
  let selected = [];
  let locked = false;
  let matched = 0;

  const status = document.createElement("p");
  const grid = document.createElement("div");
  grid.className = "memory-grid";

  cards.forEach((icon, i) => {
    const btn = document.createElement("button");
    btn.textContent = "?";
    btn.addEventListener("click", () => {
      if (locked || selected.includes(i) || btn.dataset.done === "1") return;
      btn.textContent = icon;
      selected.push(i);

      if (selected.length === 2) {
        locked = true;
        const [a,b] = selected;
        const aBtn = grid.children[a];
        const bBtn = grid.children[b];
        if (cards[a] === cards[b]) {
          aBtn.dataset.done = "1";
          bBtn.dataset.done = "1";
          matched++;
          status.textContent = `Eşleşme: ${matched}/8`;
          selected = [];
          locked = false;
          if (matched === 8) status.textContent = "Tebrikler, hepsini buldun!";
        } else {
          setTimeout(() => {
            aBtn.textContent = "?";
            bBtn.textContent = "?";
            selected = [];
            locked = false;
          }, 700);
        }
      }
    });
    grid.appendChild(btn);
  });

  status.textContent = "Eşleşme: 0/8";
  modalBody.append(status, grid);
}

function mountSnake() {
  const wrap = document.createElement("div");
  wrap.className = "snake-wrap";
  const info = document.createElement("p");
  info.textContent = "Yön tuşlarıyla oyna.";

  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  const size = 16;
  let snake = [{x:9,y:9}];
  let dir = {x:1,y:0};
  let food = {x:4,y:5};
  let score = 0;
  let over = false;

  const keyHandler = (e) => {
    const map = {
      ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0],
    };
    if (!map[e.key]) return;
    const [x,y] = map[e.key];
    if (snake.length > 1 && snake[0].x + x === snake[1].x && snake[0].y + y === snake[1].y) return;
    dir = {x,y};
  };
  window.addEventListener("keydown", keyHandler);

  function spawnFood() {
    do {
      food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  }

  const loop = setInterval(() => {
    if (modal.classList.contains("hidden")) {
      clearInterval(loop);
      window.removeEventListener("keydown", keyHandler);
      return;
    }
    if (over) return;

    const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20 || snake.some(s => s.x === head.x && s.y === head.y)) {
      over = true;
      info.textContent = `Oyun bitti! Skor: ${score}`;
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      spawnFood();
      info.textContent = `Skor: ${score}`;
    } else {
      snake.pop();
    }

    ctx.fillStyle = "#05080f";
    ctx.fillRect(0,0,320,320);
    ctx.fillStyle = "#f0a202";
    ctx.fillRect(food.x * size, food.y * size, size-1, size-1);
    ctx.fillStyle = "#47d16d";
    snake.forEach((s, idx) => {
      ctx.fillRect(s.x * size, s.y * size, idx === 0 ? size : size-1, idx === 0 ? size : size-1);
    });
  }, 110);

  wrap.appendChild(canvas);
  modalBody.append(info, wrap);
}

function mountRPS() {
  const choices = ["Taş", "Kağıt", "Makas"];
  let wins = 0;
  const status = document.createElement("p");
  status.textContent = "Seçimini yap.";
  const wrap = document.createElement("div");
  wrap.className = "rps";

  choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.addEventListener("click", () => {
      const ai = Math.floor(Math.random() * 3);
      let result = "Berabere";
      if ((idx === 0 && ai === 2) || (idx === 1 && ai === 0) || (idx === 2 && ai === 1)) {
        result = "Kazandın";
        wins++;
      } else if (idx !== ai) {
        result = "Kaybettin";
      }
      status.textContent = `Sen: ${choice} | AI: ${choices[ai]} → ${result} (Toplam galibiyet: ${wins})`;
    });
    wrap.appendChild(btn);
  });

  modalBody.append(status, wrap);
}

function mountNumberGuess() {
  const target = Math.floor(Math.random() * 100) + 1;
  let tries = 0;

  const wrap = document.createElement("div");
  wrap.className = "guess";
  const input = document.createElement("input");
  input.type = "number";
  input.min = "1";
  input.max = "100";
  input.placeholder = "1-100";
  const btn = document.createElement("button");
  btn.textContent = "Tahmin Et";
  const status = document.createElement("p");

  btn.addEventListener("click", () => {
    const val = Number(input.value);
    if (!val || val < 1 || val > 100) {
      status.textContent = "1-100 arası geçerli bir sayı gir.";
      return;
    }
    tries++;
    if (val === target) {
      status.textContent = `Doğru! ${tries} denemede buldun.`;
      btn.disabled = true;
      input.disabled = true;
    } else {
      status.textContent = val < target ? "Daha büyük bir sayı dene." : "Daha küçük bir sayı dene.";
    }
  });

  wrap.append(input, btn);
  modalBody.append(status, wrap);
}

setupFilters();
render();
