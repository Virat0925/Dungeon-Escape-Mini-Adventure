import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { [key: string]: Phaser.Input.Keyboard.Key };
  private attackKey!: Phaser.Input.Keyboard.Key;
  private speed: number = 160;
  private canAttack: boolean = true;
  private isInvincible: boolean = false;
  public projectiles!: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(10);

    this.setupControls();
    this.setupProjectiles();
  }

  setupControls(): void {
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    this.attackKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  setupProjectiles(): void {
    this.projectiles = this.scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 10,
      runChildUpdate: true
    });
  }

  update(): void {
    this.handleMovement();
    this.handleAttack();
  }

  handleMovement(): void {
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -this.speed;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = this.speed;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocityY = -this.speed;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocityY = this.speed;
    }

    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    this.setVelocity(velocityX, velocityY);

    if (velocityX !== 0 || velocityY !== 0) {
      this.setTint(0xaaaaff);
    } else {
      this.clearTint();
    }
  }

  handleAttack(): void {
    if (Phaser.Input.Keyboard.JustDown(this.attackKey) && this.canAttack) {
      this.attack();
      this.canAttack = false;
      this.scene.time.delayedCall(500, () => {
        this.canAttack = true;
      });
    }
  }

  attack(): void {
    const projectile = this.projectiles.get(this.x, this.y, 'projectile') as Phaser.Physics.Arcade.Sprite;

    if (projectile) {
      projectile.setActive(true);
      projectile.setVisible(true);
      projectile.setScale(0.5);
      projectile.setDepth(5);

      const angle = this.getAttackDirection();
      const velocity = 400;

      projectile.setVelocity(
        Math.cos(angle) * velocity,
        Math.sin(angle) * velocity
      );

      this.scene.time.delayedCall(1000, () => {
        if (projectile.active) {
          projectile.setActive(false);
          projectile.setVisible(false);
          projectile.setVelocity(0, 0);
        }
      });
    }
  }

  getAttackDirection(): number {
    const velocityX = this.body?.velocity.x || 0;
    const velocityY = this.body?.velocity.y || 0;

    if (velocityX !== 0 || velocityY !== 0) {
      return Math.atan2(velocityY, velocityX);
    }

    return 0;
  }

  takeDamage(): void {
    if (!this.isInvincible) {
      this.setTint(0xff0000);
      this.scene.time.delayedCall(200, () => {
        this.clearTint();
      });
    }
  }

  setSpeed(speed: number): void {
    this.speed = speed;
  }

  setInvincible(invincible: boolean): void {
    this.isInvincible = invincible;
    if (invincible) {
      this.setTint(0xffff00);
    } else {
      this.clearTint();
    }
  }

  getIsInvincible(): boolean {
    return this.isInvincible;
  }
}
