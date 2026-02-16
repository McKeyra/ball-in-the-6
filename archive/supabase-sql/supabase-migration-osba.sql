-- Migration: Add missing columns for OSBA integration
-- Run this in Supabase SQL Editor AFTER the main schema

-- ============================================
-- TEAM TABLE - Missing columns
-- ============================================
ALTER TABLE team ADD COLUMN IF NOT EXISTS abbreviation TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS "gradientStart" TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS "gradientEnd" TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS league TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE team ADD COLUMN IF NOT EXISTS staff JSONB DEFAULT '[]'::jsonb;
ALTER TABLE team ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- ============================================
-- GAME TABLE - Missing columns for clock/scoring
-- ============================================
ALTER TABLE game ADD COLUMN IF NOT EXISTS game_clock_seconds INTEGER DEFAULT 600;
ALTER TABLE game ADD COLUMN IF NOT EXISTS shot_clock_seconds INTEGER DEFAULT 24;
ALTER TABLE game ADD COLUMN IF NOT EXISTS home_team_color TEXT;
ALTER TABLE game ADD COLUMN IF NOT EXISTS away_team_color TEXT;
ALTER TABLE game ADD COLUMN IF NOT EXISTS quarter_length_minutes INTEGER DEFAULT 10;
ALTER TABLE game ADD COLUMN IF NOT EXISTS overtime_length_minutes INTEGER DEFAULT 5;
ALTER TABLE game ADD COLUMN IF NOT EXISTS home_team_fouls INTEGER DEFAULT 0;
ALTER TABLE game ADD COLUMN IF NOT EXISTS away_team_fouls INTEGER DEFAULT 0;
ALTER TABLE game ADD COLUMN IF NOT EXISTS home_bonus_active BOOLEAN DEFAULT FALSE;
ALTER TABLE game ADD COLUMN IF NOT EXISTS away_bonus_active BOOLEAN DEFAULT FALSE;
ALTER TABLE game ADD COLUMN IF NOT EXISTS home_timeouts INTEGER DEFAULT 2;
ALTER TABLE game ADD COLUMN IF NOT EXISTS away_timeouts INTEGER DEFAULT 2;
ALTER TABLE game ADD COLUMN IF NOT EXISTS settings JSONB;

-- ============================================
-- PLAYER TABLE - Missing columns
-- ============================================
ALTER TABLE player ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE player ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE player ADD COLUMN IF NOT EXISTS height TEXT;
ALTER TABLE player ADD COLUMN IF NOT EXISTS number TEXT;
ALTER TABLE player ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- ============================================
-- PLAYER_STAT TABLE (for game-by-game detailed stats)
-- ============================================
CREATE TABLE IF NOT EXISTS player_stat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES game(id),
  player_id UUID REFERENCES player(id),
  team_id UUID REFERENCES team(id),
  points INTEGER DEFAULT 0,
  fgm INTEGER DEFAULT 0,
  fga INTEGER DEFAULT 0,
  fgm3 INTEGER DEFAULT 0,
  fga3 INTEGER DEFAULT 0,
  ftm INTEGER DEFAULT 0,
  fta INTEGER DEFAULT 0,
  oreb INTEGER DEFAULT 0,
  dreb INTEGER DEFAULT 0,
  ast INTEGER DEFAULT 0,
  stl INTEGER DEFAULT 0,
  blk INTEGER DEFAULT 0,
  tov INTEGER DEFAULT 0,
  pf INTEGER DEFAULT 0,
  tf INTEGER DEFAULT 0,
  uf INTEGER DEFAULT 0,
  minutes INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEAGUE TABLE - ensure it exists
-- ============================================
CREATE TABLE IF NOT EXISTS league (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  abbreviation TEXT,
  sport TEXT DEFAULT 'basketball',
  season TEXT,
  status TEXT DEFAULT 'active',
  logo_url TEXT,
  description TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE RLS (with permissive policies for now)
-- ============================================
ALTER TABLE player_stat ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to player_stat" ON player_stat FOR ALL USING (true) WITH CHECK (true);

-- Make sure existing tables have permissive policies for the app
DO $$
BEGIN
  -- Team
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team' AND policyname = 'Allow all access to team') THEN
    EXECUTE 'CREATE POLICY "Allow all access to team" ON team FOR ALL USING (true) WITH CHECK (true)';
  END IF;
  -- Game
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'game' AND policyname = 'Allow all access to game') THEN
    EXECUTE 'CREATE POLICY "Allow all access to game" ON game FOR ALL USING (true) WITH CHECK (true)';
  END IF;
  -- Player
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'player' AND policyname = 'Allow all access to player') THEN
    EXECUTE 'CREATE POLICY "Allow all access to player" ON player FOR ALL USING (true) WITH CHECK (true)';
  END IF;
  -- Game Event
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'game_event' AND policyname = 'Allow all access to game_event') THEN
    EXECUTE 'CREATE POLICY "Allow all access to game_event" ON game_event FOR ALL USING (true) WITH CHECK (true)';
  END IF;
  -- League
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'league' AND policyname = 'Allow all access to league') THEN
    EXECUTE 'CREATE POLICY "Allow all access to league" ON league FOR ALL USING (true) WITH CHECK (true)';
  END IF;
END $$;
