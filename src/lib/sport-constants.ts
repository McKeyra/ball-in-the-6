export const SPORTS = {
  BASKETBALL: 'basketball',
  HOCKEY: 'hockey',
  VOLLEYBALL: 'volleyball',
  BASEBALL: 'baseball',
  SOCCER: 'soccer',
  CRICKET: 'cricket',
  TRACK_FIELD: 'track-field',
  FOOTBALL: 'football',
  SWIMMING: 'swimming',
  LACROSSE: 'lacrosse',
} as const;

export type SportId = (typeof SPORTS)[keyof typeof SPORTS];

export const SPORT_META: Record<string, { name: string; emoji: string; color: string }> = {
  basketball: { name: 'Basketball', emoji: '\u{1F3C0}', color: '#FF6B35' },
  hockey: { name: 'Hockey', emoji: '\u{1F3D2}', color: '#00B4D8' },
  volleyball: { name: 'Volleyball', emoji: '\u{1F3D0}', color: '#F59E0B' },
  baseball: { name: 'Baseball', emoji: '\u26BE', color: '#DC2626' },
  soccer: { name: 'Soccer', emoji: '\u26BD', color: '#10B981' },
  cricket: { name: 'Cricket', emoji: '\u{1F3CF}', color: '#00C853' },
  'track-field': { name: 'Track & Field', emoji: '\u{1F3C3}', color: '#8B5CF6' },
  football: { name: 'Football', emoji: '\u{1F3C8}', color: '#92400E' },
  swimming: { name: 'Swimming', emoji: '\u{1F3CA}', color: '#0EA5E9' },
  lacrosse: { name: 'Lacrosse', emoji: '\u{1F94D}', color: '#6366F1' },
};

export const CAREER_STAGES = [
  { id: 'youth', label: 'Youth Explorer', ageRange: '6-13', color: '#F59E0B' },
  { id: 'school', label: 'School Competitor', ageRange: '14-18', color: '#10B981' },
  { id: 'university', label: 'University Performer', ageRange: '18-23', color: '#3B82F6' },
  { id: 'professional', label: 'Professional Elite', ageRange: '19+', color: '#8B5CF6' },
] as const;
