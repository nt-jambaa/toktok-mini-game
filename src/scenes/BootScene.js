// ============================================================
// BootScene.js — Generate all game assets programmatically & preload
// ============================================================

import Phaser from 'phaser';
import { getAnimalList } from '../systems/MockData.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Show loading bar
    const { width, height } = this.cameras.main;
    const barWidth = 300;
    const barHeight = 30;
    const barX = (width - barWidth) / 2;
    const barY = height / 2;

    const bgBar = this.add.graphics();
    bgBar.fillStyle(0x333333, 1);
    bgBar.fillRoundedRect(barX, barY, barWidth, barHeight, 8);

    const progressBar = this.add.graphics();

    const loadingText = this.add.text(width / 2, barY - 30, 'Loading TokTok Farm...', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x4caf50, 1);
      progressBar.fillRoundedRect(barX + 4, barY + 4, (barWidth - 8) * value, barHeight - 8, 6);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      bgBar.destroy();
      loadingText.destroy();
    });
  }

  create() {
    this.generateAssets();
    this.scene.start('SelectScene');
  }

  generateAssets() {
    const animals = getAnimalList();

    // Generate animal sprites programmatically
    animals.forEach((animal) => {
      this.generateAnimalSprite(animal.key, animal.bodyColor, animal.color);
    });

    // Generate leaf sprite for feed animation
    this.generateLeafSprite();

    // Generate background
    this.generateBackground();

    // Generate button textures
    this.generateButtonTexture('btn-feed', 0x4caf50, 'Feed Grass');
    this.generateButtonTexture('btn-order', 0xff9800, 'Order Speed Up');
    this.generateButtonTexture('btn-leaderboard', 0x2196f3, 'Leaderboard');
    this.generateButtonTexture('btn-harvest', 0xffd700, 'Harvest Now!');
    this.generateButtonTexture('btn-back', 0x9e9e9e, 'Back');
    this.generateButtonTexture('btn-play-again', 0x4caf50, 'Play Again');

    // Generate particle for confetti
    this.generateConfettiParticle();
  }

  generateAnimalSprite(key, bodyColor, accentColor) {
    // Happy state
    const happyKey = `${key}-happy`;
    const gfxHappy = this.make.graphics({ add: false });
    this.drawAnimal(gfxHappy, bodyColor, accentColor, false);
    gfxHappy.generateTexture(happyKey, 120, 120);
    gfxHappy.destroy();

    // Hungry state
    const hungryKey = `${key}-hungry`;
    const gfxHungry = this.make.graphics({ add: false });
    this.drawAnimal(gfxHungry, bodyColor, accentColor, true);
    gfxHungry.generateTexture(hungryKey, 120, 120);
    gfxHungry.destroy();
  }

  drawAnimal(gfx, bodyColor, accentColor, isHungry) {
    // Body
    gfx.fillStyle(bodyColor, 1);
    gfx.fillEllipse(60, 65, 80, 70);

    // Head
    gfx.fillStyle(accentColor, 1);
    gfx.fillCircle(60, 30, 25);

    // Eyes
    if (isHungry) {
      // Sad eyes (X shape)
      gfx.lineStyle(3, 0x333333, 1);
      gfx.lineBetween(48, 23, 55, 30);
      gfx.lineBetween(55, 23, 48, 30);
      gfx.lineBetween(65, 23, 72, 30);
      gfx.lineBetween(72, 23, 65, 30);
    } else {
      // Happy eyes
      gfx.fillStyle(0x333333, 1);
      gfx.fillCircle(50, 27, 4);
      gfx.fillCircle(70, 27, 4);
      // Smile
      gfx.lineStyle(2, 0x333333, 1);
      gfx.beginPath();
      gfx.arc(60, 33, 10, 0, Math.PI, false);
      gfx.strokePath();
    }

    // Legs
    gfx.fillStyle(accentColor, 0.8);
    gfx.fillRect(35, 95, 10, 20);
    gfx.fillRect(55, 95, 10, 20);
    gfx.fillRect(75, 95, 10, 20);

    if (isHungry) {
      // Sweat drop
      gfx.fillStyle(0x64b5f6, 1);
      gfx.fillCircle(88, 18, 5);
    }
  }

  generateLeafSprite() {
    const gfx = this.make.graphics({ add: false });
    // Simple leaf shape
    gfx.fillStyle(0x66bb6a, 1);
    gfx.fillEllipse(12, 8, 20, 12);
    gfx.lineStyle(2, 0x388e3c, 1);
    gfx.lineBetween(2, 8, 22, 8);
    gfx.generateTexture('leaf', 24, 16);
    gfx.destroy();
  }

  generateBackground() {
    const gfx = this.make.graphics({ add: false });
    const w = 480;
    const h = 720;

    // Sky gradient
    for (let y = 0; y < h * 0.6; y++) {
      const t = y / (h * 0.6);
      const r = Math.floor(135 + t * 40);
      const g = Math.floor(206 + t * 20);
      const b = Math.floor(235 - t * 30);
      gfx.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      gfx.fillRect(0, y, w, 1);
    }

    // Ground
    gfx.fillStyle(0x7cb342, 1);
    gfx.fillRect(0, h * 0.6, w, h * 0.4);

    // Grass details
    gfx.fillStyle(0x689f38, 1);
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * w;
      const y = h * 0.6 + Math.random() * (h * 0.35);
      gfx.fillEllipse(x, y, 30 + Math.random() * 20, 8);
    }

    // Sun
    gfx.fillStyle(0xffd54f, 1);
    gfx.fillCircle(400, 60, 40);
    gfx.fillStyle(0xffecb3, 0.3);
    gfx.fillCircle(400, 60, 60);

    // Clouds
    gfx.fillStyle(0xffffff, 0.8);
    this.drawCloud(gfx, 80, 70);
    this.drawCloud(gfx, 250, 40);
    this.drawCloud(gfx, 380, 100);

    // Fence
    gfx.fillStyle(0x8d6e63, 1);
    for (let x = 0; x < w; x += 60) {
      gfx.fillRect(x + 10, h * 0.55, 8, 50);
    }
    gfx.fillRect(0, h * 0.58, w, 6);
    gfx.fillRect(0, h * 0.65, w, 6);

    gfx.generateTexture('background', w, h);
    gfx.destroy();
  }

  drawCloud(gfx, x, y) {
    gfx.fillCircle(x, y, 20);
    gfx.fillCircle(x + 25, y - 5, 25);
    gfx.fillCircle(x + 50, y, 20);
    gfx.fillEllipse(x + 25, y + 10, 70, 20);
  }

  generateButtonTexture(key, color, text) {
    const w = 200;
    const h = 50;
    const gfx = this.make.graphics({ add: false });

    // Shadow
    gfx.fillStyle(0x000000, 0.2);
    gfx.fillRoundedRect(2, 4, w, h, 12);

    // Button body
    gfx.fillStyle(color, 1);
    gfx.fillRoundedRect(0, 0, w, h, 12);

    // Highlight
    gfx.fillStyle(0xffffff, 0.2);
    gfx.fillRoundedRect(4, 2, w - 8, h / 2 - 2, { tl: 10, tr: 10, bl: 0, br: 0 });

    gfx.generateTexture(key, w + 4, h + 6);
    gfx.destroy();
  }

  generateConfettiParticle() {
    const gfx = this.make.graphics({ add: false });
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRect(0, 0, 8, 8);
    gfx.generateTexture('confetti', 8, 8);
    gfx.destroy();
  }
}
