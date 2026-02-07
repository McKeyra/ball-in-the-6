import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dumbbell, Video, TrendingUp, PlayCircle, Plus, Loader2, Users, BarChart3, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';

export default function PlayerDevelopment() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('training');
  const [selectedPlayerId, setSelectedPlayerId] = useState(null); // In a real app, this might come from auth or selection
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  // Mock fetching current user/player - in reality use base44.auth.me() or selected player
  const { data: currentUser } = useQuery({
      queryKey: ['currentUser'],
      queryFn: () => base44.auth.me()
  });

  const { data: plans, isLoading: plansLoading } = useQuery({
      queryKey: ['trainingPlans', selectedPlayerId || currentUser?.email], // Using email as mock ID
      queryFn: () => base44.entities.TrainingPlan.list({ sort: { generated_date: -1 } })
  });

  const { data: videos, isLoading: videosLoading } = useQuery({
      queryKey: ['videoAnalysis', selectedPlayerId || currentUser?.email],
      queryFn: () => base44.entities.VideoAnalysis.list({ sort: { upload_date: -1 } })
  });

  const generatePlanMutation = useMutation({
      mutationFn: async () => {
          setIsGenerating(true);
          // Mock stats for now
          const stats = { ppg: 12.5, fg_pct: 42, turnovers: 3.5, notes: "Needs to work on ball handling and perimeter defense." };
          const aiRes = await base44.functions.invoke('playerDevelopmentAI', {
              action: 'generate_plan',
              player_id: currentUser?.email,
              recent_stats: stats
          });
          
          const newPlan = {
              player_id: currentUser?.email,
              ...aiRes.data,
              generated_date: new Date().toISOString(),
              status: 'active'
          };
          return base44.entities.TrainingPlan.create(newPlan);
      },
      onSuccess: () => {
          queryClient.invalidateQueries(['trainingPlans']);
          toast.success("New training plan generated!");
          setIsGenerating(false);
      },
      onError: () => {
          toast.error("Failed to generate plan.");
          setIsGenerating(false);
      }
  });

  const handleVideoUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
          toast.info("Uploading video...");
          const uploadRes = await base44.integrations.Core.UploadFile({ file });
          
          toast.info("Analyzing video with AI...");
          const aiRes = await base44.functions.invoke('playerDevelopmentAI', {
              action: 'analyze_video',
              video_context: { description: `Video upload: ${file.name}. Player practicing jump shots.` } // Mock context
          });

          await base44.entities.VideoAnalysis.create({
              player_id: currentUser?.email,
              video_url: uploadRes.file_url,
              title: file.name,
              description: "Uploaded training video",
              ai_feedback: aiRes.data.feedback,
              upload_date: new Date().toISOString()
          });
          
          queryClient.invalidateQueries(['videoAnalysis']);
          toast.success("Video analyzed and saved!");
      } catch (error) {
          console.error(error);
          toast.error("Upload failed");
      }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">Player <span style={{ color: '#c9a962' }}>Development</span></h1>
          <p className="text-sm md:text-base text-white/40 mt-1">AI-powered training, video analysis, and progress tracking.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto no-scrollbar pb-2">
          {[
              { id: 'training', label: 'Training', fullLabel: 'Training Plans', icon: Dumbbell },
              { id: 'video', label: 'Video', fullLabel: 'Video Analysis', icon: Video },
              { id: 'progress', label: 'Progress', fullLabel: 'Progress Tracker', icon: TrendingUp }
          ].map(tab => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 min-h-[44px] rounded-xl font-bold transition-all whitespace-nowrap text-sm md:text-base ${
                      activeTab === tab.id
                      ? 'text-[#0f0f0f] shadow-lg'
                      : 'text-white/40 hover:text-white'
                  }`}
                  style={{
                    background: activeTab === tab.id ? '#c9a962' : '#0f0f0f',
                    boxShadow: activeTab === tab.id
                      ? '4px 4px 12px rgba(0,0,0,0.2)'
                      : '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                  }}
              >
                  <tab.icon size={18} />
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                  <span className="sm:hidden">{tab.label}</span>
              </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Training Plans Tab */}
          {activeTab === 'training' && (
              <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <h2 className="text-xl md:text-2xl font-bold text-white">Your Plans</h2>
                      <Button
                          onClick={() => generatePlanMutation.mutate()}
                          disabled={isGenerating}
                          className="min-h-[44px] w-full sm:w-auto"
                          style={{ backgroundColor: '#c9a962', color: '#0f0f0f' }}
                      >
                          {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
                          Generate AI Plan
                      </Button>
                  </div>

                  {(!plans || plans.length === 0) && (
                    <div
                      className="p-6 md:p-8 rounded-2xl text-center"
                      style={{
                        background: '#0f0f0f',
                        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                      }}
                    >
                      <Dumbbell className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/30" />
                      <h3 className="text-lg md:text-xl font-bold text-white/70 mb-2">No Training Plans Yet</h3>
                      <p className="text-sm md:text-base text-white/40 mb-4">Generate your first AI-powered training plan to get started.</p>
                      <Button
                        onClick={() => generatePlanMutation.mutate()}
                        disabled={isGenerating}
                        className="min-h-[44px]"
                        style={{ backgroundColor: '#c9a962', color: '#0f0f0f' }}
                      >
                        {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
                        Generate First Plan
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {plans?.map(plan => (
                          <div
                            key={plan.id}
                            className="p-4 md:p-6 rounded-2xl border border-white/5 transition-colors"
                            style={{
                              background: '#0f0f0f',
                              boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
                            }}
                          >
                              <div className="flex justify-between items-start mb-3 md:mb-4">
                                  <div className="flex-1 min-w-0">
                                      <h3 className="text-lg md:text-xl font-bold text-white truncate">{plan.title}</h3>
                                      <div className="text-xs text-white/30 mt-1">
                                          Generated: {new Date(plan.generated_date).toLocaleDateString()}
                                      </div>
                                  </div>
                                  <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase flex-shrink-0 ml-2 ${
                                      plan.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-white/40'
                                  }`}>
                                      {plan.status}
                                  </span>
                              </div>

                              <div className="mb-3 md:mb-4">
                                  <div className="text-xs md:text-sm text-white/40 mb-2">Focus Areas:</div>
                                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                                      {plan.focus_areas?.map((area, i) => (
                                          <span key={i} className="px-2 py-1 rounded-md bg-white/[0.08] text-[10px] md:text-xs border" style={{ color: '#c9a962', borderColor: 'rgba(201, 169, 98, 0.2)' }}>
                                              {area}
                                          </span>
                                      ))}
                                  </div>
                              </div>

                              <div className="bg-white/[0.04] rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                                  <div className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: '#c9a962' }}>
                                      <PlayCircle size={14} /> AI Insight
                                  </div>
                                  <p className="text-xs md:text-sm text-white/40 italic">"{plan.ai_notes}"</p>
                              </div>

                              <div className="space-y-2">
                                  {plan.exercises?.slice(0, 3).map((ex, i) => (
                                      <div key={i} className="flex justify-between text-xs md:text-sm p-2 rounded hover:bg-white/[0.08] min-h-[36px] items-center">
                                          <span className="text-white/50">{ex.name}</span>
                                          <span className="text-white/30">{ex.reps}</span>
                                      </div>
                                  ))}
                                  {plan.exercises?.length > 3 && (
                                      <div className="text-center text-xs text-white/30 mt-2">
                                          +{plan.exercises.length - 3} more exercises
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* Video Analysis Tab */}
          {activeTab === 'video' && (
              <div className="space-y-4 md:space-y-6">
                  <div
                    className="p-6 md:p-8 rounded-2xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-center transition-colors group cursor-pointer relative min-h-[180px]"
                    style={{
                      background: '#0f0f0f',
                      boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
                    }}
                  >
                      <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/[0.08] flex items-center justify-center mb-3 md:mb-4 transition-all text-white/30" style={{ '--tw-ring-color': '#c9a962' }}>
                          <Video size={28} className="md:w-8 md:h-8" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">Upload Technique Video</h3>
                      <p className="text-sm md:text-base text-white/40 max-w-md">Upload a video of your jump shot, dribbling, or defensive stance for instant AI feedback.</p>
                  </div>

                  {(!videos || videos.length === 0) && (
                    <div
                      className="p-6 md:p-8 rounded-2xl text-center"
                      style={{
                        background: '#0f0f0f',
                        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                      }}
                    >
                      <Video className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-white/30" />
                      <h3 className="text-lg md:text-xl font-bold text-white/70 mb-2">No Videos Uploaded</h3>
                      <p className="text-sm md:text-base text-white/40">Upload your first training video to get AI-powered technique analysis.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {videos?.map(vid => (
                          <div
                            key={vid.id}
                            className="p-3 md:p-4 rounded-2xl"
                            style={{
                              background: '#0f0f0f',
                              boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
                            }}
                          >
                              <div className="aspect-video bg-black rounded-xl mb-3 md:mb-4 relative overflow-hidden group">
                                  {vid.video_url ? (
                                      <video src={vid.video_url} controls className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center text-white/60">
                                          <PlayCircle size={40} className="md:w-12 md:h-12" />
                                      </div>
                                  )}
                              </div>
                              <h3 className="font-bold text-white text-base md:text-lg mb-1 truncate">{vid.title}</h3>
                              <div className="text-xs text-white/30 mb-2 md:mb-3">
                                  {new Date(vid.upload_date).toLocaleDateString()}
                              </div>
                              <div className="bg-white/[0.08] p-2.5 md:p-3 rounded-xl border-l-2" style={{ borderColor: '#c9a962' }}>
                                  <div className="text-xs font-bold mb-1" style={{ color: '#c9a962' }}>AI Analysis</div>
                                  <p className="text-xs md:text-sm text-white/50">{vid.ai_feedback}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
        
          {/* Progress Tab - Enhanced with meaningful content and related links */}
          {activeTab === 'progress' && (
              <div className="space-y-4 md:space-y-6">
                {/* Progress Overview */}
                <div
                  className="p-4 md:p-6 rounded-2xl"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)'
                  }}
                >
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
                      { label: 'Videos Analyzed', value: videos?.length || 0, icon: Video }
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="p-3 md:p-4 rounded-xl text-center"
                        style={{
                          background: '#0f0f0f',
                          boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)'
                        }}
                      >
                        <stat.icon className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-white/40" />
                        <div className="text-xl md:text-2xl font-bold text-white/80">{stat.value}</div>
                        <div className="text-[10px] md:text-xs text-white/40">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coming Soon Notice */}
                <div
                  className="p-6 md:p-8 rounded-2xl text-center"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                  }}
                >
                  <TrendingUp size={40} className="mx-auto text-white/40 mb-3 md:mb-4 md:w-12 md:h-12" />
                  <h3 className="text-lg md:text-xl font-bold text-white/60 mb-2">Detailed Analytics Coming Soon</h3>
                  <p className="text-sm md:text-base text-white/40 mb-4">Track your stats improvement, shooting percentages, and performance trends over time.</p>
                </div>

                {/* Related Links */}
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-white/50 uppercase tracking-wider mb-3">Related Pages</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <button
                      onClick={() => navigate(createPageUrl("PlayerProfiles"))}
                      className="flex items-center gap-3 p-4 rounded-xl text-left min-h-[56px] transition-all hover:scale-[1.02]"
                      style={{
                        background: '#0f0f0f',
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                      }}
                    >
                      <Users className="w-5 h-5 flex-shrink-0" style={{ color: '#c9a962' }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white/80 text-sm md:text-base">Player Profiles</div>
                        <div className="text-xs text-white/40">View all player career stats</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                    </button>

                    <button
                      onClick={() => navigate(createPageUrl("Standings"))}
                      className="flex items-center gap-3 p-4 rounded-xl text-left min-h-[56px] transition-all hover:scale-[1.02]"
                      style={{
                        background: '#0f0f0f',
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                      }}
                    >
                      <BarChart3 className="w-5 h-5 flex-shrink-0" style={{ color: '#c9a962' }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white/80 text-sm md:text-base">Team Standings</div>
                        <div className="text-xs text-white/40">View league rankings</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                    </button>

                    <button
                      onClick={() => navigate(createPageUrl("Schedule"))}
                      className="flex items-center gap-3 p-4 rounded-xl text-left min-h-[56px] transition-all hover:scale-[1.02]"
                      style={{
                        background: '#0f0f0f',
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                      }}
                    >
                      <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: '#c9a962' }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white/80 text-sm md:text-base">Game Schedule</div>
                        <div className="text-xs text-white/40">Upcoming games and events</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                    </button>

                    <button
                      onClick={() => navigate(createPageUrl("CourtView"))}
                      className="flex items-center gap-3 p-4 rounded-xl text-left min-h-[56px] transition-all hover:scale-[1.02]"
                      style={{
                        background: '#0f0f0f',
                        boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)'
                      }}
                    >
                      <PlayCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#c9a962' }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white/80 text-sm md:text-base">Live Game</div>
                        <div className="text-xs text-white/40">Track stats in real-time</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}