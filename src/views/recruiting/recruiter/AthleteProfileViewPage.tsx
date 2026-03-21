'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { VanceScoreBadge } from '@/components/recruiting/VanceScoreBadge';
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  GraduationCap,
  Ruler,
  Weight,
  Hand,
  Play,
  Phone,
  Mail,
  CheckCircle,
  User,
  BarChart3,
  Film,
  Users,
} from 'lucide-react';

// TODO: Replace with actual API route
// import { useAuth } from '@/lib/AuthContext';

interface AthleteProfile {
  id: string;
  name?: string;
  photo_url?: string;
  position?: string;
  graduation_year?: number;
  sport?: string;
  school?: string;
  city?: string;
  is_verified?: boolean;
  vance_rating?: number;
  height_ft?: number;
  height_in?: number;
  height_cm?: number;
  weight?: number;
  wingspan?: number;
  vertical?: number;
  dominant_hand?: string;
  bio?: string;
  gpa?: number;
  sat_score?: number;
  act_score?: number;
}

interface AthleteStat {
  id: string;
  season?: string;
  team?: string;
  games_played?: number;
  ppg?: number;
  rpg?: number;
  apg?: number;
  fg_pct?: number;
}

interface AthleteVideo {
  id: string;
  title?: string;
  thumbnail_url?: string;
  type?: string;
}

interface AthleteReference {
  id: string;
  name?: string;
  title?: string;
  organization?: string;
  willing_to_speak?: boolean;
  recommendation?: string;
  email?: string;
  phone?: string;
}

interface WatchlistItem {
  id: string;
}

interface MeasurableRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

interface AcademicRowProps {
  label: string;
  value: string | number;
}

interface AthleteProfileViewPageProps {
  athleteId: string;
}

function cmToFtIn(cm: number | undefined): string | null {
  if (!cm) return null;
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${ft}'${inches}"`;
}

function MeasurableRow({ icon: Icon, label, value }: MeasurableRowProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="flex items-center gap-2 text-sm text-slate-400">
        <Icon className="w-3.5 h-3.5" /> {label}
      </span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function AcademicRow({ label, value }: AcademicRowProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export function AthleteProfileViewPage({ athleteId }: AthleteProfileViewPageProps): React.ReactElement {
  // TODO: Replace with actual auth hook
  const userId = 'current-user';
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const { data: athlete, isLoading } = useQuery<AthleteProfile>({
    queryKey: ['athlete-profile', athleteId],
    queryFn: async () => {
      // TODO: Replace with fetch(`/api/recruiting/athletes/${athleteId}`)
      return {} as AthleteProfile;
    },
    enabled: !!athleteId,
  });

  const { data: stats = [] } = useQuery<AthleteStat[]>({
    queryKey: ['athlete-stats', athleteId],
    queryFn: async () => {
      // TODO: Replace with fetch(`/api/recruiting/athletes/${athleteId}/stats`)
      return [];
    },
    enabled: !!athleteId,
  });

  const { data: videos = [] } = useQuery<AthleteVideo[]>({
    queryKey: ['athlete-videos', athleteId],
    queryFn: async () => {
      // TODO: Replace with fetch(`/api/recruiting/athletes/${athleteId}/videos`)
      return [];
    },
    enabled: !!athleteId,
  });

  const { data: references = [] } = useQuery<AthleteReference[]>({
    queryKey: ['athlete-references', athleteId],
    queryFn: async () => {
      // TODO: Replace with fetch(`/api/recruiting/athletes/${athleteId}/references`)
      return [];
    },
    enabled: !!athleteId,
  });

  const { data: watchlistItems = [] } = useQuery<WatchlistItem[]>({
    queryKey: ['recruiter', 'watchlist-check', athleteId],
    queryFn: async () => {
      // TODO: Replace with fetch(`/api/recruiting/watchlist/check?athleteId=${athleteId}`)
      return [];
    },
    enabled: !!userId && !!athleteId,
  });

  const isSaved = watchlistItems.length > 0;

  const saveMutation = useMutation({
    mutationFn: async () => {
      // TODO: Replace with actual API call to toggle watchlist
      return {};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'watchlist-check', athleteId] });
    },
  });

  if (isLoading || !athlete) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-96 bg-slate-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  const heightDisplay = athlete.height_ft
    ? `${athlete.height_ft}'${athlete.height_in || 0}"`
    : athlete.height_cm
    ? cmToFtIn(athlete.height_cm)
    : null;

  const TABS = [
    { value: 'overview', label: 'Overview', icon: User },
    { value: 'stats', label: 'Stats', icon: BarChart3 },
    { value: 'film', label: 'Film', icon: Film },
    { value: 'references', label: 'References', icon: Users },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-red-600/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {athlete.photo_url ? (
              <img src={athlete.photo_url} alt={athlete.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-red-400">
                {(athlete.name || 'A').charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white">{athlete.name}</h1>
              {athlete.is_verified && (
                <CheckCircle className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <p className="text-sm text-slate-400">
              {athlete.position}
              {athlete.graduation_year && ` | Class of ${athlete.graduation_year}`}
              {athlete.sport && ` | ${athlete.sport}`}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
              {athlete.school && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> {athlete.school}
                </span>
              )}
              {athlete.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {athlete.city}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <VanceScoreBadge score={athlete.vance_rating} size="lg" />
            <button
              className={cn(
                'flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                isSaved
                  ? 'border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/10'
                  : 'border-slate-700 text-slate-300 hover:bg-slate-800'
              )}
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {isSaved ? (
                <><BookmarkCheck className="w-4 h-4 mr-1" /> Saved</>
              ) : (
                <><Bookmark className="w-4 h-4 mr-1" /> Save to Watchlist</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  activeTab === tab.value
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 mt-4">
            {athlete.bio && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg">
                <div className="p-4 pb-2">
                  <h3 className="text-sm font-semibold text-white">About</h3>
                </div>
                <div className="p-4 pt-2">
                  <p className="text-sm text-slate-300">{athlete.bio}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Measurables */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg">
                <div className="p-4 pb-2">
                  <h3 className="text-sm font-semibold text-white">Measurables</h3>
                </div>
                <div className="p-4 pt-2 space-y-2">
                  {heightDisplay && (
                    <MeasurableRow icon={Ruler} label="Height" value={heightDisplay} />
                  )}
                  {athlete.weight && (
                    <MeasurableRow icon={Weight} label="Weight" value={`${athlete.weight} lbs`} />
                  )}
                  {athlete.wingspan && (
                    <MeasurableRow icon={Ruler} label="Wingspan" value={`${athlete.wingspan}"`} />
                  )}
                  {athlete.vertical && (
                    <MeasurableRow icon={Ruler} label="Vertical" value={`${athlete.vertical}"`} />
                  )}
                  {athlete.dominant_hand && (
                    <MeasurableRow icon={Hand} label="Dominant Hand" value={athlete.dominant_hand} />
                  )}
                </div>
              </div>

              {/* Academics */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg">
                <div className="p-4 pb-2">
                  <h3 className="text-sm font-semibold text-white">Academics</h3>
                </div>
                <div className="p-4 pt-2 space-y-2">
                  {athlete.school && (
                    <AcademicRow label="School" value={athlete.school} />
                  )}
                  {athlete.gpa && (
                    <AcademicRow label="GPA" value={athlete.gpa.toFixed(2)} />
                  )}
                  {athlete.graduation_year && (
                    <AcademicRow label="Graduation" value={athlete.graduation_year} />
                  )}
                  {athlete.sat_score && (
                    <AcademicRow label="SAT" value={athlete.sat_score} />
                  )}
                  {athlete.act_score && (
                    <AcademicRow label="ACT" value={athlete.act_score} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="mt-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg">
              <div className="p-4 pb-2">
                <h3 className="text-sm font-semibold text-white">Season Stats</h3>
              </div>
              <div className="p-4 pt-2">
                {stats.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No stats available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">Season</th>
                          <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">Team</th>
                          <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">GP</th>
                          <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">PPG</th>
                          <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">RPG</th>
                          <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">APG</th>
                          <th className="text-left text-xs font-medium text-slate-400 py-2 px-3">FG%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.map((stat) => (
                          <tr key={stat.id} className="border-b border-slate-800">
                            <td className="text-sm text-white font-medium py-2 px-3">{stat.season}</td>
                            <td className="text-sm text-slate-300 py-2 px-3">{stat.team}</td>
                            <td className="text-sm text-slate-300 py-2 px-3">{stat.games_played}</td>
                            <td className="text-sm text-slate-300 py-2 px-3">{stat.ppg?.toFixed(1)}</td>
                            <td className="text-sm text-slate-300 py-2 px-3">{stat.rpg?.toFixed(1)}</td>
                            <td className="text-sm text-slate-300 py-2 px-3">{stat.apg?.toFixed(1)}</td>
                            <td className="text-sm text-slate-300 py-2 px-3">
                              {stat.fg_pct ? `${(stat.fg_pct * 100).toFixed(1)}%` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Film Tab */}
        {activeTab === 'film' && (
          <div className="mt-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg">
              <div className="p-4 pb-2">
                <h3 className="text-sm font-semibold text-white">Game Film & Highlights</h3>
              </div>
              <div className="p-4 pt-2">
                {videos.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No videos uploaded</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="rounded-lg overflow-hidden border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                      >
                        <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                          {video.thumbnail_url ? (
                            <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                          ) : (
                            <Film className="w-8 h-8 text-slate-600" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-red-600/80 flex items-center justify-center">
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="text-sm font-medium text-white truncate">{video.title}</p>
                          <p className="text-xs text-slate-400">{video.type || 'Highlight'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* References Tab */}
        {activeTab === 'references' && (
          <div className="mt-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg">
              <div className="p-4 pb-2">
                <h3 className="text-sm font-semibold text-white">Coach References</h3>
              </div>
              <div className="p-4 pt-2">
                {references.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No references provided</p>
                ) : (
                  <div className="space-y-3">
                    {references.map((ref) => (
                      <div
                        key={ref.id}
                        className="p-4 rounded-lg bg-slate-800/50 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">{ref.name}</p>
                            <p className="text-xs text-slate-400">
                              {ref.title} {ref.organization && `- ${ref.organization}`}
                            </p>
                          </div>
                          {ref.willing_to_speak && (
                            <span className="flex items-center bg-green-600/20 text-green-400 border border-green-600/30 text-[10px] px-2 py-0.5 rounded-full">
                              <Phone className="w-3 h-3 mr-1" /> Willing to Speak
                            </span>
                          )}
                        </div>
                        {ref.recommendation && (
                          <p className="text-sm text-slate-300 italic">&quot;{ref.recommendation}&quot;</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          {ref.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {ref.email}
                            </span>
                          )}
                          {ref.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {ref.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
