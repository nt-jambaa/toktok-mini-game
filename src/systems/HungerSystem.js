// ============================================================
// HungerSystem.js — 72h hunger bar logic
// ============================================================

import { HUNGER_TIMEOUT_SECONDS } from './MockData.js';
import { saveGameState } from './GrowthTimer.js';

/**
 * Get hunger percentage (100 = just fed, 0 = starving / left)
 */
export function getHungerPercent(gameState, timeScale) {
  const now = Date.now();
  const elapsedMs = now - gameState.lastFedAt;
  const elapsedSeconds = (elapsedMs / 1000) * timeScale;

  const hunger = 1 - (elapsedSeconds / HUNGER_TIMEOUT_SECONDS);
  if (hunger < 0) return 0;
  if (hunger > 1) return 100;
  return hunger * 100;
}

/**
 * Check if the animal has left (hunger reached 0)
 */
export function hasAnimalLeft(gameState, timeScale) {
  return getHungerPercent(gameState, timeScale) <= 0;
}

/**
 * Feed the animal (reset hunger timer)
 */
export function feedAnimal(gameState) {
  gameState.lastFedAt = Date.now();
  saveGameState(gameState);
  return gameState;
}

/**
 * Get hunger status text
 */
export function getHungerStatusText(gameState, timeScale) {
  const percent = getHungerPercent(gameState, timeScale);
  if (percent <= 0) return 'LEFT! Animal ran away!';
  if (percent < 20) return 'Starving!';
  if (percent < 50) return 'Getting hungry...';
  return 'Happy & Full';
}

/**
 * Get hunger bar color based on percentage
 */
export function getHungerColor(percent) {
  if (percent > 60) return 0x4caf50; // Green
  if (percent > 30) return 0xff9800; // Orange
  return 0xf44336; // Red
}
