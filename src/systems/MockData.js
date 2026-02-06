// ============================================================
// MockData.js — All game configuration and mock data
// ============================================================

export const ANIMALS = {
  chicken: {
    key: 'chicken',
    name: 'Chicken',
    emoji: '🐔',
    durationDays: 3,
    durationSeconds: 3 * 24 * 60 * 60, // 259,200s
    rewardCategory: 'Chicken & Wings',
    rewardAmount: '5,000 MNT',
    color: 0xf5a623,
    bodyColor: 0xffd700,
    description: 'High frequency, low barrier',
  },
  sheep: {
    key: 'sheep',
    name: 'Sheep',
    emoji: '🐑',
    durationDays: 5,
    durationSeconds: 5 * 24 * 60 * 60, // 432,000s
    rewardCategory: 'Mongolian / Traditional',
    rewardAmount: '8,000 MNT',
    color: 0xcccccc,
    bodyColor: 0xeeeeee,
    description: 'Local favorites',
  },
  pig: {
    key: 'pig',
    name: 'Pig',
    emoji: '🐷',
    durationDays: 5,
    durationSeconds: 5 * 24 * 60 * 60,
    rewardCategory: 'Asian / Korean / BBQ',
    rewardAmount: '8,000 MNT',
    color: 0xffb6c1,
    bodyColor: 0xffc0cb,
    description: 'Trendy category',
  },
  cow: {
    key: 'cow',
    name: 'Cow',
    emoji: '🐄',
    durationDays: 7,
    durationSeconds: 7 * 24 * 60 * 60,
    rewardCategory: 'Burgers / Steaks / Pizza',
    rewardAmount: '15,000 MNT',
    color: 0x8b4513,
    bodyColor: 0xffffff,
    description: 'High-value orders',
  },
  horse: {
    key: 'horse',
    name: 'Horse',
    emoji: '🐴',
    durationDays: 10,
    durationSeconds: 10 * 24 * 60 * 60,
    rewardCategory: 'Coffee / Bakery / Desserts',
    rewardAmount: '25,000 MNT',
    color: 0x8b6914,
    bodyColor: 0xc49a6c,
    description: 'For daily habit users',
  },
};

export const HUNGER_TIMEOUT_SECONDS = 72 * 60 * 60; // 72 hours

// Demo mode: accelerated time (1 real second = X game seconds)
export const TIME_SCALE = {
  demo: 360,   // 1 real second = 6 real minutes; a 3-day chicken finishes in ~12 min
  real: 1,     // Real time
};

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Boldoo', xp: 12400, badge: '👑' },
  { rank: 2, name: 'Saraa', xp: 11200, badge: '🥈' },
  { rank: 3, name: 'Temuulen', xp: 10800, badge: '🥉' },
  { rank: 4, name: 'Enkhsaikhan', xp: 9600, badge: '' },
  { rank: 5, name: 'Munkhzul', xp: 8900, badge: '' },
  { rank: 6, name: 'Bat-Erdene', xp: 7500, badge: '' },
  { rank: 7, name: 'Oyunaa', xp: 6800, badge: '' },
  { rank: 8, name: 'Anujin', xp: 5400, badge: '' },
  { rank: 9, name: 'Ganbold', xp: 4200, badge: '' },
  { rank: 10, name: 'Delgermaa', xp: 3100, badge: '' },
];

export function getAnimalList() {
  return Object.values(ANIMALS);
}

export function getAnimal(key) {
  return ANIMALS[key];
}
