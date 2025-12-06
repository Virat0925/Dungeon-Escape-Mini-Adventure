export interface GameState {
  health: number;
  maxHealth: number;
  score: number;
  level: number;
  hasKey: boolean;
  inventory: string[];
  powerUps: {
    speed: boolean;
    invincible: boolean;
    doubleScore: boolean;
  };
}

export class GameStateManager {
  private static instance: GameStateManager;
  private state: GameState;

  private constructor() {
    this.state = this.getInitialState();
  }

  static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  getInitialState(): GameState {
    return {
      health: 100,
      maxHealth: 100,
      score: 0,
      level: 1,
      hasKey: false,
      inventory: [],
      powerUps: {
        speed: false,
        invincible: false,
        doubleScore: false
      }
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  updateHealth(amount: number): void {
    this.state.health = Math.max(0, Math.min(this.state.maxHealth, this.state.health + amount));
  }

  addScore(points: number): void {
    const multiplier = this.state.powerUps.doubleScore ? 2 : 1;
    this.state.score += points * multiplier;
  }

  collectItem(item: string): void {
    this.state.inventory.push(item);
  }

  activatePowerUp(powerUp: 'speed' | 'invincible' | 'doubleScore'): void {
    this.state.powerUps[powerUp] = true;
  }

  deactivatePowerUp(powerUp: 'speed' | 'invincible' | 'doubleScore'): void {
    this.state.powerUps[powerUp] = false;
  }

  collectKey(): void {
    this.state.hasKey = true;
  }

  reset(): void {
    this.state = this.getInitialState();
  }

  nextLevel(): void {
    this.state.level++;
    this.state.health = this.state.maxHealth;
  }

  setState(newState: GameState): void {
  this.state = { ...newState };
  }
}
