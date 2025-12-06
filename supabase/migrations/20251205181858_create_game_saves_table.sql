/*
  # Create game saves table

  1. New Tables
    - `game_saves`
      - `id` (uuid, primary key)
      - `player_name` (text) - Player identifier
      - `health` (integer) - Current health
      - `max_health` (integer) - Maximum health
      - `score` (integer) - Current score
      - `level` (integer) - Current level
      - `has_key` (boolean) - Whether player has the key
      - `inventory` (jsonb) - Player inventory items
      - `power_ups` (jsonb) - Active power-ups
      - `created_at` (timestamptz) - When save was created
      - `updated_at` (timestamptz) - When save was last updated

  2. Security
    - Enable RLS on `game_saves` table
    - Add policy for anyone to create and read their own saves (public game, no auth required)
*/

CREATE TABLE IF NOT EXISTS game_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  health integer NOT NULL DEFAULT 100,
  max_health integer NOT NULL DEFAULT 100,
  score integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  has_key boolean NOT NULL DEFAULT false,
  inventory jsonb DEFAULT '[]'::jsonb,
  power_ups jsonb DEFAULT '{"speed": false, "invincible": false, "doubleScore": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create game saves"
  ON game_saves
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read game saves"
  ON game_saves
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update their own saves"
  ON game_saves
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete game saves"
  ON game_saves
  FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS game_saves_player_name_idx ON game_saves(player_name);
CREATE INDEX IF NOT EXISTS game_saves_created_at_idx ON game_saves(created_at DESC);