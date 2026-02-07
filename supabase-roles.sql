-- Ball in the 6 - User Roles Setup
-- Run this in Supabase SQL Editor

-- ============================================
-- CREATE ROLES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ball_in_the_6.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'fan',
  full_name TEXT,
  organization_id UUID,
  team_id UUID,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ball_in_the_6.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow reading roles (needed for auth check)
DROP POLICY IF EXISTS "Anyone can read roles" ON ball_in_the_6.user_roles;
CREATE POLICY "Anyone can read roles" ON ball_in_the_6.user_roles
  FOR SELECT USING (true);

-- Only owners can modify roles
DROP POLICY IF EXISTS "Owners can manage roles" ON ball_in_the_6.user_roles;
CREATE POLICY "Owners can manage roles" ON ball_in_the_6.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ball_in_the_6.user_roles
      WHERE email = auth.jwt()->>'email'
      AND role = 'owner'
    )
  );

-- ============================================
-- INSERT YOUR USERS
-- ============================================

-- Owners (full access)
INSERT INTO ball_in_the_6.user_roles (email, role, full_name) VALUES
  ('michael@enuw.ca', 'owner', 'Michael'),
  ('ai@enuw.ca', 'owner', 'AI Admin')
ON CONFLICT (email) DO UPDATE SET role = 'owner', updated_date = NOW();

-- Admins (can manage most things)
INSERT INTO ball_in_the_6.user_roles (email, role, full_name) VALUES
  ('mugugu@enuw.ca', 'admin', 'Mugugu')
ON CONFLICT (email) DO UPDATE SET role = 'admin', updated_date = NOW();

-- ============================================
-- CREATE FUNCTION TO GET USER ROLE
-- ============================================

CREATE OR REPLACE FUNCTION ball_in_the_6.get_user_role(user_email TEXT)
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM ball_in_the_6.user_roles WHERE email = user_email AND is_active = TRUE),
    'fan'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- VERIFY ROLES WERE ADDED
-- ============================================

SELECT email, role, full_name, created_date
FROM ball_in_the_6.user_roles
ORDER BY role, email;
