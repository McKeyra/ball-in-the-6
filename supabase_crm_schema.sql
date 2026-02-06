-- =============================================================================
-- CRM Schema for Ball in the 6
-- Supabase/PostgreSQL compatible
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SPONSOR TABLE
-- Manages partner/sponsor pipeline for tracking sponsorship deals and
-- relationships. Supports multi-tenancy via org_id for organizations managing
-- multiple programs or leagues.
-- -----------------------------------------------------------------------------
CREATE TABLE sponsor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID,  -- Multi-tenancy: links sponsor to an organization
    company_name TEXT NOT NULL,
    industry TEXT,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    city TEXT,
    province TEXT,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost')),
    stage TEXT DEFAULT 'Discovery' CHECK (stage IN ('Discovery', 'Proposal', 'Negotiation', 'Contract', 'Closed_Won', 'Closed_Lost')),
    deal_value DECIMAL DEFAULT 0,
    probability INT DEFAULT 20 CHECK (probability >= 0 AND probability <= 100),
    sponsor_type TEXT CHECK (sponsor_type IN ('Title', 'Gold', 'Silver', 'Bronze', 'In_Kind', 'Media')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE sponsor IS 'Partner/sponsor pipeline for tracking sponsorship opportunities and deals';
COMMENT ON COLUMN sponsor.org_id IS 'Organization ID for multi-tenancy support';
COMMENT ON COLUMN sponsor.status IS 'Current status in the sales pipeline: New, Contacted, Qualified, Proposal, Negotiation, Won, Lost';
COMMENT ON COLUMN sponsor.stage IS 'Deal stage: Discovery, Proposal, Negotiation, Contract, Closed_Won, Closed_Lost';
COMMENT ON COLUMN sponsor.sponsor_type IS 'Sponsorship tier: Title, Gold, Silver, Bronze, In_Kind, Media';
COMMENT ON COLUMN sponsor.probability IS 'Likelihood of closing the deal (0-100%)';

-- Indexes for sponsor table
CREATE INDEX idx_sponsor_status ON sponsor(status);
CREATE INDEX idx_sponsor_stage ON sponsor(stage);
CREATE INDEX idx_sponsor_org_id ON sponsor(org_id);
CREATE INDEX idx_sponsor_sponsor_type ON sponsor(sponsor_type);

-- Enable RLS
ALTER TABLE sponsor ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sponsor
CREATE POLICY "Authenticated users can view sponsors"
    ON sponsor FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert sponsors"
    ON sponsor FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update sponsors"
    ON sponsor FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sponsors"
    ON sponsor FOR DELETE
    TO authenticated
    USING (true);


-- -----------------------------------------------------------------------------
-- TEAM_HEALTH_SCORE TABLE
-- Tracks comprehensive health metrics for teams across multiple dimensions
-- including payment, engagement, retention, roster, coaching, and satisfaction.
-- Used for identifying at-risk teams and prioritizing support.
-- -----------------------------------------------------------------------------
CREATE TABLE team_health_score (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL,
    overall_score INT CHECK (overall_score >= 0 AND overall_score <= 100),
    tier TEXT CHECK (tier IN ('Healthy', 'At_Risk', 'Critical')),
    confidence TEXT CHECK (confidence IN ('High', 'Medium', 'Low')),
    payment_score INT CHECK (payment_score >= 0 AND payment_score <= 100),
    payment_evidence TEXT,
    engagement_score INT CHECK (engagement_score >= 0 AND engagement_score <= 100),
    engagement_evidence TEXT,
    retention_score INT CHECK (retention_score >= 0 AND retention_score <= 100),
    retention_evidence TEXT,
    roster_score INT CHECK (roster_score >= 0 AND roster_score <= 100),
    roster_evidence TEXT,
    coach_activity_score INT CHECK (coach_activity_score >= 0 AND coach_activity_score <= 100),
    coach_activity_evidence TEXT,
    parent_satisfaction_score INT CHECK (parent_satisfaction_score >= 0 AND parent_satisfaction_score <= 100),
    parent_satisfaction_evidence TEXT,
    scored_by TEXT DEFAULT 'System',
    scored_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE team_health_score IS 'Comprehensive health metrics for teams to identify at-risk teams and track performance';
COMMENT ON COLUMN team_health_score.team_id IS 'Reference to the team being scored';
COMMENT ON COLUMN team_health_score.overall_score IS 'Aggregate health score (0-100)';
COMMENT ON COLUMN team_health_score.tier IS 'Health classification: Healthy, At_Risk, Critical';
COMMENT ON COLUMN team_health_score.confidence IS 'Confidence level in the score: High, Medium, Low';
COMMENT ON COLUMN team_health_score.scored_by IS 'Who/what generated the score (System or user ID)';

-- Indexes for team_health_score table
CREATE INDEX idx_team_health_score_team_id ON team_health_score(team_id);
CREATE INDEX idx_team_health_score_tier ON team_health_score(tier);
CREATE INDEX idx_team_health_score_scored_at ON team_health_score(scored_at);

-- Enable RLS
ALTER TABLE team_health_score ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_health_score
CREATE POLICY "Authenticated users can view team health scores"
    ON team_health_score FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert team health scores"
    ON team_health_score FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update team health scores"
    ON team_health_score FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete team health scores"
    ON team_health_score FOR DELETE
    TO authenticated
    USING (true);


-- -----------------------------------------------------------------------------
-- COMMUNICATION_LOG TABLE
-- Centralized logging of all communications with various entities (teams,
-- players, parents, sponsors). Supports tracking calls, emails, meetings,
-- notes, and SMS with outcomes and follow-up actions.
-- -----------------------------------------------------------------------------
CREATE TABLE communication_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('team', 'player', 'parent', 'sponsor')),
    entity_id UUID NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('Call', 'Email', 'Meeting', 'Note', 'SMS')),
    subject TEXT,
    description TEXT,
    outcome TEXT CHECK (outcome IN ('Positive', 'Neutral', 'Negative', 'No_Answer')),
    next_action_date DATE,
    completed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE communication_log IS 'Centralized log of all communications with teams, players, parents, and sponsors';
COMMENT ON COLUMN communication_log.entity_type IS 'Type of entity: team, player, parent, sponsor';
COMMENT ON COLUMN communication_log.entity_id IS 'UUID of the related entity';
COMMENT ON COLUMN communication_log.activity_type IS 'Type of communication: Call, Email, Meeting, Note, SMS';
COMMENT ON COLUMN communication_log.outcome IS 'Result of the communication: Positive, Neutral, Negative, No_Answer';
COMMENT ON COLUMN communication_log.next_action_date IS 'Scheduled date for follow-up action';
COMMENT ON COLUMN communication_log.completed_by IS 'User who logged the communication';

-- Indexes for communication_log table
CREATE INDEX idx_communication_log_entity_id ON communication_log(entity_id);
CREATE INDEX idx_communication_log_entity_type ON communication_log(entity_type);
CREATE INDEX idx_communication_log_activity_type ON communication_log(activity_type);
CREATE INDEX idx_communication_log_next_action_date ON communication_log(next_action_date);
CREATE INDEX idx_communication_log_created_at ON communication_log(created_at);

-- Composite index for entity lookups
CREATE INDEX idx_communication_log_entity ON communication_log(entity_type, entity_id);

-- Enable RLS
ALTER TABLE communication_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for communication_log
CREATE POLICY "Authenticated users can view communication logs"
    ON communication_log FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert communication logs"
    ON communication_log FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update communication logs"
    ON communication_log FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete communication logs"
    ON communication_log FOR DELETE
    TO authenticated
    USING (true);


-- -----------------------------------------------------------------------------
-- PROGRAM_VITALITY TABLE
-- Tracks program and league health metrics over time periods (weekly, monthly,
-- quarterly). Aggregates key performance indicators like registrations,
-- active teams, revenue, engagement, and retention rates.
-- -----------------------------------------------------------------------------
CREATE TABLE program_vitality (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID,
    league_id UUID,
    period TEXT CHECK (period IN ('weekly', 'monthly', 'quarterly')),
    period_start DATE,
    period_end DATE,
    vitality_score INT CHECK (vitality_score >= 0 AND vitality_score <= 100),
    registration_count INT,
    active_teams INT,
    revenue DECIMAL,
    engagement_rate DECIMAL CHECK (engagement_rate >= 0 AND engagement_rate <= 100),
    retention_rate DECIMAL CHECK (retention_rate >= 0 AND retention_rate <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE program_vitality IS 'Periodic health metrics for programs and leagues tracking KPIs over time';
COMMENT ON COLUMN program_vitality.program_id IS 'Reference to the program being measured';
COMMENT ON COLUMN program_vitality.league_id IS 'Reference to the league being measured';
COMMENT ON COLUMN program_vitality.period IS 'Reporting period: weekly, monthly, quarterly';
COMMENT ON COLUMN program_vitality.vitality_score IS 'Overall health score for the period (0-100)';
COMMENT ON COLUMN program_vitality.engagement_rate IS 'Percentage of active engagement (0-100)';
COMMENT ON COLUMN program_vitality.retention_rate IS 'Percentage of retention (0-100)';

-- Indexes for program_vitality table
CREATE INDEX idx_program_vitality_program_id ON program_vitality(program_id);
CREATE INDEX idx_program_vitality_league_id ON program_vitality(league_id);
CREATE INDEX idx_program_vitality_period ON program_vitality(period);
CREATE INDEX idx_program_vitality_period_dates ON program_vitality(period_start, period_end);
CREATE INDEX idx_program_vitality_created_at ON program_vitality(created_at);

-- Enable RLS
ALTER TABLE program_vitality ENABLE ROW LEVEL SECURITY;

-- RLS Policies for program_vitality
CREATE POLICY "Authenticated users can view program vitality"
    ON program_vitality FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert program vitality"
    ON program_vitality FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update program vitality"
    ON program_vitality FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete program vitality"
    ON program_vitality FOR DELETE
    TO authenticated
    USING (true);


-- -----------------------------------------------------------------------------
-- TRIGGER FUNCTION: Update updated_at timestamp
-- Automatically updates the updated_at column when a row is modified
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to sponsor table (only table with updated_at column)
CREATE TRIGGER trigger_sponsor_updated_at
    BEFORE UPDATE ON sponsor
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
