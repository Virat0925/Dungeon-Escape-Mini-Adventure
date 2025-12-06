import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private health: number = 30;
  private speed: number = 80;
  private chaseRange: number = 200;
  private patrolPoints: Phaser.Math.Vector2[] = [];
  private currentPatrolIndex: number = 0;
  private player?: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, patrolPoints?: Phaser.Math.Vector2[]) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(5);

    if (patrolPoints && patrolPoints.length > 0) {
      this.patrolPoints = patrolPoints;
    } else {
      this.patrolPoints = [
        new Phaser.Math.Vector2(x, y),
        new Phaser.Math.Vector2(x + 100, y),
        new Phaser.Math.Vector2(x + 100, y + 100),
        new Phaser.Math.Vector2(x, y + 100)
      ];
    }
  }

  setPlayer(player: Phaser.Physics.Arcade.Sprite): void {
    this.player = player;
  }

  update(): void {
    if (!this.active) return;

    if (this.player) {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);

      if (distance < this.chaseRange) {
        this.chasePlayer();
      } else {
        this.patrol();
      }
    } else {
      this.patrol();
    }

    if (this.body?.velocity.x !== 0 || this.body?.velocity.y !== 0) {
      this.setTint(0xffaaaa);
    } else {
      this.clearTint();
    }
  }

  patrol(): void {
    const targetPoint = this.patrolPoints[this.currentPatrolIndex];
    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPoint.x, targetPoint.y);

    if (distance < 10) {
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    } else {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetPoint.x, targetPoint.y);
      this.setVelocity(Math.cos(angle) * this.speed * 0.5, Math.sin(angle) * this.speed * 0.5);
    }
  }

  chasePlayer(): void {
    if (!this.player) return;

    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
    this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    this.setTint(0xff0000);
    this.setVelocity(0, 0); // stop movement briefly

    this.scene.time.delayedCall(120, () => {
      this.clearTint();
    });

    if (this.health <= 0) {
      this.die();
    }
  }


  die(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
