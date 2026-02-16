-- ============================================
-- SUPABASE SECURITY LINTS FIXES
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. FIX FUNCTION SEARCH PATH (3 functions)
-- ============================================

-- Fix update_daily_stars_updated_at
CREATE OR REPLACE FUNCTION public.update_daily_stars_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================
-- 2. FIX RLS POLICIES - ball_in_the_6 schema
-- Replace "USING (true)" with proper auth checks
-- ============================================

-- Helper: Check if user is authenticated
CREATE OR REPLACE FUNCTION ball_in_the_6.is_authenticated()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ball_in_the_6
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- Helper: Check if user is owner or admin
CREATE OR REPLACE FUNCTION ball_in_the_6.is_owner_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ball_in_the_6
AS $$
  SELECT EXISTS (
    SELECT 1 FROM ball_in_the_6.user_roles
    WHERE email = auth.jwt()->>'email'
    AND role IN ('owner', 'admin')
    AND is_active = TRUE
  );
$$;

-- Helper: Get current user's email
CREATE OR REPLACE FUNCTION ball_in_the_6.current_user_email()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = ball_in_the_6
AS $$
  SELECT auth.jwt()->>'email';
$$;

-- ============================================
-- APPLICATION table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to application" ON ball_in_the_6.application;
CREATE POLICY "Anyone can read applications" ON ball_in_the_6.application
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create applications" ON ball_in_the_6.application
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can update applications" ON ball_in_the_6.application
  FOR UPDATE USING (ball_in_the_6.is_owner_or_admin());
CREATE POLICY "Owners/admins can delete applications" ON ball_in_the_6.application
  FOR DELETE USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- ARTICLE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to article" ON ball_in_the_6.article;
CREATE POLICY "Anyone can read articles" ON ball_in_the_6.article
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage articles" ON ball_in_the_6.article
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- AWARD table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to award" ON ball_in_the_6.award;
CREATE POLICY "Anyone can read awards" ON ball_in_the_6.award
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage awards" ON ball_in_the_6.award
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- BACKGROUND_CHECK table (sensitive - restrict access)
-- ============================================
DROP POLICY IF EXISTS "Allow all access to background_check" ON ball_in_the_6.background_check;
CREATE POLICY "Owners/admins can read background checks" ON ball_in_the_6.background_check
  FOR SELECT USING (ball_in_the_6.is_owner_or_admin());
CREATE POLICY "Owners/admins can manage background checks" ON ball_in_the_6.background_check
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- COACH table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to coach" ON ball_in_the_6.coach;
CREATE POLICY "Anyone can read coaches" ON ball_in_the_6.coach
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage coaches" ON ball_in_the_6.coach
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- CODE_OF_CONDUCT table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to code_of_conduct" ON ball_in_the_6.code_of_conduct;
CREATE POLICY "Anyone can read code of conduct" ON ball_in_the_6.code_of_conduct
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage code of conduct" ON ball_in_the_6.code_of_conduct
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- COMMUNICATION_LOG table (sensitive)
-- ============================================
DROP POLICY IF EXISTS "Allow all access to communication_log" ON ball_in_the_6.communication_log;
CREATE POLICY "Owners/admins can access communication logs" ON ball_in_the_6.communication_log
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- EVALUATION table (sensitive)
-- ============================================
DROP POLICY IF EXISTS "Allow all access to evaluation" ON ball_in_the_6.evaluation;
CREATE POLICY "Owners/admins can access evaluations" ON ball_in_the_6.evaluation
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- EVENT table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to event" ON ball_in_the_6.event;
CREATE POLICY "Anyone can read events" ON ball_in_the_6.event
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can create events" ON ball_in_the_6.event
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can update/delete events" ON ball_in_the_6.event
  FOR UPDATE USING (ball_in_the_6.is_owner_or_admin());
CREATE POLICY "Owners/admins can delete events" ON ball_in_the_6.event
  FOR DELETE USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- FAN table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to fan" ON ball_in_the_6.fan;
CREATE POLICY "Anyone can read fans" ON ball_in_the_6.fan
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can create fan profile" ON ball_in_the_6.fan
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update fan profile" ON ball_in_the_6.fan
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ============================================
-- FAN_PAGE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to fan_page" ON ball_in_the_6.fan_page;
CREATE POLICY "Anyone can read fan pages" ON ball_in_the_6.fan_page
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage fan pages" ON ball_in_the_6.fan_page
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- FEEDBACK table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to feedback" ON ball_in_the_6.feedback;
CREATE POLICY "Authenticated can create feedback" ON ball_in_the_6.feedback
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can read feedback" ON ball_in_the_6.feedback
  FOR SELECT USING (ball_in_the_6.is_owner_or_admin());
CREATE POLICY "Owners/admins can manage feedback" ON ball_in_the_6.feedback
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- FORM_TEMPLATE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to form_template" ON ball_in_the_6.form_template;
CREATE POLICY "Anyone can read form templates" ON ball_in_the_6.form_template
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage form templates" ON ball_in_the_6.form_template
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- FORUM_POST table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to forum_post" ON ball_in_the_6.forum_post;
CREATE POLICY "Anyone can read forum posts" ON ball_in_the_6.forum_post
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can create forum posts" ON ball_in_the_6.forum_post
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update forum posts" ON ball_in_the_6.forum_post
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can delete forum posts" ON ball_in_the_6.forum_post
  FOR DELETE USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- FORUM_REPLY table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to forum_reply" ON ball_in_the_6.forum_reply;
CREATE POLICY "Anyone can read forum replies" ON ball_in_the_6.forum_reply
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can create replies" ON ball_in_the_6.forum_reply
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update replies" ON ball_in_the_6.forum_reply
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can delete replies" ON ball_in_the_6.forum_reply
  FOR DELETE USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- GALLERY table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to gallery" ON ball_in_the_6.gallery;
CREATE POLICY "Anyone can read gallery" ON ball_in_the_6.gallery
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage gallery" ON ball_in_the_6.gallery
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- GAME table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to game" ON ball_in_the_6.game;
CREATE POLICY "Anyone can read games" ON ball_in_the_6.game
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage games" ON ball_in_the_6.game
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- GAME_EVENT table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to game_event" ON ball_in_the_6.game_event;
CREATE POLICY "Anyone can read game events" ON ball_in_the_6.game_event
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can create game events" ON ball_in_the_6.game_event
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can manage game events" ON ball_in_the_6.game_event
  FOR UPDATE USING (ball_in_the_6.is_owner_or_admin());
CREATE POLICY "Owners/admins can delete game events" ON ball_in_the_6.game_event
  FOR DELETE USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- GAME_VOTE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to game_vote" ON ball_in_the_6.game_vote;
CREATE POLICY "Anyone can read game votes" ON ball_in_the_6.game_vote
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can vote" ON ball_in_the_6.game_vote
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update votes" ON ball_in_the_6.game_vote
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ============================================
-- LEAGUE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to league" ON ball_in_the_6.league;
CREATE POLICY "Anyone can read leagues" ON ball_in_the_6.league
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage leagues" ON ball_in_the_6.league
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- LIVE_STAT table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to live_stat" ON ball_in_the_6.live_stat;
CREATE POLICY "Anyone can read live stats" ON ball_in_the_6.live_stat
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can create live stats" ON ball_in_the_6.live_stat
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can manage live stats" ON ball_in_the_6.live_stat
  FOR UPDATE USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- LOCATION table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to location" ON ball_in_the_6.location;
CREATE POLICY "Anyone can read locations" ON ball_in_the_6.location
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage locations" ON ball_in_the_6.location
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- MEDICAL_FORM table (sensitive)
-- ============================================
DROP POLICY IF EXISTS "Allow all access to medical_form" ON ball_in_the_6.medical_form;
CREATE POLICY "Owners/admins can access medical forms" ON ball_in_the_6.medical_form
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- MESSAGE table (sensitive)
-- ============================================
DROP POLICY IF EXISTS "Allow all access to message" ON ball_in_the_6.message;
CREATE POLICY "Authenticated can access messages" ON ball_in_the_6.message
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can send messages" ON ball_in_the_6.message
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can manage messages" ON ball_in_the_6.message
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- OPPONENT table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to opponent" ON ball_in_the_6.opponent;
CREATE POLICY "Anyone can read opponents" ON ball_in_the_6.opponent
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage opponents" ON ball_in_the_6.opponent
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- ORGANIZATION table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to organization" ON ball_in_the_6.organization;
CREATE POLICY "Anyone can read organizations" ON ball_in_the_6.organization
  FOR SELECT USING (true);
CREATE POLICY "Owners can manage organizations" ON ball_in_the_6.organization
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ball_in_the_6.user_roles
      WHERE email = auth.jwt()->>'email'
      AND role = 'owner'
      AND is_active = TRUE
    )
  );

-- ============================================
-- PARENT_PROFILE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to parent_profile" ON ball_in_the_6.parent_profile;
CREATE POLICY "Authenticated can read parent profiles" ON ball_in_the_6.parent_profile
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update parent profiles" ON ball_in_the_6.parent_profile
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can create parent profile" ON ball_in_the_6.parent_profile
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- PERSISTENT_PLAYER table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to persistent_player" ON ball_in_the_6.persistent_player;
CREATE POLICY "Anyone can read persistent players" ON ball_in_the_6.persistent_player
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage persistent players" ON ball_in_the_6.persistent_player
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- PLAYER table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to player" ON ball_in_the_6.player;
CREATE POLICY "Anyone can read players" ON ball_in_the_6.player
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage players" ON ball_in_the_6.player
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- PLAYER_BASE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to player_base" ON ball_in_the_6.player_base;
CREATE POLICY "Anyone can read player base" ON ball_in_the_6.player_base
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage player base" ON ball_in_the_6.player_base
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- PLAYER_PROFILE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to player_profile" ON ball_in_the_6.player_profile;
CREATE POLICY "Anyone can read player profiles" ON ball_in_the_6.player_profile
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can update player profiles" ON ball_in_the_6.player_profile
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can create player profile" ON ball_in_the_6.player_profile
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- PLAYER_STAT table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to player_stat" ON ball_in_the_6.player_stat;
CREATE POLICY "Anyone can read player stats" ON ball_in_the_6.player_stat
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage player stats" ON ball_in_the_6.player_stat
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- POLL table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to poll" ON ball_in_the_6.poll;
CREATE POLICY "Anyone can read polls" ON ball_in_the_6.poll
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can vote on polls" ON ball_in_the_6.poll
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can manage polls" ON ball_in_the_6.poll
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- POST table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to post" ON ball_in_the_6.post;
CREATE POLICY "Anyone can read posts" ON ball_in_the_6.post
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can create posts" ON ball_in_the_6.post
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update posts" ON ball_in_the_6.post
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can delete posts" ON ball_in_the_6.post
  FOR DELETE USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- PRODUCT table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to product" ON ball_in_the_6.product;
CREATE POLICY "Anyone can read products" ON ball_in_the_6.product
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage products" ON ball_in_the_6.product
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- PROGRAM table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to program" ON ball_in_the_6.program;
CREATE POLICY "Anyone can read programs" ON ball_in_the_6.program
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage programs" ON ball_in_the_6.program
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- PROGRAM_REGISTRATION table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to program_registration" ON ball_in_the_6.program_registration;
CREATE POLICY "Authenticated can read registrations" ON ball_in_the_6.program_registration
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can register" ON ball_in_the_6.program_registration
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can manage registrations" ON ball_in_the_6.program_registration
  FOR UPDATE USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- PROGRAM_VITALITY table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to program_vitality" ON ball_in_the_6.program_vitality;
CREATE POLICY "Anyone can read program vitality" ON ball_in_the_6.program_vitality
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage program vitality" ON ball_in_the_6.program_vitality
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- QUERY table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to query" ON ball_in_the_6.query;
CREATE POLICY "Owners/admins can access queries" ON ball_in_the_6.query
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- REFEREE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to referee" ON ball_in_the_6.referee;
CREATE POLICY "Anyone can read referees" ON ball_in_the_6.referee
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage referees" ON ball_in_the_6.referee
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- SCHEDULE_ITEM table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to schedule_item" ON ball_in_the_6.schedule_item;
CREATE POLICY "Anyone can read schedule items" ON ball_in_the_6.schedule_item
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage schedule items" ON ball_in_the_6.schedule_item
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- SOCIAL_POST table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to social_post" ON ball_in_the_6.social_post;
CREATE POLICY "Anyone can read social posts" ON ball_in_the_6.social_post
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can create social posts" ON ball_in_the_6.social_post
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update social posts" ON ball_in_the_6.social_post
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can delete social posts" ON ball_in_the_6.social_post
  FOR DELETE USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- SPONSOR table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to sponsor" ON ball_in_the_6.sponsor;
CREATE POLICY "Anyone can read sponsors" ON ball_in_the_6.sponsor
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage sponsors" ON ball_in_the_6.sponsor
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- SURVEY table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to survey" ON ball_in_the_6.survey;
CREATE POLICY "Anyone can read surveys" ON ball_in_the_6.survey
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can submit surveys" ON ball_in_the_6.survey
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can manage surveys" ON ball_in_the_6.survey
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- TEAM table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to team" ON ball_in_the_6.team;
CREATE POLICY "Anyone can read teams" ON ball_in_the_6.team
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage teams" ON ball_in_the_6.team
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- TEAM_HEALTH_SCORE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to team_health_score" ON ball_in_the_6.team_health_score;
CREATE POLICY "Owners/admins can access team health scores" ON ball_in_the_6.team_health_score
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- TEAM_MEMBER table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to team_member" ON ball_in_the_6.team_member;
CREATE POLICY "Anyone can read team members" ON ball_in_the_6.team_member
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage team members" ON ball_in_the_6.team_member
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- TEAM_STORE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to team_store" ON ball_in_the_6.team_store;
CREATE POLICY "Anyone can read team store" ON ball_in_the_6.team_store
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage team store" ON ball_in_the_6.team_store
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- TRAINING_PLAN table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to training_plan" ON ball_in_the_6.training_plan;
CREATE POLICY "Anyone can read training plans" ON ball_in_the_6.training_plan
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage training plans" ON ball_in_the_6.training_plan
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- TRYOUT_REGISTRATION table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to tryout_registration" ON ball_in_the_6.tryout_registration;
CREATE POLICY "Authenticated can read tryout registrations" ON ball_in_the_6.tryout_registration
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can register for tryouts" ON ball_in_the_6.tryout_registration
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners/admins can manage tryout registrations" ON ball_in_the_6.tryout_registration
  FOR UPDATE USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- USER_PROFILE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to user_profile" ON ball_in_the_6.user_profile;
CREATE POLICY "Authenticated can read user profiles" ON ball_in_the_6.user_profile
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update user profiles" ON ball_in_the_6.user_profile
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can create profile" ON ball_in_the_6.user_profile
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- USER_ROLES table (already has proper policies from previous setup)
-- Just ensure they're correct
-- ============================================
DROP POLICY IF EXISTS "Allow all access to user_roles" ON ball_in_the_6.user_roles;
-- Keep existing policies from supabase-roles.sql

-- ============================================
-- VENUE table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to venue" ON ball_in_the_6.venue;
CREATE POLICY "Anyone can read venues" ON ball_in_the_6.venue
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage venues" ON ball_in_the_6.venue
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- VIDEO_ANALYSIS table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to video_analysis" ON ball_in_the_6.video_analysis;
CREATE POLICY "Anyone can read video analysis" ON ball_in_the_6.video_analysis
  FOR SELECT USING (true);
CREATE POLICY "Owners/admins can manage video analysis" ON ball_in_the_6.video_analysis
  FOR ALL USING (ball_in_the_6.is_owner_or_admin());

-- ============================================
-- VOLUNTEER table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to volunteer" ON ball_in_the_6.volunteer;
CREATE POLICY "Anyone can read volunteers" ON ball_in_the_6.volunteer
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can volunteer" ON ball_in_the_6.volunteer
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update volunteer record" ON ball_in_the_6.volunteer
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ============================================
-- WAIVER_CONSENT table
-- ============================================
DROP POLICY IF EXISTS "Allow all access to waiver_consent" ON ball_in_the_6.waiver_consent;
CREATE POLICY "Authenticated can read waivers" ON ball_in_the_6.waiver_consent
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can sign waivers" ON ball_in_the_6.waiver_consent
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- 3. FIX HW SCHEMA TABLES (if needed)
-- ============================================

-- Helper function for hw schema
CREATE OR REPLACE FUNCTION hw.is_authenticated()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = hw
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- DAILY_STARS
DROP POLICY IF EXISTS "Allow all access to daily_stars" ON hw.daily_stars;
CREATE POLICY "Anyone can read daily stars" ON hw.daily_stars
  FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage daily stars" ON hw.daily_stars
  FOR ALL USING (auth.uid() IS NOT NULL);

-- FAMILY_MEMBERS
DROP POLICY IF EXISTS "Allow all access to family_members" ON hw.family_members;
CREATE POLICY "Authenticated can access family members" ON hw.family_members
  FOR ALL USING (auth.uid() IS NOT NULL);

-- RECURRING_TASKS
DROP POLICY IF EXISTS "Allow all access to recurring_tasks" ON hw.recurring_tasks;
CREATE POLICY "Authenticated can access recurring tasks" ON hw.recurring_tasks
  FOR ALL USING (auth.uid() IS NOT NULL);

-- ROUTINE_COMPLETIONS
DROP POLICY IF EXISTS "Allow all access to routine_completions" ON hw.routine_completions;
CREATE POLICY "Authenticated can access routine completions" ON hw.routine_completions
  FOR ALL USING (auth.uid() IS NOT NULL);

-- ROUTINE_TASKS
DROP POLICY IF EXISTS "Allow all access to routine_tasks" ON hw.routine_tasks;
CREATE POLICY "Authenticated can access routine tasks" ON hw.routine_tasks
  FOR ALL USING (auth.uid() IS NOT NULL);

-- ROUTINE_TEMPLATES
DROP POLICY IF EXISTS "Allow all access to routine_templates" ON hw.routine_templates;
CREATE POLICY "Authenticated can access routine templates" ON hw.routine_templates
  FOR ALL USING (auth.uid() IS NOT NULL);

-- TASK_COMPLETIONS
DROP POLICY IF EXISTS "Allow all access to task_completions" ON hw.task_completions;
CREATE POLICY "Authenticated can access task completions" ON hw.task_completions
  FOR ALL USING (auth.uid() IS NOT NULL);

-- ============================================
-- 4. ENABLE LEAKED PASSWORD PROTECTION
-- This must be done in Supabase Dashboard:
-- Go to: Authentication > Settings > Security
-- Enable "Leaked Password Protection"
-- ============================================

-- Verification query - run after to check remaining issues
SELECT
  'Remaining always-true policies' as check_type,
  COUNT(*) as count
FROM pg_policies
WHERE qual = 'true'
  AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL');
