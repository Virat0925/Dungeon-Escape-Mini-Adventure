import Phaser from 'phaser';
import { GameStateManager } from '../GameStateManager';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.text(width / 2, height / 4, 'DUNGEON ESCAPE', {
      fontSize: '48px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 4 + 60, 'Mini Adventure', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const startButton = this.add.text(width / 2, height / 2, 'START GAME', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#2ecc71',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    const instructionsButton = this.add.text(width / 2, height / 2 + 80, 'INSTRUCTIONS', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#3498db',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    startButton.on('pointerover', () => {
      startButton.setScale(1.1);
    });

    startButton.on('pointerout', () => {
      startButton.setScale(1);
    });

    startButton.on('pointerdown', () => {
    const gameState = GameStateManager.getInstance();
    gameState.reset();                 // ✅ fresh game
    this.scene.start('GameScene');
   });

    instructionsButton.on('pointerover', () => {
      instructionsButton.setScale(1.1);
    });

    instructionsButton.on('pointerout', () => {
      instructionsButton.setScale(1);
    });

    instructionsButton.on('pointerdown', () => {
      this.showInstructions();
    });

    this.add.text(width / 2, height - 50, 'Use WASD to move | SPACE to attack', {
      fontSize: '16px',
      color: '#888888'
    }).setOrigin(0.5);
  }

  showInstructions(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

    const instructions = [
      'OBJECTIVE:',
      '- Collect the golden key',
      '- Defeat or avoid enemies',
      '- Reach the exit to win',
      '',
      'CONTROLS:',
      'WASD - Move',
      'SPACE - Attack',
      'ESC - Pause',
      '',
      'ITEMS:',
      'Gold Coins - Points',
      'Health Potion - Restore HP',
      'Purple Orb - Speed Boost'
    ];

    const textY = height / 4;
    instructions.forEach((line, index) => {
      this.add.text(width / 2, textY + index * 25, line, {
        fontSize: '16px',
        color: '#ffffff'
      }).setOrigin(0.5);
    });

    const closeButton = this.add.text(width / 2, height - 80, 'CLOSE', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#e74c3c',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    closeButton.on('pointerdown', () => {
      bg.destroy();
      closeButton.destroy();
      instructions.forEach(() => {
        this.children.list.forEach(child => {
          if (child instanceof Phaser.GameObjects.Text && child !== closeButton) {
            child.destroy();
          }
        });
      });
      this.scene.restart();
    });
  }
}
