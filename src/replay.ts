/**
 * Headless Snake Replay Engine
 *
 * Deterministically replays a snake game given a seed and input log.
 * Uses the same constants and PRNG from core.ts that the client uses.
 * Game logic here must stay in sync with the inline game in index.ts.
 */

import {
  CONTEST_COLS,
  CONTEST_ROWS,
  MAX_CONTEST_ROWS,
  MIN_CONTEST_ROWS,
  type GameInput,
  type ReplayResult,
  mulberry32,
} from "./core";

// At the fastest possible game speed (60ms), max ticks per second is ~17.
// We use 2x buffer to allow for edge cases but still cap runaway games.
const MIN_GAME_SPEED_MS = 60;
const MAX_TICKS_PER_SECOND = Math.ceil(1000 / MIN_GAME_SPEED_MS);
const ROUND_TICK_BUFFER = 2;

type Pos = { x: number; y: number };
type FallingCoin = { x: number; fallProgress: number };

export function replaySnakeGame({
  seed,
  inputs,
  rows: rowsParam,
}: {
  seed: number;
  inputs: GameInput[];
  rows?: number;
}): ReplayResult {
  const COLS = CONTEST_COLS;
  const ROWS =
    rowsParam != null
      ? Math.max(MIN_CONTEST_ROWS, Math.min(MAX_CONTEST_ROWS, rowsParam))
      : CONTEST_ROWS;

  const rng = mulberry32(seed);

  // Separate direction inputs from timer events
  const directionInputs = new Map<number, { dx: number; dy: number }>();
  const timerTicks = new Set<number>();
  for (const inp of inputs) {
    if (inp.timer) {
      timerTicks.add(inp.tick);
    } else {
      directionInputs.set(inp.tick, { dx: inp.dx, dy: inp.dy });
    }
  }

  const foodSpawnTicks: number[] = [];

  let round = 1;
  let coins = 0;
  let lives = 0;
  let totalScore = 0;
  let tickCount = 0;

  let snake: Pos[] = [];
  let direction: Pos = { x: 1, y: 0 };
  let nextDirection: Pos = { x: 1, y: 0 };
  let food: Pos = { x: 0, y: 0 };
  let barriers: Pos[] = [];
  let gameOver = false;
  let roundComplete = false;
  let gameSpeed = 100;
  let baseSpeed = 100;
  let foodType = "normal";
  let icePowerUp: Pos | null = null;
  let targetLength = 0;
  let roundTimer = 0;
  let roundTimeLimit = 0;
  let fallingCoins: FallingCoin[] = [];
  let roundTickCount = 0;

  function generateBarriers(): Pos[] {
    const b: Pos[] = [];
    if (round < 2) return b;
    const numBarriers = Math.min(1 + round * 2, 12);
    const snakeStartX = Math.floor(COLS / 2);
    const snakeStartY = Math.floor(ROWS / 2);

    for (let i = 0; i < numBarriers; i++) {
      const isHorizontal = rng() > 0.5;
      const length = 3 + Math.floor(rng() * (round + 2));
      const startX = Math.floor(rng() * (COLS - length - 4)) + 2;
      const startY = Math.floor(rng() * (ROWS - length - 4)) + 2;

      for (let j = 0; j < length; j++) {
        const bx = isHorizontal ? startX + j : startX;
        const by = isHorizontal ? startY : startY + j;
        if (
          Math.abs(bx - snakeStartX) > 5 ||
          Math.abs(by - snakeStartY) > 3
        ) {
          b.push({ x: bx, y: by });
        }
      }
    }
    return b;
  }

  function placeFood(): void {
    let valid = false;
    let attempts = 0;
    while (!valid && attempts < 1000) {
      food = {
        x: Math.floor(rng() * COLS),
        y: Math.floor(rng() * ROWS),
      };
      valid =
        !snake.some((s) => s.x === food.x && s.y === food.y) &&
        !barriers.some((b) => b.x === food.x && b.y === food.y);
      attempts++;
    }

    const isGrowthRound = round % 3 === 0;
    if (isGrowthRound) {
      foodType = "normal";
    } else {
      const roll = rng();
      if (roll < 0.15) foodType = "ultra";
      else if (roll < 0.4) foodType = "speed";
      else foodType = "normal";
    }

    if (!icePowerUp && rng() < 0.25 && !isGrowthRound) {
      placeIcePowerUp();
    }
  }

  function placeIcePowerUp(): void {
    let valid = false;
    let attempts = 0;
    icePowerUp = { x: 0, y: 0 };
    while (!valid && attempts < 500) {
      icePowerUp = {
        x: Math.floor(rng() * COLS),
        y: Math.floor(rng() * ROWS),
      };
      valid =
        !snake.some((s) => s.x === icePowerUp!.x && s.y === icePowerUp!.y) &&
        !barriers.some(
          (b) => b.x === icePowerUp!.x && b.y === icePowerUp!.y,
        ) &&
        !(food.x === icePowerUp.x && food.y === icePowerUp.y);
      attempts++;
    }
  }

  function spawnCoin(): void {
    fallingCoins.push({
      x: Math.floor(rng() * COLS),
      fallProgress: 0,
    });
  }

  function changeSpeed(newSpeed: number): void {
    gameSpeed = Math.max(60, Math.min(150, newSpeed));
  }

  function startRound(): void {
    const isGrowthRound = round % 3 === 0;
    const startLength = round === 1 || isGrowthRound ? 3 : snake.length;
    snake = [];
    const startX = Math.floor(COLS / 2);
    const startY = Math.floor(ROWS / 2);
    for (let i = 0; i < startLength; i++) {
      snake.push({ x: startX - i, y: startY });
    }
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    targetLength = isGrowthRound
      ? 25 + round * 2
      : startLength + 5 + round * 3;
    barriers = generateBarriers();
    gameOver = false;
    roundComplete = false;
    baseSpeed = 100;
    gameSpeed = baseSpeed;
    icePowerUp = null;
    roundTimeLimit = isGrowthRound
      ? 90
      : Math.max(30, 60 - (round - 1) * 5);
    roundTimer = roundTimeLimit;
    roundTickCount = 0;
    placeFood();
  }

  function respawn(): void {
    const currentLength = snake.length;
    snake = [];
    const startX = Math.floor(COLS / 2);
    const startY = Math.floor(ROWS / 2);
    for (let i = 0; i < currentLength; i++) {
      snake.push({ x: startX - i, y: startY });
    }
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
  }

  function endGame(): boolean {
    if (lives > 0) {
      lives--;
      respawn();
      return false;
    }
    gameOver = true;
    return true;
  }

  function timeUp(): boolean {
    if (lives > 0) {
      lives--;
      roundTimer = roundTimeLimit;
      return false;
    }
    gameOver = true;
    return true;
  }

  function completeRound(): void {
    roundComplete = true;
    totalScore += snake.length;
  }

  // Simulate one tick — returns true if game ended
  function update(): boolean {
    if (gameOver || roundComplete) return gameOver;

    tickCount++;

    if (rng() < 0.03) spawnCoin();

    for (const c of fallingCoins) {
      c.fallProgress += 0.2;
    }
    fallingCoins = fallingCoins.filter((c) => c.fallProgress < ROWS);

    const head = snake[0];
    const newCoins: FallingCoin[] = [];
    for (const coin of fallingCoins) {
      const coinY = Math.floor(coin.fallProgress);
      if (coin.x === head.x && Math.abs(coinY - head.y) <= 1) {
        coins++;
        if (coins >= 50) {
          coins -= 50;
          lives++;
        }
      } else {
        newCoins.push(coin);
      }
    }
    fallingCoins = newCoins;

    direction = { ...nextDirection };
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    if (
      newHead.x < 0 ||
      newHead.x >= COLS ||
      newHead.y < 0 ||
      newHead.y >= ROWS
    ) {
      return endGame();
    }
    if (snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      return endGame();
    }
    if (barriers.some((b) => b.x === newHead.x && b.y === newHead.y)) {
      return endGame();
    }

    snake.unshift(newHead);

    if (
      icePowerUp &&
      newHead.x === icePowerUp.x &&
      newHead.y === icePowerUp.y
    ) {
      changeSpeed(gameSpeed + 25);
      icePowerUp = null;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
      if (foodType === "ultra") changeSpeed(baseSpeed - 15);
      else if (foodType === "speed") changeSpeed(baseSpeed - 10);
      placeFood();
      foodSpawnTicks.push(tickCount);
      if (snake.length >= targetLength) {
        completeRound();
      }
    } else {
      snake.pop();
    }

    return false;
  }

  // ── Main replay loop ─────────────────────────────────────────────────

  startRound();

  // The client game loop runs on setInterval(gameSpeed) AND inputs cause
  // an immediate update() + loop restart. For replay we process ticks in
  // order: before each update, check if there's an input for the current
  // tickCount and apply direction, then run update().
  //
  // Timer events come from the client's real-time setInterval(1000).
  // We use those recorded events instead of modeling elapsed time,
  // because input-triggered ticks don't consume real wall-clock time.

  const MAX_TICKS = 1_000_000; // safety valve

  for (let i = 0; i < MAX_TICKS; i++) {
    if (gameOver) break;

    // Apply direction input at this tick (if any)
    const inp = directionInputs.get(tickCount);
    if (inp) {
      if (
        !(inp.dx === -direction.x && inp.dy === -direction.y) &&
        (inp.dx !== 0 || inp.dy !== 0)
      ) {
        nextDirection = { x: inp.dx, y: inp.dy };
      }
    }

    // Apply timer decrement at this tick (if client recorded one)
    if (timerTicks.has(tickCount)) {
      roundTimer--;
      if (roundTimer <= 0) {
        if (timeUp()) break;
      }
    }

    // Server-side tick cap: even if timer events are missing/stripped,
    // enforce max ticks per round based on game rules.
    // At fastest speed (60ms) there are ~17 ticks/sec × roundTimeLimit seconds.
    // We allow 2x buffer for input-triggered extra ticks.
    roundTickCount++;
    const maxRoundTicks = roundTimeLimit * MAX_TICKS_PER_SECOND * ROUND_TICK_BUFFER;
    if (roundTickCount > maxRoundTicks) {
      if (timeUp()) break;
    }

    const ended = update();
    if (ended) break;

    if (roundComplete) {
      round++;
      startRound();
      continue;
    }
  }

  const finalScore = totalScore + snake.length;
  return { score: finalScore, round, length: snake.length, foodSpawnTicks };
}
