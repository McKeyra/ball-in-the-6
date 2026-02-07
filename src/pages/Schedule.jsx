import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus, MapPin, Clock, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import VenueOpponentManager from "../components/schedule/VenueOpponentManager";

export default function Schedule() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const { data: scheduleItems = [] } = useQuery({
    queryKey: ['schedule'],
    queryFn: () => base44.entities.ScheduleItem.list('-date'),
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
  });

  const { data: opponents = [] } = useQuery({
    queryKey: ['opponents'],
    queryFn: () => base44.entities.Opponent.list(),
  });

  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ScheduleItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['schedule']);
      setCreateOpen(false);
      resetForm();
    },
  });

  const [formData, setFormData] = useState({
    type: 'game',
    title: '',
    team_id: '',
    opponent_id: '',
    venue_id: '',
    date: '',
    time: '',
    home_away: 'home',
    visibility: 'public',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      type: 'game',
      title: '',
      team_id: '',
      opponent_id: '',
      venue_id: '',
      date: '',
      time: '',
      home_away: 'home',
      visibility: 'public',
      notes: '',
    });
  };

  const getTeamName = (teamId) => teams.find(t => t.id === teamId)?.name || 'Unknown Team';
  const getOpponentName = (oppId) => opponents.find(o => o.id === oppId)?.name || 'TBD';
  const getVenueName = (venueId) => venues.find(v => v.id === venueId)?.name || 'TBD';

  const typeColors = {
    game: 'from-red-500 to-pink-500',
    practice: 'from-blue-500 to-cyan-500',
    tournament: 'from-purple-500 to-indigo-500',
    event: 'from-green-500 to-emerald-500',
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">Schedule</h1>
            <p className="text-sm md:text-base text-white/40">Manage games, practices, tournaments & events</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setManageOpen(true)}
              variant="outline"
              className="border-white/[0.06] min-h-[44px] text-xs md:text-sm"
            >
              <span className="hidden sm:inline">Manage</span> Venues & Opponents
            </Button>
            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90 min-h-[44px] text-xs md:text-sm"
            >
              <Plus className="w-4 h-4 mr-1 md:mr-2" />
              Add to Schedule
            </Button>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          {scheduleItems.length === 0 ? (
            <Card className="bg-white/[0.05] border-white/[0.06]">
              <CardContent className="py-8 md:py-12 text-center">
                <CalendarIcon className="w-10 h-10 md:w-12 md:h-12 text-white/40 mx-auto mb-4" />
                <p className="text-sm md:text-base text-white/40">No scheduled items yet. Add your first game or event!</p>
              </CardContent>
            </Card>
          ) : (
            scheduleItems.map((item) => (
              <Card key={item.id} className="bg-white/[0.05] border-white/[0.06] hover:border-[#c9a962]/50 transition-all overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className={`h-1 md:h-auto md:w-2 bg-gradient-to-r md:bg-gradient-to-b ${typeColors[item.type]}`} />
                  <CardContent className="flex-1 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                          <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold bg-gradient-to-r ${typeColors[item.type]} text-white`}>
                            {item.type.toUpperCase()}
                          </span>
                          {item.visibility === 'team_only' && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] md:text-xs rounded flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Team Only
                            </span>
                          )}
                        </div>

                        <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2 truncate">
                          {item.type === 'game' && item.opponent_id ?
                            `${getTeamName(item.team_id)} vs ${getOpponentName(item.opponent_id)}` :
                            item.title
                          }
                        </h3>

                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-white/40">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span className="truncate">{format(new Date(item.date), 'EEE, MMM d, yyyy')}</span>
                          </div>
                          {item.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                              <span>{item.time}</span>
                            </div>
                          )}
                          {item.venue_id && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                              <span className="truncate">{getVenueName(item.venue_id)}</span>
                            </div>
                          )}
                        </div>

                        {item.notes && (
                          <p className="mt-2 md:mt-3 text-xs md:text-sm text-white/50 line-clamp-2">{item.notes}</p>
                        )}
                      </div>

                      {item.status === 'completed' && item.type === 'game' && (
                        <div className="flex md:flex-col items-center md:items-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.06] mt-2 md:mt-0">
                          <div className="text-center bg-white/[0.05] rounded-lg p-2 md:p-3 min-w-[60px]">
                            <p className="text-lg md:text-2xl font-bold">{item.our_score || 0}</p>
                            <p className="text-[10px] md:text-xs text-white/40">Us</p>
                          </div>
                          <div className="text-base md:text-xl font-bold text-white/30">-</div>
                          <div className="text-center bg-white/[0.05] rounded-lg p-2 md:p-3 min-w-[60px]">
                            <p className="text-lg md:text-2xl font-bold">{item.opponent_score || 0}</p>
                            <p className="text-[10px] md:text-xs text-white/40">Them</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Create Schedule Item Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="bg-[#121212] border-white/[0.06] text-white max-w-2xl max-h-[90vh] overflow-y-auto mx-4 p-4 md:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Add to Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Type</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.06] min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/[0.06]">
                      <SelectItem value="game" className="min-h-[44px]">Game</SelectItem>
                      <SelectItem value="practice" className="min-h-[44px]">Practice</SelectItem>
                      <SelectItem value="tournament" className="min-h-[44px]">Tournament</SelectItem>
                      <SelectItem value="event" className="min-h-[44px]">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Team</Label>
                  <Select value={formData.team_id} onValueChange={(val) => setFormData({...formData, team_id: val})}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.06] min-h-[44px]">
                      <SelectValue placeholder="Select team..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/[0.06]">
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id} className="min-h-[44px]">{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Title / Description</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Practice Session, Championship Game"
                  className="bg-white/[0.05] border-white/[0.06] min-h-[44px]"
                />
              </div>

              {formData.type === 'game' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Opponent</Label>
                    <Select value={formData.opponent_id} onValueChange={(val) => setFormData({...formData, opponent_id: val})}>
                      <SelectTrigger className="bg-white/[0.05] border-white/[0.06] min-h-[44px]">
                        <SelectValue placeholder="Select opponent..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-white/[0.06]">
                        {opponents.map(opp => (
                          <SelectItem key={opp.id} value={opp.id} className="min-h-[44px]">{opp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Home / Away</Label>
                    <Select value={formData.home_away} onValueChange={(val) => setFormData({...formData, home_away: val})}>
                      <SelectTrigger className="bg-white/[0.05] border-white/[0.06] min-h-[44px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-white/[0.06]">
                        <SelectItem value="home" className="min-h-[44px]">Home</SelectItem>
                        <SelectItem value="away" className="min-h-[44px]">Away</SelectItem>
                        <SelectItem value="neutral" className="min-h-[44px]">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm">Venue</Label>
                <Select value={formData.venue_id} onValueChange={(val) => setFormData({...formData, venue_id: val})}>
                  <SelectTrigger className="bg-white/[0.05] border-white/[0.06] min-h-[44px]">
                    <SelectValue placeholder="Select venue..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121212] border-white/[0.06]">
                    {venues.map(venue => (
                      <SelectItem key={venue.id} value={venue.id} className="min-h-[44px]">
                        {venue.name} - {venue.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="bg-white/[0.05] border-white/[0.06] min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Time</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="bg-white/[0.05] border-white/[0.06] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Visibility</Label>
                <Select value={formData.visibility} onValueChange={(val) => setFormData({...formData, visibility: val})}>
                  <SelectTrigger className="bg-white/[0.05] border-white/[0.06] min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121212] border-white/[0.06]">
                    <SelectItem value="public" className="min-h-[44px]">Public</SelectItem>
                    <SelectItem value="team_only" className="min-h-[44px]">Team Only</SelectItem>
                    <SelectItem value="private" className="min-h-[44px]">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Notes (Optional)</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional details..."
                  className="bg-white/[0.05] border-white/[0.06]"
                  rows={3}
                />
              </div>

              <Button
                onClick={() => createMutation.mutate(formData)}
                className="w-full bg-[#c9a962] text-[#0A0A0A] hover:bg-[#c9a962]/90 min-h-[48px]"
                disabled={!formData.title || !formData.date}
              >
                Add to Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Venue & Opponent Manager */}
        <VenueOpponentManager open={manageOpen} onOpenChange={setManageOpen} />
      </div>
    </div>
  );
}