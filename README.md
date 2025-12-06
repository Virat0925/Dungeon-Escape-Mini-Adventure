# Dungeon Escape: Mini Adventure

A fully-featured 2D dungeon escape game built with Phaser.js and React, featuring multiple scenes, enemy AI, collectibles, power-ups, and persistent save/load functionality using Supabase.

## Game Overview

**Dungeon Escape: Mini Adventure** is a top-down dungeon crawler where you must navigate through a dangerous dungeon, avoid or defeat enemies, collect treasures, find the golden key, and reach the exit to win.

## Features Implemented

### Core Gameplay Features
- **Multiple Scenes**: Boot/Preload, Main Menu, Game, Game Over, and Victory scenes
- **Player Mechanics**:
  - Smooth 8-directional movement with WASD controls
  - Projectile-based attack system (SPACE to shoot)
  - Collision detection with walls and enemies
  - Health system with visual feedback

- **Enemy AI**:
  - Three enemies with intelligent behavior
  - Patrol routes with waypoint navigation
  - Chase behavior when player is within detection range
  - Health system and visual damage feedback

- **Collectibles System**:
  - **Gold Coins**: Increase your score (+10 points each)
  - **Health Potions**: Restore 25 HP (pink cross icons)
  - **Speed Boost Power-up**: Temporary speed increase for 5 seconds (purple orb)
  - **Golden Key**: Required to unlock the exit and win the game

- **Level Design**:
  - Hand-crafted dungeon layout with walls and obstacles
  - Strategic placement of enemies and collectibles
  - Clear visual distinction between walkable and blocked areas

- **HUD (Heads-Up Display)**:
  - Real-time health display with numeric value
  - Visual health bar with color-coded status (green/yellow/red)
  - Score counter
  - Key collection indicator

### Advanced Features (Bonus)

- **React Integration**:
  - React-based UI overlay for game controls
  - Real-time game stats panel showing health, score, level, and power-up status
  - Toggle-able stats display

- **Save/Load System with Supabase**:
  - Full game state persistence to cloud database
  - Save current progress with player name
  - Load previous saves
  - View all saved games with timestamps and stats
  - Delete old saves

- **Visual Effects & Polish**:
  - Floating damage numbers on hits
  - Particle effects on collectible pickup
  - Screen shake when taking damage
  - Hit flash effects on enemy damage
  - Smooth tweening animations for collectibles
  - Color-coded visual feedback for different actions
  - Particle explosions on enemy death

- **Audio & Animation**:
  - Sprite animations with color tinting
  - Movement feedback animations
  - Smooth scene transitions
  - Animated UI elements

## How to Run

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173` ([or the port shown in your terminal](https://dungeon-escape-mini-adventure.vercel.app/))

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Gameplay Instructions

### Objective
1. Navigate through the dungeon
2. Collect the **Golden Key** (yellow key icon)
3. Avoid or defeat enemies
4. Reach the **Exit** (green square in bottom-right corner)
5. Maximize your score by collecting coins and defeating enemies

### Controls
- **W/A/S/D** or **Arrow Keys**: Move in 8 directions
- **SPACE**: Fire projectiles in your movement direction
- **ESC**: Pause the game
- **Mouse Click**: Interact with UI buttons

### Gameplay Tips
- Enemies have a detection range - they'll chase you when you get close!
- Use projectiles to defeat enemies from a distance
- Collect health potions when your HP is low
- The purple power-up gives you a speed boost - use it to escape dangerous situations
- You MUST collect the golden key before you can exit
- Watch your health bar - the game ends if it reaches zero!

### Scoring System
- **Coins**: +10 points each
- **Health Potion**: Restores 25 HP
- **Speed Boost**: +50 points + temporary speed increase
- **Golden Key**: +100 points
- **Hitting Enemy**: +5 points per hit

## Technical Architecture

### Project Structure
```
src/
├── components/
│   ├── GameContainer.tsx      # Main React wrapper for Phaser
│   └── SaveLoadMenu.tsx       # Save/Load UI component
├── game/
│   ├── config.ts              # Phaser game configuration
│   ├── GameStateManager.ts   # Centralized state management
│   ├── entities/
│   │   ├── Player.ts          # Player class with controls
│   │   ├── Enemy.ts           # Enemy AI and behavior
│   │   └── Collectible.ts    # Collectible items
│   ├── scenes/
│   │   ├── BootScene.ts       # Asset loading scene
│   │   ├── MainMenuScene.ts  # Main menu
│   │   ├── GameScene.ts       # Main gameplay
│   │   ├── GameOverScene.ts  # Game over screen
│   │   └── VictoryScene.ts   # Victory screen
│   └── utils/
│       └── EffectsManager.ts  # Visual effects system
└── lib/
    └── supabase.ts            # Database integration
```

### Technologies Used
- **Phaser 3**: Game engine for 2D game development
- **React 18**: UI framework for overlays and menus
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Backend-as-a-Service for data persistence
- **Lucide React**: Icon library for UI elements

### Game Architecture Highlights

1. **Scene Management**: Clean separation of game phases using Phaser's scene system
2. **Entity Component System**: Object-oriented design with reusable entity classes
3. **State Management**: Centralized game state with singleton pattern
4. **Effects System**: Modular visual effects manager for consistent polish
5. **React Integration**: Seamless bridge between Phaser canvas and React UI
6. **Database Integration**: Cloud-based save system with Supabase

## Advanced Features Details

### Enemy AI System
Each enemy implements intelligent behavior:
- **Patrol Mode**: Follows predefined waypoints when player is far
- **Chase Mode**: Actively pursues player when within detection range
- **Collision Avoidance**: Navigates around walls and obstacles
- **Visual Feedback**: Color tints indicate movement and damage states

### Visual Effects System
The game includes a comprehensive effects manager:
- **Floating Text**: Shows damage numbers and pickup values
- **Particle Effects**: Star bursts on collectible pickup
- **Screen Shake**: Camera shake on taking damage
- **Hit Feedback**: Color flashes and expanding circles
- **Smooth Animations**: Tweened movements for polish

### Save/Load System
Powered by Supabase:
- **Cloud Storage**: All saves stored in PostgreSQL database
- **Real-time Sync**: Instant save/load functionality
- **Multiple Saves**: Support for different player profiles
- **Rich Metadata**: Saves include score, health, level, inventory, etc.

## Known Features & Notes

### Completed Requirements
- ✅ Multiple scenes (Boot, Menu, Game, Game Over, Victory)
- ✅ Player mechanics with smooth movement and attacks
- ✅ Enemy AI with patrol and chase behavior
- ✅ Collectibles and power-ups system
- ✅ Hand-crafted dungeon level design
- ✅ Complete HUD with health and score
- ✅ Animations and visual effects
- ✅ Clean modular JavaScript/TypeScript architecture

### Bonus Features Implemented
- ✅ React integration for UI overlays
- ✅ Save/Load system with Supabase
- ✅ Particle effects and visual polish
- ✅ Floating damage numbers
- ✅ Screen shake and hit feedback
- ✅ Smooth transitions and animations
- ✅ Real-time stats display
- ✅ Cloud-based persistence

### Potential Enhancements (Not Required)
- Additional levels or procedural generation
- More enemy types and boss fights
- Inventory system with items
- Sound effects and background music
- Mobile touch controls
- Leaderboard system

## Credits

**Developer**: Built as a Phaser.js assessment project
**Game Engine**: Phaser 3
**Framework**: React + TypeScript + Vite
**Database**: Supabase
**Icons**: Lucide React

## License

This project is created for assessment purposes.

## Author

Virat Singh Bhadauriya

---

**Enjoy playing Dungeon Escape: Mini Adventure!**

For any issues or questions, please check the game controls in the main menu or review this README.
