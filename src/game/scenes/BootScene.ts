import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        color: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: {
        font: '18px monospace',
        color: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      percentText.setText(parseInt(String(value * 100)) + '%');
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    this.loadAssets();
  }

  loadAssets(): void {
    this.createPlaceholderTextures();
  }

  createPlaceholderTextures(): void {
    const graphics = this.add.graphics();

    graphics.fillStyle(0x4a90e2, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('player', 32, 32);

    graphics.clear();
    graphics.fillStyle(0xe74c3c, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('enemy', 32, 32);

    graphics.clear();
    graphics.fillStyle(0xf39c12, 1);
    graphics.beginPath();
    graphics.arc(16, 16, 12, 0, Math.PI * 2);
    graphics.fillPath();
    graphics.generateTexture('coin', 32, 32);

    graphics.clear();
    graphics.fillStyle(0xe91e63, 1);
    graphics.fillRect(8, 0, 16, 32);
    graphics.fillRect(0, 8, 32, 16);
    graphics.generateTexture('health', 32, 32);

    graphics.clear();
    graphics.fillStyle(0x9b59b6, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('powerup', 32, 32);

    graphics.clear();
    graphics.fillStyle(0x34495e, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('wall', 32, 32);

    graphics.clear();
    graphics.fillStyle(0x2ecc71, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('exit', 32, 32);

    graphics.clear();
    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(10, 5, 12, 20);
    graphics.fillCircle(16, 8, 5);
    graphics.generateTexture('key', 32, 32);

    graphics.clear();
    graphics.fillStyle(0xff6b6b, 1);
    graphics.fillRect(4, 10, 24, 12);
    graphics.fillRect(12, 4, 8, 24);
    graphics.generateTexture('projectile', 32, 32);

    graphics.destroy();
  }

  create(): void {
    this.scene.start('MainMenuScene');
  }
}
