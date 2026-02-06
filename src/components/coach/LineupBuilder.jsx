import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Save } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function LineupBuilder({ teams }) {
  const [selectedTeam, setSelectedTeam] = useState(teams[0]?.id || '');
  const [starters, setStarters] = useState([]);
  const [bench, setBench] = useState([]);

  const { data: members = [] } = useQuery({
    queryKey: ['team-members-lineup', selectedTeam],
    queryFn: () => base44.entities.TeamMember.filter({ team_id: selectedTeam, role: 'player' }),
    enabled: !!selectedTeam,
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players-lineup'],
    queryFn: () => base44.entities.Player.list(),
  });

  React.useEffect(() => {
    if (members.length > 0) {
      setStarters(members.slice(0, 5));
      setBench(members.slice(5));
    }
  }, [members]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const items = source.droppableId === 'starters' ? [...starters] : [...bench];
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);

      if (source.droppableId === 'starters') {
        setStarters(items);
      } else {
        setBench(items);
      }
    } else {
      const sourceItems = source.droppableId === 'starters' ? [...starters] : [...bench];
      const destItems = destination.droppableId === 'starters' ? [...starters] : [...bench];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      if (source.droppableId === 'starters') {
        setStarters(sourceItems);
        setBench(destItems);
      } else {
        setStarters(destItems);
        setBench(sourceItems);
      }
    }
  };

  const getPlayer = (playerId) => players.find(p => p.id === playerId);

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D0FF00]" />
            Lineup Builder
          </CardTitle>
          <Button className="bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90">
            <Save className="w-4 h-4 mr-2" />
            Save Lineup
          </Button>
        </div>
        <div className="mt-4">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select team..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Starters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Starting 5</h3>
            <Droppable droppableId="starters">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2 min-h-[200px] p-3 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver ? 'border-[#D0FF00] bg-[#D0FF00]/5' : 'border-white/10'
                  }`}
                >
                  {starters.map((member, index) => {
                    const player = getPlayer(member.player_id);
                    return (
                      <Draggable key={member.id} draggableId={member.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-3 p-3 bg-white/5 rounded-lg ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="w-8 h-8 bg-[#D0FF00] rounded-full flex items-center justify-center font-bold text-[#0A0A0A]">
                              {member.jersey_number || '?'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-white">
                                {player ? `${player.first_name} ${player.last_name}` : 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-400">{player?.position || 'No position'}</p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-[#D0FF00]/20 text-[#D0FF00] rounded">
                              Starter
                            </span>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Bench */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Bench</h3>
            <Droppable droppableId="bench">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2 min-h-[200px] p-3 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver ? 'border-blue-400 bg-blue-400/5' : 'border-white/10'
                  }`}
                >
                  {bench.map((member, index) => {
                    const player = getPlayer(member.player_id);
                    return (
                      <Draggable key={member.id} draggableId={member.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-3 p-3 bg-white/5 rounded-lg ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center font-bold text-gray-400">
                              {member.jersey_number || '?'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-white">
                                {player ? `${player.first_name} ${player.last_name}` : 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-400">{player?.position || 'No position'}</p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
}