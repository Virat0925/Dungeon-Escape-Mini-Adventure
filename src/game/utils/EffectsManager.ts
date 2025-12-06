import Phaser from 'phaser';

export class EffectsManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  showFloatingText(x: number, y: number, text: string, color: string = '#ffffff'): void {
    const floatingText = this.scene.add.text(x, y, text, {
      fontSize: '20px',
      color: color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(100);

    this.scene.tweens.add({
      targets: floatingText,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        floatingText.destroy();
      }
    });
  }

  screenShake(intensity: number = 5, duration: number = 200): void {
    this.scene.cameras.main.shake(duration, intensity / 1000);
  }

  createHitEffect(x: number, y: number, color: number = 0xff0000): void {
    const circle = this.scene.add.circle(x, y, 20, color, 0.8);
    circle.setDepth(50);

    this.scene.tweens.add({
      targets: circle,
      scale: 2,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        circle.destroy();
      }
    });
  }

  createExplosion(x: number, y: number, particleTexture: string = 'enemy'): void {
    const particles = this.scene.add.particles(x, y, particleTexture, {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 600,
      quantity: 10
    });

    this.scene.time.delayedCall(1000, () => {
      particles.destroy();
    });
  }

  createCollectEffect(x: number, y: number, color: number = 0xffd700): void {
    const star = this.scene.add.star(x, y, 5, 10, 20, color);
    star.setDepth(50);

    this.scene.tweens.add({
      targets: star,
      scale: 2,
      rotation: Math.PI * 2,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => {
        star.destroy();
      }
    });
  }

  flashSprite(sprite: Phaser.GameObjects.Sprite, color: number = 0xffffff, duration: number = 100): void {
    sprite.setTint(color);
    this.scene.time.delayedCall(duration, () => {
      sprite.clearTint();
    });
  }

  createTrailEffect(sprite: Phaser.Physics.Arcade.Sprite): void {
    const trail = this.scene.add.sprite(sprite.x, sprite.y, sprite.texture.key);
    trail.setAlpha(0.3);
    trail.setDepth(sprite.depth - 1);
    trail.setScale(sprite.scale);

    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      scale: trail.scale * 0.8,
      duration: 200,
      onComplete: () => {
        trail.destroy();
      }
    });
  }
}
