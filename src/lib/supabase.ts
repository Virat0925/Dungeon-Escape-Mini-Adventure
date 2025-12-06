import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GameSave {
  id?: string;
  player_name: string;
  health: number;
  max_health: number;
  score: number;
  level: number;
  has_key: boolean;
  inventory: string[];
  power_ups: {
    speed: boolean;
    invincible: boolean;
    doubleScore: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export async function saveGame(playerName: string, gameState: any): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: existingSaves, error: fetchError } = await supabase
      .from('game_saves')
      .select('id')
      .eq('player_name', playerName)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    const saveData: GameSave = {
      player_name: playerName,
      health: gameState.health,
      max_health: gameState.maxHealth,
      score: gameState.score,
      level: gameState.level,
      has_key: gameState.hasKey,
      inventory: gameState.inventory,
      power_ups: gameState.powerUps
    };

    if (existingSaves?.id) {
      const { error: updateError } = await supabase
        .from('game_saves')
        .update({ ...saveData, updated_at: new Date().toISOString() })
        .eq('id', existingSaves.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('game_saves')
        .insert([saveData]);

      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving game:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function loadGame(playerName: string): Promise<{ success: boolean; data?: GameSave; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('game_saves')
      .select('*')
      .eq('player_name', playerName)
      .order('updated_at', { ascending: false })
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return { success: false, error: 'No save found' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error loading game:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getAllSaves(): Promise<{ success: boolean; data?: GameSave[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('game_saves')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching saves:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteSave(saveId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('game_saves')
      .delete()
      .eq('id', saveId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting save:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
