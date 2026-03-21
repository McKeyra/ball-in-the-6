'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const SUPPORT_PERSONAS = [
  { key: 'coach', icon: '\u{1F4CB}', title: 'Coach', role: 'Your primary technical and tactical guide. They design your training, manage game strategy, and push you beyond your comfort zone.', toolkit: { conversations: ['What specific areas should I focus on to earn more playing time?', 'Can we watch film together and break down my last game?', 'What does my development trajectory look like this season?'], activities: ['Pre-game strategy sessions', 'Weekly 1-on-1 check-ins', 'Post-game film review'] } },
  { key: 'parent', icon: '\u{1F3E0}', title: 'Parent/Guardian', role: 'Your emotional anchor and logistical backbone. They drive you to practice, fund your development, and love you win or lose.', toolkit: { conversations: ['I appreciate everything you do to support my sports journey.', 'Can we talk about how to balance school and training better?', 'Here is what I am working on this month — I would love your support.'], activities: ['Post-game car ride debrief (positive only)', 'Monthly goal review', 'Nutrition planning together'] } },
  { key: 'mentor', icon: '\u{1F393}', title: 'Mentor', role: 'A trusted advisor who has walked the path before you. Could be a former player, senior teammate, or respected community member.', toolkit: { conversations: ['What do you wish you knew at my age about this sport?', 'How did you handle setbacks in your career?', 'What habits made the biggest difference in your development?'], activities: ['Monthly coffee/phone catch-up', 'Attend their games or events', 'Shadow their professional routine'] } },
  { key: 'sibling', icon: '\u{1F46B}', title: 'Sibling', role: 'Your first competitor and lifelong ally. Siblings understand the grind and can keep you accountable in ways no one else can.', toolkit: { conversations: ['Want to train together this week?', 'Be honest — what do you see in my game that needs work?', 'Let us challenge each other to hit our goals this month.'], activities: ['Backyard/driveway training sessions', 'Accountability check-ins', 'Watch games together'] } },
  { key: 'training_partner', icon: '\u{1F91C}', title: 'Training Partner', role: 'Someone at your level or above who pushes you daily. Iron sharpens iron — you both get better.', toolkit: { conversations: ['Let us set a weekly training schedule and hold each other to it.', 'What are you working on? Can I help?', 'I noticed you improved at [skill] — what changed?'], activities: ['Extra skill sessions together', 'Competitive 1-on-1 drills', 'Shared film study'] } },
  { key: 'grandparent', icon: '\u{1F9D3}', title: 'Grandparent', role: 'Perspective and unconditional love. Grandparents remind you that sports are part of a bigger life journey.', toolkit: { conversations: ['Tell me about sports in your generation — what was different?', 'I have a big game coming up and I would love if you could be there.', 'Thank you for always believing in me.'], activities: ['Invite them to games', 'Share highlights and achievements', 'Learn family sports history'] } },
  { key: 'teacher', icon: '\u{1F4DA}', title: 'Teacher', role: 'Your academic support system. Teachers help you balance education and athletics, which is critical for long-term success.', toolkit: { conversations: ['I have a tournament coming up — can we plan ahead for assignments?', 'What study habits do you recommend for student-athletes?', 'Can you help me understand how academics support my athletic career?'], activities: ['Academic planning around game schedule', 'Study groups with teammates', 'Career exploration beyond sport'] } },
  { key: 'community', icon: '\u{1F310}', title: 'Community Organizer', role: 'Connects you to leagues, tournaments, funding, and opportunities in your community. They know the local landscape.', toolkit: { conversations: ['What programs or leagues would you recommend for my level?', 'Are there any grants or sponsorships available for young athletes?', 'How can I give back to the community through my sport?'], activities: ['Volunteer at community events', 'Help coach younger kids', 'Attend local sport networking events'] } },
];

export function SupportNetworkView(): React.ReactElement {
  const { sportConfig } = useSport();
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [checkInName, setCheckInName] = useState('');
  const [checkInNote, setCheckInNote] = useState('');
  const [checkIns, setCheckIns] = useState<Array<{ name: string; note: string; date: string }>>([]);

  const togglePersona = (key: string): void => {
    setExpandedPersona(expandedPersona === key ? null : key);
  };

  const submitCheckIn = (): void => {
    if (!checkInName.trim()) return;
    setCheckIns((prev) => [{ name: checkInName.trim(), note: checkInNote.trim(), date: new Date().toISOString() }, ...prev]);
    setCheckInName('');
    setCheckInNote('');
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F91D}'}</span>
        <h1 className="text-2xl font-bold text-white">Support Network</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>

      <p className="text-neutral-400 text-sm">No athlete succeeds alone. Build your circle of 8 support personas. Each comes with conversation starters and activities.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUPPORT_PERSONAS.map((persona) => {
          const isExpanded = expandedPersona === persona.key;
          return (
            <div
              key={persona.key}
              className={cn('bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer transition-all p-5', isExpanded && 'sm:col-span-2 border-neutral-600')}
              onClick={() => togglePersona(persona.key)}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{persona.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white">{persona.title}</h3>
                  <p className="text-sm text-neutral-400 mt-1">{persona.role}</p>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-5 pt-4 border-t border-neutral-800 space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-300 mb-2">{'\u{1F4AC}'} Conversation Starters</h4>
                    <div className="space-y-2">
                      {persona.toolkit.conversations.map((c, i) => (
                        <div key={i} className="p-2 rounded-lg bg-neutral-800/50 text-sm text-neutral-300 italic">&ldquo;{c}&rdquo;</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-300 mb-2">{'\u{1F3AF}'} Activities</h4>
                    <div className="flex flex-wrap gap-2">
                      {persona.toolkit.activities.map((a) => (
                        <span key={a} className="text-xs text-neutral-300 border border-neutral-700 rounded-full px-2 py-1">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
        <h3 className="text-white text-lg font-semibold">Support Check-In</h3>
        <p className="text-sm text-neutral-400">Track when you last connected with your support network.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={checkInName} onChange={(e) => setCheckInName(e.target.value)} className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500" placeholder="Person's name..." />
          <input value={checkInNote} onChange={(e) => setCheckInNote(e.target.value)} className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500" placeholder="Quick note (optional)..." />
        </div>
        <button onClick={submitCheckIn} disabled={!checkInName.trim()} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#c8ff00] text-black hover:bg-[#b8ef00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Log Check-In</button>

        {checkIns.length > 0 && (
          <div className="space-y-2 mt-4 pt-4 border-t border-neutral-800">
            {checkIns.slice(0, 5).map((ci, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-neutral-800/30">
                <div>
                  <span className="text-sm text-white font-medium">{ci.name}</span>
                  {ci.note && <span className="text-xs text-neutral-500 ml-2">&mdash; {ci.note}</span>}
                </div>
                <span className="text-xs text-neutral-500">{new Date(ci.date).toLocaleDateString('en-CA')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
