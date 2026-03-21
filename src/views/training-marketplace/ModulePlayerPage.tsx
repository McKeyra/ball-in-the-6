'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Play, CheckCircle, Circle, Trophy, ChevronLeft, ChevronRight, Video, FileText, HelpCircle, Target, Dumbbell, Sparkles } from 'lucide-react';

interface ProgramModule { title?: string; type?: string; content?: string; drills?: Array<{ name: string; reps?: string; sets?: string; rest?: string }>; questions?: Array<{ question: string; options: string[] }>; }
interface EnrolledProgram { id: string; program_id?: string; program_name?: string; description?: string; trainer_name?: string; program_modules?: ProgramModule[]; modules?: ProgramModule[]; }
interface ModuleProgressEntry { completed?: boolean; }

const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = { video: Video, written: FileText, quiz: HelpCircle, challenge: Target };

export function ModulePlayerPage(): React.ReactElement {
  const userId = 'current-user';
  const queryClient = useQueryClient();
  const [programId, setProgramId] = useState<string | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedDrills, setCompletedDrills] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Record<number, number>>>({});
  const [challengeResponse, setChallengeResponse] = useState('');
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);

  const { data: programs = [], isLoading } = useQuery<EnrolledProgram[]>({
    queryKey: ['athlete', 'enrolled-programs'], queryFn: async () => { /* TODO: fetch('/api/training/enrolled-programs') */ return []; }, enabled: !!userId,
  });

  const { data: progress = {} } = useQuery<Record<number, ModuleProgressEntry>>({
    queryKey: ['athlete', 'module-progress', programId], queryFn: async () => { /* TODO: fetch */ return {}; }, enabled: !!userId && !!programId,
  });

  const completeMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => { /* TODO: POST */ return data as { badge_unlocked?: string }; },
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ['athlete', 'module-progress'] }); if (data?.badge_unlocked) { setUnlockedBadge(data.badge_unlocked); setShowBadgeUnlock(true); setTimeout(() => setShowBadgeUnlock(false), 4000); } },
  });

  const selectedProgram = programs.find((p) => p.program_id === programId);
  const modules = selectedProgram?.program_modules || selectedProgram?.modules || [];
  const currentModule = modules[currentModuleIndex];
  const totalProgress = useMemo(() => { if (modules.length === 0) return 0; const completed = Object.keys(progress).filter((k) => progress[Number(k)]?.completed).length; return Math.round((completed / modules.length) * 100); }, [modules, progress]);
  const isModuleComplete = (idx: number): boolean => !!progress[idx]?.completed;
  const toggleDrill = (di: number): void => { const key = `${currentModuleIndex}-${di}`; setCompletedDrills((prev) => ({ ...prev, [key]: !prev[key] })); };
  const allDrillsComplete = currentModule?.drills?.every((_, i) => completedDrills[`${currentModuleIndex}-${i}`]) ?? true;
  const handleCompleteModule = (): void => { completeMutation.mutate({ athlete_id: userId, program_id: programId, module_index: currentModuleIndex, completed: true, completed_date: new Date().toISOString() }); };

  if (!programId) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">Module Player</h1><p className="text-slate-400 text-sm mt-1">Select a program to continue your training.</p></div>
        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2].map((i) => <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3"><div className="h-4 w-40 bg-slate-800 rounded animate-pulse" /><div className="h-3 w-full bg-slate-800 rounded animate-pulse" /></div>)}</div>
        : programs.length === 0 ? <div className="bg-slate-900 border border-slate-800 rounded-lg py-12 text-center"><Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" /><h3 className="text-lg font-medium text-white mb-1">No Programs Enrolled</h3><p className="text-sm text-slate-400">Find a trainer and enroll in a program to get started.</p></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{programs.map((prog) => { const mods = prog.program_modules || prog.modules || []; return (
          <div key={prog.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer rounded-lg p-4 space-y-3" onClick={() => setProgramId(prog.program_id || null)}>
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-white">{prog.program_name}</h3><span className="border border-slate-700 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">{mods.length} modules</span></div>
            <p className="text-xs text-slate-400 line-clamp-2">{prog.description}</p>
            <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-red-600" style={{ width: '0%' }} /></div>
            <div className="flex items-center justify-between text-xs text-slate-500"><span>0% complete</span><span>{prog.trainer_name || 'Trainer'}</span></div>
          </div>); })}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showBadgeUnlock && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"><div className="text-center space-y-4"><div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto border-2 border-yellow-400"><Trophy className="w-12 h-12 text-yellow-400" /></div><h2 className="text-2xl font-bold text-white">Badge Unlocked!</h2><p className="text-yellow-400 font-medium">{unlockedBadge || 'Achievement'}</p><div className="flex items-center justify-center gap-1">{[...Array(5)].map((_, i) => <Sparkles key={i} className="w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />)}</div></div></div>}
      <div className="flex items-center justify-between">
        <div><button onClick={() => setProgramId(null)} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 mb-1"><ChevronLeft className="w-3 h-3" /> Back to Programs</button><h1 className="text-2xl font-bold text-white">{selectedProgram?.program_name}</h1></div>
        <span className="border border-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">{totalProgress}% Complete</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2"><div className="h-2 rounded-full bg-red-600 transition-all" style={{ width: `${totalProgress}%` }} /></div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2"><h3 className="text-sm font-semibold text-white">Modules</h3></div>
          <div className="p-4 space-y-1">{modules.map((mod, i) => { const Icon = MODULE_ICONS[mod.type || ''] || FileText; const completed = isModuleComplete(i); const isCurrent = i === currentModuleIndex; return (
            <button key={i} onClick={() => setCurrentModuleIndex(i)} className={cn('w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left', isCurrent && 'bg-red-600/20 border border-red-600', !isCurrent && 'hover:bg-slate-800/50')}>
              {completed ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />}
              <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className={cn('text-xs truncate', isCurrent ? 'text-white font-medium' : completed ? 'text-slate-400' : 'text-slate-300')}>{mod.title}</span>
            </button>); })}</div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          {currentModule ? (<>
            <div className="bg-slate-900 border border-slate-800 rounded-lg">
              <div className="p-4 pb-2 flex items-center justify-between"><div className="flex items-center gap-2">{(() => { const Icon = MODULE_ICONS[currentModule.type || ''] || FileText; return <Icon className="w-5 h-5 text-red-400" />; })()}<h3 className="text-base font-semibold text-white">{currentModule.title}</h3></div><span className="border border-slate-700 text-slate-400 text-[10px] px-2 py-0.5 rounded-full capitalize">{currentModule.type}</span></div>
              <div className="p-4 space-y-4">
                {currentModule.type === 'video' && <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700"><div className="text-center"><div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-2"><Play className="w-8 h-8 text-red-400 ml-1" /></div><p className="text-sm text-slate-400">Video Player</p></div></div>}
                <div className="prose prose-invert prose-sm max-w-none"><p className="text-slate-300 whitespace-pre-wrap">{currentModule.content}</p></div>
                {currentModule.type === 'quiz' && currentModule.questions && <div className="space-y-4"><div className="border-t border-slate-800" /><p className="text-sm font-medium text-white">Quiz</p>{(currentModule.questions || []).map((q, qi) => (<div key={qi} className="space-y-2 p-3 rounded-lg bg-slate-800/50"><p className="text-sm text-white font-medium">{q.question}</p><div className="space-y-1">{(q.options || []).map((opt, oi) => (<button key={oi} onClick={() => setQuizAnswers((prev) => ({ ...prev, [currentModuleIndex]: { ...(prev[currentModuleIndex] || {}), [qi]: oi } }))} className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border', quizAnswers[currentModuleIndex]?.[qi] === oi ? 'bg-red-600/20 border-red-600 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600')}>{opt}</button>))}</div></div>))}</div>}
                {currentModule.type === 'challenge' && <div className="space-y-3"><div className="border-t border-slate-800" /><p className="text-sm font-medium text-white">Your Response</p><textarea value={challengeResponse} onChange={(e) => setChallengeResponse(e.target.value)} placeholder="Describe how you completed the challenge..." rows={4} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none resize-none" /></div>}
                {currentModule.drills && currentModule.drills.length > 0 && <div className="space-y-3"><div className="border-t border-slate-800" /><p className="text-sm font-medium text-white">Drill Checklist</p>{currentModule.drills.map((drill, di) => { const key = `${currentModuleIndex}-${di}`; const done = completedDrills[key]; return (<div key={di} className={cn('flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer', done ? 'bg-green-600/10 border-green-600/30' : 'bg-slate-800/50 border-slate-800')} onClick={() => toggleDrill(di)}><input type="checkbox" checked={done || false} readOnly className="pointer-events-none rounded" /><div className="flex-1"><p className={cn('text-sm', done ? 'text-green-400 line-through' : 'text-white')}>{drill.name}</p><div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">{drill.reps && <span>{drill.reps} reps</span>}{drill.sets && <span>{drill.sets} sets</span>}{drill.rest && <span>{drill.rest}s rest</span>}</div></div></div>); })}</div>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button className="flex items-center border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm disabled:opacity-50" onClick={() => setCurrentModuleIndex((i) => Math.max(0, i - 1))} disabled={currentModuleIndex === 0}><ChevronLeft className="w-4 h-4 mr-1" /> Previous</button>
              <div className="flex items-center gap-2">
                {!isModuleComplete(currentModuleIndex) && <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors" onClick={handleCompleteModule} disabled={!allDrillsComplete || completeMutation.isPending}><CheckCircle className="w-4 h-4 mr-1" />{completeMutation.isPending ? 'Saving...' : 'Mark Complete'}</button>}
                <button className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors" onClick={() => setCurrentModuleIndex((i) => Math.min(modules.length - 1, i + 1))} disabled={currentModuleIndex === modules.length - 1}>Next <ChevronRight className="w-4 h-4 ml-1" /></button>
              </div>
            </div>
          </>) : <div className="bg-slate-900 border border-slate-800 rounded-lg py-12 text-center"><p className="text-slate-500">No module selected</p></div>}
        </div>
      </div>
    </div>
  );
}
