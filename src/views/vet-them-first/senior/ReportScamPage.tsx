'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Phone, Mail, UserX, HelpCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// TODO: Replace with actual auth hook
function useAuth(): { user: { id: string } | null } {
  return { user: { id: 'mock-user' } };
}

interface IncidentType {
  value: string;
  label: string;
  icon: LucideIcon;
  desc: string;
}

const INCIDENT_TYPES: IncidentType[] = [
  { value: 'call', label: 'Phone Call', icon: Phone, desc: 'Suspicious phone call' },
  { value: 'email', label: 'Email / Text', icon: Mail, desc: 'Suspicious email or message' },
  { value: 'visitor', label: 'Visitor', icon: UserX, desc: 'Someone came to my door' },
  { value: 'other', label: 'Something Else', icon: HelpCircle, desc: 'Other concern' },
];

export function ReportScamPage(): React.ReactElement {
  const { user } = useAuth();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [when, setWhen] = useState('');
  const [who, setWho] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: fetch('/api/vtf/senior/scam-reports', { method: 'POST', body: JSON.stringify(data) })
      return data;
    },
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (): void => {
    submitMutation.mutate({
      senior_id: user?.id,
      type,
      description,
      when_happened: when,
      who_contacted: who,
      status: 'new',
      severity: type === 'visitor' ? 'urgent' : 'warning',
      created_date: new Date().toISOString(),
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Report Submitted</h1>
          <p className="text-xl text-slate-500 max-w-md">
            Your family has been notified. They will review this and follow up with you.
          </p>
          <Button
            className="h-auto px-8 py-4 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            onClick={() => { setSubmitted(false); setType(''); setDescription(''); setWhen(''); setWho(''); }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Report Something Suspicious</h1>
        <p className="text-xl text-slate-500 mt-1">Tell us what happened. Your family will be notified.</p>
      </div>

      <div>
        <Label className="text-xl font-semibold text-slate-900 mb-3 block">What happened?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INCIDENT_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={cn(
                  'flex items-center gap-4 p-5 rounded-xl border-2 transition-colors text-left',
                  type === t.value
                    ? 'bg-red-50 border-red-500'
                    : 'bg-white border-slate-200 hover:border-slate-300',
                )}
              >
                <Icon className={cn('w-10 h-10', type === t.value ? 'text-red-500' : 'text-slate-400')} />
                <div>
                  <p className="text-xl font-semibold text-slate-900">{t.label}</p>
                  <p className="text-lg text-slate-500">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-xl font-semibold text-slate-900">Describe what happened</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us as much as you remember..."
              rows={4}
              className="bg-white border-slate-300 text-xl text-slate-900 p-4"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xl font-semibold text-slate-900">When did it happen?</Label>
            <Textarea
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              placeholder="e.g. This morning, yesterday afternoon..."
              rows={2}
              className="bg-white border-slate-300 text-xl text-slate-900 p-4"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xl font-semibold text-slate-900">Who contacted you? (if known)</Label>
            <Textarea
              value={who}
              onChange={(e) => setWho(e.target.value)}
              placeholder="Name, phone number, or any details..."
              rows={2}
              className="bg-white border-slate-300 text-xl text-slate-900 p-4"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full h-auto py-5 text-2xl font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl"
        onClick={handleSubmit}
        disabled={!type || !description.trim() || submitMutation.isPending}
      >
        <ShieldAlert className="w-7 h-7 mr-2" />
        {submitMutation.isPending ? 'Submitting...' : 'Submit Report'}
      </Button>
    </div>
  );
}
