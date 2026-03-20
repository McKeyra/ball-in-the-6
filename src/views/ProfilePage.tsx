'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import { Settings, Users, Trophy, Share2, Zap, MapPin, Calendar, Flame, ShieldCheck, TrendingUp, Shield, ChevronRight } from 'lucide-react';
import { PLAYERS } from '@/lib/mock-data';

const TABS = ['Plays', 'Assists', 'Saved'] as const;
const PLACEHOLDER_POSTS = Array.from({ length: 9 }, (_, i) => `grid-${i}`);

interface StatCardProps { icon: React.ReactNode; label: string; value: string; }
const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-center">
    <div className="flex justify-center mb-1">{icon}</div>
    <p className="text-2xl font-black tracking-tighter text-neutral-900">{value}</p>
    <p className="mt-1 text-[8px] font-mono uppercase tracking-widest text-neutral-500">{label}</p>
  </div>
);

export const ProfilePage: React.FC = () => {
  const router = useRouter();
  const me = PLAYERS[0];
  const [activeTab, setActiveTab] = useState<string>('Plays');
  const initials = me.name.split(' ').map((w) => w[0]).join('').slice(0, 2);

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <button type="button" onClick={() => router.push('/profiles')} className="absolute top-4 right-14 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm" aria-label="Browse profiles"><Users className="h-4 w-4 text-white" /></button>
        <button type="button" className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm" aria-label="Settings"><Settings className="h-4 w-4 text-white" /></button>
        <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 backdrop-blur-sm"><Trophy className="h-3 w-3 text-yellow-400" /><span className="text-xs font-black text-yellow-400">#{me.rank}</span></div>
      </div>
      <div className="px-5">
        <div className={cn('relative -mt-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br', me.color, 'shadow-[0_0_30px_rgba(147,51,234,0.4)]')}><span className="text-2xl font-black text-white/90 select-none">{initials}</span></div>
        <div className="mt-3 flex items-center gap-2"><h1 className="text-xl font-black text-neutral-900 tracking-tight">{me.name}</h1>{me.verified && <ShieldCheck className="h-5 w-5 text-[#c8ff00]" />}</div>
        <p className="text-sm font-mono text-neutral-500">{me.handle}</p>
        <p className="mt-2 text-sm text-neutral-700 leading-relaxed">Building the culture, one play at a time. Toronto born and raised.</p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Scarborough, ON</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Joined Jan 2024</span>
          <span className="flex items-center gap-1 text-orange-400"><Flame className="h-3 w-3" />{me.streak} day streak</span>
        </div>
        <div className="mt-4 flex items-center gap-6 text-sm">
          <span><span className="font-black text-neutral-900">1.2k</span> <span className="text-neutral-500">Following</span></span>
          <span><span className="font-black text-neutral-900">4.8k</span> <span className="text-neutral-500">Followers</span></span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <StatCard icon={<Trophy className="h-4 w-4 text-yellow-400" />} label="Impact Score" value={formatNumber(me.impactScore)} />
          <StatCard icon={<Share2 className="h-4 w-4 text-orange-400" />} label="Assists Given" value={String(me.assistsGiven)} />
          <StatCard icon={<Zap className="h-4 w-4 text-purple-400" />} label="Plays Posted" value={String(me.playsPosted)} />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
          <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-yellow-400" /><span className="text-xs font-bold text-neutral-700">Leaderboard Position</span></div>
          <span className="text-lg font-black text-yellow-400">#{me.rank}</span>
        </div>
        <div className="mt-6 flex border-b border-neutral-200/60">
          {TABS.map((tab) => (<button key={tab} type="button" onClick={() => setActiveTab(tab)} className={cn('flex-1 pb-3 text-center text-xs font-bold transition-colors', activeTab === tab ? 'text-neutral-900 border-b-2 border-[#c8ff00]' : 'text-neutral-500')}>{tab}</button>))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1">
          {PLACEHOLDER_POSTS.map((key) => <div key={key} className="aspect-square rounded-lg bg-neutral-100 border border-neutral-200" />)}
        </div>
      </div>
      <div className="mt-6 px-4">
        <Link href="/admin" className="flex items-center justify-between w-full p-4 bg-lime/5 border border-lime/10 rounded-2xl hover:bg-lime/10 transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center"><Shield size={18} className="text-lime-dark" /></div>
            <div><p className="text-neutral-900 font-bold text-sm">Admin Panel</p><p className="text-neutral-400 text-[10px] font-mono uppercase tracking-widest">Dashboard · Analytics · Settings</p></div>
          </div>
          <ChevronRight size={18} className="text-neutral-400 group-hover:text-lime-dark transition-colors" />
        </Link>
      </div>
    </div>
  );
};
