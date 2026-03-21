'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NBATeam {
  id: string;
  name: string;
  arena: string;
  color: string;
  division: string;
}

const NBA_TEAMS: NBATeam[] = [
  { id: 'ATL', name: 'Atlanta Hawks', arena: 'State Farm Arena', color: '#E03A3E', division: 'Southeast' },
  { id: 'BOS', name: 'Boston Celtics', arena: 'TD Garden', color: '#007A33', division: 'Atlantic' },
  { id: 'BKN', name: 'Brooklyn Nets', arena: 'Barclays Center', color: '#000000', division: 'Atlantic' },
  { id: 'CHA', name: 'Charlotte Hornets', arena: 'Spectrum Center', color: '#1D1160', division: 'Southeast' },
  { id: 'CHI', name: 'Chicago Bulls', arena: 'United Center', color: '#CE1141', division: 'Central' },
  { id: 'CLE', name: 'Cleveland Cavaliers', arena: 'Rocket Mortgage FieldHouse', color: '#860038', division: 'Central' },
  { id: 'DAL', name: 'Dallas Mavericks', arena: 'American Airlines Center', color: '#00538C', division: 'Southwest' },
  { id: 'DEN', name: 'Denver Nuggets', arena: 'Ball Arena', color: '#0E2240', division: 'Northwest' },
  { id: 'DET', name: 'Detroit Pistons', arena: 'Little Caesars Arena', color: '#C8102E', division: 'Central' },
  { id: 'GSW', name: 'Golden State Warriors', arena: 'Chase Center', color: '#1D428A', division: 'Pacific' },
  { id: 'HOU', name: 'Houston Rockets', arena: 'Toyota Center', color: '#CE1141', division: 'Southwest' },
  { id: 'IND', name: 'Indiana Pacers', arena: 'Gainbridge Fieldhouse', color: '#002D62', division: 'Central' },
  { id: 'LAC', name: 'LA Clippers', arena: 'Intuit Dome', color: '#C8102E', division: 'Pacific' },
  { id: 'LAL', name: 'Los Angeles Lakers', arena: 'Crypto.com Arena', color: '#552583', division: 'Pacific' },
  { id: 'MEM', name: 'Memphis Grizzlies', arena: 'FedExForum', color: '#5D76A9', division: 'Southwest' },
  { id: 'MIA', name: 'Miami Heat', arena: 'Kaseya Center', color: '#98002E', division: 'Southeast' },
  { id: 'MIL', name: 'Milwaukee Bucks', arena: 'Fiserv Forum', color: '#00471B', division: 'Central' },
  { id: 'MIN', name: 'Minnesota Timberwolves', arena: 'Target Center', color: '#0C2340', division: 'Northwest' },
  { id: 'NOP', name: 'New Orleans Pelicans', arena: 'Smoothie King Center', color: '#0C2340', division: 'Southwest' },
  { id: 'NYK', name: 'New York Knicks', arena: 'Madison Square Garden', color: '#006BB6', division: 'Atlantic' },
  { id: 'OKC', name: 'Oklahoma City Thunder', arena: 'Paycom Center', color: '#007AC1', division: 'Northwest' },
  { id: 'ORL', name: 'Orlando Magic', arena: 'Amway Center', color: '#0077C0', division: 'Southeast' },
  { id: 'PHI', name: 'Philadelphia 76ers', arena: 'Wells Fargo Center', color: '#006BB6', division: 'Atlantic' },
  { id: 'PHX', name: 'Phoenix Suns', arena: 'Footprint Center', color: '#1D1160', division: 'Pacific' },
  { id: 'POR', name: 'Portland Trail Blazers', arena: 'Moda Center', color: '#E03A3E', division: 'Northwest' },
  { id: 'SAC', name: 'Sacramento Kings', arena: 'Golden 1 Center', color: '#5A2D81', division: 'Pacific' },
  { id: 'SAS', name: 'San Antonio Spurs', arena: 'Frost Bank Center', color: '#C4CED4', division: 'Southwest' },
  { id: 'TOR', name: 'Toronto Raptors', arena: 'Scotiabank Arena', color: '#CE1141', division: 'Atlantic' },
  { id: 'UTA', name: 'Utah Jazz', arena: 'Delta Center', color: '#002B5C', division: 'Northwest' },
  { id: 'WAS', name: 'Washington Wizards', arena: 'Capital One Arena', color: '#002B5C', division: 'Southeast' },
];

export function TeamSelectionPage(): React.ReactElement {
  const router = useRouter();

  const handleSelect = (team: NBATeam): void => {
    localStorage.setItem('gm_selected_team', JSON.stringify(team));
    router.push('/gm-universe/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">GM Universe</h1>
        <p className="text-sm text-slate-400">Select a team to begin your GM career</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {NBA_TEAMS.map((team) => (
          <Card
            key={team.id}
            className={cn(
              'bg-slate-900/80 border-slate-800 cursor-pointer group',
              'hover:border-red-600/50 hover:scale-[1.03] transition-all duration-200',
            )}
            onClick={() => handleSelect(team)}
          >
            <CardContent className="p-3 text-center">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white group-hover:scale-110 transition-transform"
                style={{ backgroundColor: team.color }}
              >
                {team.id}
              </div>
              <p className="text-xs font-medium text-white truncate">{team.name}</p>
              <p className="text-[9px] text-slate-600 truncate">{team.arena}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
