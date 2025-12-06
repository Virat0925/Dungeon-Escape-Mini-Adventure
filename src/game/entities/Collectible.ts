import Phaser from 'phaser';

export type CollectibleType = 'coin' | 'health' | 'powerup' | 'key';

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  public collectibleType: CollectibleType;
  public value: number;

  constructor(scene: Phaser.Scene, x: number, y: number, type: CollectibleType) {
    const textureMap = {
      coin: 'coin',
      health: 'health',
      powerup: 'powerup',
      key: 'key'
    };

    super(scene, x, y, textureMap[type]);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.collectibleType = type;
    this.value = this.getValueForType(type);
    this.setDepth(1);

    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.scene.tweens.add({
      targets: this,
      y: this.y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.scene.tweens.add({
      targets: this,
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  getValueForType(type: CollectibleType): number {
    switch (type) {
      case 'coin':
        return 10;
      case 'health':
        return 25;
      case 'powerup':
        return 50;
      case 'key':
        return 100;
      default:
        return 0;
    }
  }

  collect(): void {
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
