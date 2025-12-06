import { useState, useEffect } from 'react';
import { Save, Upload, Trash2, X } from 'lucide-react';
import { saveGame, loadGame, getAllSaves, deleteSave, GameSave } from '../lib/supabase';
import { GameStateManager } from '../game/GameStateManager';

interface SaveLoadMenuProps {
  onClose: () => void;
  onLoad?: () => void;
}

export const SaveLoadMenu = ({ onClose, onLoad }: SaveLoadMenuProps) => {
  const [playerName, setPlayerName] = useState('Player');
  const [saves, setSaves] = useState<GameSave[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavesList();
  }, []);

  const loadSavesList = async () => {
    const result = await getAllSaves();
    if (result.success && result.data) {
      setSaves(result.data);
    }
  };

  const handleSave = async () => {
    if (!playerName.trim()) {
      setMessage('Please enter a player name');
      return;
    }

    setIsLoading(true);
    const gameState = GameStateManager.getInstance().getState();
    const result = await saveGame(playerName.trim(), gameState);

    if (result.success) {
      setMessage('Game saved successfully!');
      await loadSavesList();
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setIsLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLoad = async (saveName: string) => {
    setIsLoading(true);
    const result = await loadGame(saveName);

    if (result.success && result.data) {
      const gameStateManager = GameStateManager.getInstance();

      gameStateManager.setState({
        health: result.data.health,
        maxHealth: result.data.max_health,
        score: result.data.score,
        level: result.data.level,
        hasKey: result.data.has_key,
        inventory: result.data.inventory || [],
        powerUps: result.data.power_ups || {
          speed: false,
          invincible: false,
          doubleScore: false,
        },
      });

      setMessage('Game loaded successfully!');
      if (onLoad) {
        setTimeout(() => {
          onLoad();
          onClose();
        }, 1000);
      }
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setIsLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (saveId: string) => {
    if (window.confirm('Are you sure you want to delete this save?')) {
      setIsLoading(true);
      const result = await deleteSave(saveId);
      if (result.success) {
        setMessage('Save deleted');
        await loadSavesList();
      } else {
        setMessage(`Error: ${result.error}`);
      }
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Save / Load Game</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Player Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter player name"
              />
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded flex items-center gap-2 transition"
              >
                <Save size={20} />
                Save
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded ${
                message.includes('Error') ? 'bg-red-600' : 'bg-green-600'
              }`}
            >
              {message}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Saved Games</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {saves.length === 0 ? (
                <p className="text-gray-400 text-sm">No saved games found</p>
              ) : (
                saves.map((save) => (
                  <div
                    key={save.id}
                    className="bg-gray-700 rounded p-3 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{save.player_name}</p>
                      <p className="text-xs text-gray-400">
                        Level {save.level} | Score: {save.score} | HP:{' '}
                        {save.health}/{save.max_health}
                      </p>
                      <p className="text-xs text-gray-500">
                        {save.updated_at
                          ? new Date(save.updated_at).toLocaleString()
                          : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoad(save.player_name)}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 p-2 rounded transition"
                        title="Load"
                      >
                        <Upload size={16} />
                      </button>
                      <button
                        onClick={() => save.id && handleDelete(save.id)}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 p-2 rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
