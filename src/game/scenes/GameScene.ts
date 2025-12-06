import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Collectible } from '../entities/Collectible';
import { GameStateManager } from '../GameStateManager';
import { EffectsManager } from '../utils/EffectsManager';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.GameObjects.Group;
  private collectibles!: Phaser.GameObjects.Group;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private exit!: Phaser.Physics.Arcade.Sprite;
  private gameState!: GameStateManager;
  private effects!: EffectsManager;
  private hud!: {
    healthText: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
    healthBar: Phaser.GameObjects.Graphics;
    keyIcon?: Phaser.GameObjects.Sprite;
  };
  private isPaused: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.gameState = GameStateManager.getInstance();
    this.effects = new EffectsManager(this);

    this.createLevel();
    this.createPlayer();
    this.createEnemies();
    this.createCollectibles();
    this.createExit();
    this.setupCollisions();
    this.createHUD();
    this.setupPause();
  }

  createLevel(): void {
    this.cameras.main.setBackgroundColor('#0f0f1e');

    this.walls = this.physics.add.staticGroup();

    for (let i = 0; i < 25; i++) {
      this.walls.create(i * 32, 0, 'wall');
      this.walls.create(i * 32, 576, 'wall');
    }

    for (let i = 1; i < 18; i++) {
      this.walls.create(0, i * 32, 'wall');
      this.walls.create(768, i * 32, 'wall');
    }

    const obstacles = [
      { x: 200, y: 200 }, { x: 232, y: 200 }, { x: 264, y: 200 },
      { x: 600, y: 150 }, { x: 600, y: 182 }, { x: 600, y: 214 },
      { x: 300, y: 400 }, { x: 332, y: 400 }, { x: 364, y: 400 },
      { x: 500, y: 350 }, { x: 532, y: 350 },
      { x: 150, y: 450 }, { x: 182, y: 450 },
      { x: 650, y: 400 }, { x: 650, y: 432 }
    ];

    obstacles.forEach(pos => {
      this.walls.create(pos.x, pos.y, 'wall');
    });
  }

  createPlayer(): void {
    this.player = new Player(this, 100, 100);
  }

  createEnemies(): void {
    this.enemies = this.physics.add.group({
    classType: Enemy,
    runChildUpdate: true,
    immovable: false,
    allowGravity: false
  });


    const enemy1 = new Enemy(this, 400, 200, [
      new Phaser.Math.Vector2(400, 200),
      new Phaser.Math.Vector2(500, 200),
      new Phaser.Math.Vector2(500, 300),
      new Phaser.Math.Vector2(400, 300)
    ]);
    enemy1.setPlayer(this.player);
    this.enemies.add(enemy1);

    const enemy2 = new Enemy(this, 600, 450, [
      new Phaser.Math.Vector2(600, 450),
      new Phaser.Math.Vector2(700, 450)
    ]);
    enemy2.setPlayer(this.player);
    this.enemies.add(enemy2);

    const enemy3 = new Enemy(this, 300, 500, [
      new Phaser.Math.Vector2(300, 500),
      new Phaser.Math.Vector2(400, 500),
      new Phaser.Math.Vector2(400, 550),
      new Phaser.Math.Vector2(300, 550)
    ]);
    enemy3.setPlayer(this.player);
    this.enemies.add(enemy3);
  }

  createCollectibles(): void {
    this.collectibles = this.add.group();

    const coins = [
      { x: 250, y: 100 }, { x: 450, y: 100 }, { x: 650, y: 100 },
      { x: 100, y: 300 }, { x: 700, y: 300 },
      { x: 400, y: 500 }
    ];

    coins.forEach(pos => {
      const coin = new Collectible(this, pos.x, pos.y, 'coin');
      this.collectibles.add(coin);
    });

    const health1 = new Collectible(this, 550, 250, 'health');
    this.collectibles.add(health1);

    const health2 = new Collectible(this, 150, 500, 'health');
    this.collectibles.add(health2);

    const powerup = new Collectible(this, 700, 500, 'powerup');
    this.collectibles.add(powerup);

    const key = new Collectible(this, 700, 200, 'key');
    this.collectibles.add(key);
  }

  createExit(): void {
    this.exit = this.physics.add.sprite(750, 550, 'exit');
    this.exit.setImmovable(true);
    this.exit.setDepth(0);

    this.tweens.add({
      targets: this.exit,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  setupCollisions(): void {
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemies, this.walls);

    this.physics.add.overlap(
      this.player,
      this.collectibles,
      this.collectItem as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player.projectiles,
      this.enemies,
      this.projectileHitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.exit,
      this.reachExit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  collectItem(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody, collectible: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
    const item = collectible as Collectible;

    switch (item.collectibleType) {
      case 'coin':
        this.gameState.addScore(item.value);
        this.effects.showFloatingText(item.x, item.y, `+${item.value}`, '#ffd700');
        this.effects.createCollectEffect(item.x, item.y, 0xffd700);
        break;
      case 'health':
        this.gameState.updateHealth(item.value);
        this.effects.showFloatingText(item.x, item.y, `+${item.value} HP`, '#00ff00');
        this.effects.createCollectEffect(item.x, item.y, 0x00ff00);
        break;
      case 'powerup':
        this.gameState.addScore(item.value);
        this.activateSpeedBoost();
        this.effects.showFloatingText(item.x, item.y, 'SPEED BOOST!', '#ff00ff');
        this.effects.createCollectEffect(item.x, item.y, 0xff00ff);
        break;
      case 'key':
        this.gameState.collectKey();
        this.gameState.addScore(item.value);
        this.showKeyCollected();
        this.effects.showFloatingText(item.x, item.y, 'KEY!', '#ffff00');
        this.effects.createCollectEffect(item.x, item.y, 0xffff00);
        break;
    }

    item.collect();
    this.updateHUD();
  }

  activateSpeedBoost(): void {
    this.gameState.activatePowerUp('speed');
    this.player.setSpeed(240);

    this.time.delayedCall(5000, () => {
      this.gameState.deactivatePowerUp('speed');
      this.player.setSpeed(160);
    });
  }

  hitEnemy(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody, _enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
    if (!this.player.getIsInvincible()) {
      this.gameState.updateHealth(-10);
      this.player.takeDamage();
      this.effects.showFloatingText(this.player.x, this.player.y - 20, '-10', '#ff0000');
      this.effects.screenShake(10, 200);
      this.effects.createHitEffect(this.player.x, this.player.y, 0xff0000);
      this.updateHUD();

      if (this.gameState.getState().health <= 0) {
        this.scene.start('GameOverScene');
      }
    }
  }

projectileHitEnemy(
  projectile: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
): void {

  if (!(enemy instanceof Enemy)) return; // prevents freeze

  enemy.takeDamage(15);

  const proj = projectile as Phaser.Physics.Arcade.Sprite;
  proj.setActive(false).setVisible(false).setVelocity(0, 0);

  this.effects.showFloatingText(enemy.x, enemy.y - 20, '-15', '#ff6666');
  this.effects.createHitEffect(enemy.x, enemy.y, 0xff0000);

  this.gameState.addScore(5);
  this.updateHUD();
}


  reachExit(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody, _exit: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
    if (this.gameState.getState().hasKey) {
      this.scene.start('VictoryScene');
    } else {
      this.showMessage('Find the key first!');
    }
  }

  createHUD(): void {
    this.hud = {
      healthText: this.add.text(16, 16, '', { fontSize: '18px', color: '#fff' }).setScrollFactor(0).setDepth(100),
      scoreText: this.add.text(16, 46, '', { fontSize: '18px', color: '#fff' }).setScrollFactor(0).setDepth(100),
      healthBar: this.add.graphics().setScrollFactor(0).setDepth(100)
    };

    this.updateHUD();
  }

  updateHUD(): void {
    const state = this.gameState.getState();

    this.hud.healthText.setText(`Health: ${state.health}/${state.maxHealth}`);
    this.hud.scoreText.setText(`Score: ${state.score}`);

    this.hud.healthBar.clear();
    this.hud.healthBar.fillStyle(0x000000, 0.5);
    this.hud.healthBar.fillRect(14, 70, 204, 24);

    const healthPercent = state.health / state.maxHealth;
    const barColor = healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000;

    this.hud.healthBar.fillStyle(barColor, 1);
    this.hud.healthBar.fillRect(16, 72, 200 * healthPercent, 20);
  }

  showKeyCollected(): void {
    if (!this.hud.keyIcon) {
      this.hud.keyIcon = this.add.sprite(16, 110, 'key').setScrollFactor(0).setDepth(100).setOrigin(0, 0);
      this.add.text(50, 110, 'Key Collected!', { fontSize: '16px', color: '#ffd700' }).setScrollFactor(0).setDepth(100);
    }
  }

  showMessage(text: string): void {
    const message = this.add.text(400, 300, text, {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    this.time.delayedCall(2000, () => {
      message.destroy();
    });
  }

  setupPause(): void {
    const escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    escKey.on('down', () => {
      this.isPaused = !this.isPaused;

      if (this.isPaused) {
        this.scene.pause();
        this.showPauseMenu();
      } else {
        this.scene.resume();
      }
    });
  }

  showPauseMenu(): void {
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setScrollFactor(0).setDepth(300);
    const text = this.add.text(400, 300, 'PAUSED\nPress ESC to Resume', {
      fontSize: '32px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(301);

    const resumeHandler = () => {
      overlay.destroy();
      text.destroy();
      this.scene.resume();
      this.isPaused = false;
    };

    const resumeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    resumeKey.once('down', resumeHandler);
  }

  update(): void {
    if (!this.isPaused) {
      this.player.update();
    }
  }
}
