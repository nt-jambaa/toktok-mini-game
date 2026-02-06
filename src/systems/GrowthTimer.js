// ============================================================
// GrowthTimer.js — Growth progress calculation
// ============================================================

import { getAnimal, TIME_SCALE } from './MockData.js';

/**
 * Calculate the current growth progress (0–100%)
 */
export function calculateProgress(gameState, timeScale) {
  const animal = getAnimal(gameState.animalType);
  if (!animal) return 0;

  const now = Date.now();
  const elapsedMs = now - gameState.startTime;
  const elapsedSeconds = elapsedMs / 1000;

  // Apply time scale for demo mode
  const scaledElapsed = elapsedSeconds * timeScale;
  const totalEffective = scaledElapsed + gameState.bonusReductionSeconds;

  let progress = totalEffective / animal.durationSeconds;
  if (progress > 1) progress = 1;
  if (progress < 0) progress = 0;

  return progress * 100;
}

/**
 * Get remaining time as a human-readable string
 */
export function getRemainingTimeText(gameState, timeScale) {
  const animal = getAnimal(gameState.animalType);
  if (!animal) return '';

  const now = Date.now();
  const elapsedSeconds = (now - gameState.startTime) / 1000;
  const scaledElapsed = elapsedSeconds * timeScale;
  const totalEffective = scaledElapsed + gameState.bonusReductionSeconds;
  const remainingSeconds = animal.durationSeconds - totalEffective;

  if (remainingSeconds <= 0) return 'Ready to harvest!';

  // Show remaining in real time (divide by scale)
  const realRemaining = remainingSeconds / timeScale;

  if (realRemaining < 60) return `${Math.ceil(realRemaining)}s remaining`;
  if (realRemaining < 3600) return `${Math.ceil(realRemaining / 60)}m remaining`;
  if (realRemaining < 86400) return `${Math.ceil(realRemaining / 3600)}h remaining`;
  return `${Math.ceil(realRemaining / 86400)}d remaining`;
}

/**
 * Check if the animal is ready to harvest
 */
export function isReadyToHarvest(gameState, timeScale) {
  return calculateProgress(gameState, timeScale) >= 100;
}

/**
 * Apply a speed-up bonus (simulates an order)
 */
export function applyOrderSpeedUp(gameState) {
  // Each order reduces by 24 hours worth of game seconds
  gameState.bonusReductionSeconds += 24 * 60 * 60;
  gameState.ordersPlaced = (gameState.ordersPlaced || 0) + 1;
  saveGameState(gameState);
  return gameState;
}

// ============================================================
// localStorage persistence
// ============================================================

const STORAGE_KEY = 'toktok_farm_state';

export function saveGameState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadGameState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearGameState() {
  localStorage.removeItem(STORAGE_KEY);
}

export function createNewGameState(animalType) {
  const state = {
    animalType,
    startTime: Date.now(),
    lastFedAt: Date.now(),
    bonusReductionSeconds: 0,
    ordersPlaced: 0,
    farmXP: loadFarmXP(),
    status: 'ACTIVE',
  };
  saveGameState(state);
  return state;
}

// Farm XP persists across games
const XP_KEY = 'toktok_farm_xp';

export function loadFarmXP() {
  return parseInt(localStorage.getItem(XP_KEY) || '0', 10);
}

export function addFarmXP(amount) {
  const current = loadFarmXP();
  const newXP = current + amount;
  localStorage.setItem(XP_KEY, newXP.toString());
  return newXP;
}
