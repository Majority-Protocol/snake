/**
 * Shared game constants and utilities.
 *
 * This is the single source of truth for values that must match
 * between the client game (index.ts HTML) and the server replay engine.
 */

// Fixed grid dimensions used in contest mode
export const CONTEST_COLS = 20;
export const CONTEST_ROWS = 20;

// Mulberry32 seeded PRNG — deterministic random from a 32-bit seed
export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Shared types
// dx/dy = direction input; timer = 1 means "1 second elapsed" (wall-clock timer tick)
export type GameInput = { tick: number; dx: number; dy: number; timer?: number };
export type ReplayResult = {
  score: number;
  round: number;
  length: number;
  foodSpawnTicks: number[];
};
