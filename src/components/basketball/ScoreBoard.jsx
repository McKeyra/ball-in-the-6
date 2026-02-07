import { useState } from "react";
import { Play, Pause, RotateCcw, Menu, AlertCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameClock } from "./GameClockContext";

export default function ScoreBoard({ game, onEventFeedToggle, onQuickStat }) {
  const { 
    isRunning, 
    setIsRunning, 
    gameClockSeconds, 
    shotClockSeconds, 
    resetGameClock, 
    resetShotClock 
  } = useGameClock();
  
  const [showViolationAlert, setShowViolationAlert] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getQuarterLabel = (quarter) => {
    if (quarter <= 4) return `Q${quarter}`;
    return `OT${quarter - 4}`;
  };

  return (
    <>
      {showViolationAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            className="w-full max-w-md mx-4 rounded-3xl p-8"
            style={{
              background: '#e0e0e0',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: '#ef4444',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                }}
              >
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Shot Clock Violation!</h2>
              <p className="text-gray-600 mb-6">24-second shot clock has expired</p>
              <Button
                onClick={() => setShowViolationAlert(false)}
                className="w-full h-12 text-lg font-semibold"
                style={{
                  background: '#ef4444',
                  color: 'white',
                  boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
                  border: 'none'
                }}
              >
                Acknowledge
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        {/* Desktop ScoreBoard */}
        <div className="hidden md:block">
          <div 
            className="p-6 relative"
            style={{
              background: '#e0e0e0',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
            }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                {/* Home Team */}
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="w-16 h-16 rounded-full"
                    style={{
                      background: game.home_team_color,
                      boxShadow: '4px 4px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                  <div>
                    <div className="text-2xl font-bold text-gray-700">{game.home_team_name}</div>
                    <div className="text-6xl font-bold text-gray-800 leading-none mt-1">{game.home_score}</div>
                    <div className="text-xs text-gray-500 mt-1">Fouls: {game.home_team_fouls}</div>
                  </div>
                </div>

                {/* Center - Clock Controls */}
                <div 
                  className="flex flex-col items-center gap-4 px-8 py-4 rounded-2xl"
                  style={{
                    background: 'white',
                    boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
                  }}
                >
                  <button 
                    onClick={resetGameClock}
                    className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="text-6xl font-bold text-gray-800 mb-2">
                      {formatTime(gameClockSeconds)}
                    </div>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsRunning(!isRunning)}
                      style={{
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                        background: 'white'
                      }}
                    >
                      {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onEventFeedToggle}
                      style={{
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                        background: 'white'
                      }}
                    >
                      <Menu className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={onQuickStat}
                      className="h-10 px-4"
                      style={{
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                        background: '#000435',
                        color: 'white'
                      }}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Stat
                    </Button>

                    <div className="flex items-center gap-2">
                      <div 
                        className="px-4 py-2 rounded-xl"
                        style={{
                          background: shotClockSeconds <= 5 ? '#ef4444' : 'white',
                          boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)',
                          color: shotClockSeconds <= 5 ? 'white' : '#374151'
                        }}
                      >
                        <div className="text-2xl font-bold">{shotClockSeconds}</div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetShotClock}
                        style={{
                          boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                          background: 'white'
                        }}
                      >
                        <RotateCcw className="w-5 h-5" />
                      </Button>

                      <div className="text-sm font-semibold text-gray-500 ml-1">
                        {getQuarterLabel(game.quarter)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-4 flex-1 justify-end">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-700">{game.away_team_name}</div>
                    <div className="text-6xl font-bold text-gray-800 leading-none mt-1">{game.away_score}</div>
                    <div className="text-xs text-gray-500 mt-1">Fouls: {game.away_team_fouls}</div>
                  </div>
                  <div 
                    className="w-16 h-16 rounded-full"
                    style={{
                      background: game.away_team_color,
                      boxShadow: '4px 4px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile ScoreBoard */}
        <div className="block md:hidden">
          <div 
            className="p-4 relative"
            style={{
              background: '#e0e0e0',
              boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
            }}
          >
            <div className="flex items-start justify-between mb-3">
              {/* Home Team */}
              <div className="flex items-center gap-2">
                <div 
                  className="w-12 h-12 rounded-full"
                  style={{
                    background: game.home_team_color,
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.15)'
                  }}
                />
                <div>
                  <div className="text-sm font-bold text-gray-700 leading-tight">{game.home_team_name}</div>
                  <div className="text-5xl font-bold text-gray-800 leading-none mt-1">{game.home_score}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Fouls: {game.home_team_fouls}</div>
                </div>
              </div>

              {/* Center Clock */}
              <button 
                onClick={resetGameClock}
                className="text-center cursor-pointer hover:opacity-80 transition-opacity px-3 py-2 rounded-xl"
                style={{
                  background: 'white',
                  boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                }}
              >
                <div className="text-5xl font-bold text-gray-800 leading-tight">
                  {formatTime(gameClockSeconds)}
                </div>
              </button>

              {/* Away Team */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-700 leading-tight">{game.away_team_name}</div>
                  <div className="text-5xl font-bold text-gray-800 leading-none mt-1">{game.away_score}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Fouls: {game.away_team_fouls}</div>
                </div>
                <div 
                  className="w-12 h-12 rounded-full"
                  style={{
                    background: game.away_team_color,
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.15)'
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div 
              className="flex items-center justify-center gap-3 p-3 rounded-xl"
              style={{
                background: 'white',
                boxShadow: '3px 3px 6px rgba(0,0,0,0.1), -3px -3px 6px rgba(255,255,255,0.7)'
              }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRunning(!isRunning)}
                className="h-11 w-11 p-0"
                style={{
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.1), -2px -2px 4px rgba(255,255,255,0.7)',
                  background: 'white'
                }}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onEventFeedToggle}
                className="h-11 w-11 p-0"
                style={{
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.1), -2px -2px 4px rgba(255,255,255,0.7)',
                  background: 'white'
                }}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onQuickStat}
                className="h-11 px-5"
                style={{
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  background: '#000435',
                  color: 'white'
                }}
              >
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold">Stat</span>
              </Button>

              <div className="flex items-center gap-2">
                <div 
                  className="px-3 py-2 rounded-lg min-w-[3rem] text-center"
                  style={{
                    background: shotClockSeconds <= 5 ? '#ef4444' : 'white',
                    boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)',
                    color: shotClockSeconds <= 5 ? 'white' : '#374151'
                  }}
                >
                  <div className="text-xl font-bold leading-none">{shotClockSeconds}</div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetShotClock}
                  className="h-11 w-11 p-0"
                  style={{
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.1), -2px -2px 4px rgba(255,255,255,0.7)',
                    background: 'white'
                  }}
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>

                <div className="text-sm font-bold text-gray-600 ml-1">
                  {getQuarterLabel(game.quarter)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}