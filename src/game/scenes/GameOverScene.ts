import Phaser from 'phaser';
import { GameStateManager } from '../GameStateManager';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const gameState = GameStateManager.getInstance();
    const finalScore = gameState.getState().score;

    this.cameras.main.setBackgroundColor('#1a1a2e');

    this.add.text(width / 2, height / 3, 'GAME OVER', {
      fontSize: '64px',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, `Final Score: ${finalScore}`, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const retryButton = this.add.text(width / 2, height / 2 + 80, 'RETRY', {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#e74c3c',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive();

    const menuButton = this.add.text(width / 2, height / 2 + 150, 'MAIN MENU', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#3498db',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    retryButton.on('pointerover', () => {
      retryButton.setScale(1.1);
    });

    retryButton.on('pointerout', () => {
      retryButton.setScale(1);
    });

    retryButton.on('pointerdown', () => {
      gameState.reset();
      this.scene.start('GameScene');
    });

    menuButton.on('pointerover', () => {
      menuButton.setScale(1.1);
    });

    menuButton.on('pointerout', () => {
      menuButton.setScale(1);
    });

    menuButton.on('pointerdown', () => {
      gameState.reset();
      this.scene.start('MainMenuScene');
    });

    this.tweens.add({
      targets: retryButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    this.add.particles(width / 2, height / 3, 'enemy', {
      speed: { min: -100, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 2000,
      frequency: 100
    });
  }
}
