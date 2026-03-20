'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ImagePlus, MapPin, Hash, BarChart3 } from 'lucide-react';

const MAX_CHARS = 280;
const CHAR_WARN_THRESHOLD = 20;

const ATTACHMENT_BUTTONS = [
  { icon: ImagePlus, label: 'Image' },
  { icon: MapPin, label: 'Location' },
  { icon: Hash, label: 'Tag' },
  { icon: BarChart3, label: 'Poll' },
] as const;

export const ComposePage: React.FC = () => {
  const router = useRouter();
  const [content, setContent] = useState<string>('');
  const remaining = MAX_CHARS - content.length;
  const canPost = content.trim().length > 0 && remaining >= 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200/60">
        <button type="button" onClick={() => router.back()} className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700">Cancel</button>
        <button type="button" disabled={!canPost} className={cn('rounded-xl px-6 py-2 text-sm font-black transition-all', canPost ? 'bg-[#c8ff00] text-black hover:bg-[#d4ff33]' : 'bg-neutral-100/60 text-neutral-300 cursor-not-allowed')}>Post</button>
      </div>
      <div className="flex-1 px-4 pt-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500"><span className="text-xs font-black text-white/90 select-none">MK</span></div>
          <textarea value={content} onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))} placeholder="What's happening on the court?" className="flex-1 resize-none bg-transparent text-lg text-neutral-900 placeholder:text-neutral-400 outline-none min-h-[200px]" />
        </div>
        <div className="mt-4 flex justify-end">
          <span className={cn('text-xs font-mono', remaining < 0 ? 'text-red-500' : remaining < CHAR_WARN_THRESHOLD ? 'text-red-400' : 'text-neutral-400')}>{remaining}</span>
        </div>
      </div>
      <div className="border-t border-neutral-200/60 px-4 py-3">
        <div className="flex items-center gap-5">
          {ATTACHMENT_BUTTONS.map(({ icon: Icon, label }) => (<button key={label} type="button" className="transition-colors hover:text-[#c8ff00]" aria-label={label}><Icon className="h-5 w-5 text-neutral-500" /></button>))}
        </div>
      </div>
    </div>
  );
};
