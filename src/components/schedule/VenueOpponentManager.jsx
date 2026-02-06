import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, MapPin, Users } from "lucide-react";

export default function VenueOpponentManager({ open, onOpenChange }) {
  const queryClient = useQueryClient();

  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list(),
  });

  const { data: opponents = [] } = useQuery({
    queryKey: ['opponents'],
    queryFn: () => base44.entities.Opponent.list(),
  });

  const createVenueMutation = useMutation({
    mutationFn: (data) => base44.entities.Venue.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['venues']);
      setVenueForm({ name: '', address: '', city: '', state: '' });
    },
  });

  const createOpponentMutation = useMutation({
    mutationFn: (data) => base44.entities.Opponent.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['opponents']);
      setOpponentForm({ name: '', location: '', color: '#FF0000' });
    },
  });

  const deleteVenueMutation = useMutation({
    mutationFn: (id) => base44.entities.Venue.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['venues']),
  });

  const deleteOpponentMutation = useMutation({
    mutationFn: (id) => base44.entities.Opponent.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['opponents']),
  });

  const [venueForm, setVenueForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
  });

  const [opponentForm, setOpponentForm] = useState({
    name: '',
    location: '',
    color: '#FF0000',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Venues & Opponents</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="venues" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="opponents">Opponents</TabsTrigger>
          </TabsList>

          <TabsContent value="venues" className="flex-1 overflow-y-auto space-y-4 mt-4">
            <div className="p-4 bg-white/5 rounded-lg space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D0FF00]" />
                Add New Venue
              </h3>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Venue Name</Label>
                  <Input 
                    value={venueForm.name}
                    onChange={(e) => setVenueForm({...venueForm, name: e.target.value})}
                    placeholder="e.g., Scotiabank Arena"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input 
                    value={venueForm.address}
                    onChange={(e) => setVenueForm({...venueForm, address: e.target.value})}
                    placeholder="Street address"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input 
                    value={venueForm.city}
                    onChange={(e) => setVenueForm({...venueForm, city: e.target.value})}
                    placeholder="City"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>State / Province</Label>
                  <Input 
                    value={venueForm.state}
                    onChange={(e) => setVenueForm({...venueForm, state: e.target.value})}
                    placeholder="ON, CA, NY"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <Button 
                onClick={() => createVenueMutation.mutate(venueForm)}
                className="bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90"
                disabled={!venueForm.name || !venueForm.city}
              >
                Add Venue
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-400">Saved Venues ({venues.length})</h3>
              {venues.map((venue) => (
                <div key={venue.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#D0FF00]" />
                    <div>
                      <p className="font-medium">{venue.name}</p>
                      <p className="text-sm text-gray-400">
                        {venue.address && `${venue.address}, `}{venue.city}, {venue.state}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteVenueMutation.mutate(venue.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opponents" className="flex-1 overflow-y-auto space-y-4 mt-4">
            <div className="p-4 bg-white/5 rounded-lg space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D0FF00]" />
                Add New Opponent
              </h3>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Team Name</Label>
                  <Input 
                    value={opponentForm.name}
                    onChange={(e) => setOpponentForm({...opponentForm, name: e.target.value})}
                    placeholder="e.g., Toronto Raptors Elite"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    value={opponentForm.location}
                    onChange={(e) => setOpponentForm({...opponentForm, location: e.target.value})}
                    placeholder="City, State"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Team Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color"
                      value={opponentForm.color}
                      onChange={(e) => setOpponentForm({...opponentForm, color: e.target.value})}
                      className="w-16 bg-white/5 border-white/10"
                    />
                    <Input 
                      value={opponentForm.color}
                      onChange={(e) => setOpponentForm({...opponentForm, color: e.target.value})}
                      className="flex-1 bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => createOpponentMutation.mutate(opponentForm)}
                className="bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90"
                disabled={!opponentForm.name}
              >
                Add Opponent
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-400">Saved Opponents ({opponents.length})</h3>
              {opponents.map((opponent) => (
                <div key={opponent.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: opponent.color || '#FF0000' }}
                    >
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{opponent.name}</p>
                      {opponent.location && (
                        <p className="text-sm text-gray-400">{opponent.location}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteOpponentMutation.mutate(opponent.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}