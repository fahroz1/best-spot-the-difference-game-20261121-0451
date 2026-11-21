// Twin Peeks — Spot the Difference: the hand-in program (Node 22, stdlib only).
//
// It copies this repository's game/ and screenshots/ beside this file into the
// output directory (MAKEFUN_OUTPUT_DIR, or /output in the grader) and writes
// /output/dossier.json with the vendored make.fun library, so the sealed
// scorer can check the game and the judge can read its dossier.
//
// Outside the grader:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy a directory tree verbatim (plain files and directories only), visiting
// entries in sorted order so repeated runs write identical bytes.
function copyTree(srcDir, dstDir) {
  mkdirSync(dstDir, { recursive: true });
  const entries = readdirSync(srcDir).sort();
  for (const name of entries) {
    const src = join(srcDir, name);
    const dst = join(dstDir, name);
    const info = statSync(src);
    if (info.isDirectory()) {
      copyTree(src, dst);
    } else if (info.isFile()) {
      copyFileSync(src, dst);
    }
  }
}

const gameDir = join(here, 'game');
const shotsDir = join(here, 'screenshots');

if (!existsSync(gameDir)) {
  throw new Error('game/ is missing next to main.ts');
}
if (!existsSync(join(gameDir, 'index.html'))) {
  throw new Error('game/index.html is missing');
}

mkdirSync(outDir, { recursive: true });
copyTree(gameDir, join(outDir, 'game'));
if (existsSync(shotsDir)) {
  copyTree(shotsDir, join(outDir, 'screenshots'));
}

// The dossier the judge reads: byte for byte what buildDossier writes from
// the copied game/ and screenshots/, under the scorer's own caps.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

// A one-line summary on stdout, so a run's log shows what was handed in.
const shotCount = existsSync(shotsDir) ? readdirSync(shotsDir).length : 0;
console.log(`Twin Peeks handed in: game/ + ${shotCount} screenshot(s) + dossier.json -> ${outDir}`);
