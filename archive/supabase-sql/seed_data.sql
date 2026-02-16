-- ============================================================
-- SEED DATA: 2 Teams, 20 Players, 1 Game, 1 User
-- Run this in Supabase SQL Editor after the schema
-- ============================================================

-- Create 2 teams
INSERT INTO team (id, name, abbreviation, primary_color, gradient_start, gradient_end, sport, wins, losses)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Toronto Thunder', 'TOR', '#6366f1', '#4f46e5', '#818cf8', 'basketball', 8, 3),
  ('b2222222-2222-2222-2222-222222222222', 'Scarborough Lions', 'SCR', '#f59e42', '#ea580c', '#fb923c', 'basketball', 6, 5);

-- Create a game between the two teams (status = 'scheduled' so LiveGame can start it)
INSERT INTO game (id, sport, status, home_team_id, away_team_id, home_team_name, away_team_name, home_score, away_score, period, quarter, game_date, game_clock_seconds, home_timeouts, away_timeouts)
VALUES
  ('c3333333-3333-3333-3333-333333333333', 'basketball', 'scheduled',
   'a1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222',
   'Toronto Thunder', 'Scarborough Lions',
   0, 0, 1, 1, CURRENT_DATE, 600, 5, 5);

-- Create 10 players for Toronto Thunder (home)
INSERT INTO player (id, game_id, team_id, name, jersey_number, team, position, on_court, user_email)
VALUES
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Marcus Johnson', 1, 'home', 'PG', true, 'marcus.j@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Darnell Williams', 3, 'home', 'SG', true, 'darnell.w@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Jaylen Carter', 5, 'home', 'SF', true, 'jaylen.c@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Andre Davis', 12, 'home', 'PF', true, 'andre.d@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'DeShawn Thompson', 24, 'home', 'C', true, 'deshawn.t@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Tyler Brooks', 7, 'home', 'PG', false, 'tyler.b@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Kevin Harris', 11, 'home', 'SG', false, 'kevin.h@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Chris Walker', 15, 'home', 'SF', false, 'chris.w@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Brandon Lee', 22, 'home', 'PF', false, 'brandon.l@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Isaiah Martinez', 33, 'home', 'C', false, 'isaiah.m@example.com');

-- Create 10 players for Scarborough Lions (away)
INSERT INTO player (id, game_id, team_id, name, jersey_number, team, position, on_court, user_email)
VALUES
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Malik Robinson', 2, 'away', 'PG', true, 'malik.r@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Terrence Scott', 4, 'away', 'SG', true, 'terrence.s@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Jordan Mitchell', 10, 'away', 'SF', true, 'jordan.m@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Cameron Young', 14, 'away', 'PF', true, 'cameron.y@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Elijah Brown', 25, 'away', 'C', true, 'elijah.b@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Rashad Green', 6, 'away', 'PG', false, 'rashad.g@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Xavier King', 8, 'away', 'SG', false, 'xavier.k@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Aaron White', 13, 'away', 'SF', false, 'aaron.w@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Damien Taylor', 20, 'away', 'PF', false, 'damien.t@example.com'),
  (uuid_generate_v4(), 'c3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Troy Anderson', 30, 'away', 'C', false, 'troy.a@example.com');

-- Create a test user (via auth.users — use Supabase Dashboard "Authentication" to create a user instead)
-- The app uses Supabase Auth, so create a user via the Dashboard:
--   Email: admin@ballinthe6.com
--   Password: Test1234!
--   User metadata: { "full_name": "Demo Admin", "user_role": "org_admin" }
