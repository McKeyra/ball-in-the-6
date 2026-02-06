import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Calendar, AlertCircle } from 'lucide-react';

export default function NaturalLanguageScheduler() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResult(null);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a basketball league scheduling assistant. The user wants to schedule games and needs your help.

User request: "${prompt}"

Based on this request, extract the following information and return it as JSON:
- What teams are involved (if mentioned)
- What dates or date ranges (if mentioned)
- How many games
- Any specific matchups
- Location preferences
- Time preferences

If information is missing, indicate what needs to be clarified.

Return your response in this format:
{
  "teams": ["team1", "team2", ...],
  "date_range": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"},
  "num_games": number,
  "specific_matchups": [{"home": "team1", "away": "team2"}],
  "location": "location name or null",
  "time": "HH:MM or null",
  "missing_info": ["list of missing information"],
  "suggestion": "helpful suggestion or next steps"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            teams: { type: "array", items: { type: "string" } },
            date_range: { 
              type: "object",
              properties: {
                start: { type: "string" },
                end: { type: "string" }
              }
            },
            num_games: { type: "number" },
            specific_matchups: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  home: { type: "string" },
                  away: { type: "string" }
                }
              }
            },
            location: { type: "string" },
            time: { type: "string" },
            missing_info: { type: "array", items: { type: "string" } },
            suggestion: { type: "string" }
          }
        }
      });

      setResult(response);
    } catch (error) {
      console.error('Error processing request:', error);
      setResult({
        error: true,
        message: 'Failed to process your request. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createGamesFromResult = async () => {
    if (!result || !result.specific_matchups) return;

    const gamesToCreate = result.specific_matchups.map((matchup, index) => {
      const date = result.date_range?.start || new Date().toISOString().split('T')[0];
      const gameDate = new Date(date);
      gameDate.setDate(gameDate.getDate() + index);

      return {
        sport: "basketball",
        home_team_name: matchup.home,
        away_team_name: matchup.away,
        home_team_color: "#1e40af",
        away_team_color: "#dc2626",
        status: "not_started",
        game_date: gameDate.toISOString().split('T')[0],
        game_time: result.time || "19:00",
        location: result.location || "TBD",
        home_score: 0,
        away_score: 0
      };
    });

    await base44.entities.Game.bulkCreate(gamesToCreate);
    queryClient.invalidateQueries(['games']);
    
    setResult({
      ...result,
      created: true,
      message: `Successfully created ${gamesToCreate.length} games!`
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div 
        className="p-8 rounded-3xl mb-6"
        style={{
          background: 'linear-gradient(135deg, #000435 0%, #1e40af 100%)',
          boxShadow: '8px 8px 16px rgba(0,0,0,0.2)'
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-8 h-8 text-white" />
          <h2 className="text-3xl font-bold text-white">Natural Language Scheduler</h2>
        </div>
        <p className="text-blue-100">
          Describe what games you want to schedule, and I'll help you set them up. Be as specific or general as you like!
        </p>
      </div>

      {/* Input Section */}
      <div 
        className="p-6 rounded-2xl mb-6"
        style={{
          background: '#e0e0e0',
          boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
        }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Tell me what you'd like to schedule:
        </label>
        
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="For example: 'Schedule 5 games for Crestwood Prep next week' or 'I need a matchup between Lincoln Prep and Hodan Prep on Friday at 7pm' or 'Create a round-robin tournament for all OSBA Mens teams starting next month'"
          className="min-h-32 mb-4"
          style={{
            background: 'white',
            border: 'none'
          }}
        />

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-2"
            style={{
              background: '#000435',
              color: 'white',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Processing...' : 'Analyze Request'}
          </Button>

          {prompt && (
            <Button
              onClick={() => {
                setPrompt('');
                setResult(null);
              }}
              variant="outline"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: '#e0e0e0',
            boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
          }}
        >
          {result.error ? (
            <div className="flex items-start gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Error</h3>
                <p className="text-sm">{result.message}</p>
              </div>
            </div>
          ) : result.created ? (
            <div className="flex items-start gap-3 text-green-600">
              <Calendar className="w-5 h-5 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Success!</h3>
                <p className="text-sm">{result.message}</p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Analysis Results</h3>
              
              <div className="space-y-4">
                {result.teams && result.teams.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">Teams Identified:</div>
                    <div className="flex flex-wrap gap-2">
                      {result.teams.map((team, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-800"
                        >
                          {team}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.date_range && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">Date Range:</div>
                    <div className="text-gray-800">
                      {result.date_range.start} to {result.date_range.end}
                    </div>
                  </div>
                )}

                {result.num_games && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">Number of Games:</div>
                    <div className="text-gray-800">{result.num_games}</div>
                  </div>
                )}

                {result.location && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">Location:</div>
                    <div className="text-gray-800">{result.location}</div>
                  </div>
                )}

                {result.time && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">Time:</div>
                    <div className="text-gray-800">{result.time}</div>
                  </div>
                )}

                {result.specific_matchups && result.specific_matchups.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">Proposed Matchups:</div>
                    <div className="space-y-2">
                      {result.specific_matchups.map((matchup, i) => (
                        <div 
                          key={i}
                          className="p-3 rounded-lg"
                          style={{
                            background: 'white',
                            boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <span className="font-semibold">{matchup.home}</span>
                          <span className="mx-2 text-gray-400">vs</span>
                          <span className="font-semibold">{matchup.away}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.missing_info && result.missing_info.length > 0 && (
                  <div 
                    className="p-4 rounded-lg"
                    style={{
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.3)'
                    }}
                  >
                    <div className="text-sm font-semibold text-amber-800 mb-2">Missing Information:</div>
                    <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                      {result.missing_info.map((info, i) => (
                        <li key={i}>{info}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.suggestion && (
                  <div 
                    className="p-4 rounded-lg"
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <div className="text-sm font-semibold text-blue-800 mb-2">Suggestion:</div>
                    <p className="text-sm text-blue-700">{result.suggestion}</p>
                  </div>
                )}

                {result.specific_matchups && result.specific_matchups.length > 0 && (
                  <div className="pt-4 border-t border-gray-300">
                    <Button
                      onClick={createGamesFromResult}
                      className="w-full"
                      style={{
                        background: '#10b981',
                        color: 'white',
                        boxShadow: '4px 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Create These Games
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Example Prompts */}
      {!result && (
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: '#e0e0e0',
            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
          }}
        >
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Example requests you can try:</h3>
          <div className="space-y-2">
            {[
              "Schedule Crestwood Prep vs Lincoln Prep this Friday at 7pm",
              "Create 5 games for Hodan Prep next week",
              "I need a round-robin for all OSBA Womens teams in December",
              "Set up playoffs between the top 4 Trillium Mens teams"
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="w-full text-left p-3 rounded-lg text-sm text-gray-700 hover:bg-white/50 transition-colors"
                style={{
                  background: 'white',
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}