import { TrendingUp, Target, Percent, Activity } from 'lucide-react';

export default function AdvancedStats({ player }) {
  // Calculate advanced metrics
  const efg = player.fga > 0 ? 
    ((player.fgm + 0.5 * player.three_pm) / player.fga * 100).toFixed(1) : '0.0';
  
  const ts = player.fga > 0 ? 
    (player.points / (2 * (player.fga + 0.44 * player.fta)) * 100).toFixed(1) : '0.0';
  
  const astToRatio = player.turnovers > 0 ?
    (player.assists / player.turnovers).toFixed(2) : player.assists.toFixed(2);
  
  // Calculate Player Efficiency Rating (simplified)
  const per = (
    player.points + 
    player.rebounds_off + player.rebounds_def + 
    player.assists + 
    player.steals + 
    player.blocks - 
    (player.fga - player.fgm) - 
    (player.fta - player.ftm) - 
    player.turnovers
  ).toFixed(1);

  const stats = [
    { 
      label: 'eFG%', 
      value: `${efg}%`, 
      icon: Target,
      description: 'Effective Field Goal %',
      color: '#10B981'
    },
    { 
      label: 'TS%', 
      value: `${ts}%`, 
      icon: TrendingUp,
      description: 'True Shooting %',
      color: '#3B82F6'
    },
    { 
      label: 'AST/TO', 
      value: astToRatio, 
      icon: Activity,
      description: 'Assist to Turnover Ratio',
      color: '#F59E0B'
    },
    { 
      label: 'PER', 
      value: per, 
      icon: Percent,
      description: 'Player Efficiency Rating',
      color: '#8B5CF6'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="p-4 rounded-2xl"
            style={{
              background: '#e0e0e0',
              boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `${stat.color}20`,
                  boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-700 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.description}</div>
          </div>
        );
      })}
    </div>
  );
}