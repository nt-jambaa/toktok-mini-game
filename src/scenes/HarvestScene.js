// ============================================================
// HarvestScene.js — Reward/coupon reveal with celebration
// ============================================================

import Phaser from 'phaser';
import { getAnimal } from '../systems/MockData.js';
import { clearGameState, addFarmXP } from '../systems/GrowthTimer.js';

export class HarvestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HarvestScene' });
  }

  init(data) {
    this.gameState = data.gameState;
  }

  create() {
    const { width, height } = this.cameras.main;
    const animal = getAnimal(this.gameState.animalType);

    // Background
    this.add.image(width / 2, height / 2, 'background');

    // Dark overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.5);
    overlay.fillRect(0, 0, width, height);

    // Add farm XP
    const xpEarned = animal.durationDays * 100;
    const totalXP = addFarmXP(xpEarned);

    // ---- Confetti particles ----
    this.createConfetti(width, height);

    // ---- "Harvest Complete" title ----
    const title = this.add.text(width / 2, 80, 'HARVEST\nCOMPLETE!', {
      fontSize: '42px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffd700',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5).setScale(0);

    this.tweens.add({
      targets: title,
      scale: 1,
      duration: 600,
      ease: 'Back.easeOut',
    });

    // ---- Animal sprite ----
    const animalSprite = this.add.image(width / 2, 220, `${animal.key}-happy`);
    animalSprite.setScale(2);

    this.tweens.add({
      targets: animalSprite,
      angle: { from: -5, to: 5 },
      duration: 300,
      yoyo: true,
      repeat: -1,
    });

    // ---- Reward Card ----
    this.time.delayedCall(600, () => {
      this.showRewardCard(width, height, animal, xpEarned, totalXP);
    });

    // Camera fade in
    this.cameras.main.fadeIn(300, 255, 255, 255);
  }

  showRewardCard(width, height, animal, xpEarned, totalXP) {
    const cardW = 380;
    const cardH = 280;
    const cardX = width / 2 - cardW / 2;
    const cardY = 290;

    // Card background
    const card = this.add.graphics();
    card.fillStyle(0xffffff, 0.95);
    card.fillRoundedRect(cardX, cardY, cardW, cardH, 16);
    card.lineStyle(3, 0xffd700, 1);
    card.strokeRoundedRect(cardX, cardY, cardW, cardH, 16);

    // "Your Reward" label
    this.add.text(width / 2, cardY + 25, 'Your Reward', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#999999',
    }).setOrigin(0.5);

    // Coupon amount
    const amountText = this.add.text(width / 2, cardY + 65, animal.rewardAmount, {
      fontSize: '40px',
      fontFamily: 'Arial, sans-serif',
      color: '#4caf50',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: amountText,
      scale: { from: 0.5, to: 1 },
      duration: 400,
      ease: 'Back.easeOut',
    });

    // Category
    this.add.text(width / 2, cardY + 105, `Category: ${animal.rewardCategory}`, {
      fontSize: '15px',
      fontFamily: 'Arial, sans-serif',
      color: '#666666',
    }).setOrigin(0.5);

    // Divider
    const divider = this.add.graphics();
    divider.lineStyle(1, 0xdddddd, 1);
    divider.lineBetween(cardX + 30, cardY + 130, cardX + cardW - 30, cardY + 130);

    // XP earned
    this.add.text(width / 2, cardY + 155, `+${xpEarned} Farm XP earned!`, {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ff9800',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, cardY + 180, `Total XP: ${totalXP}`, {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      color: '#999999',
    }).setOrigin(0.5);

    // Coupon code (mock)
    const codeText = this.add.text(width / 2, cardY + 220, 'TOKTOK-FARM-' + Math.random().toString(36).substring(2, 8).toUpperCase(), {
      fontSize: '18px',
      fontFamily: 'Courier New, monospace',
      color: '#333333',
      fontStyle: 'bold',
      backgroundColor: '#f5f5f5',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5);

    // ---- Play Again Button ----
    const btnY = cardY + cardH + 40;
    const btn = this.add.image(width / 2, btnY, 'btn-play-again').setInteractive({ useHandCursor: true });
    const btnText = this.add.text(width / 2, btnY - 2, '🔄 Play Again', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    btn.on('pointerover', () => btn.setScale(1.05));
    btn.on('pointerout', () => btn.setScale(1));
    btn.on('pointerdown', () => {
      clearGameState();
      this.scene.start('SelectScene');
    });
  }

  createConfetti(width, height) {
    const colors = [0xff5252, 0xffeb3b, 0x4caf50, 0x2196f3, 0xff9800, 0x9c27b0];

    // Create multiple confetti bursts
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(-200, -20);
      const color = Phaser.Utils.Array.GetRandom(colors);

      const particle = this.add.rectangle(x, y, 8, 8, color);
      particle.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));

      this.tweens.add({
        targets: particle,
        y: height + 50,
        x: x + Phaser.Math.Between(-100, 100),
        rotation: Phaser.Math.FloatBetween(Math.PI * 2, Math.PI * 8),
        duration: Phaser.Math.Between(2000, 4000),
        delay: Phaser.Math.Between(0, 1000),
        ease: 'Quad.easeIn',
        onComplete: () => particle.destroy(),
      });
    }
  }
}
