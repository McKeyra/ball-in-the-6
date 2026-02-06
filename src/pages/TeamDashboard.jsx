import React from "react";
import { TrendingUp, Users, Calendar, Target } from "lucide-react";

export default function TeamDashboard() {
  const stats = [
    { label: "Record", value: "12-3", icon: Target },
    { label: "PPG", value: "105.2", icon: TrendingUp },
    { label: "Players", value: "15", icon: Users },
    { label: "Games", value: "4", icon: Calendar }
  ];

  const games = [
    { opponent: "Lakers", score: "112-98", result: "W", date: "Nov 15" },
    { opponent: "Bulls", score: "95-102", result: "L", date: "Nov 12" },
    { opponent: "Celtics", score: "108-101", result: "W", date: "Nov 10" }
  ];

  const players = [
    { name: "Marcus Johnson", points: 28.4, position: "PG" },
    { name: "Tyler Williams", points: 22.1, position: "SG" },
    { name: "James Carter", points: 19.8, position: "SF" },
    { name: "Kevin Davis", points: 16.5, position: "PF" },
    { name: "Brandon Miller", points: 14.2, position: "C" }
  ];

  return (
    <div 
      className="min-h-screen p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1e2749 100%)',
      }}
    >
      {/* Animated Background Elements */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(123, 44, 191, 0.1) 0%, transparent 50%)'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <h1 
          className="text-5xl font-bold mb-8 bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Warriors Dashboard
        </h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl relative group transition-all duration-300 hover:scale-105"
                style={{
                  background: '#1a1a1a',
                  boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(30, 39, 73, 0.6)',
                }}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{
                    background: 'linear-gradient(90deg, #c9a962, #c9a962)'
                  }}
                />
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: '#b4bcd0', fontSize: '14px' }}>{stat.label}</span>
                  <Icon className="w-5 h-5" style={{ color: '#c9a962' }} />
                </div>
                <div 
                  className="text-4xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)'
                  }}
                >
                  {stat.value}
                </div>
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Games */}
          <div
            className="p-6 rounded-2xl relative"
            style={{
              background: '#1a1a1a',
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(30, 39, 73, 0.6)',
            }}
          >
            <div 
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{
                background: 'linear-gradient(90deg, #c9a962, #c9a962)'
              }}
            />
            <h2 
              className="text-2xl font-bold mb-6 bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)'
              }}
            >
              Recent Games
            </h2>
            <div className="space-y-4">
              {games.map((game, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl relative group transition-all duration-300 hover:scale-102"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(21, 27, 61, 0.5)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            background: '#c9a962'
                          }}
                        />
                        <span className="text-lg font-semibold" style={{ color: '#ffffff' }}>
                          vs {game.opponent}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{
                            background: game.result === 'W' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: game.result === 'W' ? '#10b981' : '#ef4444'
                          }}
                        >
                          {game.result}
                        </span>
                      </div>
                      <div className="text-sm" style={{ color: '#b4bcd0' }}>
                        {game.date}
                      </div>
                    </div>
                    <div 
                      className="text-2xl font-bold bg-clip-text text-transparent"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)'
                      }}
                    >
                      {game.score}
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: '0 0 15px rgba(0, 212, 255, 0.2)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Player Leaderboard */}
          <div
            className="p-6 rounded-2xl relative"
            style={{
              background: '#1a1a1a',
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(30, 39, 73, 0.6)',
            }}
          >
            <div 
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{
                background: 'linear-gradient(90deg, #c9a962, #c9a962)'
              }}
            />
            <h2 
              className="text-2xl font-bold mb-6 bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)'
              }}
            >
              Top Scorers
            </h2>
            <div className="space-y-3">
              {players.map((player, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl flex items-center justify-between group transition-all duration-300 hover:scale-102"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(21, 27, 61, 0.5)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #c9a962, #c9a962)',
                        color: '#ffffff'
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: '#ffffff' }}>
                        {player.name}
                      </div>
                      <div className="text-xs" style={{ color: '#b4bcd0' }}>
                        {player.position}
                      </div>
                    </div>
                  </div>
                  <div 
                    className="text-2xl font-bold bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #c9a962, #c9a962)'
                    }}
                  >
                    {player.points}
                  </div>
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: '0 0 15px rgba(0, 212, 255, 0.2)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #c9a962, #c9a962)',
            boxShadow: '0 8px 24px rgba(0, 212, 255, 0.4), 0 0 40px rgba(123, 44, 191, 0.3)'
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}