// AI6 Scoring Engine - ENUW Portfolio

// Industry Classifications
export const TIER_1_INDUSTRIES = [
  "Roofing", "HVAC", "Plumbing", "Electrical", "Insurance",
  "Legal Services", "Medical", "Dental", "Real Estate",
  "Mortgage", "Financial Services", "Home Security", "Solar"
];

export const TIER_2_INDUSTRIES = [
  "Renovations", "Landscaping", "Cleaning", "Pest Control",
  "Auto Services", "Fitness", "Personal Training", "Accounting",
  "Bookkeeping", "Photography", "Event Planning", "Moving Services"
];

export const TIER_3_INDUSTRIES = [
  "Education", "Tutoring", "Nonprofit", "Religious",
  "HOA", "Property Management", "Retail", "Manufacturing",
  "Sports Organization"
];

// Geographic Classifications
export const GTA_CORE = ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill"];
export const ONTARIO_URBAN = ["Ottawa", "Hamilton", "London", "Kitchener", "Waterloo", "Windsor", "Oshawa", "Whitby", "Burlington"];
export const ONTARIO_SUBURBAN = ["Ajax", "Pickering", "Aurora", "Newmarket", "Milton"];

// Default Scoring Weights
export const DEFAULT_SCORING_WEIGHTS = {
  industry_fit: 0.25,
  mrr_potential: 0.20,
  digital_maturity: 0.15,
  geographic_value: 0.15,
  decision_authority: 0.10,
  service_alignment: 0.10,
  timing_signals: 0.05
};

// Legacy export for backwards compatibility
export const SCORING_WEIGHTS = DEFAULT_SCORING_WEIGHTS;

// Score Industry Fit
export function scoreIndustryFit(lead) {
  if (TIER_1_INDUSTRIES.includes(lead.industry)) {
    return { score: 95, evidence: `${lead.industry} = Tier 1 ICP` };
  }
  if (TIER_2_INDUSTRIES.includes(lead.industry)) {
    return { score: 70, evidence: `${lead.industry} = Tier 2 ICP` };
  }
  if (TIER_3_INDUSTRIES.includes(lead.industry)) {
    return { score: 55, evidence: `${lead.industry} = Tier 3 ICP` };
  }
  return { score: 40, evidence: "Unclassified industry" };
}

// Score MRR Potential
export function scoreMRRPotential(lead) {
  let score = 50;
  const evidence = [];

  if (TIER_1_INDUSTRIES.includes(lead.industry)) {
    score += 30;
    evidence.push("High-value industry");
  } else if (TIER_2_INDUSTRIES.includes(lead.industry)) {
    score += 15;
    evidence.push("Mid-value industry");
  }

  if (lead.employee_count > 20) {
    score += 10;
    evidence.push("Large team (20+)");
  } else if (lead.employee_count > 5) {
    score += 5;
    evidence.push("Medium team (5+)");
  }

  if (lead.years_in_business > 10) {
    score += 10;
    evidence.push("Established (10+ years)");
  } else if (lead.years_in_business > 3) {
    score += 5;
    evidence.push("Growing (3+ years)");
  }

  return { score: Math.min(100, score), evidence: evidence.join(", ") || "Base assessment" };
}

// Score Digital Maturity
export function scoreDigitalMaturity(lead) {
  let score = 50;
  let evidence = "";

  if (!lead.website || lead.website === "") {
    score = 95;
    evidence = "No website = HIGH priority for enuwWEB";
  } else if (lead.website.includes("wix") || lead.website.includes("squarespace")) {
    score = 75;
    evidence = "Template site, upgrade candidate";
  } else if (lead.website.includes("facebook.com") || lead.website.includes("instagram.com")) {
    score = 85;
    evidence = "Social only, needs real site";
  } else {
    score = 60;
    evidence = "Has website, may need refresh";
  }

  if (lead.google_review_count > 50 && lead.google_rating >= 4.5) {
    score -= 10;
    evidence += " | Digitally mature";
  } else if (lead.google_review_count < 10) {
    score += 10;
    evidence += " | Low digital presence";
  }

  return { score: Math.min(100, Math.max(0, score)), evidence };
}

// Score Geographic Value
export function scoreGeographicValue(lead) {
  if (GTA_CORE.includes(lead.city)) {
    return { score: 95, evidence: `${lead.city} = GTA Core market` };
  }
  if (ONTARIO_URBAN.includes(lead.city)) {
    return { score: 80, evidence: `${lead.city} = Ontario Urban` };
  }
  if (ONTARIO_SUBURBAN.includes(lead.city)) {
    return { score: 65, evidence: `${lead.city} = Ontario Suburban` };
  }
  return { score: 45, evidence: "Outside primary markets" };
}

// Score Decision Authority
export function scoreDecisionAuthority(lead) {
  let score = 50;
  let evidence = "";

  if (lead.owner_name && lead.contact_email?.toLowerCase().includes(lead.owner_name.toLowerCase())) {
    score = 90;
    evidence = "Direct owner contact confirmed";
  } else if (lead.contact_email?.startsWith("info@") || lead.contact_email?.startsWith("hello@")) {
    score = 50;
    evidence = "Generic email contact";
  } else if (lead.contact_email?.includes("admin") || lead.contact_email?.includes("contact")) {
    score = 60;
    evidence = "Administrative contact";
  } else if (lead.owner_name) {
    score = 85;
    evidence = "Owner name known";
  } else {
    score = 70;
    evidence = "Named contact, not confirmed owner";
  }

  return { score, evidence };
}

// Score Service Alignment
export function scoreServiceAlignment(lead) {
  let score = 70;
  let evidence = "";

  // Based on venture matching
  if (lead.venture === "enuwWEB" && (!lead.website || lead.website === "")) {
    score = 95;
    evidence = "Perfect fit for enuwWEB - no website";
  } else if (lead.venture === "Wear_US" && ["Sports Organization", "Fitness", "Personal Training"].includes(lead.industry)) {
    score = 90;
    evidence = "Apparel opportunity identified";
  } else if (lead.venture === "Ball_in_the_6" && lead.city === "Toronto" && lead.industry === "Sports Organization") {
    score = 95;
    evidence = "Toronto sports organization - perfect BiT6 fit";
  } else {
    evidence = "Standard service alignment";
  }

  return { score, evidence };
}

// Score Timing Signals
export function scoreTimingSignals(lead) {
  const currentMonth = new Date().getMonth();
  let score = 60;
  let evidence = "";

  // Q1 (Jan-Mar) and Q4 (Oct-Dec) are typically budget planning periods
  if (currentMonth >= 0 && currentMonth <= 2) {
    score = 80;
    evidence = "Q1 budget cycle - favorable timing";
  } else if (currentMonth >= 9 && currentMonth <= 11) {
    score = 75;
    evidence = "Q4 planning period";
  } else {
    evidence = "Standard timing";
  }

  // New businesses may be more receptive
  if (lead.years_in_business <= 2) {
    score += 10;
    evidence += " | New business, likely seeking services";
  }

  return { score: Math.min(100, score), evidence };
}

// Complete Scoring Function
export function scoreProspect(lead, customWeights = null) {
  // Use custom weights if provided, otherwise use defaults
  const weights = customWeights || DEFAULT_SCORING_WEIGHTS;
  
  const industryFit = scoreIndustryFit(lead);
  const mrrPotential = scoreMRRPotential(lead);
  const digitalMaturity = scoreDigitalMaturity(lead);
  const geographicValue = scoreGeographicValue(lead);
  const decisionAuthority = scoreDecisionAuthority(lead);
  const serviceAlignment = scoreServiceAlignment(lead);
  const timingSignals = scoreTimingSignals(lead);

  const scores = {
    industry_fit: industryFit,
    mrr_potential: mrrPotential,
    digital_maturity: digitalMaturity,
    geographic_value: geographicValue,
    decision_authority: decisionAuthority,
    service_alignment: serviceAlignment,
    timing_signals: timingSignals
  };

  let overall_score = 0;
  overall_score += industryFit.score * (weights.industry_fit_weight || weights.industry_fit || DEFAULT_SCORING_WEIGHTS.industry_fit);
  overall_score += mrrPotential.score * (weights.mrr_potential_weight || weights.mrr_potential || DEFAULT_SCORING_WEIGHTS.mrr_potential);
  overall_score += digitalMaturity.score * (weights.digital_maturity_weight || weights.digital_maturity || DEFAULT_SCORING_WEIGHTS.digital_maturity);
  overall_score += geographicValue.score * (weights.geographic_value_weight || weights.geographic_value || DEFAULT_SCORING_WEIGHTS.geographic_value);
  overall_score += decisionAuthority.score * (weights.decision_authority_weight || weights.decision_authority || DEFAULT_SCORING_WEIGHTS.decision_authority);
  overall_score += serviceAlignment.score * (weights.service_alignment_weight || weights.service_alignment || DEFAULT_SCORING_WEIGHTS.service_alignment);
  overall_score += timingSignals.score * (weights.timing_signals_weight || weights.timing_signals || DEFAULT_SCORING_WEIGHTS.timing_signals);

  const tier = overall_score >= 80 ? "Tier_1_Hot"
    : overall_score >= 60 ? "Tier_2_Warm"
    : "Tier_3_Monitor";

  const confidence = overall_score >= 85 ? "High"
    : overall_score >= 70 ? "Medium"
    : "Low";

  return {
    overall_score: Math.round(overall_score),
    tier,
    confidence,
    scores,
    projected_mrr: {
      conservative: tier === "Tier_1_Hot" ? 150 : tier === "Tier_2_Warm" ? 100 : 50,
      target: tier === "Tier_1_Hot" ? 175 : tier === "Tier_2_Warm" ? 125 : 75,
      stretch: tier === "Tier_1_Hot" ? 200 : tier === "Tier_2_Warm" ? 150 : 100
    }
  };
}

// Calculate Weighted Pipeline Value
export function calculateWeightedValue(dealValue, probability) {
  return (dealValue * probability) / 100;
}

// Get stage probability
export function getStageProbability(stage) {
  const probabilities = {
    "Discovery": 20,
    "Proposal": 40,
    "Negotiation": 60,
    "Contract": 80,
    "Closed_Won": 100,
    "Closed_Lost": 0
  };
  return probabilities[stage] || 20;
}

// Venture colors
export const VENTURE_COLORS = {
  "Vance": "#8B5CF6",
  "Ball_in_the_6": "#F97316",
  "Wear_US": "#10B981",
  "enuwWEB": "#3B82F6"
};

// Tier colors
export const TIER_COLORS = {
  "Tier_1_Hot": "#EF4444",
  "Tier_2_Warm": "#F59E0B",
  "Tier_3_Monitor": "#6B7280"
};

// Format currency
export function formatCurrency(value) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value?.toFixed(0) || 0}`;
}