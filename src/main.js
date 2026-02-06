import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { SelectScene } from './scenes/SelectScene.js';
import { GameScene } from './scenes/GameScene.js';
import { HarvestScene } from './scenes/HarvestScene.js';
import { LeaderboardScene } from './scenes/LeaderboardScene.js';

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#87CEEB',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1 },
      debug: false,
    },
  },
  scene: [BootScene, SelectScene, GameScene, HarvestScene, LeaderboardScene],
};

const game = new Phaser.Game(config);
