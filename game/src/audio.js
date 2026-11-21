// Twin Peeks sounds: every effect is synthesized with the Web Audio API,
// so the game ships no audio files and makes no network request.

let audioCtx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

function ensureContext() {
  if (!audioCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol) {
  const ctx = ensureContext();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + dur + 0.05);
}

export function playClick() {
  tone(620, 0, 0.07, 'triangle', 0.12);
}

export function playFound() {
  // bright two-note chime
  tone(880, 0, 0.14, 'sine', 0.22);
  tone(1318, 0.09, 0.22, 'sine', 0.22);
  tone(1760, 0.18, 0.18, 'triangle', 0.1);
}

export function playWrong() {
  // low dull buzz
  tone(160, 0, 0.18, 'sawtooth', 0.12);
  tone(110, 0.05, 0.2, 'sawtooth', 0.1);
}

export function playHint() {
  tone(1046, 0, 0.1, 'sine', 0.16);
  tone(784, 0.08, 0.16, 'sine', 0.16);
}

export function playLevelWin() {
  const notes = [523, 659, 784, 1046];
  notes.forEach((n, i) => tone(n, i * 0.11, 0.22, 'triangle', 0.2));
}

export function playGameWin() {
  const notes = [523, 659, 784, 1046, 784, 1046, 1318];
  notes.forEach((n, i) => tone(n, i * 0.13, 0.26, 'triangle', 0.2));
}

export function playLose() {
  const notes = [392, 330, 262, 196];
  notes.forEach((n, i) => tone(n, i * 0.16, 0.28, 'sine', 0.18));
}

export function playTick() {
  tone(980, 0, 0.05, 'square', 0.06);
}
