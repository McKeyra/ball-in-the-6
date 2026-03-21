'use client';

import { useState } from 'react';
import {
  Users, Heart, Share2, Bell, Plus,
} from 'lucide-react';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface User {
  email: string;
  full_name?: string;
}

interface Team {
  id: string;
  name?: string;
  team_name?: string;
  team_color?: string;
  team_logo?: string;
  coach_email?: string;
}

interface FanPage {
  id: string;
  team_id: string;
  team_name: string;
  description?: string;
  banner_image?: string;
  followers: string[];
  social_links?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
  };
}

export function FanPagesPage(): React.ReactElement {
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [createForm, setCreateForm] = useState({
    team_id: '',
    team_name: '',
    description: '',
    social_links: { instagram: '', twitter: '', facebook: '', youtube: '' },
  });

  // TODO: Replace with API calls
  // const { data: user } = useQuery({ queryKey: ['me'], queryFn: ... });
  // const { data: fanPages = [] } = useQuery({ queryKey: ['fanPages'], queryFn: ... });
  // const { data: teams = [] } = useQuery({ queryKey: ['teams'], queryFn: ... });
  const user = null as User | null;
  const fanPages: FanPage[] = [];
  const teams: Team[] = [];
  const myTeams: Team[] = [];

  const teamsWithoutFanPage = myTeams.filter(
    (team) => !fanPages.some((fp) => fp.team_id === team.id)
  );

  const handleFollow = (pageId: string, followers: string[]): void => {
    // TODO: PATCH /api/fan-pages/${pageId} toggle follow
  };

  const handleShare = (fanPage: FanPage, platform: string): void => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/fan-pages?team=${fanPage.team_id}`;
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
    } else {
      const shareUrls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${fanPage.team_name} on Ball in the 6!`)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      };
      window.open(shareUrls[platform], '_blank');
    }
  };

  const handleCreateFanPage = (): void => {
    if (!createForm.team_id) return;
    // TODO: POST /api/fan-pages
    setShowCreatePage(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
                Team Fan Pages
              </h1>
              <p className="text-white/50 mt-1 text-sm md:text-base">Follow your favorite teams and stay updated</p>
            </div>
            {teamsWithoutFanPage.length > 0 && (
              <button
                onClick={() => setShowCreatePage(true)}
                className="bg-gradient-to-r from-[#c9a962] to-[#d4b978] text-[#0f0f0f] min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Fan Page
              </button>
            )}
          </div>
        </div>

        {/* Fan Pages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {fanPages.map((fanPage) => {
            const team = teams.find((t) => t.id === fanPage.team_id);
            const isFollowing = fanPage.followers?.includes(user?.email || '');
            return (
              <div key={fanPage.id} className="bg-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.08] transition-all">
                {/* Banner */}
                <div
                  className="h-32 relative"
                  style={{
                    background: fanPage.banner_image ? `url(${fanPage.banner_image}) center/cover` : '#c9a962',
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl border-4 border-[#121212] shadow-lg bg-[#121212] flex items-center justify-center">
                    {team?.team_logo ? (
                      <img src={team.team_logo} alt={fanPage.team_name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-white/30" />
                    )}
                  </div>
                </div>

                <div className="pt-10 sm:pt-12 pb-4 sm:pb-6 px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{fanPage.team_name}</h3>
                      <p className="text-xs sm:text-sm text-white/40">{fanPage.followers?.length || 0} followers</p>
                    </div>
                    <button
                      onClick={() => handleFollow(fanPage.id, fanPage.followers || [])}
                      className={`min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                        isFollowing
                          ? 'border border-white/[0.06] text-white/60'
                          : 'bg-gradient-to-r from-[#c9a962] to-[#d4b978] text-[#0f0f0f]'
                      }`}
                    >
                      {isFollowing ? (
                        <><Bell className="w-4 h-4" /> Following</>
                      ) : (
                        <><Heart className="w-4 h-4" /> Follow</>
                      )}
                    </button>
                  </div>

                  {fanPage.description && (
                    <p className="text-white/50 text-xs sm:text-sm mb-4 line-clamp-2">{fanPage.description}</p>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-2 mb-4">
                    {fanPage.social_links?.instagram && (
                      <a href={fanPage.social_links.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white hover:opacity-80 min-w-[44px] min-h-[44px] flex items-center justify-center">IG</a>
                    )}
                    {fanPage.social_links?.twitter && (
                      <a href={fanPage.social_links.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-400 rounded-lg text-white hover:opacity-80 min-w-[44px] min-h-[44px] flex items-center justify-center">X</a>
                    )}
                    {fanPage.social_links?.facebook && (
                      <a href={fanPage.social_links.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-600 rounded-lg text-white hover:opacity-80 min-w-[44px] min-h-[44px] flex items-center justify-center">FB</a>
                    )}
                    {fanPage.social_links?.youtube && (
                      <a href={fanPage.social_links.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-red-600 rounded-lg text-white hover:opacity-80 min-w-[44px] min-h-[44px] flex items-center justify-center">YT</a>
                    )}
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/[0.06]">
                    <span className="text-xs sm:text-sm text-white/40">Share:</span>
                    <button onClick={() => handleShare(fanPage, 'twitter')} className="p-2.5 hover:bg-white/[0.05] rounded min-w-[44px] min-h-[44px] flex items-center justify-center text-blue-400 text-sm">X</button>
                    <button onClick={() => handleShare(fanPage, 'facebook')} className="p-2.5 hover:bg-white/[0.05] rounded min-w-[44px] min-h-[44px] flex items-center justify-center text-blue-600 text-sm">FB</button>
                    <button onClick={() => handleShare(fanPage, 'copy')} className="p-2.5 hover:bg-white/[0.05] rounded min-w-[44px] min-h-[44px] flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-white/40" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {fanPages.length === 0 && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-12 md:py-16 text-center px-4">
            <Heart className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No fan pages yet</h3>
            <p className="text-white/50 mb-4 text-sm md:text-base">Create a fan page for your team to connect with supporters!</p>
            {teamsWithoutFanPage.length > 0 && (
              <button
                onClick={() => setShowCreatePage(true)}
                className="bg-gradient-to-r from-[#c9a962] to-[#d4b978] text-[#0f0f0f] min-h-[44px] px-4 py-2 rounded-lg font-medium"
              >
                Create Fan Page
              </button>
            )}
          </div>
        )}

        {/* Create Fan Page Dialog */}
        {showCreatePage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-w-lg w-full bg-[#121212] border border-white/[0.06] text-white rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Create Team Fan Page</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Team</label>
                  <select
                    value={createForm.team_id}
                    onChange={(e) => {
                      const team = teamsWithoutFanPage.find((t) => t.id === e.target.value);
                      setCreateForm({ ...createForm, team_id: e.target.value, team_name: team?.name || team?.team_name || '' });
                    }}
                    className="w-full p-2 border rounded-lg bg-white/[0.05] border-white/[0.06] text-white min-h-[44px]"
                  >
                    <option value="">Choose a team...</option>
                    {teamsWithoutFanPage.map((team) => (
                      <option key={team.id} value={team.id}>{team.name || team.team_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    placeholder="Tell fans about your team..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="w-full min-h-[80px] bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-3 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Instagram URL" value={createForm.social_links.instagram} onChange={(e) => setCreateForm({ ...createForm, social_links: { ...createForm.social_links, instagram: e.target.value } })} className="bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px] text-sm" />
                  <input placeholder="Twitter URL" value={createForm.social_links.twitter} onChange={(e) => setCreateForm({ ...createForm, social_links: { ...createForm.social_links, twitter: e.target.value } })} className="bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px] text-sm" />
                  <input placeholder="Facebook URL" value={createForm.social_links.facebook} onChange={(e) => setCreateForm({ ...createForm, social_links: { ...createForm.social_links, facebook: e.target.value } })} className="bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px] text-sm" />
                  <input placeholder="YouTube URL" value={createForm.social_links.youtube} onChange={(e) => setCreateForm({ ...createForm, social_links: { ...createForm.social_links, youtube: e.target.value } })} className="bg-white/[0.05] border border-white/[0.06] rounded-lg text-white p-2 min-h-[44px] text-sm" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowCreatePage(false)} className="flex-1 min-h-[44px] border border-white/[0.06] rounded-lg text-white/60">Cancel</button>
                  <button onClick={handleCreateFanPage} disabled={!createForm.team_id} className="flex-1 bg-[#c9a962] text-[#0f0f0f] hover:bg-[#c9a962]/90 min-h-[44px] rounded-lg font-medium disabled:opacity-50">
                    Create Fan Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
