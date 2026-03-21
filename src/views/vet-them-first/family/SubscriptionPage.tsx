'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Check, Star, Shield, Zap, Crown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  icon: LucideIcon;
  color: 'blue' | 'red' | 'amber';
  seniors: number;
  devices: number;
  popular?: boolean;
  features: string[];
}

interface SubscriptionRecord {
  id: string;
  plan_id?: string;
  plan_name?: string;
  price?: number;
  start_date?: string;
}

const PLANS: Plan[] = [
  {
    id: 'basic', name: 'Basic', price: 9.99, interval: 'month', icon: Shield, color: 'blue',
    seniors: 1, devices: 2,
    features: ['1 senior protected', '2 devices monitored', 'Basic scam alerts', 'Manual check-ins', 'Email support'],
  },
  {
    id: 'standard', name: 'Standard', price: 19.99, interval: 'month', icon: Zap, color: 'red',
    seniors: 2, devices: 5, popular: true,
    features: ['2 seniors protected', '5 devices monitored', 'Real-time scam alerts', 'Scheduled check-ins', 'Contractor vetting', 'Visit scheduling', 'Priority support'],
  },
  {
    id: 'premium', name: 'Premium', price: 39.99, interval: 'month', icon: Crown, color: 'amber',
    seniors: -1, devices: -1,
    features: ['Unlimited seniors', 'Unlimited devices', 'AI-powered scam detection', 'Auto check-ins & reminders', 'Contractor vetting + background checks', 'Visit scheduling + coordination', 'Dedicated account manager', 'Phone support 24/7'],
  },
];

const PLAN_COLORS: Record<string, { bg: string; border: string; text: string; btn: string; ring: string }> = {
  blue: { bg: 'bg-blue-600/10', border: 'border-blue-600/30', text: 'text-blue-400', btn: 'bg-blue-600 hover:bg-blue-700', ring: 'ring-blue-600/30' },
  red: { bg: 'bg-red-600/10', border: 'border-red-600/30', text: 'text-red-400', btn: 'bg-red-600 hover:bg-red-700', ring: 'ring-red-600/30' },
  amber: { bg: 'bg-amber-600/10', border: 'border-amber-600/30', text: 'text-amber-400', btn: 'bg-amber-600 hover:bg-amber-700', ring: 'ring-amber-600/30' },
};

export function SubscriptionPage(): React.ReactElement {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const { data: subscription, isLoading } = useQuery<SubscriptionRecord | null>({
    queryKey: ['vtf', 'subscription'],
    queryFn: async () => {
      // TODO: fetch('/api/vtf/family/subscription')
      return null;
    },
    enabled: !!user?.id,
  });

  const upgradeMutation = useMutation({
    mutationFn: async (planId: string) => {
      setUpgrading(planId);
      // TODO: fetch('/api/vtf/family/subscription', { method: 'POST', body: JSON.stringify({ plan_id: planId }) })
      return { planId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vtf', 'subscription'] });
      setUpgrading(null);
    },
    onError: () => setUpgrading(null),
  });

  const currentPlanId = subscription?.plan_id ?? null;
  const currentPlanIndex = PLANS.findIndex((p) => p.id === currentPlanId);

  return (
    <div className="bg-slate-950 min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscription</h1>
        <p className="text-slate-400 text-sm mt-1">Choose the right protection plan for your family.</p>
      </div>

      {subscription && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', PLAN_COLORS[PLANS.find((p) => p.id === currentPlanId)?.color ?? 'blue'].bg)}>
                <Star className={cn('w-5 h-5', PLAN_COLORS[PLANS.find((p) => p.id === currentPlanId)?.color ?? 'blue'].text)} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Current Plan: {subscription.plan_name}</p>
                <p className="text-xs text-slate-400">
                  ${subscription.price}/mo | Active since {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-green-600/30 text-green-400 text-[10px]">Active</Badge>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-96 bg-slate-800 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, idx) => {
            const colors = PLAN_COLORS[plan.color];
            const Icon = plan.icon;
            const isCurrent = currentPlanId === plan.id;
            const isDowngrade = currentPlanIndex !== -1 && idx < currentPlanIndex;
            const isUpgrade = currentPlanIndex !== -1 && idx > currentPlanIndex;

            return (
              <Card
                key={plan.id}
                className={cn(
                  'bg-slate-900 border-slate-800 relative overflow-hidden transition-all',
                  plan.popular && 'ring-2',
                  plan.popular && colors.ring,
                  isCurrent && 'ring-2 ring-green-600/40',
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-0 left-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg">
                    CURRENT
                  </div>
                )}
                <CardHeader className="pb-2 pt-8">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3', colors.bg)}>
                    <Icon className={cn('w-6 h-6', colors.text)} />
                  </div>
                  <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-white">${plan.price}</span>
                    <span className="text-sm text-slate-400">/{plan.interval}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {plan.seniors === -1 ? 'Unlimited seniors' : `${plan.seniors} senior${plan.seniors > 1 ? 's' : ''}`}
                    {' | '}
                    {plan.devices === -1 ? 'Unlimited devices' : `${plan.devices} devices`}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <Check className={cn('w-4 h-4 mt-0.5 shrink-0', colors.text)} />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={cn(
                      'w-full text-white',
                      isCurrent ? 'bg-slate-700 hover:bg-slate-700 cursor-default' : colors.btn,
                    )}
                    disabled={isCurrent || upgrading !== null}
                    onClick={() => upgradeMutation.mutate(plan.id)}
                  >
                    {isCurrent
                      ? 'Current Plan'
                      : upgrading === plan.id
                        ? 'Processing...'
                        : isDowngrade
                          ? 'Downgrade'
                          : isUpgrade
                            ? 'Upgrade'
                            : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { q: 'Can I change plans at any time?', a: 'Yes. Upgrades are effective immediately. Downgrades take effect at the end of your current billing cycle.' },
            { q: 'Is there a free trial?', a: 'New users get a 14-day free trial of the Standard plan. No credit card required.' },
            { q: 'What happens if I exceed my device limit?', a: 'You will be prompted to upgrade or remove a device before adding a new one.' },
            { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel anytime from this page and you will retain access until the end of your billing period.' },
          ].map(({ q, a }) => (
            <div key={q}>
              <p className="text-sm font-medium text-white">{q}</p>
              <p className="text-xs text-slate-400 mt-0.5">{a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
