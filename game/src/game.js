// Twin Peeks — Spot the Difference.
// Two near-identical pictures side by side; click the 7 differences in each
// of 3 hand-drawn scenes before the timer runs out. Score, combo, hints,
// win/lose screens and a replay button included.

import { SCENES, SCENE_W, SCENE_H } from './scenes.js';
import {
  playClick,
  playFound,
  playWrong,
  playHint,
  playLevelWin,
  playGameWin,
  playLose,
  playTick,
  toggleMute,
  isMuted,
} from './audio.js';

const LEVEL_TIME = 100;
const DIFFS_PER_LEVEL = 7;
const WRONG_TIME_PENALTY = 3;
const HINTS_PER_LEVEL = 3;

const $ = (id) => document.getElementById(id);
const leftCanvas = $('leftCanvas');
const rightCanvas = $('rightCanvas');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');

const state = {
  screen: 'title', // title | play | level | win | lose
  levelIndex: 0,
  found: new Set(),
  foundAt: new Map(), // diff index -> timestamp of the find (pop animation)
  score: 0,
  levelScore: 0,
  combo: 0,
  mistakes: 0,
  hintsLeft: HINTS_PER_LEVEL,
  timeLeft: LEVEL_TIME,
  hint: null, // { index, until }
  flashes: [], // wrong-click marks { x, y, until, panel }
  lastTickSecond: -1,
  levelStars: [],
};

function currentScene() {
  return SCENES[state.levelIndex];
}

function setMessage(text) {
  $('message').textContent = text;
}

function refreshHud() {
  const scene = currentScene();
  $('levelLabel').textContent = `Level ${state.levelIndex + 1} · ${scene.name}`;
  $('foundLabel').textContent = `Found ${state.found.size} / ${DIFFS_PER_LEVEL}`;
  $('scoreLabel').textContent = `Score ${state.score}`;
  $('hintBtn').textContent = `💡 Hint ×${state.hintsLeft}`;
  $('hintBtn').disabled = state.screen !== 'play' || state.hintsLeft <= 0;
  $('comboLabel').textContent =
    state.combo >= 2 ? `🔥 Combo ×${state.combo}` : '';
  const pct = Math.max(0, (state.timeLeft / LEVEL_TIME) * 100);
  $('timerBar').style.width = `${pct}%`;
  $('timerBar').classList.toggle('low', state.timeLeft <= 15);
  $('timerText').textContent = String(Math.ceil(state.timeLeft));
  $('timerText').classList.toggle('low', state.timeLeft <= 15);
}

// ---------- overlays ----------
function showOverlay(title, text, statsHtml, buttons, hint) {
  $('overlayTitle').textContent = title;
  $('overlayText').textContent = text;
  $('overlayStats').innerHTML = statsHtml;
  const box = $('overlayButtons');
  box.innerHTML = '';
  for (const b of buttons) {
    const btn = document.createElement('button');
    btn.className = 'big-btn' + (b.secondary ? ' secondary' : '');
    btn.textContent = b.label;
    btn.addEventListener('click', b.onClick);
    box.appendChild(btn);
  }
  $('overlayHint').textContent = hint || '';
  $('overlay').classList.remove('hidden');
}

function hideOverlay() {
  $('overlay').classList.add('hidden');
}

function showTitle() {
  state.screen = 'title';
  refreshHud();
  setMessage('Three scenes, 21 differences. How sharp are your eyes?');
  showOverlay(
    '🔍 Twin Peeks',
    'Two pictures sit side by side — almost identical. Find all 7 differences in each scene before the timer runs out. Click a difference on either picture. Wrong clicks cost 3 seconds!',
    '3 scenes · 7 differences each · 100 seconds per scene<br>Hints: 3 per scene (−50 pts) · Combos multiply your points',
    [{ label: '▶ Start playing', onClick: () => startGame() }],
    'Keys: H = hint · M = sound · R = restart level · Enter = continue',
  );
}

function startGame() {
  state.score = 0;
  state.levelIndex = 0;
  state.levelStars = [];
  playClick();
  startLevel(0);
}

function startLevel(index) {
  state.levelIndex = index;
  state.found = new Set();
  state.foundAt = new Map();
  state.levelScore = 0;
  state.combo = 0;
  state.mistakes = 0;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.timeLeft = LEVEL_TIME;
  state.hint = null;
  state.flashes = [];
  state.lastTickSecond = -1;
  state.screen = 'play';
  hideOverlay();
  refreshHud();
  setMessage(currentScene().intro);
}

function levelComplete() {
  const timeBonus = Math.round(state.timeLeft) * 5;
  state.score += timeBonus;
  const stars = state.timeLeft >= 40 && state.mistakes <= 1 ? 3
    : state.timeLeft >= 20 ? 2 : 1;
  state.levelStars.push(stars);
  state.screen = 'level';
  playLevelWin();
  refreshHud();
  const last = state.levelIndex === SCENES.length - 1;
  showOverlay(
    last ? '🎉 You found them all!' : '⭐ Scene cleared!',
    last
      ? 'Every difference in every scene — spotted. The Twin Peeks trophy is yours!'
      : `All 7 differences in ${currentScene().name} found. Ready for the next scene?`,
    `Time bonus +${timeBonus} · Scene score ${state.levelScore + timeBonus}<br>` +
      `Total score ${state.score} · ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`,
    last
      ? [
          { label: '🏆 See my result', onClick: showWin },
          { label: '↻ Play again', secondary: true, onClick: startGame },
        ]
      : [
          { label: `▶ Next scene: ${SCENES[state.levelIndex + 1].name}`, onClick: () => startLevel(state.levelIndex + 1) },
          { label: '↻ Replay scene', secondary: true, onClick: () => startLevel(state.levelIndex) },
        ],
    'Enter = continue',
  );
}

function showWin() {
  state.screen = 'win';
  playGameWin();
  const best = Number(localStorage.getItem('twinPeeksBest') || 0);
  const newBest = state.score > best;
  if (newBest) localStorage.setItem('twinPeeksBest', String(state.score));
  const stars = state.levelStars.map((s) => '★'.repeat(s)).join('  ');
  showOverlay(
    '🏆 Twin Peeks Champion!',
    newBest
      ? 'A brand-new best score! You spotted all 21 differences across the park, the café and the campsite.'
      : 'You spotted all 21 differences across the park, the café and the campsite. Sharp eyes!',
    `Final score ${state.score}<br>Best score ${Math.max(best, state.score)}<br>${stars}`,
    [
      { label: '↻ Play again', onClick: startGame },
      { label: '🔍 Replay Moon Camp', secondary: true, onClick: () => startLevel(2) },
    ],
    'Thanks for playing Twin Peeks!',
  );
}

function showLose() {
  state.screen = 'lose';
  playLose();
  const scene = currentScene();
  showOverlay(
    '⏰ Time’s up!',
    `The timer ran out in ${scene.name} with ${DIFFS_PER_LEVEL - state.found.size} difference${DIFFS_PER_LEVEL - state.found.size === 1 ? '' : 's'} still hiding. So close — try again!`,
    `Found ${state.found.size} / ${DIFFS_PER_LEVEL} · Score ${state.score}`,
    [
      { label: '↻ Retry this scene', onClick: () => startLevel(state.levelIndex) },
      { label: '🏠 Back to title', secondary: true, onClick: showTitle },
    ],
    'Tip: use a hint (H) when you are stuck — it costs only 50 points.',
  );
}

// ---------- play ----------
function scenePoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * SCENE_W,
    y: ((event.clientY - rect.top) / rect.height) * SCENE_H,
  };
}

function unfoundDiffAt(p) {
  const scene = currentScene();
  for (let i = 0; i < scene.diffs.length; i++) {
    if (state.found.has(i)) continue;
    const d = scene.diffs[i];
    const dx = p.x - d.x;
    const dy = p.y - d.y;
    if (dx * dx + dy * dy <= (d.r + 12) * (d.r + 12)) return i;
  }
  return -1;
}

function onBoardClick(canvas, event) {
  if (state.screen !== 'play') return;
  const p = scenePoint(canvas, event);
  const idx = unfoundDiffAt(p);
  if (idx >= 0) {
    state.found.add(idx);
    state.foundAt.set(idx, performance.now());
    state.combo += 1;
    const points = 100 + (state.combo - 1) * 25;
    state.score += points;
    state.levelScore += points;
    playFound();
    setMessage(`✅ ${currentScene().diffs[idx].name} — +${points} pts!`);
    state.hint = null;
    refreshHud();
    if (state.found.size === DIFFS_PER_LEVEL) levelComplete();
  } else {
    state.combo = 0;
    state.mistakes += 1;
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_TIME_PENALTY);
    state.flashes.push({
      x: p.x, y: p.y,
      panel: canvas === leftCanvas ? 'left' : 'right',
      until: performance.now() + 700,
    });
    canvas.classList.remove('wrong-shake');
    void canvas.offsetWidth;
    canvas.classList.add('wrong-shake');
    playWrong();
    setMessage(`❌ Not a difference… −${WRONG_TIME_PENALTY}s. Look again!`);
    refreshHud();
  }
}

function useHint() {
  if (state.screen !== 'play' || state.hintsLeft <= 0) return;
  const remaining = currentScene().diffs
    .map((d, i) => i)
    .filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 50);
  state.hint = { index: pick, until: performance.now() + 3000 };
  playHint();
  setMessage('💡 Hint: look inside the glowing circle… (−50 pts)');
  refreshHud();
}

// ---------- rendering ----------
function drawFoundRing(ctx, d, now, index) {
  const born = state.foundAt.get(index) || now;
  const age = Math.min(1, (now - born) / 300);
  const pulse = 1 + Math.sin(now / 260) * 0.06;
  const r = d.r * (0.6 + 0.4 * age) * pulse;
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#f2b705';
  ctx.beginPath();
  ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#2b2118';
  ctx.beginPath();
  ctx.arc(d.x, d.y, r + 4, 0, Math.PI * 2);
  ctx.stroke();
  // check mark
  ctx.strokeStyle = '#e4572e';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(d.x - 10, d.y);
  ctx.lineTo(d.x - 3, d.y + 8);
  ctx.lineTo(d.x + 12, d.y - 9);
  ctx.stroke();
  ctx.restore();
}

function drawFlash(ctx, f, now) {
  const alpha = Math.max(0, (f.until - now) / 700);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#d64545';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(f.x - 12, f.y - 12); ctx.lineTo(f.x + 12, f.y + 12);
  ctx.moveTo(f.x + 12, f.y - 12); ctx.lineTo(f.x - 12, f.y + 12);
  ctx.stroke();
  ctx.restore();
}

function drawHintRing(ctx, d, now) {
  const pulse = 1 + Math.sin(now / 180) * 0.12;
  ctx.save();
  ctx.setLineDash([10, 8]);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#17a398';
  ctx.beginPath();
  ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function render(now) {
  const scene = currentScene();
  scene.paint(leftCtx, 0);
  scene.paint(rightCtx, 1);
  const diffs = scene.diffs;
  for (const i of state.found) {
    drawFoundRing(leftCtx, diffs[i], now, i);
    drawFoundRing(rightCtx, diffs[i], now, i);
  }
  if (state.hint && now < state.hint.until) {
    drawHintRing(leftCtx, diffs[state.hint.index], now);
    drawHintRing(rightCtx, diffs[state.hint.index], now);
  } else if (state.hint) {
    state.hint = null;
  }
  state.flashes = state.flashes.filter((f) => now < f.until);
  for (const f of state.flashes) {
    drawFlash(f.panel === 'left' ? leftCtx : rightCtx, f, now);
  }
}

// ---------- main loop ----------
let lastFrame = performance.now();

function frame(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  if (state.screen === 'play') {
    state.timeLeft -= dt;
    const sec = Math.ceil(state.timeLeft);
    if (state.timeLeft <= 10 && sec !== state.lastTickSecond && state.timeLeft > 0) {
      state.lastTickSecond = sec;
      playTick();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      refreshHud();
      showLose();
    } else {
      refreshHud();
    }
  }
  render(now);
  requestAnimationFrame(frame);
}

// ---------- wiring ----------
leftCanvas.addEventListener('click', (e) => onBoardClick(leftCanvas, e));
rightCanvas.addEventListener('click', (e) => onBoardClick(rightCanvas, e));
$('hintBtn').addEventListener('click', useHint);
$('soundBtn').addEventListener('click', () => {
  const m = toggleMute();
  $('soundBtn').textContent = m ? '🔇' : '🔊';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') useHint();
  if (e.key === 'm' || e.key === 'M') {
    const m = toggleMute();
    $('soundBtn').textContent = m ? '🔇' : '🔊';
  }
  if (e.key === 'r' || e.key === 'R') {
    if (state.screen === 'play' || state.screen === 'lose') startLevel(state.levelIndex);
  }
  if (e.key === 'Enter') {
    if (state.screen === 'title') startGame();
    else if (state.screen === 'level') {
      if (state.levelIndex === SCENES.length - 1) showWin();
      else startLevel(state.levelIndex + 1);
    }
  }
});

showTitle();
requestAnimationFrame(frame);
