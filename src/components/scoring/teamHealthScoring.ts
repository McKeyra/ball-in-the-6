// Ball in the 6 - Team Health Scoring Engine

export const HEALTH_TIERS = {
  HEALTHY: 'Healthy',
  AT_RISK: 'At_Risk',
  CRITICAL: 'Critical',
} as const;

type HealthTier = (typeof HEALTH_TIERS)[keyof typeof HEALTH_TIERS];

export const ROSTER_REQUIREMENTS: Record<string, { min: number; max: number }> = {
  U8: { min: 8, max: 12 },
  U10: { min: 10, max: 15 },
  U12: { min: 10, max: 15 },
  U14: { min: 10, max: 15 },
  U16: { min: 10, max: 15 },
  U18: { min: 10, max: 15 },
  Adult: { min: 10, max: 18 },
  Default: { min: 10, max: 15 },
};

export const PAYMENT_STATUS = {
  PAID: 'Paid',
  PARTIAL: 'Partial',
  OVERDUE: 'Overdue',
  DELINQUENT: 'Delinquent',
} as const;

export const DEFAULT_SCORING_WEIGHTS = {
  payment_health: 0.25,
  engagement: 0.2,
  retention: 0.2,
  roster_completeness: 0.15,
  coach_activity: 0.1,
  parent_satisfaction: 0.1,
} as const;

export const SCORING_WEIGHTS = DEFAULT_SCORING_WEIGHTS;

interface ScoreResult {
  score: number;
  evidence: string;
}

interface TeamData {
  paid_percentage?: number;
  overdue_amount?: number;
  delinquent_players?: number;
  game_attendance_rate?: number;
  practice_attendance_rate?: number;
  returning_players_percentage?: number;
  seasons_active?: number;
  division?: string;
  roster_size?: number;
  registered_players?: number;
  coach_logins_last_30_days?: number;
  roster_updates_last_30_days?: number;
  coach_messages_sent?: number;
  practices_scheduled?: number;
  parent_feedback_score?: number | null;
  feedback_responses?: number;
  complaints_count?: number;
}

interface ScoringWeights {
  payment_health?: number;
  payment_health_weight?: number;
  engagement?: number;
  engagement_weight?: number;
  retention?: number;
  retention_weight?: number;
  roster_completeness?: number;
  roster_completeness_weight?: number;
  coach_activity?: number;
  coach_activity_weight?: number;
  parent_satisfaction?: number;
  parent_satisfaction_weight?: number;
}

interface Recommendation {
  priority: string;
  dimension: string;
  action: string;
}

interface TeamHealthResult {
  overall_score: number;
  tier: HealthTier;
  confidence: string;
  scores: Record<string, ScoreResult>;
  recommendations: Recommendation[];
}

interface LeagueHealthResult {
  overall_score: number;
  tier: HealthTier;
  team_breakdown: {
    healthy: number;
    at_risk: number;
    critical: number;
  };
  dimension_averages: Record<string, number>;
  teams_scored?: TeamHealthResult[];
}

export function scorePaymentHealth(team: TeamData): ScoreResult {
  let score = 100;
  const evidence: string[] = [];

  const paidPercentage = team.paid_percentage ?? 100;
  const overdueAmount = team.overdue_amount ?? 0;
  const delinquentCount = team.delinquent_players ?? 0;

  if (paidPercentage >= 95) {
    score = 100;
    evidence.push('Excellent payment compliance (95%+)');
  } else if (paidPercentage >= 80) {
    score = 80;
    evidence.push(`Good payment status (${paidPercentage}% paid)`);
  } else if (paidPercentage >= 60) {
    score = 60;
    evidence.push(`Payment concerns (${paidPercentage}% paid)`);
  } else {
    score = 40;
    evidence.push(`Critical payment issues (${paidPercentage}% paid)`);
  }

  if (overdueAmount > 5000) {
    score -= 20;
    evidence.push(`High overdue: ${formatCurrency(overdueAmount)}`);
  } else if (overdueAmount > 2000) {
    score -= 10;
    evidence.push(`Moderate overdue: ${formatCurrency(overdueAmount)}`);
  } else if (overdueAmount > 0) {
    score -= 5;
    evidence.push(`Minor overdue: ${formatCurrency(overdueAmount)}`);
  }

  if (delinquentCount > 3) {
    score -= 10;
    evidence.push(`${delinquentCount} delinquent players`);
  } else if (delinquentCount > 0) {
    score -= 5;
    evidence.push(`${delinquentCount} delinquent player(s)`);
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    evidence: evidence.join(' | ') || 'Payment data unavailable',
  };
}

export function scoreEngagement(team: TeamData): ScoreResult {
  let score = 50;
  const evidence: string[] = [];

  const gameAttendance = team.game_attendance_rate ?? 0;
  const practiceAttendance = team.practice_attendance_rate ?? 0;

  if (gameAttendance >= 90) {
    score += 30;
    evidence.push(`Excellent game attendance (${gameAttendance}%)`);
  } else if (gameAttendance >= 75) {
    score += 20;
    evidence.push(`Good game attendance (${gameAttendance}%)`);
  } else if (gameAttendance >= 50) {
    score += 10;
    evidence.push(`Fair game attendance (${gameAttendance}%)`);
  } else if (gameAttendance > 0) {
    evidence.push(`Low game attendance (${gameAttendance}%)`);
  } else {
    evidence.push('No game attendance data');
  }

  if (practiceAttendance >= 85) {
    score += 20;
    evidence.push(`Excellent practice attendance (${practiceAttendance}%)`);
  } else if (practiceAttendance >= 70) {
    score += 15;
    evidence.push(`Good practice attendance (${practiceAttendance}%)`);
  } else if (practiceAttendance >= 50) {
    score += 5;
    evidence.push(`Fair practice attendance (${practiceAttendance}%)`);
  } else if (practiceAttendance > 0) {
    evidence.push(`Low practice attendance (${practiceAttendance}%)`);
  } else {
    evidence.push('No practice attendance data');
  }

  return {
    score: Math.min(100, score),
    evidence: evidence.join(' | ') || 'Engagement data unavailable',
  };
}

export function scoreRetention(team: TeamData): ScoreResult {
  let score = 50;
  let evidence = '';

  const returningPercentage = team.returning_players_percentage ?? 0;
  const seasonCount = team.seasons_active ?? 1;

  if (returningPercentage >= 80) {
    score = 95;
    evidence = `Excellent retention (${returningPercentage}% returning)`;
  } else if (returningPercentage >= 60) {
    score = 75;
    evidence = `Good retention (${returningPercentage}% returning)`;
  } else if (returningPercentage >= 40) {
    score = 55;
    evidence = `Moderate retention (${returningPercentage}% returning)`;
  } else if (returningPercentage > 0) {
    score = 35;
    evidence = `Low retention (${returningPercentage}% returning)`;
  } else if (seasonCount <= 1) {
    score = 70;
    evidence = 'New team - no retention history';
  } else {
    score = 30;
    evidence = 'Poor retention - needs attention';
  }

  if (seasonCount >= 5) {
    score += 5;
    evidence += ` | Established team (${seasonCount} seasons)`;
  }

  return {
    score: Math.min(100, score),
    evidence,
  };
}

export function scoreRosterCompleteness(team: TeamData): ScoreResult {
  const division = team.division || 'Default';
  const requirements = ROSTER_REQUIREMENTS[division] || ROSTER_REQUIREMENTS.Default;
  const rosterSize = team.roster_size ?? 0;
  const registeredPlayers = team.registered_players ?? rosterSize;

  let score = 50;
  let evidence = '';

  if (rosterSize >= requirements.min && rosterSize <= requirements.max) {
    score = 100;
    evidence = `Optimal roster size (${rosterSize}/${requirements.min}-${requirements.max})`;
  } else if (rosterSize >= requirements.min - 2 && rosterSize < requirements.min) {
    score = 70;
    evidence = `Slightly under roster minimum (${rosterSize}/${requirements.min})`;
  } else if (rosterSize > requirements.max) {
    score = 75;
    evidence = `Over maximum roster (${rosterSize}/${requirements.max})`;
  } else if (rosterSize >= Math.floor(requirements.min * 0.6)) {
    score = 50;
    evidence = `Under-rostered (${rosterSize}/${requirements.min})`;
  } else if (rosterSize > 0) {
    score = 25;
    evidence = `Critical roster shortage (${rosterSize}/${requirements.min})`;
  } else {
    score = 0;
    evidence = 'No players registered';
  }

  if (registeredPlayers < rosterSize) {
    const incomplete = rosterSize - registeredPlayers;
    score -= 10;
    evidence += ` | ${incomplete} incomplete registration(s)`;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    evidence,
  };
}

export function scoreCoachActivity(team: TeamData): ScoreResult {
  let score = 50;
  const evidence: string[] = [];

  const coachLogins = team.coach_logins_last_30_days ?? 0;
  const rosterUpdates = team.roster_updates_last_30_days ?? 0;
  const messagesSent = team.coach_messages_sent ?? 0;

  if (coachLogins >= 10) {
    score += 25;
    evidence.push(`Active coach (${coachLogins} logins/month)`);
  } else if (coachLogins >= 5) {
    score += 15;
    evidence.push(`Engaged coach (${coachLogins} logins/month)`);
  } else if (coachLogins >= 1) {
    score += 5;
    evidence.push(`Minimal coach activity (${coachLogins} logins/month)`);
  } else {
    evidence.push('No coach logins in 30 days');
  }

  if (rosterUpdates >= 3) {
    score += 15;
    evidence.push('Active roster management');
  } else if (rosterUpdates >= 1) {
    score += 10;
    evidence.push('Some roster updates');
  }

  if (messagesSent >= 5) {
    score += 10;
    evidence.push('Good team communication');
  } else if (messagesSent >= 1) {
    score += 5;
    evidence.push('Some team communication');
  }

  return {
    score: Math.min(100, score),
    evidence: evidence.join(' | ') || 'No coach activity data',
  };
}

export function scoreParentSatisfaction(team: TeamData): ScoreResult {
  let score = 70;
  let evidence = '';

  const feedbackScore = team.parent_feedback_score ?? null;
  const feedbackCount = team.feedback_responses ?? 0;
  const complaintsCount = team.complaints_count ?? 0;

  if (feedbackScore !== null) {
    if (feedbackScore >= 4.5) {
      score = 100;
      evidence = `Excellent satisfaction (${feedbackScore}/5)`;
    } else if (feedbackScore >= 4.0) {
      score = 85;
      evidence = `Good satisfaction (${feedbackScore}/5)`;
    } else if (feedbackScore >= 3.5) {
      score = 70;
      evidence = `Moderate satisfaction (${feedbackScore}/5)`;
    } else if (feedbackScore >= 3.0) {
      score = 55;
      evidence = `Below average satisfaction (${feedbackScore}/5)`;
    } else {
      score = 40;
      evidence = `Poor satisfaction (${feedbackScore}/5)`;
    }

    if (feedbackCount < 5) {
      evidence += ' (limited responses)';
    }
  } else {
    score = 60;
    evidence = 'No feedback data available';
  }

  if (complaintsCount >= 3) {
    score -= 20;
    evidence += ` | ${complaintsCount} complaints filed`;
  } else if (complaintsCount >= 1) {
    score -= 10;
    evidence += ` | ${complaintsCount} complaint(s) filed`;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    evidence,
  };
}

export function scoreTeamHealth(
  team: TeamData,
  customWeights: ScoringWeights | null = null
): TeamHealthResult {
  const weights: ScoringWeights = customWeights || { ...DEFAULT_SCORING_WEIGHTS };

  const paymentHealth = scorePaymentHealth(team);
  const engagement = scoreEngagement(team);
  const retention = scoreRetention(team);
  const rosterCompleteness = scoreRosterCompleteness(team);
  const coachActivity = scoreCoachActivity(team);
  const parentSatisfaction = scoreParentSatisfaction(team);

  const scores: Record<string, ScoreResult> = {
    payment_health: paymentHealth,
    engagement,
    retention,
    roster_completeness: rosterCompleteness,
    coach_activity: coachActivity,
    parent_satisfaction: parentSatisfaction,
  };

  let overall_score = 0;
  overall_score +=
    paymentHealth.score *
    (weights.payment_health_weight || weights.payment_health || DEFAULT_SCORING_WEIGHTS.payment_health);
  overall_score +=
    engagement.score *
    (weights.engagement_weight || weights.engagement || DEFAULT_SCORING_WEIGHTS.engagement);
  overall_score +=
    retention.score *
    (weights.retention_weight || weights.retention || DEFAULT_SCORING_WEIGHTS.retention);
  overall_score +=
    rosterCompleteness.score *
    (weights.roster_completeness_weight ||
      weights.roster_completeness ||
      DEFAULT_SCORING_WEIGHTS.roster_completeness);
  overall_score +=
    coachActivity.score *
    (weights.coach_activity_weight || weights.coach_activity || DEFAULT_SCORING_WEIGHTS.coach_activity);
  overall_score +=
    parentSatisfaction.score *
    (weights.parent_satisfaction_weight ||
      weights.parent_satisfaction ||
      DEFAULT_SCORING_WEIGHTS.parent_satisfaction);

  const tier: HealthTier =
    overall_score >= 80
      ? HEALTH_TIERS.HEALTHY
      : overall_score >= 60
        ? HEALTH_TIERS.AT_RISK
        : HEALTH_TIERS.CRITICAL;

  const confidence =
    overall_score >= 85 ? 'High' : overall_score >= 70 ? 'Medium' : 'Low';

  return {
    overall_score: Math.round(overall_score),
    tier,
    confidence,
    scores,
    recommendations: generateRecommendations(scores, tier),
  };
}

function generateRecommendations(
  scores: Record<string, ScoreResult>,
  _tier: HealthTier
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (scores.payment_health.score < 70) {
    recommendations.push({
      priority: 'High',
      dimension: 'payment_health',
      action: 'Review payment collection process and follow up with overdue accounts',
    });
  }

  if (scores.engagement.score < 60) {
    recommendations.push({
      priority: 'High',
      dimension: 'engagement',
      action: 'Increase team communication and address attendance barriers',
    });
  }

  if (scores.retention.score < 60) {
    recommendations.push({
      priority: 'Medium',
      dimension: 'retention',
      action: 'Survey departing players and implement retention initiatives',
    });
  }

  if (scores.roster_completeness.score < 70) {
    recommendations.push({
      priority: 'High',
      dimension: 'roster_completeness',
      action: 'Prioritize player recruitment to meet roster requirements',
    });
  }

  if (scores.coach_activity.score < 50) {
    recommendations.push({
      priority: 'Medium',
      dimension: 'coach_activity',
      action: 'Check in with coach and provide platform training if needed',
    });
  }

  if (scores.parent_satisfaction.score < 60) {
    recommendations.push({
      priority: 'Medium',
      dimension: 'parent_satisfaction',
      action: 'Address parent concerns and improve communication',
    });
  }

  return recommendations;
}

export const TIER_COLORS: Record<HealthTier, string> = {
  [HEALTH_TIERS.HEALTHY]: '#10B981',
  [HEALTH_TIERS.AT_RISK]: '#F59E0B',
  [HEALTH_TIERS.CRITICAL]: '#EF4444',
};

export const BRAND_COLORS = {
  primary: '#1a1a2e',
  accent: '#c9a962',
  secondary: '#4a4a6a',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
} as const;

export const DIVISION_COLORS: Record<string, string> = {
  U8: '#8B5CF6',
  U10: '#06B6D4',
  U12: '#10B981',
  U14: '#F97316',
  U16: '#EC4899',
  U18: '#3B82F6',
  Adult: '#c9a962',
};

export const CONFIDENCE_COLORS: Record<string, string> = {
  High: '#10B981',
  Medium: '#F59E0B',
  Low: '#6B7280',
};

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value?.toFixed(0) || 0}`;
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return `${Math.round(value)}%`;
}

export function getTierFromScore(score: number): HealthTier {
  if (score >= 80) return HEALTH_TIERS.HEALTHY;
  if (score >= 60) return HEALTH_TIERS.AT_RISK;
  return HEALTH_TIERS.CRITICAL;
}

export function getTierColor(tier: HealthTier): string {
  return TIER_COLORS[tier] || TIER_COLORS[HEALTH_TIERS.AT_RISK];
}

export function getScoreColor(score: number): string {
  if (score >= 80) return TIER_COLORS[HEALTH_TIERS.HEALTHY];
  if (score >= 60) return TIER_COLORS[HEALTH_TIERS.AT_RISK];
  return TIER_COLORS[HEALTH_TIERS.CRITICAL];
}

export function calculateLeagueHealth(teams: TeamData[]): LeagueHealthResult {
  if (!teams || teams.length === 0) {
    return {
      overall_score: 0,
      tier: HEALTH_TIERS.CRITICAL,
      team_breakdown: {
        healthy: 0,
        at_risk: 0,
        critical: 0,
      },
      dimension_averages: {},
    };
  }

  const teamScores = teams.map((team) => scoreTeamHealth(team));
  const avgScore =
    teamScores.reduce((sum, t) => sum + t.overall_score, 0) / teams.length;

  const breakdown = {
    healthy: teamScores.filter((t) => t.tier === HEALTH_TIERS.HEALTHY).length,
    at_risk: teamScores.filter((t) => t.tier === HEALTH_TIERS.AT_RISK).length,
    critical: teamScores.filter((t) => t.tier === HEALTH_TIERS.CRITICAL).length,
  };

  const dimensionAverages: Record<string, number> = {
    payment_health:
      teamScores.reduce((sum, t) => sum + t.scores.payment_health.score, 0) /
      teams.length,
    engagement:
      teamScores.reduce((sum, t) => sum + t.scores.engagement.score, 0) /
      teams.length,
    retention:
      teamScores.reduce((sum, t) => sum + t.scores.retention.score, 0) /
      teams.length,
    roster_completeness:
      teamScores.reduce((sum, t) => sum + t.scores.roster_completeness.score, 0) /
      teams.length,
    coach_activity:
      teamScores.reduce((sum, t) => sum + t.scores.coach_activity.score, 0) /
      teams.length,
    parent_satisfaction:
      teamScores.reduce((sum, t) => sum + t.scores.parent_satisfaction.score, 0) /
      teams.length,
  };

  return {
    overall_score: Math.round(avgScore),
    tier: getTierFromScore(avgScore),
    team_breakdown: breakdown,
    dimension_averages: dimensionAverages,
    teams_scored: teamScores,
  };
}
