'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  Plus,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Target,
  Trash2,
  GripVertical,
  Dumbbell,
} from 'lucide-react';

// TODO: Replace with actual API route

interface ProgramType {
  value: string;
  label: string;
}

interface ModuleType {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROGRAM_TYPES: ProgramType[] = [
  { value: 'course', label: 'Course' },
  { value: 'module_series', label: 'Module Series' },
  { value: 'challenge', label: 'Challenge' },
  { value: 'camp', label: 'Camp' },
];

const MODULE_TYPES: ModuleType[] = [
  { value: 'video', label: 'Video', icon: Video },
  { value: 'written', label: 'Written Lesson', icon: FileText },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
  { value: 'challenge', label: 'Challenge', icon: Target },
];

const DIFFICULTY_LABELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Elite'] as const;

interface DrillForm {
  name: string;
  reps: string;
  sets: string;
  rest: string;
}

interface ModuleForm {
  title: string;
  type: string;
  content: string;
  drills: DrillForm[];
}

interface ProgramFormState {
  name: string;
  sport: string;
  type: string;
  description: string;
  difficulty: number;
  equipment: string;
  price: string;
}

interface ModuleData extends ModuleForm {
  order: number;
}

interface ProgramData {
  id: string;
  name?: string;
  sport?: string;
  type?: string;
  description?: string;
  difficulty?: number;
  price?: number;
  status?: string;
  modules?: ModuleData[];
}

const EMPTY_PROGRAM: ProgramFormState = {
  name: '',
  sport: '',
  type: 'course',
  description: '',
  difficulty: 3,
  equipment: '',
  price: '',
};

const EMPTY_MODULE: ModuleForm = {
  title: '',
  type: 'video',
  content: '',
  drills: [],
};

const EMPTY_DRILL: DrillForm = {
  name: '',
  reps: '',
  sets: '',
  rest: '',
};

interface ProgramCardProps {
  program: ProgramData;
  onDelete: () => void;
}

function ProgramCard({ program, onDelete }: ProgramCardProps): React.ReactElement {
  const diffLabel = DIFFICULTY_LABELS[(program.difficulty ?? 1) - 1];
  const typeLabel = PROGRAM_TYPES.find((t) => t.value === program.type)?.label ?? program.type;
  const moduleCount = program.modules?.length ?? 0;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{program.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{program.sport}</p>
        </div>
        <span className="inline-flex items-center border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">
          {typeLabel}
        </span>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2">{program.description}</p>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" /> {moduleCount} modules
        </span>
        <span>Lv {program.difficulty} ({diffLabel})</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <span className="text-sm font-bold text-white">
          {program.price ? `$${program.price}` : 'Free'}
        </span>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'inline-flex items-center border text-[10px] px-2 py-0.5 rounded-full',
              program.status === 'published'
                ? 'border-green-600/30 text-green-400'
                : 'border-yellow-600/30 text-yellow-400'
            )}
          >
            {program.status ?? 'draft'}
          </span>
          <button
            className="h-7 w-7 p-0 flex items-center justify-center text-red-400 hover:bg-red-600/20 rounded transition-colors"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function TrainerProgramsPage(): React.ReactElement {
  const userId = 'current-user';
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [programForm, setProgramForm] = useState<ProgramFormState>(EMPTY_PROGRAM);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [moduleForm, setModuleForm] = useState<ModuleForm>(EMPTY_MODULE);

  const { data: programs = [], isLoading } = useQuery<ProgramData[]>({
    queryKey: ['trainer', 'programs'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/training-marketplace/trainer/programs')
      return [];
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: Replace with fetch('/api/training-marketplace/trainer/programs', { method: 'POST', body: JSON.stringify(data) })
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer', 'programs'] });
      setShowCreate(false);
      setProgramForm(EMPTY_PROGRAM);
      setModules([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with fetch(`/api/training-marketplace/trainer/programs/${id}`, { method: 'DELETE' })
      return { id };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trainer', 'programs'] }),
  });

  const handleCreateProgram = (): void => {
    createMutation.mutate({
      ...programForm,
      trainer_id: userId,
      difficulty: programForm.difficulty,
      price: parseFloat(programForm.price) || 0,
      equipment: programForm.equipment.split(',').map((e) => e.trim()).filter(Boolean),
      modules,
      status: 'draft',
    });
  };

  const addModule = (): void => {
    setModules((prev) => [...prev, { ...moduleForm, order: prev.length + 1 }]);
    setModuleForm(EMPTY_MODULE);
    setShowModuleDialog(false);
  };

  const removeModule = (index: number): void => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  const addDrillToModule = (): void => {
    setModuleForm((prev) => ({
      ...prev,
      drills: [...prev.drills, { ...EMPTY_DRILL }],
    }));
  };

  const updateDrill = (drillIndex: number, field: keyof DrillForm, value: string): void => {
    setModuleForm((prev) => ({
      ...prev,
      drills: prev.drills.map((d, i) =>
        i === drillIndex ? { ...d, [field]: value } : d
      ),
    }));
  };

  const removeDrill = (drillIndex: number): void => {
    setModuleForm((prev) => ({
      ...prev,
      drills: prev.drills.filter((_, i) => i !== drillIndex),
    }));
  };

  if (showCreate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Create Program</h1>
            <p className="text-slate-400 text-sm mt-1">Build a training program for your athletes.</p>
          </div>
          <button
            className="border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
            onClick={() => { setShowCreate(false); setProgramForm(EMPTY_PROGRAM); setModules([]); }}
          >
            Cancel
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2">
            <h2 className="text-base font-semibold text-white">Program Details</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Program Name</label>
                <input
                  value={programForm.name}
                  onChange={(e) => setProgramForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Elite Ball Handling Program"
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Sport</label>
                <input
                  value={programForm.sport}
                  onChange={(e) => setProgramForm((p) => ({ ...p, sport: e.target.value }))}
                  placeholder="e.g. Basketball"
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Type</label>
                <select
                  value={programForm.type}
                  onChange={(e) => setProgramForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  {PROGRAM_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Difficulty (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setProgramForm((p) => ({ ...p, difficulty: level }))}
                      className={cn(
                        'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                        programForm.difficulty >= level
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                      )}
                    >
                      {level}
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 ml-2">
                    {DIFFICULTY_LABELS[(programForm.difficulty || 1) - 1]}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Price ($)</label>
                <input
                  type="number"
                  value={programForm.price}
                  onChange={(e) => setProgramForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="49.99"
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Description</label>
              <textarea
                value={programForm.description}
                onChange={(e) => setProgramForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="What will athletes learn? Who is this for?"
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Equipment Needed (comma-separated)</label>
              <input
                value={programForm.equipment}
                onChange={(e) => setProgramForm((p) => ({ ...p, equipment: e.target.value }))}
                placeholder="Basketball, Cones, Resistance Band"
                className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg">
          <div className="p-4 pb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Modules ({modules.length})</h2>
            <button
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
              onClick={() => setShowModuleDialog(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Module
            </button>
          </div>
          <div className="p-4 pt-2">
            {modules.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No modules added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {modules.map((mod, i) => {
                  const TypeIcon = MODULE_TYPES.find((mt) => mt.value === mod.type)?.icon ?? FileText;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800"
                    >
                      <GripVertical className="w-4 h-4 text-slate-600" />
                      <div className="p-2 bg-slate-800 rounded">
                        <TypeIcon className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{mod.title}</p>
                        <p className="text-xs text-slate-400 capitalize">
                          {mod.type} - {mod.drills.length} drill{mod.drills.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <button
                        className="text-red-400 hover:bg-red-600/20 p-1.5 rounded transition-colors"
                        onClick={() => removeModule(i)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors"
            onClick={handleCreateProgram}
            disabled={!programForm.name.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Program'}
          </button>
        </div>

        {/* Add Module Dialog */}
        {showModuleDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">Add Module</h2>
                <button onClick={() => setShowModuleDialog(false)} className="text-slate-400 hover:text-white">
                  <span className="text-xl">&times;</span>
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Module Title</label>
                  <input
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm((m) => ({ ...m, title: e.target.value }))}
                    placeholder="e.g. Crossover Fundamentals"
                    className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {MODULE_TYPES.map((mt) => {
                      const Icon = mt.icon;
                      return (
                        <button
                          key={mt.value}
                          onClick={() => setModuleForm((m) => ({ ...m, type: mt.value }))}
                          className={cn(
                            'flex items-center gap-2 p-3 rounded-lg border transition-colors',
                            moduleForm.type === mt.value
                              ? 'bg-red-600/20 border-red-600 text-red-400'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{mt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Content / Instructions</label>
                  <textarea
                    value={moduleForm.content}
                    onChange={(e) => setModuleForm((m) => ({ ...m, content: e.target.value }))}
                    placeholder="Describe this module, instructions, or video URL..."
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none resize-none"
                  />
                </div>

                {/* Drills */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-300">Drills</label>
                    <button
                      className="flex items-center border border-slate-600 text-slate-300 px-2 py-1 rounded-lg text-xs hover:bg-slate-800 transition-colors"
                      onClick={addDrillToModule}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Drill
                    </button>
                  </div>
                  {moduleForm.drills.map((drill, di) => (
                    <div key={di} className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Drill {di + 1}</span>
                        <button
                          className="h-6 w-6 p-0 flex items-center justify-center text-red-400 hover:bg-red-600/20 rounded transition-colors"
                          onClick={() => removeDrill(di)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        value={drill.name}
                        onChange={(e) => updateDrill(di, 'name', e.target.value)}
                        placeholder="Drill name"
                        className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={drill.reps}
                          onChange={(e) => updateDrill(di, 'reps', e.target.value)}
                          placeholder="Reps"
                          className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                        />
                        <input
                          value={drill.sets}
                          onChange={(e) => updateDrill(di, 'sets', e.target.value)}
                          placeholder="Sets"
                          className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                        />
                        <input
                          value={drill.rest}
                          onChange={(e) => updateDrill(di, 'rest', e.target.value)}
                          placeholder="Rest (sec)"
                          className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm disabled:opacity-50 transition-colors"
                  onClick={addModule}
                  disabled={!moduleForm.title.trim()}
                >
                  Add Module
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Programs</h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage your training programs.</p>
        </div>
        <button
          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="w-4 h-4 mr-1" /> Create Program
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="h-5 w-40 bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : programs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg py-12 text-center">
          <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">No Programs Yet</h3>
          <p className="text-sm text-slate-400 mb-4">
            Create your first training program to start helping athletes develop their skills.
          </p>
          <button
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="w-4 h-4 mr-1" /> Create Your First Program
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onDelete={() => deleteMutation.mutate(program.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
