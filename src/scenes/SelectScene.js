// ============================================================
// SelectScene.js — Animal selection screen
// ============================================================

import Phaser from 'phaser';
import { getAnimalList } from '../systems/MockData.js';
import { createNewGameState, loadGameState } from '../systems/GrowthTimer.js';

export class SelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SelectScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Check for existing active game
    const existingState = loadGameState();
    if (existingState && existingState.status === 'ACTIVE') {
      this.scene.start('GameScene');
      return;
    }

    // Background
    this.add.image(width / 2, height / 2, 'background');

    // Semi-transparent overlay for readability
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.3);
    overlay.fillRect(0, 0, width, height);

    // Title
    this.add.text(width / 2, 40, 'TokTok Farm', {
      fontSize: '36px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, 80, 'Choose your animal to raise!', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffcc',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // Animal cards
    const animals = getAnimalList();
    const cardWidth = 200;
    const cardHeight = 110;
    const startY = 120;
    const gap = 12;

    animals.forEach((animal, index) => {
      const cardY = startY + index * (cardHeight + gap);
      this.createAnimalCard(width / 2, cardY, cardWidth, cardHeight, animal, index);
    });

    // Footer
    this.add.text(width / 2, height - 25, 'Raise it. Feed it. Earn rewards!', {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      color: '#cccccc',
      fontStyle: 'italic',
    }).setOrigin(0.5);
  }

  createAnimalCard(x, y, w, h, animal, index) {
    const card = this.add.container(x, y);

    // Card background
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 0.9);
    bg.fillRoundedRect(-w / 2, 0, w, h, 12);
    bg.lineStyle(2, animal.color, 1);
    bg.strokeRoundedRect(-w / 2, 0, w, h, 12);
    card.add(bg);

    // Animal sprite
    const sprite = this.add.image(-w / 2 + 45, h / 2, `${animal.key}-happy`).setScale(0.65);
    card.add(sprite);

    // Animal name + emoji
    const nameText = this.add.text(-w / 2 + 85, 10, `${animal.emoji} ${animal.name}`, {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#333333',
      fontStyle: 'bold',
    });
    card.add(nameText);

    // Duration
    const durationText = this.add.text(-w / 2 + 85, 34, `${animal.durationDays} days to grow`, {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      color: '#666666',
    });
    card.add(durationText);

    // Reward
    const rewardText = this.add.text(-w / 2 + 85, 54, `Reward: ${animal.rewardCategory}`, {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: '#888888',
    });
    card.add(rewardText);

    // Coupon amount
    const couponText = this.add.text(-w / 2 + 85, 74, `Coupon: ${animal.rewardAmount}`, {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#4caf50',
      fontStyle: 'bold',
    });
    card.add(couponText);

    // Make interactive
    const hitArea = this.add.zone(0, h / 2, w, h).setInteractive({ useHandCursor: true });
    card.add(hitArea);

    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0xfff9c4, 0.95);
      bg.fillRoundedRect(-w / 2, 0, w, h, 12);
      bg.lineStyle(3, animal.color, 1);
      bg.strokeRoundedRect(-w / 2, 0, w, h, 12);
      card.setScale(1.03);
    });

    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0xffffff, 0.9);
      bg.fillRoundedRect(-w / 2, 0, w, h, 12);
      bg.lineStyle(2, animal.color, 1);
      bg.strokeRoundedRect(-w / 2, 0, w, h, 12);
      card.setScale(1);
    });

    hitArea.on('pointerdown', () => {
      // Create new game
      createNewGameState(animal.key);
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.start('GameScene');
      });
    });

    // Entry animation
    card.setAlpha(0);
    card.x = x + 100;
    this.tweens.add({
      targets: card,
      alpha: 1,
      x: x,
      duration: 400,
      delay: 100 * index,
      ease: 'Back.easeOut',
    });

    return card;
  }
}
