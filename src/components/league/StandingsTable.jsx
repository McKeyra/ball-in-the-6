import { ChevronRight } from 'lucide-react';

export default function StandingsTable({ teams, teamRecords, onTeamClick }) {
  return (
    <div 
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#e0e0e0',
        boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
      }}
    >
      {/* Table Header */}
      <div 
        className="grid grid-cols-12 gap-2 p-4 text-xs font-bold text-gray-500 uppercase border-b border-gray-300"
        style={{ background: 'rgba(0,0,0,0.03)' }}
      >
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-4">Team</div>
        <div className="col-span-1 text-center">W</div>
        <div className="col-span-1 text-center">L</div>
        <div className="col-span-1 text-center">PCT</div>
        <div className="col-span-1 text-center">PF</div>
        <div className="col-span-1 text-center">PA</div>
        <div className="col-span-2 text-center">Last 5</div>
      </div>

      {/* Table Body */}
      {teams.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          No teams found
        </div>
      ) : (
        teams.map((team, index) => {
          const record = teamRecords[team.id] || { wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0, lastFive: [] };
          const gamesPlayed = record.wins + record.losses;
          const winPct = gamesPlayed > 0 ? (record.wins / gamesPlayed).toFixed(3).substring(1) : '.000';

          return (
            <div
              key={team.id}
              onClick={() => onTeamClick(team.id)}
              className="grid grid-cols-12 gap-2 p-4 items-center cursor-pointer hover:bg-white/30 transition-colors border-b border-gray-200 last:border-b-0"
            >
              {/* Rank */}
              <div className="col-span-1 text-center">
                <span 
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </span>
              </div>

              {/* Team Info */}
              <div className="col-span-4 flex items-center gap-3">
                {team.logo_url ? (
                  <img 
                    src={team.logo_url} 
                    alt={team.team_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: team.team_color || '#666' }}
                  >
                    {team.team_name?.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-800">{team.team_name}</div>
                  <div className="text-xs text-gray-500">{team.division}</div>
                </div>
              </div>

              {/* Wins */}
              <div className="col-span-1 text-center font-bold text-green-600">
                {record.wins}
              </div>

              {/* Losses */}
              <div className="col-span-1 text-center font-bold text-red-500">
                {record.losses}
              </div>

              {/* Win Percentage */}
              <div className="col-span-1 text-center font-semibold text-gray-700">
                {winPct}
              </div>

              {/* Points For */}
              <div className="col-span-1 text-center text-gray-600">
                {record.pointsFor}
              </div>

              {/* Points Against */}
              <div className="col-span-1 text-center text-gray-600">
                {record.pointsAgainst}
              </div>

              {/* Last 5 */}
              <div className="col-span-2 flex items-center justify-center gap-1">
                {record.lastFive.length > 0 ? (
                  record.lastFive.map((result, i) => (
                    <span
                      key={i}
                      className={`w-5 h-5 rounded text-xs font-bold flex items-center justify-center ${
                        result === 'W' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {result}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}