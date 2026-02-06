import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dumbbell, Video, TrendingUp, PlayCircle, CheckCircle, Plus, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function PlayerDevelopment() {
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
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tight">Player <span className="text-blue-500">Development</span></h1>
        <p className="text-white/40 mt-1">AI-powered training, video analysis, and progress tracking.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar">
        {[
            { id: 'training', label: 'Training Plans', icon: Dumbbell },
            { id: 'video', label: 'Video Analysis', icon: Video },
            { id: 'progress', label: 'Progress Tracker', icon: TrendingUp }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'neu-flat text-white/40 hover:text-white'
                }`}
            >
                <tab.icon size={18} /> {tab.label}
            </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Training Plans Tab */}
        {activeTab === 'training' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Your Plans</h2>
                    <Button 
                        onClick={() => generatePlanMutation.mutate()} 
                        disabled={isGenerating}
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
                        Generate AI Plan
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans?.map(plan => (
                        <div key={plan.id} className="neu-flat p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                                    <div className="text-xs text-white/30 mt-1">
                                        Generated: {new Date(plan.generated_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    plan.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-white/40'
                                }`}>
                                    {plan.status}
                                </span>
                            </div>
                            
                            <div className="mb-4">
                                <div className="text-sm text-white/40 mb-2">Focus Areas:</div>
                                <div className="flex flex-wrap gap-2">
                                    {plan.focus_areas?.map((area, i) => (
                                        <span key={i} className="px-2 py-1 rounded-md bg-white/[0.08] text-xs text-blue-300 border border-blue-500/20">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/[0.04] rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-2 text-purple-400 text-sm font-bold mb-2">
                                    <PlayCircle size={14} /> AI Insight
                                </div>
                                <p className="text-sm text-white/40 italic">"{plan.ai_notes}"</p>
                            </div>

                            <div className="space-y-2">
                                {plan.exercises?.slice(0, 3).map((ex, i) => (
                                    <div key={i} className="flex justify-between text-sm p-2 rounded hover:bg-white/[0.08]">
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
            <div className="space-y-6">
                <div className="neu-flat p-8 rounded-2xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors group cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-16 h-16 rounded-full bg-white/[0.08] flex items-center justify-center mb-4 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all text-white/30">
                        <Video size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Upload Technique Video</h3>
                    <p className="text-white/40 max-w-md">Upload a video of your jump shot, dribbling, or defensive stance for instant AI feedback.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos?.map(vid => (
                        <div key={vid.id} className="neu-flat p-4 rounded-2xl">
                            <div className="aspect-video bg-black rounded-xl mb-4 relative overflow-hidden group">
                                {vid.video_url ? (
                                    <video src={vid.video_url} controls className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/60">
                                        <PlayCircle size={48} />
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1">{vid.title}</h3>
                            <div className="text-xs text-white/30 mb-3">
                                {new Date(vid.upload_date).toLocaleDateString()}
                            </div>
                            <div className="bg-white/[0.08] p-3 rounded-xl border-l-2 border-blue-500">
                                <div className="text-xs font-bold text-blue-400 mb-1">AI Analysis</div>
                                <p className="text-sm text-white/50">{vid.ai_feedback}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {/* Progress (Placeholder) */}
        {activeTab === 'progress' && (
            <div className="neu-flat p-10 rounded-2xl text-center">
                <TrendingUp size={48} className="mx-auto text-white/60 mb-4" />
                <h3 className="text-xl font-bold text-white/50">Progress Tracking Coming Soon</h3>
                <p className="text-white/30">Track your stats improvement over time.</p>
            </div>
        )}

      </div>
    </div>
  );
}