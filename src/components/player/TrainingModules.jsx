import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Play, Lock, CheckCircle } from "lucide-react";

export default function TrainingModules({ player }) {
  const modules = [
    { 
      id: 1, 
      title: "Ball Handling Fundamentals", 
      sport: "basketball",
      duration: "15 min",
      difficulty: "Beginner",
      completed: true,
      locked: false
    },
    { 
      id: 2, 
      title: "Shooting Form Mastery", 
      sport: "basketball",
      duration: "20 min",
      difficulty: "Intermediate",
      completed: false,
      locked: false
    },
    { 
      id: 3, 
      title: "Advanced Footwork Drills", 
      sport: "basketball",
      duration: "25 min",
      difficulty: "Advanced",
      completed: false,
      locked: true
    },
    { 
      id: 4, 
      title: "Conditioning & Agility", 
      sport: "all",
      duration: "30 min",
      difficulty: "All Levels",
      completed: false,
      locked: false
    },
  ];

  const difficultyColors = {
    'Beginner': 'text-green-400 bg-green-500/20',
    'Intermediate': 'text-yellow-400 bg-yellow-500/20',
    'Advanced': 'text-red-400 bg-red-500/20',
    'All Levels': 'text-blue-400 bg-blue-500/20',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-[#D0FF00]" />
        <h2 className="text-xl font-bold text-white">Training Modules</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <Card 
            key={module.id} 
            className={`bg-white/5 border-white/10 hover:border-[#D0FF00]/50 transition-all ${
              module.locked ? 'opacity-60' : ''
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2">{module.title}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded ${difficultyColors[module.difficulty]}`}>
                      {module.difficulty}
                    </span>
                    <span className="text-gray-400">{module.duration}</span>
                  </div>
                </div>
                {module.completed && (
                  <CheckCircle className="w-6 h-6 text-green-400" fill="currentColor" />
                )}
                {module.locked && (
                  <Lock className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <Button 
                disabled={module.locked}
                className={`w-full mt-3 ${
                  module.completed 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : module.locked
                    ? 'bg-white/5 text-gray-500'
                    : 'bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90'
                }`}
              >
                {module.locked ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Locked
                  </>
                ) : module.completed ? (
                  'Review'
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Training
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}