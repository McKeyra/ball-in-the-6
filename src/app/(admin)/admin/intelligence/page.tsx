'use client';

import { Brain } from 'lucide-react';

export default function AdminIntelligencePage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/15">
          <Brain className="h-5 w-5 text-neutral-800" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Intelligence</h1>
          <p className="text-sm text-neutral-500">AI6 engine analytics and configuration</p>
        </div>
      </div>
      <div className="rounded-[20px] border border-black/[0.06] bg-white p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <p className="text-sm text-neutral-400">Intelligence dashboard coming soon.</p>
      </div>
    </div>
  );
}
