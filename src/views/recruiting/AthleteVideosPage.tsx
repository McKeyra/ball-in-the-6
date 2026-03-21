'use client';

import { Video, Upload, Film, Play } from 'lucide-react';

const VIDEO_TYPES = [
  { label: 'Game Film', description: 'Full game footage from official games', icon: Film },
  { label: 'Highlights', description: 'Curated clips of your best plays', icon: Play },
  { label: 'Training', description: 'Workout and skills training footage', icon: Video },
] as const;

export function AthleteVideosPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Video Highlights</h1>
        <p className="text-slate-400 text-sm mt-1">
          Upload and manage video content to showcase your abilities to recruiters.
        </p>
      </div>

      <div className="bg-slate-900 border border-dashed border-slate-800 rounded-lg p-8 text-center">
        <Upload className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 text-sm font-medium">Upload Video</p>
        <p className="text-slate-600 text-xs mt-1">MP4, MOV up to 500MB. YouTube and Hudl links also supported.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {VIDEO_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <div key={type.label} className="bg-slate-900 border border-slate-800 rounded-lg">
              <div className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-white">{type.label}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500">{type.description}</p>
                <div className="mt-4 py-6 text-center">
                  <p className="text-slate-600 text-xs">No videos uploaded yet</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4"><h2 className="text-base font-semibold text-white">Video Tips</h2></div>
        <div className="p-4">
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2"><span className="text-red-500 mt-1">1.</span>Upload at least 3 highlight clips to get 5x more recruiter views</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-1">2.</span>Include your jersey number and position in video titles</li>
            <li className="flex items-start gap-2"><span className="text-red-500 mt-1">3.</span>Keep highlight reels under 5 minutes for maximum engagement</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
