'use client';

import { useState } from 'react';
import {
  Trophy, Star, Award as AwardIcon, Users, TrendingUp,
  Crown, Medal, Sparkles, Plus, ThumbsUp, Calendar,
} from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface User {
  email: string;
  full_name?: string;
}

interface AwardType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Award {
  id: string;
  type: string;
  recipient_name: string;
  team_name?: string;
  reason?: string;
  votes: string[];
  week_of?: string;
  month_of?: string;
  stats_snapshot?: {
    points?: number;
    assists?: number;
    rebounds?: number;
    wins?: number;
  };
  created_date: string;
}

interface Player {
  user_email: string;
  first_name: string;
  last_name: string;
  teams?: string[];
}

interface Team {
  id: string;
  name: string;
}

const awardTypes: AwardType[] = [
  { id: 'player_of_week', label: 'Player of the Week', icon: Star, color: 'from-yellow-400 to-orange-500' },
  { id: 'team_of_month', label: 'Team of the Month', icon: Trophy, color: 'from-purple-500 to-pink-500' },
  { id: 'mvp', label: 'MVP', icon: Crown, color: 'from-blue-500 to-cyan-500' },
  { id: 'most_improved', label: 'Most Improved', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
  { id: 'sportsmanship', label: 'Sportsmanship Award', icon: Medal, color: 'from-pink-500 to-rose-500' },
];

// ----------------------------------------------------------------
// NominationForm
// ----------------------------------------------------------------
function NominationForm({
  players,
  teams,
  onSubmit,
  onClose,
}: {
  players: Player[];
  teams: Team[];
  onSubmit: (data: Record<string, unknown>) => void;
  onClose: () => void;
}): React.ReactElement {
  const [formData, setFormData] = useState({
    type: 'player_of_week',
    recipient_type: 'player',
    recipient_id: '',
    recipient_name: '',
    team_id: '',
    team_name: '',
    reason: '',
  });

  const handleTypeChange = (type: string): void => {
    const isTeamAward = type === 'team_of_month';
    setFormData({
      ...formData,
      type,
      recipient_type: isTeamAward ? 'team' : 'player',
      recipient_id: '',
      recipient_name: '',
    });
  };

  const handleRecipientChange = (value: string): void => {
    if (formData.recipient_type === 'player') {
      const player = players.find((p) => p.user_email === value);
      const team = teams.find((t) => player?.teams?.includes(t.id));
      setFormData({
        ...formData,
        recipient_id: value,
        recipient_name: player ? `${player.first_name} ${player.last_name}` : '',
        team_id: team?.id || '',
        team_name: team?.name || '',
      });
    } else {
      const team = teams.find((t) => t.id === value);
      setFormData({
        ...formData,
        recipient_id: value,
        recipient_name: team?.name || '',
        team_id: value,
        team_name: team?.name || '',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Award Type</label>
        <select
          value={formData.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px]"
        >
          {awardTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          {formData.recipient_type === 'player' ? 'Select Player' : 'Select Team'}
        </label>
        <select
          value={formData.recipient_id}
          onChange={(e) => handleRecipientChange(e.target.value)}
          className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px]"
        >
          <option value="">Choose...</option>
          {formData.recipient_type === 'player'
            ? players.map((p) => (
                <option key={p.user_email} value={p.user_email}>
                  {p.first_name} {p.last_name}
                </option>
              ))
            : teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Reason for Nomination</label>
        <textarea
          placeholder="Why does this player/team deserve recognition?"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="w-full min-h-[100px] bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-3 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 min-h-[44px] border border-white/[0.06] rounded-lg text-white/60">
          Cancel
        </button>
        <button
          onClick={() => onSubmit(formData)}
          disabled={!formData.recipient_id}
          className="flex-1 bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] rounded-lg font-medium disabled:opacity-50"
        >
          Submit Nomination
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Page
// ----------------------------------------------------------------
export function AwardsPage(): React.ReactElement {
  const [showNominate, setShowNominate] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  // TODO: Replace with API calls
  // const { data: user } = useQuery({ queryKey: ['me'], queryFn: ... });
  // const { data: awards = [] } = useQuery({ queryKey: ['awards'], queryFn: ... });
  // const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: ... });
  // const { data: teams = [] } = useQuery({ queryKey: ['teams'], queryFn: ... });
  // TODO: Replace with actual auth hook
  const user = null as User | null;
  const awards: Award[] = [];
  const players: Player[] = [];
  const teams: Team[] = [];

  const filteredAwards = selectedTab === 'all' ? awards : awards.filter((a) => a.type === selectedTab);

  const handleVote = (awardId: string, votes: string[]): void => {
    // TODO: PATCH /api/awards/${awardId} toggle vote
  };

  const handleCreateAward = (data: Record<string, unknown>): void => {
    // TODO: POST /api/awards
    setShowNominate(false);
  };

  // Get current week/month featured awards
  const currentWeekStart = new Date();
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
  const playerOfWeek = awards.find(
    (a) => a.type === 'player_of_week' && a.week_of && new Date(a.week_of) >= currentWeekStart
  );
  const currentMonth = new Date().toISOString().slice(0, 7);
  const teamOfMonth = awards.find((a) => a.type === 'team_of_month' && a.month_of === currentMonth);

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-[#c9a962]" />
                Awards &amp; Recognition
              </h1>
              <p className="text-white/40 mt-1 text-sm md:text-base">Celebrating excellence in our community</p>
            </div>
            <button
              onClick={() => setShowNominate(true)}
              className="bg-gradient-to-r from-[#c9a962] to-[#d4b978] text-[#0f0f0f] min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nominate
            </button>
          </div>
        </div>

        {/* Featured Awards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Player of the Week */}
          <div className="bg-gradient-to-br from-[#c9a962]/20 to-[#d4b978]/10 border border-[#c9a962]/30 rounded-xl overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-[#c9a962]" />
                <h3 className="text-base md:text-lg font-bold text-white">Player of the Week</h3>
              </div>
              {playerOfWeek ? (
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#c9a962] to-[#d4b978] flex items-center justify-center text-[#0f0f0f] text-xl md:text-2xl font-bold flex-shrink-0">
                    {playerOfWeek.recipient_name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg md:text-xl font-bold text-white truncate">{playerOfWeek.recipient_name}</p>
                    <p className="text-[#c9a962] text-sm md:text-base truncate">{playerOfWeek.team_name}</p>
                    {playerOfWeek.stats_snapshot && (
                      <div className="flex gap-2 md:gap-3 mt-2 text-xs md:text-sm text-white/60">
                        <span>{playerOfWeek.stats_snapshot.points || 0} PTS</span>
                        <span>{playerOfWeek.stats_snapshot.assists || 0} AST</span>
                        <span>{playerOfWeek.stats_snapshot.rebounds || 0} REB</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 md:py-8">
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 text-[#c9a962]/50" />
                  <p className="text-white/40 text-sm md:text-base">No player of the week yet</p>
                  <p className="text-xs md:text-sm text-white/30">Nominate a standout player!</p>
                </div>
              )}
            </div>
          </div>

          {/* Team of the Month */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                <h3 className="text-base md:text-lg font-bold text-white">Team of the Month</h3>
              </div>
              {teamOfMonth ? (
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
                    <Users className="w-7 h-7 md:w-10 md:h-10" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg md:text-xl font-bold text-white truncate">{teamOfMonth.recipient_name}</p>
                    <p className="text-purple-300 text-sm md:text-base">
                      {teamOfMonth.month_of && new Date(teamOfMonth.month_of + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    {teamOfMonth.stats_snapshot && (
                      <div className="flex gap-2 md:gap-3 mt-2 text-xs md:text-sm text-white/60">
                        <span>{teamOfMonth.stats_snapshot.wins || 0} Wins</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 md:py-8">
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 text-purple-500/50" />
                  <p className="text-white/40 text-sm md:text-base">No team of the month yet</p>
                  <p className="text-xs md:text-sm text-white/30">Nominate a dominant team!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Award Types Filter */}
        <div className="flex flex-wrap gap-1 p-1 bg-white/[0.08] border border-white/[0.08] rounded-lg mb-4 md:mb-6">
          <button
            onClick={() => setSelectedTab('all')}
            className={`min-h-[40px] text-xs sm:text-sm px-3 rounded-md ${selectedTab === 'all' ? 'bg-[#c9a962] text-[#0f0f0f]' : 'text-white/50'}`}
          >
            All Awards
          </button>
          {awardTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedTab(type.id)}
              className={`min-h-[40px] text-xs sm:text-sm px-2 sm:px-3 rounded-md ${selectedTab === type.id ? 'bg-[#c9a962] text-[#0f0f0f]' : 'text-white/50'}`}
            >
              <span className="hidden sm:inline">{type.label}</span>
              <span className="sm:hidden">{type.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredAwards.map((award) => {
            const awardType = awardTypes.find((t) => t.id === award.type);
            const Icon = awardType?.icon || AwardIcon;
            const hasVoted = award.votes?.includes(user?.email || '');

            return (
              <div key={award.id} className="bg-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.08] transition-all active:scale-[0.99]">
                <div className={`h-2 bg-gradient-to-r ${awardType?.color || 'from-white/20 to-white/30'}`} />
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${awardType?.color || 'from-white/20 to-white/30'} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="px-2 py-1 border border-white/[0.08] rounded text-xs text-white/40">
                      <span className="hidden sm:inline">{awardType?.label}</span>
                      <span className="sm:hidden">{awardType?.label?.split(' ')[0]}</span>
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-white mb-1 truncate">{award.recipient_name}</h3>
                  {award.team_name && <p className="text-xs md:text-sm text-white/40 mb-2 truncate">{award.team_name}</p>}
                  {award.reason && <p className="text-xs md:text-sm text-white/30 mb-3 md:mb-4 line-clamp-2">{award.reason}</p>}

                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/[0.06]">
                    <div className="text-xs md:text-sm text-white/30 flex items-center gap-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      {new Date(award.created_date).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => handleVote(award.id, award.votes || [])}
                      className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs md:text-sm transition-all min-h-[44px] ${
                        hasVoted
                          ? 'bg-[#c9a962]/20 text-[#c9a962]'
                          : 'bg-white/[0.08] text-white/40 hover:bg-white/[0.12]'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                      {award.votes?.length || 0}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAwards.length === 0 && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-12 md:py-16 text-center px-4">
            <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No awards yet</h3>
            <p className="text-white/40 mb-4 text-sm md:text-base">Be the first to recognize outstanding performance!</p>
            <button
              onClick={() => setShowNominate(true)}
              className="bg-gradient-to-r from-[#c9a962] to-[#d4b978] text-[#0f0f0f] min-h-[44px] px-4 py-2 rounded-lg font-medium"
            >
              Submit Nomination
            </button>
          </div>
        )}

        {/* Nomination Dialog */}
        {showNominate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-w-lg w-full bg-[#121212] border border-white/[0.06] text-white rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Submit a Nomination</h2>
              <NominationForm
                players={players}
                teams={teams}
                onSubmit={handleCreateAward}
                onClose={() => setShowNominate(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
