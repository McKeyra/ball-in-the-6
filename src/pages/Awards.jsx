import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Trophy, Star, Award as AwardIcon, Users, TrendingUp, 
  Crown, Medal, Sparkles, Plus, ThumbsUp, Calendar 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const awardTypes = [
  { id: "player_of_week", label: "Player of the Week", icon: Star, color: "from-yellow-400 to-orange-500" },
  { id: "team_of_month", label: "Team of the Month", icon: Trophy, color: "from-purple-500 to-pink-500" },
  { id: "mvp", label: "MVP", icon: Crown, color: "from-blue-500 to-cyan-500" },
  { id: "most_improved", label: "Most Improved", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
  { id: "sportsmanship", label: "Sportsmanship Award", icon: Medal, color: "from-pink-500 to-rose-500" },
];

export default function Awards() {
  const [user, setUser] = useState(null);
  const [showNominate, setShowNominate] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: awards = [] } = useQuery({
    queryKey: ['awards'],
    queryFn: () => base44.entities.Award.list('-created_date'),
    enabled: !!user,
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => base44.entities.Player.list(),
    enabled: !!user,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
    enabled: !!user,
  });

  const { data: leagues = [] } = useQuery({
    queryKey: ['leagues'],
    queryFn: () => base44.entities.League.list(),
    enabled: !!user,
  });

  const voteMutation = useMutation({
    mutationFn: async ({ awardId, votes }) => {
      const newVotes = votes.includes(user.email)
        ? votes.filter(e => e !== user.email)
        : [...votes, user.email];
      return base44.entities.Award.update(awardId, { votes: newVotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      toast.success('Vote recorded!');
    }
  });

  const createAwardMutation = useMutation({
    mutationFn: (data) => base44.entities.Award.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      setShowNominate(false);
      toast.success('Nomination submitted!');
    }
  });

  const filteredAwards = selectedTab === "all" 
    ? awards 
    : awards.filter(a => a.type === selectedTab);

  // Get current week's player of the week
  const currentWeekStart = new Date();
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
  const playerOfWeek = awards.find(a => 
    a.type === 'player_of_week' && 
    new Date(a.week_of) >= currentWeekStart
  );

  // Get current month's team of the month
  const currentMonth = new Date().toISOString().slice(0, 7);
  const teamOfMonth = awards.find(a => 
    a.type === 'team_of_month' && 
    a.month_of === currentMonth
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-[#c9a962]" />
                Awards & Recognition
              </h1>
              <p className="text-white/40 mt-1 text-sm md:text-base">Celebrating excellence in our community</p>
            </div>
            <Dialog open={showNominate} onOpenChange={setShowNominate}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#c9a962] to-[#d4b978] text-[#0f0f0f] min-h-[44px] w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Nominate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Submit a Nomination</DialogTitle>
                </DialogHeader>
                <NominationForm 
                  players={players}
                  teams={teams}
                  leagues={leagues}
                  onSubmit={createAwardMutation.mutate}
                  onClose={() => setShowNominate(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Featured Awards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Player of the Week */}
          <Card className="bg-gradient-to-br from-[#c9a962]/20 to-[#d4b978]/10 border-[#c9a962]/30 overflow-hidden">
            <CardContent className="p-4 md:p-6">
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
            </CardContent>
          </Card>

          {/* Team of the Month */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 overflow-hidden">
            <CardContent className="p-4 md:p-6">
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
                    <p className="text-purple-300 text-sm md:text-base">{new Date(teamOfMonth.month_of + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
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
            </CardContent>
          </Card>
        </div>

        {/* Award Types Filter */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4 md:mb-6">
          <TabsList className="bg-white/[0.08] border-white/[0.08] flex flex-wrap h-auto p-1 gap-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#c9a962] data-[state=active]:text-[#0f0f0f] min-h-[40px] text-xs sm:text-sm px-3">All Awards</TabsTrigger>
            {awardTypes.map(type => (
              <TabsTrigger key={type.id} value={type.id} className="data-[state=active]:bg-[#c9a962] data-[state=active]:text-[#0f0f0f] min-h-[40px] text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">{type.label}</span>
                <span className="sm:hidden">{type.label.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredAwards.map((award, index) => {
              const awardType = awardTypes.find(t => t.id === award.type);
              const Icon = awardType?.icon || AwardIcon;
              const hasVoted = award.votes?.includes(user?.email);

              return (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-white/[0.05] border-white/[0.06] overflow-hidden hover:border-white/[0.08] transition-all active:scale-[0.99]">
                    <div className={`h-2 bg-gradient-to-r ${awardType?.color || 'from-white/20 to-white/30'}`} />
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${awardType?.color || 'from-white/20 to-white/30'} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-white/40 border-white/[0.08] text-xs">
                          <span className="hidden sm:inline">{awardType?.label}</span>
                          <span className="sm:hidden">{awardType?.label?.split(' ')[0]}</span>
                        </Badge>
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-white mb-1 truncate">{award.recipient_name}</h3>
                      {award.team_name && (
                        <p className="text-xs md:text-sm text-white/40 mb-2 truncate">{award.team_name}</p>
                      )}
                      {award.reason && (
                        <p className="text-xs md:text-sm text-white/30 mb-3 md:mb-4 line-clamp-2">{award.reason}</p>
                      )}

                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/[0.06]">
                        <div className="text-xs md:text-sm text-white/30 flex items-center gap-1">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                          {new Date(award.created_date).toLocaleDateString()}
                        </div>
                        <button
                          onClick={() => voteMutation.mutate({ awardId: award.id, votes: award.votes || [] })}
                          className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs md:text-sm transition-all min-h-[44px] ${
                            hasVoted
                              ? 'bg-[#c9a962]/20 text-[#c9a962]'
                              : 'bg-white/[0.08] text-white/40 hover:bg-white/[0.12] active:bg-white/[0.15]'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                          {award.votes?.length || 0}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredAwards.length === 0 && (
          <Card className="bg-white/[0.03] border-white/[0.06]">
            <CardContent className="py-12 md:py-16 text-center px-4">
              <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/20" />
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No awards yet</h3>
              <p className="text-white/40 mb-4 text-sm md:text-base">Be the first to recognize outstanding performance!</p>
              <Button onClick={() => setShowNominate(true)} className="bg-gradient-to-r from-[#c9a962] to-[#d4b978] text-[#0f0f0f] min-h-[44px]">
                Submit Nomination
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function NominationForm({ players, teams, leagues, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    type: "player_of_week",
    recipient_type: "player",
    recipient_id: "",
    recipient_name: "",
    team_id: "",
    team_name: "",
    league_id: "",
    reason: "",
    week_of: new Date().toISOString().slice(0, 10),
    month_of: new Date().toISOString().slice(0, 7),
    votes: []
  });

  const handleRecipientChange = (value) => {
    if (formData.recipient_type === "player") {
      const player = players.find(p => p.user_email === value);
      const team = teams.find(t => player?.teams?.includes(t.id));
      setFormData({
        ...formData,
        recipient_id: value,
        recipient_name: player ? `${player.first_name} ${player.last_name}` : "",
        team_id: team?.id || "",
        team_name: team?.name || ""
      });
    } else {
      const team = teams.find(t => t.id === value);
      setFormData({
        ...formData,
        recipient_id: value,
        recipient_name: team?.name || "",
        team_id: value,
        team_name: team?.name || ""
      });
    }
  };

  const handleTypeChange = (type) => {
    const isTeamAward = type === "team_of_month";
    setFormData({
      ...formData,
      type,
      recipient_type: isTeamAward ? "team" : "player",
      recipient_id: "",
      recipient_name: ""
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Award Type</label>
        <Select value={formData.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {awardTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          {formData.recipient_type === "player" ? "Select Player" : "Select Team"}
        </label>
        <Select value={formData.recipient_id} onValueChange={handleRecipientChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose..." />
          </SelectTrigger>
          <SelectContent>
            {formData.recipient_type === "player" ? (
              players.map(player => (
                <SelectItem key={player.user_email} value={player.user_email}>
                  {player.first_name} {player.last_name}
                </SelectItem>
              ))
            ) : (
              teams.map(team => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Reason for Nomination</label>
        <Textarea
          placeholder="Why does this player/team deserve recognition?"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        />
      </div>

      <Button
        onClick={() => onSubmit(formData)}
        disabled={!formData.recipient_id}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500"
      >
        Submit Nomination
      </Button>
    </div>
  );
}