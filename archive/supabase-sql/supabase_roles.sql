-- ============================================================
-- BALL IN THE 6: Role-Based Access Control
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create custom enum type for the 7 roles
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM (
        'player',
        'parent',
        'coach',
        'team_admin',
        'league_admin',
        'org_admin',
        'fan'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create users table to store role info (links to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    role public.user_role DEFAULT 'fan',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own record
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own record (except role)
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Org admins and league admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('org_admin', 'league_admin')
    );

-- Only org_admin can update roles
CREATE POLICY "Org admin can manage users" ON public.users
    FOR ALL USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'org_admin'
    );

-- 3. Trigger function to auto-create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        CASE
            -- Staff/admin emails get org_admin
            WHEN NEW.email = 'admin@ballinthe6.com' THEN 'org_admin'::public.user_role
            WHEN NEW.email LIKE '%@ballinthe6.com' THEN 'org_admin'::public.user_role

            -- Check metadata user_role passed from signup form
            WHEN (NEW.raw_user_meta_data->>'user_role') = 'org_admin' THEN 'org_admin'::public.user_role
            WHEN (NEW.raw_user_meta_data->>'user_role') = 'league_admin' THEN 'league_admin'::public.user_role
            WHEN (NEW.raw_user_meta_data->>'user_role') = 'team_admin' THEN 'team_admin'::public.user_role
            WHEN (NEW.raw_user_meta_data->>'user_role') = 'coach' THEN 'coach'::public.user_role
            WHEN (NEW.raw_user_meta_data->>'user_role') = 'parent' THEN 'parent'::public.user_role
            WHEN (NEW.raw_user_meta_data->>'user_role') = 'player' THEN 'player'::public.user_role

            -- Default to fan
            ELSE 'fan'::public.user_role
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Example RLS policies for other tables (apply to your existing tables)

-- Teams: coaches and above can manage teams they're assigned to
-- CREATE POLICY "Team access by role" ON public.team
--     FOR ALL USING (
--         (SELECT role FROM public.users WHERE id = auth.uid()) IN ('org_admin', 'league_admin', 'team_admin', 'coach')
--     );

-- Games: coaches can manage, players/parents/fans can view
-- CREATE POLICY "Game read access" ON public.game
--     FOR SELECT USING (true);  -- Everyone can view games
--
-- CREATE POLICY "Game write access" ON public.game
--     FOR ALL USING (
--         (SELECT role FROM public.users WHERE id = auth.uid()) IN ('org_admin', 'league_admin', 'team_admin', 'coach')
--     );

-- Players: players see own data, coaches see their team's players, admins see all
-- CREATE POLICY "Player data access" ON public.player
--     FOR SELECT USING (
--         user_email = auth.jwt() ->> 'email'
--         OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('org_admin', 'league_admin', 'team_admin', 'coach', 'parent')
--     );

-- ============================================================
-- 6. Backfill existing admin user (run after creating user via Dashboard)
-- ============================================================
-- UPDATE public.users
-- SET role = 'org_admin', full_name = 'Demo Admin'
-- WHERE email = 'admin@ballinthe6.com';

-- ============================================================
-- JAVASCRIPT SIGNUP EXAMPLES
-- ============================================================
--
-- // Sign up as a player (default)
-- const { data, error } = await supabase.auth.signUp({
--   email: 'player@example.com',
--   password: 'password123',
--   options: {
--     data: {
--       full_name: 'John Player',
--       user_role: 'player'
--     }
--   }
-- });
--
-- // Sign up as a coach
-- const { data, error } = await supabase.auth.signUp({
--   email: 'coach@example.com',
--   password: 'password123',
--   options: {
--     data: {
--       full_name: 'Mike Coach',
--       user_role: 'coach'
--     }
--   }
-- });
--
-- // Sign up as org admin (admin@ballinthe6.com gets this automatically)
-- const { data, error } = await supabase.auth.signUp({
--   email: 'admin@ballinthe6.com',
--   password: 'Test1234!',
--   options: {
--     data: {
--       full_name: 'Demo Admin',
--       user_role: 'org_admin'
--     }
--   }
-- });
