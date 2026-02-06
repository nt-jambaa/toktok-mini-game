// ============================================================
// LeaderboardScene.js — Mock leaderboard display
// ============================================================

import Phaser from 'phaser';
import { MOCK_LEADERBOARD } from '../systems/MockData.js';
import { loadFarmXP } from '../systems/GrowthTimer.js';

export class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.image(width / 2, height / 2, 'background');

    // Dark overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.6);
    overlay.fillRect(0, 0, width, height);

    // Title
    this.add.text(width / 2, 35, '🏆 Master Farmer Leaderboard', {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, 65, 'Top farmers earn Golden Harvest rewards!', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#cccccc',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Leaderboard entries
    const startY = 100;
    const rowHeight = 50;
    const playerXP = loadFarmXP();
    let playerInserted = false;

    MOCK_LEADERBOARD.forEach((entry, index) => {
      const y = startY + index * rowHeight;
      this.createLeaderboardRow(width, y, entry, false, index);
    });

    // Player's own rank
    const playerRank = this.getPlayerRank(playerXP);
    const playerY = startY + MOCK_LEADERBOARD.length * rowHeight + 20;

    // Divider
    const divider = this.add.graphics();
    divider.lineStyle(2, 0xffd700, 0.5);
    divider.lineBetween(30, playerY - 10, width - 30, playerY - 10);

    this.add.text(width / 2, playerY - 20, '— Your Rank —', {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffd700',
    }).setOrigin(0.5);

    this.createLeaderboardRow(width, playerY + 5, {
      rank: playerRank,
      name: 'You',
      xp: playerXP,
      badge: '⭐',
    }, true, playerRank - 1);

    // Prize info
    this.add.text(width / 2, playerY + 65, '🎁 Top 10 monthly: Golden Harvest 100k+ MNT', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffcc80',
      align: 'center',
    }).setOrigin(0.5);

    // Back button
    const btnY = height - 60;
    const btn = this.add.image(width / 2, btnY, 'btn-back').setInteractive({ useHandCursor: true });
    const btnText = this.add.text(width / 2, btnY - 2, '← Back to Farm', {
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
      this.scene.start('GameScene');
    });

    // Fade in
    this.cameras.main.fadeIn(200);
  }

  createLeaderboardRow(width, y, entry, isPlayer, index) {
    const rowW = width - 40;
    const rowX = 20;

    // Row background
    const bg = this.add.graphics();
    if (isPlayer) {
      bg.fillStyle(0xffd700, 0.2);
    } else if (index < 3) {
      bg.fillStyle(0xffffff, 0.12);
    } else {
      bg.fillStyle(0xffffff, 0.06);
    }
    bg.fillRoundedRect(rowX, y, rowW, 42, 8);

    if (isPlayer) {
      bg.lineStyle(2, 0xffd700, 0.5);
      bg.strokeRoundedRect(rowX, y, rowW, 42, 8);
    }

    // Rank
    const rankColor = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#ffffff';
    this.add.text(rowX + 18, y + 21, `#${entry.rank}`, {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: rankColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Badge
    if (entry.badge) {
      this.add.text(rowX + 45, y + 21, entry.badge, {
        fontSize: '18px',
      }).setOrigin(0.5);
    }

    // Name
    this.add.text(rowX + 70, y + 21, entry.name, {
      fontSize: '15px',
      fontFamily: 'Arial, sans-serif',
      color: isPlayer ? '#ffd700' : '#ffffff',
      fontStyle: isPlayer ? 'bold' : 'normal',
    }).setOrigin(0, 0.5);

    // XP
    this.add.text(rowX + rowW - 15, y + 21, `${entry.xp.toLocaleString()} XP`, {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#4caf50',
      fontStyle: 'bold',
    }).setOrigin(1, 0.5);

    // Entry animation
    bg.setAlpha(0);
    this.tweens.add({
      targets: bg,
      alpha: 1,
      duration: 300,
      delay: index * 50,
    });
  }

  getPlayerRank(playerXP) {
    let rank = 1;
    for (const entry of MOCK_LEADERBOARD) {
      if (playerXP < entry.xp) rank++;
    }
    return rank;
  }
}
