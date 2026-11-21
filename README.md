[![Twin Peeks](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/fahroz1/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/fahroz1/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

# Twin Peeks — Spot the Difference

Two near-identical pictures side by side. Find all 7 differences in each of 3 hand-drawn scenes — Sunny Park, Cat Café Kitchen and Moon Camp — before the timer runs out. Click a difference on either picture: a golden ring and chime mark the find, combos multiply your points, hints cost 50 points, and wrong clicks cost 3 seconds.

Play it offline: open `game/index.html` in a desktop browser (or serve `game/` with any static server). All art is drawn in code on canvas and all sounds are synthesized with the Web Audio API — no downloads, no network.

Entry for the make.fun bounty: https://make.fun/bounty/best-spot-the-difference-game-20261121-0451

## How to hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
