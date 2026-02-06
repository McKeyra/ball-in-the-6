import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Users, Heart, Share2, Bell, Instagram, Twitter, 
  Facebook, Youtube, Plus, ExternalLink, Megaphone 
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function FanPages() {
  const [user, setUser] = useState(null);
  const [selectedFanPage, setSelectedFanPage] = useState(null);
  const [showCreatePage, setShowCreatePage] = useState(false);
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

  const { data: fanPages = [] } = useQuery({
    queryKey: ['fanPages'],
    queryFn: () => base44.entities.FanPage.list('-created_date'),
    enabled: !!user,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
    enabled: !!user,
  });

  const { data: myTeams = [] } = useQuery({
    queryKey: ['myTeams', user?.email],
    queryFn: () => base44.entities.Team.filter({ coach_email: user?.email }),
    enabled: !!user,
  });

  const followMutation = useMutation({
    mutationFn: async ({ pageId, followers }) => {
      const newFollowers = followers.includes(user.email)
        ? followers.filter(e => e !== user.email)
        : [...followers, user.email];
      return base44.entities.FanPage.update(pageId, { followers: newFollowers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fanPages'] });
      toast.success('Updated!');
    }
  });

  const createFanPageMutation = useMutation({
    mutationFn: (data) => base44.entities.FanPage.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fanPages'] });
      setShowCreatePage(false);
      toast.success('Fan page created!');
    }
  });

  const teamsWithoutFanPage = myTeams.filter(
    team => !fanPages.some(fp => fp.team_id === team.id)
  );

  const handleShare = (fanPage, platform) => {
    const url = `${window.location.origin}${createPageUrl("FanPages")}?team=${fanPage.team_id}`;
    const text = `Check out ${fanPage.team_name} on Ball in the 6!`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    } else {
      window.open(shareUrls[platform], '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Heart className="w-8 h-8 text-pink-600" />
                Team Fan Pages
              </h1>
              <p className="text-white/50 mt-1">Follow your favorite teams and stay updated</p>
            </div>
            {teamsWithoutFanPage.length > 0 && (
              <Button 
                onClick={() => setShowCreatePage(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Fan Page
              </Button>
            )}
          </div>
        </div>

        {/* Fan Pages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fanPages.map((fanPage, index) => {
            const team = teams.find(t => t.id === fanPage.team_id);
            const isFollowing = fanPage.followers?.includes(user?.email);
            
            return (
              <motion.div
                key={fanPage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  {/* Banner */}
                  <div 
                    className="h-32 bg-gradient-to-r from-orange-500 to-pink-600 relative"
                    style={fanPage.banner_image ? { backgroundImage: `url(${fanPage.banner_image})`, backgroundSize: 'cover' } : {}}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    {team?.team_logo && (
                      <div className="absolute -bottom-8 left-6">
                        <img 
                          src={team.team_logo} 
                          alt={fanPage.team_name}
                          className="w-16 h-16 rounded-xl border-4 border-white shadow-lg object-cover"
                        />
                      </div>
                    )}
                    {!team?.team_logo && (
                      <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl border-4 border-white shadow-lg bg-white flex items-center justify-center">
                        <Users className="w-8 h-8 text-white/30" />
                      </div>
                    )}
                  </div>

                  <CardContent className="pt-12 pb-6 px-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{fanPage.team_name}</h3>
                        <p className="text-sm text-white/40">{fanPage.followers?.length || 0} followers</p>
                      </div>
                      <Button
                        size="sm"
                        variant={isFollowing ? "outline" : "default"}
                        onClick={() => followMutation.mutate({ pageId: fanPage.id, followers: fanPage.followers || [] })}
                        className={isFollowing ? "" : "bg-gradient-to-r from-orange-500 to-pink-600"}
                      >
                        {isFollowing ? (
                          <>
                            <Bell className="w-4 h-4 mr-1" />
                            Following
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4 mr-1" />
                            Follow
                          </>
                        )}
                      </Button>
                    </div>

                    {fanPage.description && (
                      <p className="text-white/50 text-sm mb-4 line-clamp-2">{fanPage.description}</p>
                    )}

                    {/* Social Links */}
                    <div className="flex items-center gap-2 mb-4">
                      {fanPage.social_links?.instagram && (
                        <a href={fanPage.social_links.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white hover:opacity-80">
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {fanPage.social_links?.twitter && (
                        <a href={fanPage.social_links.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-400 rounded-lg text-white hover:opacity-80">
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {fanPage.social_links?.facebook && (
                        <a href={fanPage.social_links.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 rounded-lg text-white hover:opacity-80">
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {fanPage.social_links?.youtube && (
                        <a href={fanPage.social_links.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-red-600 rounded-lg text-white hover:opacity-80">
                          <Youtube className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Share Buttons */}
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <span className="text-sm text-white/40">Share:</span>
                      <button onClick={() => handleShare(fanPage, 'twitter')} className="p-1.5 hover:bg-white/[0.05] rounded">
                        <Twitter className="w-4 h-4 text-blue-400" />
                      </button>
                      <button onClick={() => handleShare(fanPage, 'facebook')} className="p-1.5 hover:bg-white/[0.05] rounded">
                        <Facebook className="w-4 h-4 text-blue-600" />
                      </button>
                      <button onClick={() => handleShare(fanPage, 'copy')} className="p-1.5 hover:bg-white/[0.05] rounded">
                        <Share2 className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {fanPages.length === 0 && (
          <Card className="border-none shadow-lg">
            <CardContent className="py-16 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <h3 className="text-xl font-semibold text-white mb-2">No fan pages yet</h3>
              <p className="text-white/50 mb-4">Create a fan page for your team to connect with supporters!</p>
              {teamsWithoutFanPage.length > 0 && (
                <Button onClick={() => setShowCreatePage(true)} className="bg-gradient-to-r from-orange-500 to-pink-600">
                  Create Fan Page
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create Fan Page Dialog */}
        <CreateFanPageDialog
          open={showCreatePage}
          onOpenChange={setShowCreatePage}
          teams={teamsWithoutFanPage}
          onSubmit={createFanPageMutation.mutate}
        />
      </div>
    </div>
  );
}

function CreateFanPageDialog({ open, onOpenChange, teams, onSubmit }) {
  const [formData, setFormData] = useState({
    team_id: "",
    team_name: "",
    description: "",
    social_links: { instagram: "", twitter: "", facebook: "", youtube: "" }
  });

  const handleTeamSelect = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    setFormData({ ...formData, team_id: teamId, team_name: team?.name || "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Team Fan Page</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Team</label>
            <select
              value={formData.team_id}
              onChange={(e) => handleTeamSelect(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Choose a team...</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="Tell fans about your team..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Instagram URL"
              value={formData.social_links.instagram}
              onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, instagram: e.target.value } })}
            />
            <Input
              placeholder="Twitter URL"
              value={formData.social_links.twitter}
              onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, twitter: e.target.value } })}
            />
            <Input
              placeholder="Facebook URL"
              value={formData.social_links.facebook}
              onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, facebook: e.target.value } })}
            />
            <Input
              placeholder="YouTube URL"
              value={formData.social_links.youtube}
              onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, youtube: e.target.value } })}
            />
          </div>
          <Button
            onClick={() => onSubmit({ ...formData, followers: [], announcements: [] })}
            disabled={!formData.team_id}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-600"
          >
            Create Fan Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}