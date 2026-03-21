'use client';

import {
  MessageSquare,
  Inbox,
  Send,
  Search,
} from 'lucide-react';

const TABS = [
  { label: 'Inbox', icon: Inbox, count: 0 },
  { label: 'Sent', icon: Send, count: 0 },
] as const;

export function AthleteMessagesPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-slate-400 text-sm mt-1">
          Communicate directly with recruiters and coaches interested in your profile.
        </p>
      </div>

      <div className="flex gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-red-600"
          readOnly
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center py-16">
        <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-sm font-medium">No messages yet</p>
        <p className="text-slate-600 text-xs mt-2 max-w-sm mx-auto">
          When recruiters reach out about your profile, their messages will appear here.
          Complete your profile to increase recruiter interest.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg">
        <div className="p-4 pb-2">
          <h2 className="text-base font-semibold text-white">Communication Guidelines</h2>
        </div>
        <div className="p-4">
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">DO</span>
              Respond to recruiter messages within 24-48 hours
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">DO</span>
              Be professional, express genuine interest, and ask thoughtful questions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">DON&apos;T</span>
              Share personal contact info outside the platform before verification
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
