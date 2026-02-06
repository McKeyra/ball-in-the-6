export const sportConfigs = {
  basketball: {
    name: 'Basketball',
    icon: '🏀',
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    startersCount: 5,
    periods: { name: 'Quarter', count: 4, length: 10 },
    hasOvertime: true,
    hasShotClock: true,
    shotClockSeconds: 24,
    stats: [
      { key: 'points', label: 'PTS', category: 'scoring' },
      { key: 'fgm', label: 'FGM', category: 'scoring' },
      { key: 'fga', label: 'FGA', category: 'scoring' },
      { key: 'three_pm', label: '3PM', category: 'scoring' },
      { key: 'three_pa', label: '3PA', category: 'scoring' },
      { key: 'ftm', label: 'FTM', category: 'scoring' },
      { key: 'fta', label: 'FTA', category: 'scoring' },
      { key: 'rebounds_off', label: 'OREB', category: 'rebounds' },
      { key: 'rebounds_def', label: 'DREB', category: 'rebounds' },
      { key: 'assists', label: 'AST', category: 'playmaking' },
      { key: 'steals', label: 'STL', category: 'defense' },
      { key: 'blocks', label: 'BLK', category: 'defense' },
      { key: 'turnovers', label: 'TO', category: 'errors' },
      { key: 'personal_fouls', label: 'PF', category: 'fouls' }
    ],
    eventTypes: [
      '2pt_make', '2pt_miss', '3pt_make', '3pt_miss',
      'ft_make', 'ft_miss', 'assist', 'rebound_off', 'rebound_def',
      'steal', 'block', 'turnover', 'foul_personal', 'substitution', 'timeout'
    ],
    scoringRules: {
      '2pt_make': 2,
      '3pt_make': 3,
      'ft_make': 1
    }
  },
  
  hockey: {
    name: 'Hockey',
    icon: '🏒',
    positions: ['C', 'LW', 'RW', 'LD', 'RD', 'G'],
    startersCount: 6,
    periods: { name: 'Period', count: 3, length: 20 },
    hasOvertime: true,
    hasShotClock: false,
    stats: [
      { key: 'goals', label: 'G', category: 'scoring' },
      { key: 'assists', label: 'A', category: 'playmaking' },
      { key: 'shots', label: 'SOG', category: 'offense' },
      { key: 'hits', label: 'HIT', category: 'physical' },
      { key: 'blocks', label: 'BLK', category: 'defense' },
      { key: 'takeaways', label: 'TK', category: 'defense' },
      { key: 'giveaways', label: 'GV', category: 'errors' },
      { key: 'penalties', label: 'PIM', category: 'penalties' },
      { key: 'faceoffs_won', label: 'FOW', category: 'special' },
      { key: 'plus_minus', label: '+/-', category: 'overall' }
    ],
    eventTypes: [
      'goal', 'assist', 'shot', 'save', 'hit', 'block',
      'penalty', 'faceoff_win', 'faceoff_loss', 'substitution'
    ],
    scoringRules: {
      'goal': 1
    }
  },
  
  volleyball: {
    name: 'Volleyball',
    icon: '🏐',
    positions: ['S', 'OH', 'MB', 'OPP', 'L', 'DS'],
    startersCount: 6,
    periods: { name: 'Set', count: 5, length: null },
    hasOvertime: false,
    hasShotClock: false,
    stats: [
      { key: 'kills', label: 'K', category: 'offense' },
      { key: 'attacks', label: 'ATT', category: 'offense' },
      { key: 'attack_errors', label: 'E', category: 'errors' },
      { key: 'aces', label: 'SA', category: 'serves' },
      { key: 'service_errors', label: 'SE', category: 'errors' },
      { key: 'blocks', label: 'BS', category: 'defense' },
      { key: 'digs', label: 'D', category: 'defense' },
      { key: 'assists', label: 'A', category: 'playmaking' },
      { key: 'reception_errors', label: 'RE', category: 'errors' }
    ],
    eventTypes: [
      'kill', 'attack_error', 'ace', 'service_error',
      'block', 'dig', 'assist', 'substitution', 'timeout'
    ],
    scoringRules: {
      'point': 1
    }
  },
  
  baseball: {
    name: 'Baseball',
    icon: '⚾',
    positions: ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'],
    startersCount: 9,
    periods: { name: 'Inning', count: 9, length: null },
    hasOvertime: true,
    hasShotClock: false,
    stats: [
      { key: 'at_bats', label: 'AB', category: 'batting' },
      { key: 'runs', label: 'R', category: 'batting' },
      { key: 'hits', label: 'H', category: 'batting' },
      { key: 'doubles', label: '2B', category: 'batting' },
      { key: 'triples', label: '3B', category: 'batting' },
      { key: 'home_runs', label: 'HR', category: 'batting' },
      { key: 'rbis', label: 'RBI', category: 'batting' },
      { key: 'walks', label: 'BB', category: 'batting' },
      { key: 'strikeouts', label: 'K', category: 'batting' },
      { key: 'stolen_bases', label: 'SB', category: 'baserunning' },
      { key: 'errors', label: 'E', category: 'fielding' }
    ],
    eventTypes: [
      'single', 'double', 'triple', 'home_run', 'walk',
      'strikeout', 'out', 'rbi', 'stolen_base', 'error', 'substitution'
    ],
    scoringRules: {
      'run': 1
    }
  },
  
  soccer: {
    name: 'Soccer',
    icon: '⚽',
    positions: ['GK', 'LB', 'CB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'],
    startersCount: 11,
    periods: { name: 'Half', count: 2, length: 45 },
    hasOvertime: true,
    hasShotClock: false,
    stats: [
      { key: 'goals', label: 'G', category: 'scoring' },
      { key: 'assists', label: 'A', category: 'playmaking' },
      { key: 'shots', label: 'SH', category: 'offense' },
      { key: 'shots_on_target', label: 'SOT', category: 'offense' },
      { key: 'passes', label: 'P', category: 'passing' },
      { key: 'key_passes', label: 'KP', category: 'passing' },
      { key: 'tackles', label: 'TK', category: 'defense' },
      { key: 'interceptions', label: 'INT', category: 'defense' },
      { key: 'fouls', label: 'FC', category: 'discipline' },
      { key: 'yellow_cards', label: 'YC', category: 'discipline' },
      { key: 'red_cards', label: 'RC', category: 'discipline' }
    ],
    eventTypes: [
      'goal', 'assist', 'shot', 'save', 'tackle', 'interception',
      'foul', 'yellow_card', 'red_card', 'corner', 'substitution'
    ],
    scoringRules: {
      'goal': 1
    }
  },
  
  football: {
    name: 'Football',
    icon: '🏈',
    positions: ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P'],
    startersCount: 11,
    periods: { name: 'Quarter', count: 4, length: 15 },
    hasOvertime: true,
    hasShotClock: false,
    stats: [
      { key: 'pass_yards', label: 'PassYd', category: 'passing' },
      { key: 'pass_tds', label: 'PassTD', category: 'passing' },
      { key: 'interceptions', label: 'INT', category: 'passing' },
      { key: 'rush_yards', label: 'RushYd', category: 'rushing' },
      { key: 'rush_tds', label: 'RushTD', category: 'rushing' },
      { key: 'receptions', label: 'REC', category: 'receiving' },
      { key: 'rec_yards', label: 'RecYd', category: 'receiving' },
      { key: 'rec_tds', label: 'RecTD', category: 'receiving' },
      { key: 'tackles', label: 'TK', category: 'defense' },
      { key: 'sacks', label: 'SK', category: 'defense' },
      { key: 'fumbles', label: 'FUM', category: 'turnovers' }
    ],
    eventTypes: [
      'touchdown', 'field_goal', 'extra_point', 'safety',
      'interception', 'fumble', 'sack', 'substitution', 'timeout'
    ],
    scoringRules: {
      'touchdown': 6,
      'field_goal': 3,
      'extra_point': 1,
      'two_point': 2,
      'safety': 2
    }
  }
};

export const getSportConfig = (sport) => {
  return sportConfigs[sport] || sportConfigs.basketball;
};