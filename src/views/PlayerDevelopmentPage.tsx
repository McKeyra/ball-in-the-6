'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dumbbell, Video, TrendingUp, PlayCircle, Plus,
  Users, BarChart3, Calendar, ArrowRight,
} from 'lucide-react';

/* ---------- Types ---------- */
interface TrainingPlan {
  id: string;
  title: string;
  generated_date: string;
  status: 'active' | 'completed';
  focus_areas?: string[];
  ai_notes?: string;
  exercises?: { name: string; reps: string }[];
}

interface VideoAnalysis {
  id: string;
  title: string;
  video_url?: string;
  upload_date: string;
  ai_feedback?: string;
}

type TabId = 'training' | 'video' | 'progress';

/* ---------- Component ---------- */
export function PlayerDevelopmentPage(): React.ReactElement {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('training');

  // TODO: Replace with fetch('/api/training-plans') + TanStack Query
  const plans: TrainingPlan[] = [];
  // TODO: Replace with fetch('/api/video-analysis') + TanStack Query
  const videos: VideoAnalysis[] = [];

  const tabs: { id: TabId; label: string; fullLabel: string; icon: typeof Dumbbell }[] = [
    { id: 'training', label: 'Training', fullLabel: 'Training Plans', icon: Dumbbell },
    { id: 'video', label: 'Video', fullLabel: 'Video Analysis', icon: Video },
    { id: 'progress', label: 'Progress', fullLabel: 'Progress Tracker', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Player <span style={{ color: '#c9a962' }}>Development</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 mt-1">AI-powered training, video analysis, and progress tracking.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 min-h-[44px] rounded-xl font-bold transition-all whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab.id ? 'text-[#0f0f0f] shadow-lg' : 'text-white/40 hover:text-white'
                }`}
                style={{
                  background: activeTab === tab.id ? '#c9a962' : '#0f0f0f',
                  boxShadow: activeTab === tab.id
                    ? '4px 4px 12px rgba(0,0,0,0.2)'
                    : '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
                }}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span className="hidden sm:inline">{tab.fullLabel}</span>
                <span className="sm:hidden">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Training Plans Tab */}
        {activeTab === 'training' && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-white">Your Plans</h2>
              <button className="min-h-[44px] w-full sm:w-auto flex items-center justify-center gap-2 px-4 rounded-md font-medium" style={{ backgroundColor: '#c9a962', color: '#0f0f0f' }}>
                <Plus className="w-4 h-4" /> Generate AI Plan
              </button>
            </div>

            {plans.length === 0 && (
              <div className="p-6 md:p-8 rounded-2xl text-center" style={{ background: '#0f0f0f', boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)' }}>
                <Dumbbell className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/30" />
                <h3 className="text-lg md:text-xl font-bold text-white/70 mb-2">No Training Plans Yet</h3>
                <p className="text-sm md:text-base text-white/40 mb-4">Generate your first AI-powered training plan to get started.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="p-4 md:p-6 rounded-2xl border border-white/5" style={{ background: '#0f0f0f', boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)' }}>
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white truncate">{plan.title}</h3>
                      <div className="text-xs text-white/30 mt-1">Generated: {new Date(plan.generated_date).toLocaleDateString()}</div>
                    </div>
                    <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase flex-shrink-0 ml-2 ${plan.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-white/40'}`}>
                      {plan.status}
                    </span>
                  </div>
                  {plan.focus_areas && plan.focus_areas.length > 0 && (
                    <div className="mb-3 md:mb-4">
                      <div className="text-xs md:text-sm text-white/40 mb-2">Focus Areas:</div>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {plan.focus_areas.map((area, i) => (
                          <span key={i} className="px-2 py-1 rounded-md bg-white/[0.08] text-[10px] md:text-xs border" style={{ color: '#c9a962', borderColor: 'rgba(201, 169, 98, 0.2)' }}>{area}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {plan.ai_notes && (
                    <div className="bg-white/[0.04] rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                      <div className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: '#c9a962' }}>
                        <PlayCircle className="w-[14px] h-[14px]" /> AI Insight
                      </div>
                      <p className="text-xs md:text-sm text-white/40 italic">&quot;{plan.ai_notes}&quot;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Analysis Tab */}
        {activeTab === 'video' && (
          <div className="space-y-4 md:space-y-6">
            <div className="p-6 md:p-8 rounded-2xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-center relative min-h-[180px]" style={{ background: '#0f0f0f', boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)' }}>
              {/* TODO: Wire up file upload */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/[0.08] flex items-center justify-center mb-3 md:mb-4 text-white/30">
                <Video className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Upload Technique Video</h3>
              <p className="text-sm md:text-base text-white/40 max-w-md">Upload a video of your jump shot, dribbling, or defensive stance for instant AI feedback.</p>
            </div>

            {videos.length === 0 && (
              <div className="p-6 md:p-8 rounded-2xl text-center" style={{ background: '#0f0f0f', boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)' }}>
                <Video className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/30" />
                <h3 className="text-lg md:text-xl font-bold text-white/70 mb-2">No Videos Uploaded</h3>
                <p className="text-sm md:text-base text-white/40">Upload your first training video to get AI-powered technique analysis.</p>
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-4 md:space-y-6">
            <div className="p-4 md:p-6 rounded-2xl" style={{ background: '#0f0f0f', boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)' }}>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6" style={{ color: '#c9a962' }} />
                <h2 className="text-lg md:text-xl font-bold text-white">Progress Overview</h2>
              </div>
              <p className="text-sm md:text-base text-white/50 mb-4">Track your improvement over time with detailed analytics and performance metrics.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: 'Games Played', value: '--', icon: Calendar },
                  { label: 'Avg Points', value: '--', icon: BarChart3 },
                  { label: 'Training Sessions', value: '--', icon: Dumbbell },
                  { label: 'Videos Analyzed', value: videos.length, icon: Video },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="p-3 md:p-4 rounded-xl text-center" style={{ background: '#0f0f0f', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)' }}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-white/40" />
                      <div className="text-xl md:text-2xl font-bold text-white/80">{stat.value}</div>
                      <div className="text-[10px] md:text-xs text-white/40">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Related Links */}
            <div>
              <h3 className="text-sm md:text-base font-semibold text-white/50 uppercase tracking-wider mb-3">Related Pages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[
                  { href: '/players/profiles', icon: Users, label: 'Player Profiles', desc: 'View all player career stats' },
                  { href: '/teams/overview', icon: BarChart3, label: 'Team Standings', desc: 'View league rankings' },
                  { href: '/schedule', icon: Calendar, label: 'Game Schedule', desc: 'Upcoming games and events' },
                  { href: '/games/court-view', icon: PlayCircle, label: 'Live Game', desc: 'Track stats in real-time' },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href} className="flex items-center gap-3 p-4 rounded-xl text-left min-h-[56px] transition-all hover:scale-[1.02]" style={{ background: '#0f0f0f', boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)' }}>
                      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: '#c9a962' }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white/80 text-sm md:text-base">{link.label}</div>
                        <div className="text-xs text-white/40">{link.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
