import type {
  SportId,
  SportData,
  SportStanding,
  SportLeaderCategory,
  SportFixture,
} from '@/types/sports';

/* ================================================================
   BASKETBALL
   ================================================================ */

const basketballStandings: SportStanding[] = [
  { teamId: 'bk-1', teamName: 'Toronto Raptors', teamAbbr: 'TOR', teamColor: '#CE1141', conference: 'Eastern', division: 'Atlantic', wins: 41, losses: 19, gamesBack: 0, pointsFor: 112.4, pointsAgainst: 106.8, streak: 'W5', lastTen: '8-2', winPct: 0.683 },
  { teamId: 'bk-2', teamName: 'Boston Celtics', teamAbbr: 'BOS', teamColor: '#007A33', conference: 'Eastern', division: 'Atlantic', wins: 39, losses: 21, gamesBack: 2, pointsFor: 114.1, pointsAgainst: 108.2, streak: 'W3', lastTen: '7-3', winPct: 0.650 },
  { teamId: 'bk-3', teamName: 'Milwaukee Bucks', teamAbbr: 'MIL', teamColor: '#00471B', conference: 'Eastern', division: 'Central', wins: 38, losses: 22, gamesBack: 3, pointsFor: 113.7, pointsAgainst: 109.4, streak: 'L1', lastTen: '6-4', winPct: 0.633 },
  { teamId: 'bk-4', teamName: 'Philadelphia 76ers', teamAbbr: 'PHI', teamColor: '#006BB6', conference: 'Eastern', division: 'Atlantic', wins: 36, losses: 24, gamesBack: 5, pointsFor: 110.2, pointsAgainst: 107.1, streak: 'W2', lastTen: '7-3', winPct: 0.600 },
  { teamId: 'bk-5', teamName: 'New York Knicks', teamAbbr: 'NYK', teamColor: '#F58426', conference: 'Eastern', division: 'Atlantic', wins: 35, losses: 25, gamesBack: 6, pointsFor: 111.8, pointsAgainst: 109.6, streak: 'W1', lastTen: '5-5', winPct: 0.583 },
  { teamId: 'bk-6', teamName: 'Cleveland Cavaliers', teamAbbr: 'CLE', teamColor: '#860038', conference: 'Eastern', division: 'Central', wins: 33, losses: 27, gamesBack: 8, pointsFor: 108.9, pointsAgainst: 107.4, streak: 'L2', lastTen: '4-6', winPct: 0.550 },
  { teamId: 'bk-7', teamName: 'Miami Heat', teamAbbr: 'MIA', teamColor: '#98002E', conference: 'Eastern', division: 'Southeast', wins: 31, losses: 29, gamesBack: 10, pointsFor: 107.3, pointsAgainst: 107.9, streak: 'W1', lastTen: '5-5', winPct: 0.517 },
  { teamId: 'bk-8', teamName: 'Indiana Pacers', teamAbbr: 'IND', teamColor: '#002D62', conference: 'Eastern', division: 'Central', wins: 29, losses: 31, gamesBack: 12, pointsFor: 109.5, pointsAgainst: 111.2, streak: 'L3', lastTen: '3-7', winPct: 0.483 },
];

const basketballLeaders: SportLeaderCategory[] = [
  {
    category: { key: 'ppg', label: 'Points Per Game', abbr: 'PPG' },
    leaders: [
      { playerId: 'bp-1', playerName: 'RJ Barrett', team: 'Toronto Raptors', teamAbbr: 'TOR', stat: 'ppg', value: 28.4, rank: 1, avatar: 'RB' },
      { playerId: 'bp-2', playerName: 'Jayson Tatum', team: 'Boston Celtics', teamAbbr: 'BOS', stat: 'ppg', value: 27.1, rank: 2, avatar: 'JT' },
      { playerId: 'bp-3', playerName: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', teamAbbr: 'MIL', stat: 'ppg', value: 26.8, rank: 3, avatar: 'GA' },
      { playerId: 'bp-4', playerName: 'Joel Embiid', team: 'Philadelphia 76ers', teamAbbr: 'PHI', stat: 'ppg', value: 25.9, rank: 4, avatar: 'JE' },
      { playerId: 'bp-5', playerName: 'Scottie Barnes', team: 'Toronto Raptors', teamAbbr: 'TOR', stat: 'ppg', value: 24.2, rank: 5, avatar: 'SB' },
    ],
  },
  {
    category: { key: 'rpg', label: 'Rebounds Per Game', abbr: 'RPG' },
    leaders: [
      { playerId: 'bp-3', playerName: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', teamAbbr: 'MIL', stat: 'rpg', value: 12.1, rank: 1, avatar: 'GA' },
      { playerId: 'bp-4', playerName: 'Joel Embiid', team: 'Philadelphia 76ers', teamAbbr: 'PHI', stat: 'rpg', value: 11.4, rank: 2, avatar: 'JE' },
      { playerId: 'bp-6', playerName: 'Scottie Barnes', team: 'Toronto Raptors', teamAbbr: 'TOR', stat: 'rpg', value: 10.3, rank: 3, avatar: 'SB' },
      { playerId: 'bp-7', playerName: 'Bam Adebayo', team: 'Miami Heat', teamAbbr: 'MIA', stat: 'rpg', value: 9.8, rank: 4, avatar: 'BA' },
      { playerId: 'bp-8', playerName: 'Myles Turner', team: 'Indiana Pacers', teamAbbr: 'IND', stat: 'rpg', value: 9.2, rank: 5, avatar: 'MT' },
    ],
  },
  {
    category: { key: 'apg', label: 'Assists Per Game', abbr: 'APG' },
    leaders: [
      { playerId: 'bp-9', playerName: 'Tyrese Haliburton', team: 'Indiana Pacers', teamAbbr: 'IND', stat: 'apg', value: 10.4, rank: 1, avatar: 'TH' },
      { playerId: 'bp-10', playerName: 'Jalen Brunson', team: 'New York Knicks', teamAbbr: 'NYK', stat: 'apg', value: 8.7, rank: 2, avatar: 'JB' },
      { playerId: 'bp-11', playerName: 'Immanuel Quickley', team: 'Toronto Raptors', teamAbbr: 'TOR', stat: 'apg', value: 7.9, rank: 3, avatar: 'IQ' },
      { playerId: 'bp-12', playerName: 'Damian Lillard', team: 'Milwaukee Bucks', teamAbbr: 'MIL', stat: 'apg', value: 7.3, rank: 4, avatar: 'DL' },
      { playerId: 'bp-13', playerName: 'Derrick White', team: 'Boston Celtics', teamAbbr: 'BOS', stat: 'apg', value: 6.1, rank: 5, avatar: 'DW' },
    ],
  },
];

const basketballFixtures: SportFixture[] = [
  { id: 'bkf-1', sportId: 'basketball', homeTeam: 'Toronto Raptors', homeAbbr: 'TOR', homeColor: '#CE1141', awayTeam: 'Boston Celtics', awayAbbr: 'BOS', awayColor: '#007A33', venue: 'Scotiabank Arena', date: 'Today', time: '7:30 PM ET', broadcast: 'TSN', status: 'upcoming' },
  { id: 'bkf-2', sportId: 'basketball', homeTeam: 'Milwaukee Bucks', homeAbbr: 'MIL', homeColor: '#00471B', awayTeam: 'Philadelphia 76ers', awayAbbr: 'PHI', awayColor: '#006BB6', venue: 'Fiserv Forum', date: 'Today', time: '8:00 PM ET', broadcast: 'ESPN', status: 'upcoming' },
  { id: 'bkf-3', sportId: 'basketball', homeTeam: 'New York Knicks', homeAbbr: 'NYK', homeColor: '#F58426', awayTeam: 'Toronto Raptors', awayAbbr: 'TOR', awayColor: '#CE1141', venue: 'Madison Square Garden', date: 'Tomorrow', time: '7:00 PM ET', broadcast: 'SN', status: 'upcoming' },
  { id: 'bkf-4', sportId: 'basketball', homeTeam: 'Cleveland Cavaliers', homeAbbr: 'CLE', homeColor: '#860038', awayTeam: 'Miami Heat', awayAbbr: 'MIA', awayColor: '#98002E', venue: 'Rocket Mortgage FieldHouse', date: 'Mar 22', time: '6:00 PM ET', broadcast: 'NBA TV', status: 'upcoming' },
];

/* ================================================================
   SOCCER
   ================================================================ */

const soccerStandings: SportStanding[] = [
  { teamId: 'sc-1', teamName: 'Toronto FC', teamAbbr: 'TFC', teamColor: '#E31937', conference: 'Eastern', wins: 14, losses: 5, ties: 7, gamesBack: 0, pointsFor: 42, pointsAgainst: 24, points: 49, streak: 'W3', lastTen: '7-1-2', winPct: 0.654 },
  { teamId: 'sc-2', teamName: 'CF Montréal', teamAbbr: 'MTL', teamColor: '#000F2B', conference: 'Eastern', wins: 13, losses: 6, ties: 7, gamesBack: 2, pointsFor: 38, pointsAgainst: 26, points: 46, streak: 'D1', lastTen: '6-2-2', winPct: 0.615 },
  { teamId: 'sc-3', teamName: 'Columbus Crew', teamAbbr: 'CLB', teamColor: '#FEDD00', conference: 'Eastern', wins: 12, losses: 7, ties: 7, gamesBack: 4, pointsFor: 40, pointsAgainst: 30, points: 43, streak: 'W1', lastTen: '5-3-2', winPct: 0.577 },
  { teamId: 'sc-4', teamName: 'Inter Miami', teamAbbr: 'MIA', teamColor: '#F7B5CD', conference: 'Eastern', wins: 12, losses: 8, ties: 6, gamesBack: 5, pointsFor: 44, pointsAgainst: 32, points: 42, streak: 'W2', lastTen: '6-3-1', winPct: 0.577 },
  { teamId: 'sc-5', teamName: 'Cincinnati', teamAbbr: 'CIN', teamColor: '#FE5000', conference: 'Eastern', wins: 11, losses: 8, ties: 7, gamesBack: 6, pointsFor: 36, pointsAgainst: 29, points: 40, streak: 'L1', lastTen: '4-4-2', winPct: 0.538 },
  { teamId: 'sc-6', teamName: 'New York Red Bulls', teamAbbr: 'RBNY', teamColor: '#ED1E36', conference: 'Eastern', wins: 10, losses: 9, ties: 7, gamesBack: 8, pointsFor: 33, pointsAgainst: 31, points: 37, streak: 'D2', lastTen: '3-4-3', winPct: 0.500 },
  { teamId: 'sc-7', teamName: 'Charlotte FC', teamAbbr: 'CLT', teamColor: '#1A85C8', conference: 'Eastern', wins: 9, losses: 11, ties: 6, gamesBack: 11, pointsFor: 28, pointsAgainst: 34, points: 33, streak: 'L2', lastTen: '3-5-2', winPct: 0.462 },
  { teamId: 'sc-8', teamName: 'Atlanta United', teamAbbr: 'ATL', teamColor: '#80000A', conference: 'Eastern', wins: 7, losses: 14, ties: 5, gamesBack: 16, pointsFor: 25, pointsAgainst: 41, points: 26, streak: 'L4', lastTen: '2-7-1', winPct: 0.365 },
];

const soccerLeaders: SportLeaderCategory[] = [
  {
    category: { key: 'goals', label: 'Goals', abbr: 'G' },
    leaders: [
      { playerId: 'sp-1', playerName: 'Lorenzo Insigne', team: 'Toronto FC', teamAbbr: 'TFC', stat: 'goals', value: 16, rank: 1, avatar: 'LI' },
      { playerId: 'sp-2', playerName: 'Lionel Messi', team: 'Inter Miami', teamAbbr: 'MIA', stat: 'goals', value: 15, rank: 2, avatar: 'LM' },
      { playerId: 'sp-3', playerName: 'Cucho Hernández', team: 'Columbus Crew', teamAbbr: 'CLB', stat: 'goals', value: 13, rank: 3, avatar: 'CH' },
      { playerId: 'sp-4', playerName: 'Federico Bernardeschi', team: 'Toronto FC', teamAbbr: 'TFC', stat: 'goals', value: 11, rank: 4, avatar: 'FB' },
      { playerId: 'sp-5', playerName: 'Lewis Morgan', team: 'New York Red Bulls', teamAbbr: 'RBNY', stat: 'goals', value: 10, rank: 5, avatar: 'LM' },
    ],
  },
  {
    category: { key: 'assists', label: 'Assists', abbr: 'A' },
    leaders: [
      { playerId: 'sp-2', playerName: 'Lionel Messi', team: 'Inter Miami', teamAbbr: 'MIA', stat: 'assists', value: 14, rank: 1, avatar: 'LM' },
      { playerId: 'sp-6', playerName: 'Federico Bernardeschi', team: 'Toronto FC', teamAbbr: 'TFC', stat: 'assists', value: 11, rank: 2, avatar: 'FB' },
      { playerId: 'sp-7', playerName: 'Luciano Acosta', team: 'Cincinnati', teamAbbr: 'CIN', stat: 'assists', value: 10, rank: 3, avatar: 'LA' },
      { playerId: 'sp-8', playerName: 'Darlington Nagbe', team: 'Columbus Crew', teamAbbr: 'CLB', stat: 'assists', value: 9, rank: 4, avatar: 'DN' },
      { playerId: 'sp-9', playerName: 'Kwadwo Opoku', team: 'CF Montréal', teamAbbr: 'MTL', stat: 'assists', value: 8, rank: 5, avatar: 'KO' },
    ],
  },
  {
    category: { key: 'cleanSheets', label: 'Clean Sheets', abbr: 'CS' },
    leaders: [
      { playerId: 'sp-10', playerName: 'Sean Johnson', team: 'Toronto FC', teamAbbr: 'TFC', stat: 'cleanSheets', value: 11, rank: 1, avatar: 'SJ' },
      { playerId: 'sp-11', playerName: 'Patrick Schulte', team: 'Columbus Crew', teamAbbr: 'CLB', stat: 'cleanSheets', value: 9, rank: 2, avatar: 'PS' },
      { playerId: 'sp-12', playerName: 'Drake Callender', team: 'Inter Miami', teamAbbr: 'MIA', stat: 'cleanSheets', value: 8, rank: 3, avatar: 'DC' },
      { playerId: 'sp-13', playerName: 'Jonathan Sirois', team: 'CF Montréal', teamAbbr: 'MTL', stat: 'cleanSheets', value: 7, rank: 4, avatar: 'JS' },
      { playerId: 'sp-14', playerName: 'Roman Celentano', team: 'Cincinnati', teamAbbr: 'CIN', stat: 'cleanSheets', value: 6, rank: 5, avatar: 'RC' },
    ],
  },
];

const soccerFixtures: SportFixture[] = [
  { id: 'scf-1', sportId: 'soccer', homeTeam: 'Toronto FC', homeAbbr: 'TFC', homeColor: '#E31937', awayTeam: 'CF Montréal', awayAbbr: 'MTL', awayColor: '#000F2B', venue: 'BMO Field', date: 'Today', time: '7:30 PM ET', broadcast: 'TSN', status: 'upcoming' },
  { id: 'scf-2', sportId: 'soccer', homeTeam: 'Inter Miami', homeAbbr: 'MIA', homeColor: '#F7B5CD', awayTeam: 'Columbus Crew', awayAbbr: 'CLB', awayColor: '#FEDD00', venue: 'Chase Stadium', date: 'Tomorrow', time: '8:00 PM ET', broadcast: 'Apple TV', status: 'upcoming' },
  { id: 'scf-3', sportId: 'soccer', homeTeam: 'Cincinnati', homeAbbr: 'CIN', homeColor: '#FE5000', awayTeam: 'Toronto FC', awayAbbr: 'TFC', awayColor: '#E31937', venue: 'TQL Stadium', date: 'Mar 23', time: '5:00 PM ET', broadcast: 'MLS Season Pass', status: 'upcoming' },
  { id: 'scf-4', sportId: 'soccer', homeTeam: 'New York Red Bulls', homeAbbr: 'RBNY', homeColor: '#ED1E36', awayTeam: 'Charlotte FC', awayAbbr: 'CLT', awayColor: '#1A85C8', venue: 'Red Bull Arena', date: 'Mar 24', time: '1:00 PM ET', broadcast: 'MLS Season Pass', status: 'upcoming' },
];

/* ================================================================
   HOCKEY
   ================================================================ */

const hockeyStandings: SportStanding[] = [
  { teamId: 'hk-1', teamName: 'Toronto Maple Leafs', teamAbbr: 'TOR', teamColor: '#003E7E', conference: 'Eastern', division: 'Atlantic', wins: 42, losses: 18, overtimeLosses: 6, gamesBack: 0, pointsFor: 238, pointsAgainst: 186, points: 90, streak: 'W4', lastTen: '8-1-1', winPct: 0.682 },
  { teamId: 'hk-2', teamName: 'Florida Panthers', teamAbbr: 'FLA', teamColor: '#041E42', conference: 'Eastern', division: 'Atlantic', wins: 40, losses: 20, overtimeLosses: 5, gamesBack: 3, pointsFor: 224, pointsAgainst: 192, points: 85, streak: 'W2', lastTen: '7-2-1', winPct: 0.654 },
  { teamId: 'hk-3', teamName: 'Boston Bruins', teamAbbr: 'BOS', teamColor: '#FFB81C', conference: 'Eastern', division: 'Atlantic', wins: 38, losses: 22, overtimeLosses: 6, gamesBack: 6, pointsFor: 218, pointsAgainst: 198, points: 82, streak: 'L1', lastTen: '6-3-1', winPct: 0.621 },
  { teamId: 'hk-4', teamName: 'Tampa Bay Lightning', teamAbbr: 'TBL', teamColor: '#002868', conference: 'Eastern', division: 'Atlantic', wins: 36, losses: 24, overtimeLosses: 6, gamesBack: 8, pointsFor: 212, pointsAgainst: 204, points: 78, streak: 'W1', lastTen: '5-4-1', winPct: 0.591 },
  { teamId: 'hk-5', teamName: 'Ottawa Senators', teamAbbr: 'OTT', teamColor: '#C52032', conference: 'Eastern', division: 'Atlantic', wins: 34, losses: 26, overtimeLosses: 6, gamesBack: 12, pointsFor: 206, pointsAgainst: 208, points: 74, streak: 'L2', lastTen: '4-5-1', winPct: 0.561 },
  { teamId: 'hk-6', teamName: 'Montréal Canadiens', teamAbbr: 'MTL', teamColor: '#AF1E2D', conference: 'Eastern', division: 'Atlantic', wins: 32, losses: 28, overtimeLosses: 6, gamesBack: 16, pointsFor: 198, pointsAgainst: 214, points: 70, streak: 'W1', lastTen: '5-4-1', winPct: 0.530 },
  { teamId: 'hk-7', teamName: 'Detroit Red Wings', teamAbbr: 'DET', teamColor: '#CE1126', conference: 'Eastern', division: 'Atlantic', wins: 28, losses: 32, overtimeLosses: 6, gamesBack: 24, pointsFor: 188, pointsAgainst: 226, points: 62, streak: 'L3', lastTen: '3-6-1', winPct: 0.470 },
  { teamId: 'hk-8', teamName: 'Buffalo Sabres', teamAbbr: 'BUF', teamColor: '#003087', conference: 'Eastern', division: 'Atlantic', wins: 24, losses: 36, overtimeLosses: 6, gamesBack: 32, pointsFor: 176, pointsAgainst: 238, points: 54, streak: 'L5', lastTen: '2-7-1', winPct: 0.409 },
];

const hockeyLeaders: SportLeaderCategory[] = [
  {
    category: { key: 'points', label: 'Points', abbr: 'PTS' },
    leaders: [
      { playerId: 'hp-1', playerName: 'Auston Matthews', team: 'Toronto Maple Leafs', teamAbbr: 'TOR', stat: 'points', value: 88, rank: 1, avatar: 'AM' },
      { playerId: 'hp-2', playerName: 'Mitch Marner', team: 'Toronto Maple Leafs', teamAbbr: 'TOR', stat: 'points', value: 82, rank: 2, avatar: 'MM' },
      { playerId: 'hp-3', playerName: 'Sam Reinhart', team: 'Florida Panthers', teamAbbr: 'FLA', stat: 'points', value: 76, rank: 3, avatar: 'SR' },
      { playerId: 'hp-4', playerName: 'David Pastrnak', team: 'Boston Bruins', teamAbbr: 'BOS', stat: 'points', value: 74, rank: 4, avatar: 'DP' },
      { playerId: 'hp-5', playerName: 'Nikita Kucherov', team: 'Tampa Bay Lightning', teamAbbr: 'TBL', stat: 'points', value: 72, rank: 5, avatar: 'NK' },
    ],
  },
  {
    category: { key: 'goals', label: 'Goals', abbr: 'G' },
    leaders: [
      { playerId: 'hp-1', playerName: 'Auston Matthews', team: 'Toronto Maple Leafs', teamAbbr: 'TOR', stat: 'goals', value: 44, rank: 1, avatar: 'AM' },
      { playerId: 'hp-3', playerName: 'Sam Reinhart', team: 'Florida Panthers', teamAbbr: 'FLA', stat: 'goals', value: 38, rank: 2, avatar: 'SR' },
      { playerId: 'hp-4', playerName: 'David Pastrnak', team: 'Boston Bruins', teamAbbr: 'BOS', stat: 'goals', value: 36, rank: 3, avatar: 'DP' },
      { playerId: 'hp-6', playerName: 'Brady Tkachuk', team: 'Ottawa Senators', teamAbbr: 'OTT', stat: 'goals', value: 32, rank: 4, avatar: 'BT' },
      { playerId: 'hp-7', playerName: 'William Nylander', team: 'Toronto Maple Leafs', teamAbbr: 'TOR', stat: 'goals', value: 30, rank: 5, avatar: 'WN' },
    ],
  },
  {
    category: { key: 'saves', label: 'Save Percentage', abbr: 'SV%', unit: '%' },
    leaders: [
      { playerId: 'hp-8', playerName: 'Joseph Woll', team: 'Toronto Maple Leafs', teamAbbr: 'TOR', stat: 'saves', value: 92.4, rank: 1, avatar: 'JW' },
      { playerId: 'hp-9', playerName: 'Sergei Bobrovsky', team: 'Florida Panthers', teamAbbr: 'FLA', stat: 'saves', value: 91.8, rank: 2, avatar: 'SB' },
      { playerId: 'hp-10', playerName: 'Jeremy Swayman', team: 'Boston Bruins', teamAbbr: 'BOS', stat: 'saves', value: 91.5, rank: 3, avatar: 'JS' },
      { playerId: 'hp-11', playerName: 'Andrei Vasilevskiy', team: 'Tampa Bay Lightning', teamAbbr: 'TBL', stat: 'saves', value: 91.2, rank: 4, avatar: 'AV' },
      { playerId: 'hp-12', playerName: 'Linus Ullmark', team: 'Ottawa Senators', teamAbbr: 'OTT', stat: 'saves', value: 90.8, rank: 5, avatar: 'LU' },
    ],
  },
];

const hockeyFixtures: SportFixture[] = [
  { id: 'hkf-1', sportId: 'hockey', homeTeam: 'Toronto Maple Leafs', homeAbbr: 'TOR', homeColor: '#003E7E', awayTeam: 'Boston Bruins', awayAbbr: 'BOS', awayColor: '#FFB81C', venue: 'Scotiabank Arena', date: 'Today', time: '7:00 PM ET', broadcast: 'TSN', status: 'upcoming' },
  { id: 'hkf-2', sportId: 'hockey', homeTeam: 'Florida Panthers', homeAbbr: 'FLA', homeColor: '#041E42', awayTeam: 'Tampa Bay Lightning', awayAbbr: 'TBL', awayColor: '#002868', venue: 'Amerant Bank Arena', date: 'Today', time: '7:30 PM ET', broadcast: 'ESPN', status: 'upcoming' },
  { id: 'hkf-3', sportId: 'hockey', homeTeam: 'Ottawa Senators', homeAbbr: 'OTT', homeColor: '#C52032', awayTeam: 'Toronto Maple Leafs', awayAbbr: 'TOR', awayColor: '#003E7E', venue: 'Canadian Tire Centre', date: 'Tomorrow', time: '7:00 PM ET', broadcast: 'SN', status: 'upcoming' },
  { id: 'hkf-4', sportId: 'hockey', homeTeam: 'Montréal Canadiens', homeAbbr: 'MTL', homeColor: '#AF1E2D', awayTeam: 'Detroit Red Wings', awayAbbr: 'DET', awayColor: '#CE1126', venue: 'Bell Centre', date: 'Mar 23', time: '7:00 PM ET', broadcast: 'RDS', status: 'upcoming' },
];

/* ================================================================
   FOOTBALL
   ================================================================ */

const footballStandings: SportStanding[] = [
  { teamId: 'fb-1', teamName: 'Toronto Argonauts', teamAbbr: 'TOR', teamColor: '#002B5C', conference: 'Eastern', wins: 11, losses: 4, ties: 1, gamesBack: 0, pointsFor: 412, pointsAgainst: 298, points: 23, streak: 'W3', lastTen: '8-1-1', winPct: 0.719 },
  { teamId: 'fb-2', teamName: 'Montréal Alouettes', teamAbbr: 'MTL', teamColor: '#862633', conference: 'Eastern', wins: 10, losses: 5, ties: 1, gamesBack: 1, pointsFor: 388, pointsAgainst: 312, points: 21, streak: 'W1', lastTen: '7-2-1', winPct: 0.656 },
  { teamId: 'fb-3', teamName: 'Ottawa Redblacks', teamAbbr: 'OTT', teamColor: '#000000', conference: 'Eastern', wins: 8, losses: 7, ties: 1, gamesBack: 4, pointsFor: 346, pointsAgainst: 338, points: 17, streak: 'L1', lastTen: '5-4-1', winPct: 0.531 },
  { teamId: 'fb-4', teamName: 'Hamilton Tiger-Cats', teamAbbr: 'HAM', teamColor: '#FFB819', conference: 'Eastern', wins: 6, losses: 10, ties: 0, gamesBack: 7, pointsFor: 304, pointsAgainst: 376, points: 12, streak: 'L2', lastTen: '4-6-0', winPct: 0.375 },
  { teamId: 'fb-5', teamName: 'Winnipeg Blue Bombers', teamAbbr: 'WPG', teamColor: '#002F65', conference: 'Western', wins: 12, losses: 3, ties: 1, gamesBack: 0, pointsFor: 438, pointsAgainst: 276, points: 25, streak: 'W6', lastTen: '9-0-1', winPct: 0.781 },
  { teamId: 'fb-6', teamName: 'BC Lions', teamAbbr: 'BC', teamColor: '#F26522', conference: 'Western', wins: 9, losses: 6, ties: 1, gamesBack: 4, pointsFor: 372, pointsAgainst: 328, points: 19, streak: 'W2', lastTen: '6-3-1', winPct: 0.594 },
  { teamId: 'fb-7', teamName: 'Saskatchewan Roughriders', teamAbbr: 'SSK', teamColor: '#006341', conference: 'Western', wins: 7, losses: 8, ties: 1, gamesBack: 7, pointsFor: 334, pointsAgainst: 352, points: 15, streak: 'D1', lastTen: '4-5-1', winPct: 0.469 },
  { teamId: 'fb-8', teamName: 'Calgary Stampeders', teamAbbr: 'CGY', teamColor: '#CE1126', conference: 'Western', wins: 5, losses: 11, ties: 0, gamesBack: 10, pointsFor: 288, pointsAgainst: 398, points: 10, streak: 'L4', lastTen: '2-8-0', winPct: 0.313 },
];

const footballLeaders: SportLeaderCategory[] = [
  {
    category: { key: 'passYds', label: 'Passing Yards', abbr: 'YDS' },
    leaders: [
      { playerId: 'fp-1', playerName: 'Chad Kelly', team: 'Toronto Argonauts', teamAbbr: 'TOR', stat: 'passYds', value: 4218, rank: 1, avatar: 'CK' },
      { playerId: 'fp-2', playerName: 'Zach Collaros', team: 'Winnipeg Blue Bombers', teamAbbr: 'WPG', stat: 'passYds', value: 4102, rank: 2, avatar: 'ZC' },
      { playerId: 'fp-3', playerName: 'Cody Fajardo', team: 'Montréal Alouettes', teamAbbr: 'MTL', stat: 'passYds', value: 3876, rank: 3, avatar: 'CF' },
      { playerId: 'fp-4', playerName: 'Vernon Adams Jr.', team: 'BC Lions', teamAbbr: 'BC', stat: 'passYds', value: 3654, rank: 4, avatar: 'VA' },
      { playerId: 'fp-5', playerName: 'Dru Brown', team: 'Ottawa Redblacks', teamAbbr: 'OTT', stat: 'passYds', value: 3412, rank: 5, avatar: 'DB' },
    ],
  },
  {
    category: { key: 'rushYds', label: 'Rushing Yards', abbr: 'RuYDS' },
    leaders: [
      { playerId: 'fp-6', playerName: 'Brady Oliveira', team: 'Winnipeg Blue Bombers', teamAbbr: 'WPG', stat: 'rushYds', value: 1124, rank: 1, avatar: 'BO' },
      { playerId: 'fp-7', playerName: 'Ka\'Deem Carey', team: 'Toronto Argonauts', teamAbbr: 'TOR', stat: 'rushYds', value: 986, rank: 2, avatar: 'KC' },
      { playerId: 'fp-8', playerName: 'William Stanback', team: 'BC Lions', teamAbbr: 'BC', stat: 'rushYds', value: 912, rank: 3, avatar: 'WS' },
      { playerId: 'fp-9', playerName: 'Walter Fletcher', team: 'Montréal Alouettes', teamAbbr: 'MTL', stat: 'rushYds', value: 834, rank: 4, avatar: 'WF' },
      { playerId: 'fp-10', playerName: 'Frankie Hickson', team: 'Saskatchewan Roughriders', teamAbbr: 'SSK', stat: 'rushYds', value: 778, rank: 5, avatar: 'FH' },
    ],
  },
  {
    category: { key: 'td', label: 'Touchdowns', abbr: 'TD' },
    leaders: [
      { playerId: 'fp-6', playerName: 'Brady Oliveira', team: 'Winnipeg Blue Bombers', teamAbbr: 'WPG', stat: 'td', value: 14, rank: 1, avatar: 'BO' },
      { playerId: 'fp-11', playerName: 'Kurleigh Gittens Jr.', team: 'Toronto Argonauts', teamAbbr: 'TOR', stat: 'td', value: 12, rank: 2, avatar: 'KG' },
      { playerId: 'fp-12', playerName: 'Tyson Philpot', team: 'Montréal Alouettes', teamAbbr: 'MTL', stat: 'td', value: 11, rank: 3, avatar: 'TP' },
      { playerId: 'fp-13', playerName: 'Dominique Rhymes', team: 'BC Lions', teamAbbr: 'BC', stat: 'td', value: 10, rank: 4, avatar: 'DR' },
      { playerId: 'fp-14', playerName: 'Dalton Schoen', team: 'Winnipeg Blue Bombers', teamAbbr: 'WPG', stat: 'td', value: 9, rank: 5, avatar: 'DS' },
    ],
  },
];

const footballFixtures: SportFixture[] = [
  { id: 'fbf-1', sportId: 'football', homeTeam: 'Toronto Argonauts', homeAbbr: 'TOR', homeColor: '#002B5C', awayTeam: 'Montréal Alouettes', awayAbbr: 'MTL', awayColor: '#862633', venue: 'BMO Field', date: 'Saturday', time: '4:00 PM ET', broadcast: 'TSN', status: 'upcoming' },
  { id: 'fbf-2', sportId: 'football', homeTeam: 'Winnipeg Blue Bombers', homeAbbr: 'WPG', homeColor: '#002F65', awayTeam: 'BC Lions', awayAbbr: 'BC', awayColor: '#F26522', venue: 'IG Field', date: 'Saturday', time: '7:00 PM CT', broadcast: 'TSN', status: 'upcoming' },
  { id: 'fbf-3', sportId: 'football', homeTeam: 'Ottawa Redblacks', homeAbbr: 'OTT', homeColor: '#000000', awayTeam: 'Hamilton Tiger-Cats', awayAbbr: 'HAM', awayColor: '#FFB819', venue: 'TD Place Stadium', date: 'Sunday', time: '1:00 PM ET', broadcast: 'TSN', status: 'upcoming' },
  { id: 'fbf-4', sportId: 'football', homeTeam: 'Saskatchewan Roughriders', homeAbbr: 'SSK', homeColor: '#006341', awayTeam: 'Calgary Stampeders', awayAbbr: 'CGY', awayColor: '#CE1126', venue: 'Mosaic Stadium', date: 'Sunday', time: '5:00 PM CT', broadcast: 'TSN', status: 'upcoming' },
];

/* ================================================================
   AGGREGATED DATA MAP
   ================================================================ */

const SPORTS_DATA: Record<string, SportData> = {
  basketball: {
    standings: basketballStandings,
    leaderCategories: basketballLeaders,
    fixtures: basketballFixtures,
  },
  soccer: {
    standings: soccerStandings,
    leaderCategories: soccerLeaders,
    fixtures: soccerFixtures,
  },
  hockey: {
    standings: hockeyStandings,
    leaderCategories: hockeyLeaders,
    fixtures: hockeyFixtures,
  },
  football: {
    standings: footballStandings,
    leaderCategories: footballLeaders,
    fixtures: footballFixtures,
  },
};

export const getSportData = (sportId: string): SportData | undefined =>
  SPORTS_DATA[sportId];

export const getAllSportsData = (): Record<string, SportData> => SPORTS_DATA;
