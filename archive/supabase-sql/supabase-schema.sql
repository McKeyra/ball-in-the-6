-- Ball in the 6 - Supabase Schema
-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES (Most Used)
-- ============================================

-- Teams
CREATE TABLE IF NOT EXISTS team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  team_name TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#c9a962',
  secondary_color TEXT DEFAULT '#0f0f0f',
  division TEXT,
  age_group TEXT,
  sport TEXT DEFAULT 'basketball',
  league_id UUID,
  organization_id UUID,
  coach_name TEXT,
  coach_email TEXT,
  home_venue TEXT,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  ties INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Games
CREATE TABLE IF NOT EXISTS game (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team_id UUID REFERENCES team(id),
  away_team_id UUID REFERENCES team(id),
  home_team_name TEXT,
  away_team_name TEXT,
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  game_date TIMESTAMPTZ,
  venue TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, live, completed, cancelled
  quarter INTEGER DEFAULT 1,
  time_remaining TEXT,
  league_id UUID,
  season TEXT,
  notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Players (game-specific roster)
CREATE TABLE IF NOT EXISTS player (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  jersey_number TEXT,
  position TEXT,
  team_id UUID REFERENCES team(id),
  game_id UUID REFERENCES game(id),
  is_starter BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  points INTEGER DEFAULT 0,
  rebounds INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  steals INTEGER DEFAULT 0,
  blocks INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,
  fouls INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Persistent Players (master player records)
CREATE TABLE IF NOT EXISTS persistent_player (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT,
  last_name TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  jersey_number TEXT,
  position TEXT,
  height TEXT,
  weight TEXT,
  date_of_birth DATE,
  team_id UUID REFERENCES team(id),
  organization_id UUID,
  photo_url TEXT,
  status TEXT DEFAULT 'active',
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  emergency_contact TEXT,
  medical_notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Game Events (plays, stats)
CREATE TABLE IF NOT EXISTS game_event (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES game(id),
  player_id UUID,
  team_id UUID,
  event_type TEXT NOT NULL, -- points, rebound, assist, steal, block, turnover, foul, substitution
  points INTEGER,
  quarter INTEGER,
  time TEXT,
  x_position FLOAT,
  y_position FLOAT,
  is_made BOOLEAN,
  description TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORGANIZATION & LEAGUE
-- ============================================

CREATE TABLE IF NOT EXISTS organization (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#c9a962',
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT DEFAULT 'Toronto',
  province TEXT DEFAULT 'ON',
  description TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS league (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  organization_id UUID REFERENCES organization(id),
  sport TEXT DEFAULT 'basketball',
  season TEXT,
  start_date DATE,
  end_date DATE,
  registration_open BOOLEAN DEFAULT TRUE,
  logo_url TEXT,
  description TEXT,
  rules TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SCHEDULE & PROGRAMS
-- ============================================

CREATE TABLE IF NOT EXISTS schedule_item (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT DEFAULT 'game', -- game, practice, event, meeting
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  location TEXT,
  team_id UUID REFERENCES team(id),
  game_id UUID REFERENCES game(id),
  description TEXT,
  is_cancelled BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS program (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT, -- camp, clinic, league, training
  start_date DATE,
  end_date DATE,
  price DECIMAL(10,2),
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  location TEXT,
  age_group TEXT,
  skill_level TEXT,
  organization_id UUID,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEAM MEMBERS & STAFF
-- ============================================

CREATE TABLE IF NOT EXISTS team_member (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES team(id),
  user_id UUID,
  player_id UUID,
  role TEXT DEFAULT 'player', -- player, coach, assistant_coach, manager, parent
  name TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coach (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  team_id UUID REFERENCES team(id),
  certifications TEXT[],
  experience_years INTEGER,
  bio TEXT,
  photo_url TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referee (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  certification_level TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS volunteer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  roles TEXT[],
  availability TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SOCIAL & COMMUNITY
-- ============================================

CREATE TABLE IF NOT EXISTS post (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  content TEXT,
  author_id UUID,
  author_name TEXT,
  team_id UUID,
  image_url TEXT,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  post_type TEXT DEFAULT 'general',
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_post (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT,
  author_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  image_url TEXT,
  video_url TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_post (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID,
  author_name TEXT,
  category TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_reply (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES forum_post(id),
  content TEXT,
  author_id UUID,
  author_name TEXT,
  likes INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fan_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES team(id),
  name TEXT,
  description TEXT,
  cover_image TEXT,
  followers INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID,
  recipient_id UUID,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AWARDS & RECOGNITION
-- ============================================

CREATE TABLE IF NOT EXISTS award (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- mvp, most_improved, sportsmanship, etc
  player_id UUID,
  team_id UUID,
  season TEXT,
  votes INTEGER DEFAULT 0,
  image_url TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VENUES & LOCATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS venue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT DEFAULT 'Toronto',
  capacity INTEGER,
  courts INTEGER DEFAULT 1,
  amenities TEXT[],
  contact_email TEXT,
  contact_phone TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS location (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  type TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opponent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT,
  notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SPONSORS & STORE
-- ============================================

CREATE TABLE IF NOT EXISTS sponsor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum
  contact_name TEXT,
  contact_email TEXT,
  amount DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_store (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES team(id),
  name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  category TEXT,
  team_id UUID,
  store_id UUID,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HEALTH & STATS
-- ============================================

CREATE TABLE IF NOT EXISTS team_health_score (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES team(id),
  overall_score INTEGER,
  payment_score INTEGER,
  engagement_score INTEGER,
  attendance_score INTEGER,
  roster_score INTEGER,
  calculated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_stat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID,
  game_id UUID,
  season TEXT,
  points INTEGER DEFAULT 0,
  rebounds INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  steals INTEGER DEFAULT 0,
  blocks INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,
  minutes INTEGER DEFAULT 0,
  field_goals_made INTEGER DEFAULT 0,
  field_goals_attempted INTEGER DEFAULT 0,
  three_pointers_made INTEGER DEFAULT 0,
  three_pointers_attempted INTEGER DEFAULT 0,
  free_throws_made INTEGER DEFAULT 0,
  free_throws_attempted INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS live_stat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES game(id),
  stat_type TEXT,
  value INTEGER,
  player_id UUID,
  team_id UUID,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRAINING & DEVELOPMENT
-- ============================================

CREATE TABLE IF NOT EXISTS training_plan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  player_id UUID,
  team_id UUID,
  duration_weeks INTEGER,
  focus_areas TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS video_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  video_url TEXT,
  player_id UUID,
  game_id UUID,
  notes TEXT,
  tags TEXT[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FORMS & APPLICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS application (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- sponsor, vendor, facility, league
  applicant_name TEXT,
  applicant_email TEXT,
  status TEXT DEFAULT 'pending',
  data JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS form_template (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT,
  sections JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tryout_registration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_name TEXT,
  player_email TEXT,
  parent_name TEXT,
  parent_email TEXT,
  age_group TEXT,
  position TEXT,
  experience TEXT,
  status TEXT DEFAULT 'pending',
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS program_registration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES program(id),
  player_name TEXT,
  player_email TEXT,
  parent_name TEXT,
  parent_email TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMPLIANCE & DOCUMENTATION
-- ============================================

CREATE TABLE IF NOT EXISTS waiver_consent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID,
  parent_name TEXT,
  parent_email TEXT,
  signed_date TIMESTAMPTZ,
  waiver_type TEXT,
  is_signed BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medical_form (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID,
  allergies TEXT,
  medications TEXT,
  conditions TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  doctor_name TEXT,
  doctor_phone TEXT,
  insurance_info TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS code_of_conduct (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signer_name TEXT,
  signer_email TEXT,
  role TEXT,
  signed_date TIMESTAMPTZ,
  is_signed BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS background_check (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_name TEXT,
  person_email TEXT,
  role TEXT,
  status TEXT DEFAULT 'pending',
  submitted_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  result TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FEEDBACK & SURVEYS
-- ============================================

CREATE TABLE IF NOT EXISTS survey (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  questions JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID,
  respondent_email TEXT,
  responses JSONB,
  rating INTEGER,
  comments TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evaluation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT, -- coach, player, program
  subject_id UUID,
  evaluator_id UUID,
  scores JSONB,
  comments TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER PROFILES
-- ============================================

CREATE TABLE IF NOT EXISTS user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'fan',
  avatar_url TEXT,
  phone TEXT,
  organization_id UUID,
  team_id UUID,
  preferences JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parent_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  players UUID[],
  payment_method TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  player_id UUID,
  bio TEXT,
  highlight_video TEXT,
  social_links JSONB,
  achievements TEXT[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MISC
-- ============================================

CREATE TABLE IF NOT EXISTS article (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  author_name TEXT,
  image_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_date TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  description TEXT,
  team_id UUID,
  game_id UUID,
  images TEXT[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS poll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  options JSONB,
  votes JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  end_date TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_vote (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES game(id),
  voter_id UUID,
  vote_type TEXT, -- mvp, best_play, etc
  player_id UUID,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  name TEXT,
  email TEXT,
  favorite_teams UUID[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (Optional but recommended)
-- ============================================

-- For now, allow all operations (you can tighten this later)
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE game ENABLE ROW LEVEL SECURITY;
ALTER TABLE player ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all access (for development)
CREATE POLICY "Allow all access to team" ON team FOR ALL USING (true);
CREATE POLICY "Allow all access to game" ON game FOR ALL USING (true);
CREATE POLICY "Allow all access to player" ON player FOR ALL USING (true);

-- ============================================
-- SEED DATA (Optional - some sample data)
-- ============================================

-- Sample Organization
INSERT INTO organization (name, city, primary_color)
VALUES ('Ball in the 6', 'Toronto', '#c9a962')
ON CONFLICT DO NOTHING;

-- Sample Teams
INSERT INTO team (name, division, age_group, primary_color, wins, losses) VALUES
('Toronto Raptors Elite', 'Senior', 'U18', '#ce1141', 8, 2),
('Scarborough Blues', 'Senior', 'U18', '#4A90E2', 6, 4),
('North York Knights', 'Senior', 'U16', '#c9a962', 7, 3),
('Mississauga Magic', 'Junior', 'U14', '#8BC9A8', 5, 5)
ON CONFLICT DO NOTHING;

RAISE NOTICE 'Schema created successfully!';
