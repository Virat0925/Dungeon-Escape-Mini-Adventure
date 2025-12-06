import Phaser from 'phaser';
import { GameStateManager } from '../GameStateManager';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const gameState = GameStateManager.getInstance();
    const finalScore = gameState.getState().score;

    this.cameras.main.setBackgroundColor('#1a1a2e');

    this.add.text(width / 2, height / 4, 'VICTORY!', {
      fontSize: '72px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 4 + 80, 'You Escaped the Dungeon!', {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, `Final Score: ${finalScore}`, {
      fontSize: '32px',
      color: '#ffd700'
    }).setOrigin(0.5);

    const playAgainButton = this.add.text(width / 2, height / 2 + 80, 'PLAY AGAIN', {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#2ecc71',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive();

    const menuButton = this.add.text(width / 2, height / 2 + 150, 'MAIN MENU', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#3498db',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    playAgainButton.on('pointerover', () => {
      playAgainButton.setScale(1.1);
    });

    playAgainButton.on('pointerout', () => {
      playAgainButton.setScale(1);
    });

    playAgainButton.on('pointerdown', () => {
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
      targets: playAgainButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    this.add.particles(width / 2, height / 4, 'coin', {
      speed: { min: 50, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 2000,
      frequency: 80,
      gravityY: 100
    });

    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      const star = this.add.sprite(x, y, 'powerup').setScale(0.3).setAlpha(0);

      this.tweens.add({
        targets: star,
        alpha: 1,
        scale: 0.5,
        duration: 1000,
        delay: i * 100,
        yoyo: true,
        repeat: -1
      });
    }
  }
}
