'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Phone, ShieldAlert, Users, AlertTriangle, Shield, Laptop } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface HelpTopic {
  title: string;
  icon: LucideIcon;
  items: string[];
}

const HELP_TOPICS: HelpTopic[] = [
  { title: 'Common Scams to Watch For', icon: AlertTriangle, items: ['Phone calls saying you owe money to the government', 'Emails asking for your password or bank info', 'People at your door claiming to be from a company', 'Text messages with suspicious links', 'Someone claiming a family member is in trouble'] },
  { title: 'What to Do If Something Feels Wrong', icon: Shield, items: ['Do NOT give personal information', 'Hang up the phone or close the door', 'Call a family member right away', 'Report it using the button above', 'Write down any details you remember'] },
  { title: 'How to Check Device Safety', icon: Laptop, items: ['Look for the protection score on your devices page', 'A green shield means you are protected', 'A red warning means action is needed', 'Ask your family member to help if needed'] },
];

export function GetHelpPage(): React.ReactElement {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Get Help</h1>
        <p className="text-xl text-slate-500 mt-1">Quick actions and helpful information.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <a href="tel:911" className="flex items-center justify-center gap-4 p-6 rounded-xl bg-red-600 text-white text-2xl font-bold shadow-lg hover:bg-red-700 transition-colors">
          <Phone className="w-8 h-8" /> Call 911
        </a>
        <Button
          className="h-auto p-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold shadow-lg flex items-center justify-center gap-4 w-full"
          onClick={() => router.push('/vet-them-first/senior/family-contacts')}
        >
          <Users className="w-8 h-8" /> Call Family
        </Button>
        <Button
          className="h-auto p-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-2xl font-bold shadow-lg flex items-center justify-center gap-4 w-full"
          onClick={() => router.push('/vet-them-first/senior/report-scam')}
        >
          <ShieldAlert className="w-8 h-8" /> Report a Scam
        </Button>
      </div>

      <div className="space-y-4">
        {HELP_TOPICS.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card key={topic.title} className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-8 h-8 text-blue-500" />
                  <h2 className="text-2xl font-bold text-slate-900">{topic.title}</h2>
                </div>
                <ul className="space-y-3">
                  {topic.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold text-blue-600">{i + 1}</span>
                      </div>
                      <p className="text-xl text-slate-700">{item}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
