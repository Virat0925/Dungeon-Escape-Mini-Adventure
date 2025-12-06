import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '../game/config';
import { GameStateManager } from '../game/GameStateManager';
import { SaveLoadMenu } from './SaveLoadMenu';

export const GameContainer = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [gameState, setGameState] = useState(GameStateManager.getInstance().getState());

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(gameConfig);
    }

    const interval = setInterval(() => {
      setGameState(GameStateManager.getInstance().getState());
    }, 100);

    return () => {
      clearInterval(interval);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const toggleSaveLoad = () => {
    setShowSaveLoad(!showSaveLoad);
  };

  const handleLoadGame = () => {
    if (gameRef.current) {
      const currentScene = gameRef.current.scene.getScene('GameScene');
      if (currentScene) {
        gameRef.current.scene.start('GameScene');
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
      <div id="game-container" className="relative" />

      <div className="absolute top-4 right-4 space-y-2">
        <button
          onClick={toggleStats}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
        >
          {showStats ? 'Hide Stats' : 'Show Stats'}
        </button>
        <button
          onClick={toggleSaveLoad}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all w-full"
        >
          Save/Load
        </button>
      </div>

      {showStats && (
        <div className="absolute top-36 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">Game Stats</h3>
          <div className="space-y-1 text-sm">
            <p>Health: {gameState.health}/{gameState.maxHealth}</p>
            <p>Score: {gameState.score}</p>
            <p>Level: {gameState.level}</p>
            <p>Has Key: {gameState.hasKey ? '✓' : '✗'}</p>
            <div className="mt-2">
              <p className="font-semibold">Power-ups:</p>
              <p className="text-xs">Speed: {gameState.powerUps.speed ? '✓' : '✗'}</p>
              <p className="text-xs">Invincible: {gameState.powerUps.invincible ? '✓' : '✗'}</p>
              <p className="text-xs">2x Score: {gameState.powerUps.doubleScore ? '✓' : '✗'}</p>
            </div>
          </div>
        </div>
      )}

      {showSaveLoad && (
        <SaveLoadMenu
          onClose={() => setShowSaveLoad(false)}
          onLoad={handleLoadGame}
        />
      )}

      <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg">
        <p className="text-xs">WASD - Move | SPACE - Attack | ESC - Pause</p>
      </div>
    </div>
  );
};
