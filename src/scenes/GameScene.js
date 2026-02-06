// ============================================================
// GameScene.js — Main gameplay screen
// ============================================================

import Phaser from 'phaser';
import { getAnimal, TIME_SCALE } from '../systems/MockData.js';
import {
  calculateProgress,
  getRemainingTimeText,
  isReadyToHarvest,
  applyOrderSpeedUp,
  loadGameState,
  saveGameState,
  clearGameState,
} from '../systems/GrowthTimer.js';
import {
  getHungerPercent,
  hasAnimalLeft,
  feedAnimal,
  getHungerStatusText,
  getHungerColor,
} from '../systems/HungerSystem.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.gameState = null;
    this.animalData = null;
    this.timeScale = TIME_SCALE.demo; // Start in demo mode
    this.isDemoMode = true;
  }

  create() {
    const { width, height } = this.cameras.main;

    this.gameState = loadGameState();
    if (!this.gameState) {
      this.scene.start('SelectScene');
      return;
    }

    this.animalData = getAnimal(this.gameState.animalType);
    this.timeScale = this.isDemoMode ? TIME_SCALE.demo : TIME_SCALE.real;

    // Background
    this.add.image(width / 2, height / 2, 'background');

    // ---- TOP UI: Progress Bar ----
    this.createProgressUI(width);

    // ---- Hunger Bar ----
    this.createHungerUI(width);

    // ---- Center: Animal ----
    this.createAnimalDisplay(width, height);

    // ---- Bottom: Buttons ----
    this.createButtons(width, height);

    // ---- Demo Mode Toggle ----
    this.createDemoToggle(width);

    // ---- Matter.js walls for leaf physics ----
    this.setupPhysicsWalls(width, height);

    // ---- Update loop ----
    this.time.addEvent({
      delay: 500,
      callback: this.updateUI,
      callbackScope: this,
      loop: true,
    });

    // Camera fade in
    this.cameras.main.fadeIn(300);
  }

  // ==========================
  // UI Creation
  // ==========================

  createProgressUI(width) {
    // Background panel
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.5);
    panel.fillRoundedRect(15, 12, width - 30, 60, 10);

    // Progress bar background
    this.progressBarBg = this.add.graphics();
    this.progressBarBg.fillStyle(0x333333, 1);
    this.progressBarBg.fillRoundedRect(25, 40, width - 50, 20, 8);

    // Progress bar fill
    this.progressBarFill = this.add.graphics();

    // Progress text
    this.progressText = this.add.text(width / 2, 26, '', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Remaining time text
    this.remainingText = this.add.text(width - 30, 26, '', {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffcc',
    }).setOrigin(1, 0.5);
  }

  createHungerUI(width) {
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.5);
    panel.fillRoundedRect(15, 80, width - 30, 50, 10);

    this.hungerLabel = this.add.text(25, 88, 'Hunger:', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
    });

    this.hungerStatusText = this.add.text(width - 25, 88, '', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
    }).setOrigin(1, 0);

    // Hunger bar background
    this.hungerBarBg = this.add.graphics();
    this.hungerBarBg.fillStyle(0x333333, 1);
    this.hungerBarBg.fillRoundedRect(25, 106, width - 50, 14, 6);

    this.hungerBarFill = this.add.graphics();
  }

  createAnimalDisplay(width, height) {
    const centerY = height * 0.42;

    // Animal sprite
    this.animalSprite = this.add.image(width / 2, centerY, `${this.animalData.key}-happy`);
    this.animalSprite.setScale(1.8);

    // Idle bounce animation
    this.tweens.add({
      targets: this.animalSprite,
      y: centerY - 8,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Animal name label
    this.add.text(width / 2, centerY + 80, `${this.animalData.emoji} ${this.animalData.name}`, {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Orders counter
    this.ordersText = this.add.text(width / 2, centerY + 108, '', {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffcc',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
  }

  createButtons(width, height) {
    const btnY = height - 160;
    const btnGap = 58;

    // Feed Grass button
    this.feedBtn = this.createButton(width / 2, btnY, 'btn-feed', '🌿 Feed Grass', () => {
      this.onFeed();
    });

    // Order Speed Up button
    this.orderBtn = this.createButton(width / 2, btnY + btnGap, 'btn-order', '🛒 Order to Speed Up', () => {
      this.onOrder();
    });

    // Leaderboard button
    this.lbBtn = this.createButton(width / 2, btnY + btnGap * 2, 'btn-leaderboard', '🏆 Leaderboard', () => {
      this.scene.start('LeaderboardScene');
    });
  }

  createButton(x, y, textureKey, label, callback) {
    const btn = this.add.image(x, y, textureKey).setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y - 2, label, {
      fontSize: '15px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    btn.on('pointerover', () => btn.setScale(1.05));
    btn.on('pointerout', () => btn.setScale(1));
    btn.on('pointerdown', () => {
      btn.setScale(0.95);
      this.time.delayedCall(100, () => btn.setScale(1));
      callback();
    });

    return { btn, text };
  }

  createDemoToggle(width) {
    const toggleText = this.add.text(width - 15, 140, this.isDemoMode ? 'DEMO: Fast' : 'REAL TIME', {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffeb3b',
      backgroundColor: '#00000088',
      padding: { x: 6, y: 3 },
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

    toggleText.on('pointerdown', () => {
      this.isDemoMode = !this.isDemoMode;
      this.timeScale = this.isDemoMode ? TIME_SCALE.demo : TIME_SCALE.real;
      toggleText.setText(this.isDemoMode ? 'DEMO: Fast' : 'REAL TIME');
    });
  }

  setupPhysicsWalls(width, height) {
    // Floor and walls for leaf physics
    this.matter.world.setBounds(0, 0, width, height);
  }

  // ==========================
  // Game Actions
  // ==========================

  onFeed() {
    if (!this.gameState) return;

    this.gameState = feedAnimal(this.gameState);

    // Trigger leaf physics animation
    this.spawnLeaves();

    // Animal happy bounce
    this.tweens.add({
      targets: this.animalSprite,
      scaleX: 2.0,
      scaleY: 1.6,
      duration: 150,
      yoyo: true,
      ease: 'Bounce',
    });
  }

  onOrder() {
    if (!this.gameState) return;

    this.gameState = applyOrderSpeedUp(this.gameState);

    // Flash effect
    this.cameras.main.flash(200, 255, 235, 59);

    // Show "+24h" text
    const { width } = this.cameras.main;
    const popText = this.add.text(width / 2, 300, '+24h Speed Up!', {
      fontSize: '28px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffeb3b',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: popText,
      y: 220,
      alpha: 0,
      duration: 1200,
      ease: 'Cubic.easeOut',
      onComplete: () => popText.destroy(),
    });
  }

  spawnLeaves() {
    const { width } = this.cameras.main;
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const leaf = this.matter.add.image(x, -20, 'leaf', null, {
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.03,
        angle: Phaser.Math.FloatBetween(0, Math.PI * 2),
      });
      leaf.setScale(Phaser.Math.FloatBetween(1, 2));

      // Apply random force
      leaf.setVelocity(
        Phaser.Math.FloatBetween(-2, 2),
        Phaser.Math.FloatBetween(2, 5)
      );

      // Spin
      leaf.setAngularVelocity(Phaser.Math.FloatBetween(-0.1, 0.1));

      // Remove after a while
      this.time.delayedCall(3000, () => {
        if (leaf && leaf.body) {
          leaf.destroy();
        }
      });
    }
  }

  // ==========================
  // UI Update Loop
  // ==========================

  updateUI() {
    if (!this.gameState) return;

    // Reload state
    this.gameState = loadGameState();
    if (!this.gameState) return;

    const progress = calculateProgress(this.gameState, this.timeScale);
    const remaining = getRemainingTimeText(this.gameState, this.timeScale);
    const hungerPct = getHungerPercent(this.gameState, this.timeScale);
    const hungerStatus = getHungerStatusText(this.gameState, this.timeScale);
    const hungerColor = getHungerColor(hungerPct);

    // Update progress bar
    const barWidth = this.cameras.main.width - 50;
    this.progressBarFill.clear();
    this.progressBarFill.fillStyle(0x4caf50, 1);
    this.progressBarFill.fillRoundedRect(25, 40, Math.max(0, barWidth * (progress / 100)), 20, 8);

    this.progressText.setText(`${this.animalData.emoji} Growth: ${Math.floor(progress)}%`);
    this.remainingText.setText(remaining);

    // Update hunger bar
    const hungerBarWidth = this.cameras.main.width - 50;
    this.hungerBarFill.clear();
    this.hungerBarFill.fillStyle(hungerColor, 1);
    this.hungerBarFill.fillRoundedRect(25, 106, Math.max(0, hungerBarWidth * (hungerPct / 100)), 14, 6);

    this.hungerStatusText.setText(hungerStatus);

    // Update animal sprite based on hunger
    const spriteKey = hungerPct < 30 ? `${this.animalData.key}-hungry` : `${this.animalData.key}-happy`;
    if (this.animalSprite.texture.key !== spriteKey) {
      this.animalSprite.setTexture(spriteKey);
    }

    // Update orders text
    this.ordersText.setText(`Orders placed: ${this.gameState.ordersPlaced || 0}`);

    // Check if animal left
    if (hasAnimalLeft(this.gameState, this.timeScale)) {
      this.handleAnimalLeft();
      return;
    }

    // Check if ready to harvest
    if (isReadyToHarvest(this.gameState, this.timeScale)) {
      this.handleReadyToHarvest();
    }
  }

  handleAnimalLeft() {
    clearGameState();

    const { width, height } = this.cameras.main;
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, width, height);
    overlay.setDepth(100);

    const msg = this.add.text(width / 2, height / 2 - 40, 'Your animal ran away!\nYou forgot to feed it.', {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#ff5252',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(101);

    const restartBtn = this.add.text(width / 2, height / 2 + 40, '[ Try Again ]', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      backgroundColor: '#4caf50',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setDepth(101).setInteractive({ useHandCursor: true });

    restartBtn.on('pointerdown', () => {
      this.scene.start('SelectScene');
    });

    // Stop update loop
    this.gameState = null;
  }

  handleReadyToHarvest() {
    this.gameState.status = 'READY_TO_HARVEST';
    saveGameState(this.gameState);

    // Stop update loop
    const state = { ...this.gameState };
    this.gameState = null;

    this.cameras.main.fadeOut(500, 255, 255, 255);
    this.time.delayedCall(500, () => {
      this.scene.start('HarvestScene', { gameState: state });
    });
  }
}
