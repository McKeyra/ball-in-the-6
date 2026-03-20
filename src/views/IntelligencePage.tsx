'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, BarChart3, Users, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IntelligenceDashboard } from '@/components/intelligence/IntelligenceDashboard';
import { CrossSportCard } from '@/components/intelligence/CrossSportCard';
import { AthleteIntelCard } from '@/components/intelligence/AthleteIntelCard';
import { StakeholderMatrix } from '@/components/intelligence/StakeholderMatrix';
import { ALL_COMPARISONS, ATHLETES, STAKEHOLDER_WEIGHTS } from '@/lib/intelligence-data';

type IntelTab = 'overview' | 'compare' | 'athletes' | 'matrix';

const TABS: { key: IntelTab; label: string; icon: typeof Brain }[] = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'compare', label: 'Compare', icon: Layers },
  { key: 'athletes', label: 'Athletes', icon: Users },
  { key: 'matrix', label: 'Matrix', icon: Brain },
];

function TabContent({ tab }: { tab: IntelTab }): React.ReactElement {
  switch (tab) {
    case 'overview':
      return <IntelligenceDashboard comparisons={ALL_COMPARISONS} athletes={ATHLETES} />;

    case 'compare':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-black text-neutral-900">Cross-Sport Comparisons</h2>
            <span className="text-[9px] font-mono text-neutral-400">{ALL_COMPARISONS.length} analyses</span>
          </div>
          {ALL_COMPARISONS.map((comparison, i) => (
            <CrossSportCard key={comparison.trait.id} comparison={comparison} index={i} />
          ))}
        </div>
      );

    case 'athletes':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-black text-neutral-900">Athlete Intelligence Profiles</h2>
            <span className="text-[9px] font-mono text-neutral-400">{ATHLETES.length} profiled</span>
          </div>
          {ATHLETES
            .sort((a, b) => b.impactScore - a.impactScore)
            .map((athlete, i) => (
              <AthleteIntelCard key={athlete.athleteId} athlete={athlete} index={i} />
            ))}
        </div>
      );

    case 'matrix':
      return <StakeholderMatrix weights={STAKEHOLDER_WEIGHTS} athlete={ATHLETES[0]} />;
  }
}

export const IntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IntelTab>('overview');

  return (
    <div className="min-h-screen pb-28">
      <div className="sticky top-0 z-40 bg-void/90 backdrop-blur-2xl border-b border-neutral-200/60">
        <div className="mx-auto max-w-xl px-4 pt-14 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime/[0.08] border border-lime/[0.15]">
              <Brain className="h-5 w-5 text-lime-dark" />
            </div>
            <div>
              <h1 className="text-lg font-black text-neutral-900">Intelligence Engine</h1>
              <p className="text-[11px] text-neutral-500">2,596 stats &middot; 40 sports &middot; 57 universal concepts</p>
            </div>
          </div>
          <div className="mt-4 flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-lime/[0.12] text-lime-dark border border-lime/[0.2]'
                      : 'text-neutral-400 hover:text-neutral-600'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="intel-tab-indicator"
                      className="absolute inset-0 rounded-xl bg-lime/[0.06] border border-lime/[0.12]"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-xl px-4 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <TabContent tab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
