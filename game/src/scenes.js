// Twin Peeks scenes: every picture is drawn in code on a 640x420 canvas.
// paint(ctx, variant) draws the scene; variant 0 is the LEFT (original) panel,
// variant 1 is the RIGHT panel with that scene's 7 differences applied.
// Each difference has a hit spot {x, y, r} in scene coordinates.

export const SCENE_W = 640;
export const SCENE_H = 420;

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  circle(ctx, x, y, 20 * s, '#ffffff');
  circle(ctx, x + 22 * s, y - 6 * s, 24 * s, '#ffffff');
  circle(ctx, x + 46 * s, y, 20 * s, '#ffffff');
  ctx.fillRect(x - 18 * s, y, 82 * s, 18 * s);
}

function flower(ctx, x, y, petal, center) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 7, petal);
  }
  circle(ctx, x, y, 6, center);
}

function tree(ctx, x, y, apples) {
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(x - 8, y, 16, 70);
  circle(ctx, x, y - 18, 52, '#3f9e4d');
  circle(ctx, x - 34, y + 6, 34, '#57b368');
  circle(ctx, x + 34, y + 6, 34, '#57b368');
  const spots = [[-28, -30], [18, -38], [34, 2]];
  for (let i = 0; i < apples; i++) {
    circle(ctx, x + spots[i][0], y + spots[i][1], 8, '#e4572e');
  }
}

function dog(ctx, x, y, tailUp) {
  ctx.fillStyle = '#c98f4e';
  rr(ctx, x - 42, y - 26, 84, 40, 16); // body
  ctx.fill(); // rr only builds path; fill above uses current style
  circle(ctx, x + 48, y - 30, 20, '#c98f4e'); // head
  ctx.fillStyle = '#a86f33';
  ctx.beginPath(); // floppy ear
  ctx.ellipse(x + 40, y - 40, 7, 12, 0.4, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, x + 56, y - 34, 3, '#2b2118'); // eye
  circle(ctx, x + 66, y - 26, 4, '#2b2118'); // nose
  ctx.strokeStyle = '#a86f33';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 42, y - 18);
  if (tailUp) ctx.quadraticCurveTo(x - 58, y - 44, x - 48, y - 52);
  else ctx.quadraticCurveTo(x - 58, y - 2, x - 50, y + 6);
  ctx.stroke();
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 6;
  ctx.beginPath(); // legs
  ctx.moveTo(x - 30, y + 12); ctx.lineTo(x - 30, y + 26);
  ctx.moveTo(x - 8, y + 12); ctx.lineTo(x - 8, y + 26);
  ctx.moveTo(x + 16, y + 12); ctx.lineTo(x + 16, y + 26);
  ctx.moveTo(x + 34, y + 12); ctx.lineTo(x + 34, y + 26);
  ctx.stroke();
}

function kite(ctx, x, y, withTail) {
  ctx.strokeStyle = '#8a6d3b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 20, y + 90);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.fillStyle = '#e4572e';
  ctx.beginPath();
  ctx.moveTo(x, y - 34); ctx.lineTo(x + 30, y); ctx.lineTo(x, y + 34); ctx.lineTo(x - 30, y);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f2b705';
  ctx.beginPath();
  ctx.moveTo(x, y - 34); ctx.lineTo(x + 30, y); ctx.lineTo(x, y); ctx.lineTo(x, y);
  ctx.closePath(); ctx.fill();
  if (withTail) {
    ctx.strokeStyle = '#e4572e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 34);
    ctx.quadraticCurveTo(x + 12, y + 60, x - 2, y + 84);
    ctx.stroke();
    ctx.fillStyle = '#17a398';
    circle(ctx, x + 8, y + 56, 5, '#17a398');
    circle(ctx, x - 2, y + 80, 5, '#17a398');
  }
}

// ---------------- Scene 1: Sunny Park ----------------
function paintPark(ctx, v) {
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#7ec8f7');
  sky.addColorStop(0.6, '#bfe6fb');
  sky.addColorStop(0.6, '#8fce6e');
  sky.addColorStop(1, '#5da24a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 420);

  // sun (diff 1: sunglasses on the right)
  circle(ctx, 90, 70, 36, '#ffd93b');
  ctx.strokeStyle = '#f2b705';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(90 + Math.cos(a) * 44, 70 + Math.sin(a) * 44);
    ctx.lineTo(90 + Math.cos(a) * 56, 70 + Math.sin(a) * 56);
    ctx.stroke();
  }
  circle(ctx, 82, 66, 3, '#2b2118');
  circle(ctx, 98, 66, 3, '#2b2118');
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(90, 76, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  if (v === 1) {
    ctx.fillStyle = '#2b2118';
    rr(ctx, 68, 58, 18, 12, 4); ctx.fill();
    rr(ctx, 94, 58, 18, 12, 4); ctx.fill();
    ctx.fillRect(84, 62, 12, 3);
  }

  cloud(ctx, 180, 55, 1);
  if (v === 0) cloud(ctx, 330, 48, 0.9); // diff 2: middle cloud missing
  cloud(ctx, 470, 70, 0.8);

  // kite (diff 6: tail missing on the right)
  kite(ctx, 300, 130, v === 0);

  // pond
  ctx.fillStyle = '#4db2e8';
  ctx.beginPath();
  ctx.ellipse(500, 372, 110, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(480, 368, 12, 0.2, 2.6); ctx.stroke();
  ctx.beginPath(); ctx.arc(520, 380, 10, 0.4, 2.8); ctx.stroke();

  tree(ctx, 545, 210, v === 0 ? 3 : 2); // diff 3: one apple missing

  // bench (diff 7: bird perched on it, left only)
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(120, 300, 130, 12);
  ctx.fillRect(120, 278, 130, 10);
  ctx.fillStyle = '#6d4420';
  ctx.fillRect(132, 312, 10, 46);
  ctx.fillRect(228, 312, 10, 46);
  if (v === 0) {
    ctx.fillStyle = '#3f7fd1';
    circle(ctx, 216, 266, 11, '#3f7fd1');
    ctx.beginPath(); ctx.moveTo(226, 264); ctx.lineTo(236, 268); ctx.lineTo(226, 272); ctx.closePath(); ctx.fill();
    circle(ctx, 220, 263, 2, '#ffffff');
  }

  dog(ctx, 430, 330, v === 0); // diff 4: tail up vs down

  // flowers (diff 5: the big flower changes colour)
  flower(ctx, 90, 372, v === 0 ? '#e4572e' : '#9b5de5', '#f2b705');
  flower(ctx, 150, 388, '#ff7bac', '#ffffff');
  flower(ctx, 60, 396, '#ffffff', '#f2b705');
  flower(ctx, 340, 392, '#ff7bac', '#f2b705');
  flower(ctx, 250, 376, '#ffffff', '#e4572e');

  // path
  ctx.fillStyle = '#e8d9b0';
  ctx.beginPath();
  ctx.ellipse(320, 415, 200, 12, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------- Scene 2: Cat Café Kitchen ----------------
function paintKitchen(ctx, v) {
  ctx.fillStyle = '#ffe3c2';
  ctx.fillRect(0, 0, 640, 420);
  ctx.fillStyle = '#f7c89b';
  ctx.fillRect(0, 330, 640, 90); // counter

  // window (diff 6: curtain closed on the right)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(66, 44, 150, 140);
  ctx.fillStyle = '#aee3f5';
  ctx.fillRect(74, 52, 134, 124);
  circle(ctx, 250 - 132, 84, 18, '#ffd93b');
  cloud(ctx, 96, 92, 0.55);
  ctx.strokeStyle = '#8a6d3b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(141, 52); ctx.lineTo(141, 176);
  ctx.moveTo(74, 114); ctx.lineTo(208, 114);
  ctx.stroke();
  ctx.fillStyle = '#e4572e';
  ctx.beginPath(); // curtain panels
  ctx.moveTo(66, 44); ctx.lineTo(96, 44); ctx.lineTo(88, 184); ctx.lineTo(66, 184); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(216, 44); ctx.lineTo(186, 44); ctx.lineTo(194, 184); ctx.lineTo(216, 184); ctx.closePath(); ctx.fill();
  if (v === 1) {
    ctx.fillStyle = '#e4572e';
    ctx.fillRect(66, 44, 150, 140);
    ctx.fillStyle = '#c74324';
    for (let i = 0; i < 5; i++) ctx.fillRect(76 + i * 30, 44, 8, 140);
  }

  // clock (diff 1: 3 o'clock vs 5 o'clock)
  circle(ctx, 520, 80, 34, '#ffffff');
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(520, 80, 34, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(520, 80); ctx.lineTo(520, 58); // 12
  ctx.moveTo(520, 80);
  if (v === 0) ctx.lineTo(542, 80); // 3
  else ctx.lineTo(534, 98); // 5
  ctx.stroke();
  circle(ctx, 520, 80, 3, '#2b2118');

  // shelf with jars (diff 4: three jars vs two)
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(420, 168, 190, 10);
  const jarX = [440, 500, 560];
  const jarCount = v === 0 ? 3 : 2;
  for (let i = 0; i < jarCount; i++) {
    ctx.fillStyle = '#d9f2ff';
    rr(ctx, jarX[i], 128, 40, 40, 8); ctx.fill();
    ctx.fillStyle = '#e4572e';
    ctx.fillRect(jarX[i] + 4, 122, 32, 8);
    ctx.fillStyle = '#8a5a2b';
    circle(ctx, jarX[i] + 20, 152, 7, '#8a5a2b');
  }

  // plant (diff 5: one leaf missing on the right)
  ctx.fillStyle = '#e4572e';
  rr(ctx, 66, 300, 48, 40, 8); ctx.fill();
  ctx.strokeStyle = '#3f9e4d';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(90, 300); ctx.quadraticCurveTo(70, 268, 62, 252); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(90, 300); ctx.quadraticCurveTo(90, 262, 90, 244); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(90, 300); ctx.quadraticCurveTo(110, 268, 118, 252); ctx.stroke();
  if (v === 0) {
    ctx.beginPath();
    ctx.moveTo(90, 300); ctx.quadraticCurveTo(104, 250, 128, 238); ctx.stroke();
  }

  // cat (diff 2: bow red vs blue)
  ctx.fillStyle = '#f5a623';
  circle(ctx, 320, 300, 46, '#f5a623'); // body
  circle(ctx, 320, 238, 32, '#f5a623'); // head
  ctx.beginPath(); // ears
  ctx.moveTo(296, 222); ctx.lineTo(292, 196); ctx.lineTo(312, 212); ctx.closePath(); ctx.fill();
  ctx.moveTo(344, 222); ctx.lineTo(348, 196); ctx.lineTo(328, 212); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f78fb3';
  ctx.beginPath();
  ctx.moveTo(298, 218); ctx.lineTo(296, 202); ctx.lineTo(307, 212); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(342, 218); ctx.lineTo(344, 202); ctx.lineTo(333, 212); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 2;
  ctx.beginPath(); // closed happy eyes
  ctx.arc(308, 236, 6, Math.PI, 0); ctx.stroke();
  ctx.beginPath();
  ctx.arc(332, 236, 6, Math.PI, 0); ctx.stroke();
  ctx.fillStyle = '#e4572e';
  ctx.beginPath(); // nose
  ctx.moveTo(316, 248); ctx.lineTo(324, 248); ctx.lineTo(320, 254); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 8;
  ctx.beginPath(); // tail curl
  ctx.moveTo(364, 318);
  ctx.quadraticCurveTo(396, 310, 390, 280);
  ctx.stroke();
  // bow under chin
  ctx.fillStyle = v === 0 ? '#e4572e' : '#3f7fd1';
  ctx.beginPath();
  ctx.moveTo(320, 268); ctx.lineTo(304, 258); ctx.lineTo(304, 278); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(320, 268); ctx.lineTo(336, 258); ctx.lineTo(336, 278); ctx.closePath(); ctx.fill();
  circle(ctx, 320, 268, 5, v === 0 ? '#e4572e' : '#3f7fd1');

  // teapot (diff 3: steam on the left only)
  ctx.fillStyle = '#7ec8e3';
  circle(ctx, 470, 312, 30, '#7ec8e3');
  ctx.fillRect(446, 282, 48, 12);
  ctx.beginPath();
  ctx.moveTo(494, 300); ctx.quadraticCurveTo(516, 296, 512, 318); ctx.quadraticCurveTo(500, 316, 496, 308);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2b2118';
  circle(ctx, 470, 280, 6, '#2b2118');
  if (v === 0) {
    ctx.strokeStyle = '#b0b0b0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(462, 272); ctx.quadraticCurveTo(454, 256, 462, 242);
    ctx.moveTo(478, 272); ctx.quadraticCurveTo(486, 256, 478, 242);
    ctx.stroke();
  }

  // cup (diff 7: coffee inside vs empty)
  ctx.fillStyle = '#ffffff';
  rr(ctx, 222, 312, 40, 30, 6); ctx.fill();
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(264, 326, 9, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  if (v === 0) {
    ctx.fillStyle = '#6d4420';
    ctx.beginPath(); ctx.ellipse(242, 316, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
  }
}

// ---------------- Scene 3: Moon Camp ----------------
function paintCamp(ctx, v) {
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#0b1035');
  sky.addColorStop(0.6, '#1d2b5c');
  sky.addColorStop(0.6, '#234d33');
  sky.addColorStop(1, '#17301f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 420);

  // stars (diff 2: the bright star near the moon is gone on the right)
  const stars = [[60, 60], [150, 40], [220, 90], [360, 40], [440, 90], [600, 150], [80, 150], [260, 30]];
  for (const [sx, sy] of stars) star(ctx, sx, sy, 5, '#ffffff');
  if (v === 0) star(ctx, 300, 60, 10, '#ffe98a');

  // moon (diff 1: crescent on the right)
  circle(ctx, 540, 70, 34, '#fdf6d8');
  circle(ctx, 530, 62, 7, '#e8ddb0');
  circle(ctx, 552, 80, 5, '#e8ddb0');
  if (v === 1) {
    circle(ctx, 556, 58, 30, '#1d2b5c');
  }

  // pine trees
  function pine(x, y, s) {
    ctx.fillStyle = '#2e6b3a';
    ctx.beginPath();
    ctx.moveTo(x, y - 90 * s); ctx.lineTo(x - 34 * s, y - 20 * s); ctx.lineTo(x + 34 * s, y - 20 * s);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y - 60 * s); ctx.lineTo(x - 42 * s, y + 16 * s); ctx.lineTo(x + 42 * s, y + 16 * s);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#6d4420';
    ctx.fillRect(x - 6 * s, y + 16 * s, 12 * s, 18 * s);
  }
  pine(60, 300, 1);
  pine(600, 290, 0.9);
  pine(120, 320, 0.7);

  // owl on a branch (diff 5: eyes open vs closed)
  ctx.strokeStyle = '#6d4420';
  ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(150, 180); ctx.lineTo(250, 168); ctx.stroke();
  ctx.fillStyle = '#8a5a2b';
  circle(ctx, 205, 150, 24, '#8a5a2b');
  ctx.beginPath(); // ear tufts
  ctx.moveTo(188, 132); ctx.lineTo(184, 116); ctx.lineTo(196, 128); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(222, 132); ctx.lineTo(226, 116); ctx.lineTo(214, 128); ctx.closePath(); ctx.fill();
  if (v === 0) {
    circle(ctx, 196, 146, 6, '#ffffff');
    circle(ctx, 214, 146, 6, '#ffffff');
    circle(ctx, 196, 146, 3, '#2b2118');
    circle(ctx, 214, 146, 3, '#2b2118');
  } else {
    ctx.strokeStyle = '#2b2118';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(190, 146); ctx.lineTo(202, 146); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(208, 146); ctx.lineTo(220, 146); ctx.stroke();
  }
  ctx.fillStyle = '#f2b705';
  ctx.beginPath(); ctx.moveTo(201, 154); ctx.lineTo(209, 154); ctx.lineTo(205, 160); ctx.closePath(); ctx.fill();

  // tent (diff 4: flag on top, left only)
  ctx.fillStyle = '#e4572e';
  ctx.beginPath();
  ctx.moveTo(200, 220); ctx.lineTo(120, 340); ctx.lineTo(280, 340); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c74324';
  ctx.beginPath();
  ctx.moveTo(200, 220); ctx.lineTo(200, 340); ctx.lineTo(280, 340); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2b2118';
  ctx.beginPath();
  ctx.moveTo(200, 280); ctx.lineTo(168, 340); ctx.lineTo(232, 340); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(200, 220); ctx.lineTo(200, 200); ctx.stroke();
  if (v === 0) {
    ctx.fillStyle = '#f2b705';
    ctx.beginPath();
    ctx.moveTo(200, 200); ctx.lineTo(224, 206); ctx.lineTo(200, 212); ctx.closePath(); ctx.fill();
  }

  // campfire (diff 3: big flame vs small flame)
  ctx.fillStyle = '#6d6d6d';
  circle(ctx, 372, 344, 8, '#6d6d6d');
  circle(ctx, 388, 344, 8, '#6d6d6d');
  circle(ctx, 380, 336, 8, '#6d6d6d');
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(360, 352); ctx.lineTo(398, 332); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(398, 352); ctx.lineTo(360, 332); ctx.stroke();
  ctx.fillStyle = '#f2b705';
  ctx.beginPath();
  if (v === 0) {
    ctx.moveTo(380, 296);
    ctx.quadraticCurveTo(402, 318, 396, 338);
    ctx.quadraticCurveTo(380, 348, 364, 338);
    ctx.quadraticCurveTo(358, 318, 380, 296);
  } else {
    ctx.moveTo(380, 314);
    ctx.quadraticCurveTo(392, 326, 390, 338);
    ctx.quadraticCurveTo(380, 344, 370, 338);
    ctx.quadraticCurveTo(368, 326, 380, 314);
  }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e4572e';
  ctx.beginPath();
  ctx.moveTo(380, 318);
  ctx.quadraticCurveTo(390, 330, 388, 340);
  ctx.quadraticCurveTo(380, 344, 372, 340);
  ctx.quadraticCurveTo(370, 330, 380, 318);
  ctx.closePath(); ctx.fill();

  // marshmallow stick (diff 7: marshmallow on the stick, left only)
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(330, 372); ctx.lineTo(352, 306); ctx.stroke();
  if (v === 0) {
    ctx.fillStyle = '#ffffff';
    rr(ctx, 344, 288, 16, 20, 6); ctx.fill();
    ctx.fillStyle = '#f2b705';
    ctx.fillRect(344, 296, 16, 3);
  }

  // backpack (diff 6: mug hanging on it, left only)
  ctx.fillStyle = '#17a398';
  rr(ctx, 470, 310, 56, 52, 12); ctx.fill();
  ctx.fillStyle = '#0f7a70';
  rr(ctx, 478, 318, 40, 24, 8); ctx.fill();
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(482, 302, 10, Math.PI, 0); ctx.stroke();
  if (v === 0) {
    ctx.fillStyle = '#e4572e';
    rr(ctx, 522, 322, 16, 20, 4); ctx.fill();
    ctx.strokeStyle = '#e4572e';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(540, 332, 6, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  }

  // sleeping log + fireflies
  ctx.fillStyle = '#6d4420';
  rr(ctx, 540, 380, 80, 18, 8); ctx.fill();
  circle(ctx, 500, 250, 3, '#ffe98a');
  circle(ctx, 90, 220, 3, '#ffe98a');
  circle(ctx, 580, 210, 3, '#ffe98a');
}

export const SCENES = [
  {
    id: 'park',
    name: 'Sunny Park',
    intro: 'A lazy afternoon in the park. The sun is shining, the dog is wagging — but 7 little things changed between the two pictures. Can you spot them all?',
    paint: paintPark,
    diffs: [
      { x: 90, y: 70, r: 40, name: 'Sunglasses on the sun' },
      { x: 356, y: 48, r: 34, name: 'The missing cloud' },
      { x: 579, y: 212, r: 26, name: 'An apple vanished' },
      { x: 378, y: 296, r: 28, name: "The dog's tail" },
      { x: 90, y: 372, r: 24, name: 'The flower changed colour' },
      { x: 300, y: 178, r: 30, name: "The kite's tail" },
      { x: 216, y: 266, r: 24, name: 'The bird on the bench' },
    ],
  },
  {
    id: 'kitchen',
    name: 'Cat Café Kitchen',
    intro: 'Momo the cat is guarding the teapot while the kitchen hums. Seven sneaky changes are hiding in here — the clock, the jars, the curtains… look closely!',
    paint: paintKitchen,
    diffs: [
      { x: 520, y: 80, r: 36, name: 'The clock hands moved' },
      { x: 320, y: 268, r: 26, name: "Momo's bow changed colour" },
      { x: 470, y: 256, r: 28, name: 'The teapot steam is gone' },
      { x: 580, y: 148, r: 28, name: 'A jar disappeared' },
      { x: 128, y: 238, r: 26, name: 'A plant leaf is missing' },
      { x: 141, y: 114, r: 40, name: 'The curtain closed' },
      { x: 242, y: 326, r: 26, name: 'The coffee is gone' },
    ],
  },
  {
    id: 'camp',
    name: 'Moon Camp',
    intro: 'Night falls over the campsite. The fire crackles, the owl watches — but 7 things are different under the moonlight. Trust your eyes, not the dark!',
    paint: paintCamp,
    diffs: [
      { x: 540, y: 70, r: 36, name: 'The moon turned crescent' },
      { x: 300, y: 60, r: 24, name: 'A bright star went out' },
      { x: 380, y: 322, r: 32, name: 'The campfire shrank' },
      { x: 212, y: 206, r: 24, name: 'The tent flag is gone' },
      { x: 205, y: 146, r: 26, name: 'The owl closed its eyes' },
      { x: 530, y: 332, r: 24, name: 'The mug vanished' },
      { x: 352, y: 298, r: 24, name: 'The marshmallow is missing' },
    ],
  },
];
