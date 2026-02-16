-- Ball in the 6 - Missing Tables
-- Run this in Supabase SQL Editor to add missing tables to ball_in_the_6 schema

-- ============================================
-- MISSING TABLES FOR BALL IN THE 6
-- ============================================

-- Application (for sponsors, vendors, facilities, leagues)
CREATE TABLE IF NOT EXISTS ball_in_the_6.application (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  applicant_name TEXT,
  applicant_email TEXT,
  status TEXT DEFAULT 'pending',
  data JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Article
CREATE TABLE IF NOT EXISTS ball_in_the_6.article (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author_name TEXT,
  image_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_date TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Background Check
CREATE TABLE IF NOT EXISTS ball_in_the_6.background_check (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_name TEXT,
  person_email TEXT,
  role TEXT,
  status TEXT DEFAULT 'pending',
  submitted_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  result TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Coach
CREATE TABLE IF NOT EXISTS ball_in_the_6.coach (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  team_id UUID,
  certifications TEXT[],
  experience_years INTEGER,
  bio TEXT,
  photo_url TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Code of Conduct
CREATE TABLE IF NOT EXISTS ball_in_the_6.code_of_conduct (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  signer_name TEXT,
  signer_email TEXT,
  role TEXT,
  signed_date TIMESTAMPTZ,
  is_signed BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluation
CREATE TABLE IF NOT EXISTS ball_in_the_6.evaluation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT,
  subject_id UUID,
  evaluator_id UUID,
  scores JSONB,
  comments TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Fan
CREATE TABLE IF NOT EXISTS ball_in_the_6.fan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT,
  email TEXT,
  favorite_teams UUID[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback
CREATE TABLE IF NOT EXISTS ball_in_the_6.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID,
  respondent_email TEXT,
  responses JSONB,
  rating INTEGER,
  comments TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Form Template
CREATE TABLE IF NOT EXISTS ball_in_the_6.form_template (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  sections JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery
CREATE TABLE IF NOT EXISTS ball_in_the_6.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  team_id UUID,
  game_id UUID,
  images TEXT[],
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Medical Form
CREATE TABLE IF NOT EXISTS ball_in_the_6.medical_form (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Parent Profile
CREATE TABLE IF NOT EXISTS ball_in_the_6.parent_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  players UUID[],
  payment_method TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Poll
CREATE TABLE IF NOT EXISTS ball_in_the_6.poll (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB,
  votes JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  end_date TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Program Registration
CREATE TABLE IF NOT EXISTS ball_in_the_6.program_registration (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID,
  player_name TEXT,
  player_email TEXT,
  parent_name TEXT,
  parent_email TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Referee
CREATE TABLE IF NOT EXISTS ball_in_the_6.referee (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  certification_level TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Survey
CREATE TABLE IF NOT EXISTS ball_in_the_6.survey (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  questions JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Tryout Registration
CREATE TABLE IF NOT EXISTS ball_in_the_6.tryout_registration (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- User Profile
CREATE TABLE IF NOT EXISTS ball_in_the_6.user_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Volunteer
CREATE TABLE IF NOT EXISTS ball_in_the_6.volunteer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  roles TEXT[],
  availability TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Waiver Consent
CREATE TABLE IF NOT EXISTS ball_in_the_6.waiver_consent (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID,
  parent_name TEXT,
  parent_email TEXT,
  signed_date TIMESTAMPTZ,
  waiver_type TEXT,
  is_signed BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE RLS & CREATE POLICIES
-- ============================================

DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'application', 'article', 'background_check', 'coach', 'code_of_conduct',
    'evaluation', 'fan', 'feedback', 'form_template', 'gallery', 'medical_form',
    'parent_profile', 'poll', 'program_registration', 'referee', 'survey',
    'tryout_registration', 'user_profile', 'volunteer', 'waiver_consent'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    EXECUTE format('ALTER TABLE IF EXISTS ball_in_the_6.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Allow all access to %s" ON ball_in_the_6.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Allow all access to %s" ON ball_in_the_6.%I FOR ALL USING (true)', tbl, tbl);
  END LOOP;
END $$;

-- ============================================
-- ADD RLS TO EXISTING TABLES (if not already)
-- ============================================

DO $$
DECLARE
  tbl TEXT;
  existing_tables TEXT[] := ARRAY[
    'award', 'fan_page', 'forum_post', 'forum_reply', 'game', 'game_event',
    'game_vote', 'league', 'live_stat', 'location', 'message', 'opponent',
    'organization', 'persistent_player', 'player', 'player_base', 'player_profile',
    'player_stat', 'post', 'product', 'program', 'schedule_item', 'social_post',
    'sponsor', 'team', 'team_health_score', 'team_member', 'team_store',
    'training_plan', 'venue', 'video_analysis'
  ];
BEGIN
  FOREACH tbl IN ARRAY existing_tables
  LOOP
    EXECUTE format('ALTER TABLE IF EXISTS ball_in_the_6.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Allow all access to %s" ON ball_in_the_6.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Allow all access to %s" ON ball_in_the_6.%I FOR ALL USING (true)', tbl, tbl);
  END LOOP;
END $$;

-- ============================================
-- VERIFY: List all tables in ball_in_the_6 schema
-- ============================================

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'ball_in_the_6'
ORDER BY table_name;
