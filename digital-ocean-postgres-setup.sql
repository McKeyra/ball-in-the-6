-- ============================================================
-- Ball in the 6 - Digital Ocean PostgreSQL Setup
-- Complete database schema for standard PostgreSQL
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE TABLES
-- ============================================

CREATE TABLE organization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE league (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  abbreviation TEXT,
  organization_id UUID REFERENCES organization(id),
  sport TEXT DEFAULT 'basketball',
  season TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  registration_open BOOLEAN DEFAULT TRUE,
  logo_url TEXT,
  description TEXT,
  rules TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team_name TEXT,
  abbreviation TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#c9a962',
  secondary_color TEXT DEFAULT '#0f0f0f',
  "gradientStart" TEXT,
  "gradientEnd" TEXT,
  division TEXT,
  league TEXT,
  age_group TEXT,
  sport TEXT DEFAULT 'basketball',
  city TEXT,
  province TEXT,
  league_id UUID REFERENCES league(id),
  organization_id UUID REFERENCES organization(id),
  coach_name TEXT,
  coach_email TEXT,
  home_venue TEXT,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  ties INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  staff JSONB DEFAULT '[]'::jsonb,
  roster JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  gender TEXT,
  team_color TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE game (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team_id UUID REFERENCES team(id),
  away_team_id UUID REFERENCES team(id),
  home_team_name TEXT,
  away_team_name TEXT,
  home_team_color TEXT,
  away_team_color TEXT,
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  game_date TIMESTAMPTZ,
  venue TEXT,
  status TEXT DEFAULT 'scheduled',
  quarter INTEGER DEFAULT 1,
  time_remaining TEXT,
  game_clock_seconds INTEGER DEFAULT 600,
  shot_clock_seconds INTEGER DEFAULT 24,
  quarter_length_minutes INTEGER DEFAULT 10,
  overtime_length_minutes INTEGER DEFAULT 5,
  home_team_fouls INTEGER DEFAULT 0,
  away_team_fouls INTEGER DEFAULT 0,
  home_bonus_active BOOLEAN DEFAULT FALSE,
  away_bonus_active BOOLEAN DEFAULT FALSE,
  home_timeouts INTEGER DEFAULT 2,
  away_timeouts INTEGER DEFAULT 2,
  settings JSONB,
  league_id UUID REFERENCES league(id),
  season TEXT,
  notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE player (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  jersey_number TEXT,
  number TEXT,
  position TEXT,
  height TEXT,
  weight TEXT,
  team_id UUID REFERENCES team(id),
  game_id UUID REFERENCES game(id),
  is_starter BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  on_court BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  points INTEGER DEFAULT 0,
  rebounds INTEGER DEFAULT 0,
  rebounds_off INTEGER DEFAULT 0,
  rebounds_def INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  steals INTEGER DEFAULT 0,
  blocks INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,
  fouls INTEGER DEFAULT 0,
  personal_fouls INTEGER DEFAULT 0,
  fgm INTEGER DEFAULT 0,
  fga INTEGER DEFAULT 0,
  three_pm INTEGER DEFAULT 0,
  three_pa INTEGER DEFAULT 0,
  ftm INTEGER DEFAULT 0,
  fta INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  team TEXT,
  user_email TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE persistent_player (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  bio TEXT,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  emergency_contact TEXT,
  medical_notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE player_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  jersey_number TEXT,
  primary_position TEXT,
  height TEXT,
  current_team_id UUID REFERENCES team(id),
  status TEXT DEFAULT 'active',
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE game_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES game(id),
  player_id UUID,
  player_email TEXT,
  team_id UUID,
  event_type TEXT NOT NULL,
  points INTEGER,
  quarter INTEGER,
  period TEXT,
  time TEXT,
  timestamp TIMESTAMPTZ,
  x_position FLOAT,
  y_position FLOAT,
  is_made BOOLEAN,
  description TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE player_stat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES player(id),
  game_id UUID REFERENCES game(id),
  team_id UUID REFERENCES team(id),
  season TEXT,
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
  rebounds INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  steals INTEGER DEFAULT 0,
  blocks INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,
  field_goals_made INTEGER DEFAULT 0,
  field_goals_attempted INTEGER DEFAULT 0,
  three_pointers_made INTEGER DEFAULT 0,
  three_pointers_attempted INTEGER DEFAULT 0,
  free_throws_made INTEGER DEFAULT 0,
  free_throws_attempted INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUPPORTING TABLES
-- ============================================

CREATE TABLE schedule_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT DEFAULT 'game',
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  location TEXT,
  team_id UUID REFERENCES team(id),
  game_id UUID REFERENCES game(id),
  description TEXT,
  is_cancelled BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE program (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  start_date DATE,
  end_date DATE,
  price DECIMAL(10,2),
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  location TEXT,
  age_group TEXT,
  skill_level TEXT,
  organization_id UUID REFERENCES organization(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_member (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES team(id),
  user_id UUID,
  player_id UUID,
  role TEXT DEFAULT 'player',
  name TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE coach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE referee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  certification_level TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE volunteer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  roles TEXT[],
  availability TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE social_post (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE forum_post (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE forum_reply (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_post(id),
  content TEXT,
  author_id UUID,
  author_name TEXT,
  likes INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fan_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES team(id),
  name TEXT,
  description TEXT,
  cover_image TEXT,
  followers INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE message (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID,
  recipient_id UUID,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE award (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  player_id UUID,
  team_id UUID,
  season TEXT,
  votes INTEGER DEFAULT 0,
  image_url TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE venue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE location (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  type TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE opponent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT,
  notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sponsor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  tier TEXT DEFAULT 'bronze',
  contact_name TEXT,
  contact_email TEXT,
  amount DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_store (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES team(id),
  name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE team_health_score (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES team(id),
  overall_score INTEGER,
  payment_score INTEGER,
  engagement_score INTEGER,
  attendance_score INTEGER,
  roster_score INTEGER,
  calculated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE live_stat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES game(id),
  stat_type TEXT,
  value INTEGER,
  player_id UUID,
  team_id UUID,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE training_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  player_id UUID,
  team_id UUID,
  duration_weeks INTEGER,
  focus_areas TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE video_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  video_url TEXT,
  player_id UUID,
  game_id UUID,
  notes TEXT,
  tags TEXT[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE application (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  applicant_name TEXT,
  applicant_email TEXT,
  status TEXT DEFAULT 'pending',
  data JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE form_template (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  sections JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tryout_registration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE program_registration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES program(id),
  player_name TEXT,
  player_email TEXT,
  parent_name TEXT,
  parent_email TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE waiver_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID,
  parent_name TEXT,
  parent_email TEXT,
  signed_date TIMESTAMPTZ,
  waiver_type TEXT,
  is_signed BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medical_form (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE code_of_conduct (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signer_name TEXT,
  signer_email TEXT,
  role TEXT,
  signed_date TIMESTAMPTZ,
  is_signed BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE background_check (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name TEXT,
  person_email TEXT,
  role TEXT,
  status TEXT DEFAULT 'pending',
  submitted_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  result TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE survey (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  questions JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID,
  respondent_email TEXT,
  responses JSONB,
  rating INTEGER,
  comments TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE evaluation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,
  subject_id UUID,
  evaluator_id UUID,
  scores JSONB,
  comments TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE parent_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  players UUID[],
  payment_method TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE player_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  player_id UUID,
  bio TEXT,
  highlight_video TEXT,
  social_links JSONB,
  achievements TEXT[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE article (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author_name TEXT,
  image_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_date TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  team_id UUID,
  game_id UUID,
  images TEXT[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE poll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB,
  votes JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  end_date TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE game_vote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES game(id),
  voter_id UUID,
  vote_type TEXT,
  player_id UUID,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT,
  email TEXT,
  favorite_teams UUID[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'fan',
  full_name TEXT,
  organization_id UUID,
  team_id UUID,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_game_status ON game(status);
CREATE INDEX idx_game_date ON game(game_date);
CREATE INDEX idx_game_teams ON game(home_team_id, away_team_id);
CREATE INDEX idx_player_team ON player(team_id);
CREATE INDEX idx_player_game ON player(game_id);
CREATE INDEX idx_game_event_game ON game_event(game_id);
CREATE INDEX idx_team_league ON team(league_id);
CREATE INDEX idx_user_roles_email ON user_roles(email);

-- ============================================
-- SEED DATA
-- ============================================

-- Default Organization
INSERT INTO organization (name, city, primary_color) VALUES
  ('Ball in the 6', 'Toronto', '#c9a962');

-- Sample Teams
INSERT INTO team (name, division, age_group, primary_color, wins, losses) VALUES
  ('Toronto Raptors Elite', 'Senior', 'U18', '#ce1141', 8, 2),
  ('Scarborough Blues', 'Senior', 'U18', '#4A90E2', 6, 4),
  ('North York Knights', 'Senior', 'U16', '#c9a962', 7, 3),
  ('Mississauga Magic', 'Junior', 'U14', '#8BC9A8', 5, 5);

-- Admin Users (update these with your actual email addresses)
INSERT INTO user_roles (email, role, full_name) VALUES
  ('michael@enuw.ca', 'owner', 'Michael'),
  ('ai@enuw.ca', 'owner', 'AI Admin'),
  ('mugugu@enuw.ca', 'admin', 'Mugugu')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Ball in the 6 database setup complete!';
  RAISE NOTICE 'Total tables created: 50+';
  RAISE NOTICE 'Sample data inserted: 1 organization, 4 teams, 3 admin users';
END $$;
