'use client';

import { motion } from 'motion/react';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Key,
  Save,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FeatureToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const INITIAL_TOGGLES: FeatureToggle[] = [
  { id: 'ft-001', label: 'User Registration', description: 'Allow new users to create accounts', enabled: true },
  { id: 'ft-002', label: 'Content Moderation Queue', description: 'Require manual approval for new posts', enabled: true },
  { id: 'ft-003', label: 'Intelligence Module', description: 'Enable cross-sport intelligence analytics', enabled: true },
  { id: 'ft-004', label: 'Court Check-ins', description: 'Allow users to check in at courts', enabled: true },
  { id: 'ft-005', label: 'Live Scoring', description: 'Enable real-time game score updates', enabled: false },
  { id: 'ft-006', label: 'Push Notifications', description: 'Send push notifications to mobile users', enabled: false },
  { id: 'ft-007', label: 'API Public Access', description: 'Allow third-party API access', enabled: false },
  { id: 'ft-008', label: 'Dark Mode', description: 'Enable dark mode theme option', enabled: false },
];

const NOTIFICATION_SETTINGS = [
  { id: 'n-001', label: 'New user signups', enabled: true },
  { id: 'n-002', label: 'Flagged content alerts', enabled: true },
  { id: 'n-003', label: 'Game score updates', enabled: false },
  { id: 'n-004', label: 'System health alerts', enabled: true },
  { id: 'n-005', label: 'Weekly digest report', enabled: true },
];

export default function SettingsPage(): React.ReactElement {
  const [appName, setAppName] = useState('Ball in the 6');
  const [appDescription, setAppDescription] = useState("Toronto's sports community platform. Plays, game results, player intelligence, and court discovery.");
  const [appUrl, setAppUrl] = useState('https://ballinthe6.com');
  const [supportEmail, setSupportEmail] = useState('support@ballinthe6.com');

  const [features, setFeatures] = useState(INITIAL_TOGGLES);
  const [notifications, setNotifications] = useState(NOTIFICATION_SETTINGS);

  const toggleFeature = (id: string): void => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const toggleNotification = (id: string): void => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)));
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Configure platform settings and preferences
        </p>
      </div>

      {/* General settings */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-5"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100">
            <Globe size={16} className="text-neutral-600" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900">General</h2>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              App Name
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-black/[0.06] bg-surface px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-lime focus:ring-1 focus:ring-lime/30"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Description
            </label>
            <textarea
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              rows={3}
              className="mt-1.5 w-full resize-none rounded-2xl border border-black/[0.06] bg-surface px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-lime focus:ring-1 focus:ring-lime/30"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                App URL
              </label>
              <input
                type="url"
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-black/[0.06] bg-surface px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-lime focus:ring-1 focus:ring-lime/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-black/[0.06] bg-surface px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-lime focus:ring-1 focus:ring-lime/30"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </motion.div>

      {/* Feature toggles */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-5"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime/[0.1]">
            <Settings size={16} className="text-lime-dark" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900">Feature Toggles</h2>
        </div>

        <div className="mt-5 divide-y divide-black/[0.04]">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{feature.label}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{feature.description}</p>
              </div>
              <button
                onClick={() => toggleFeature(feature.id)}
                className="shrink-0"
              >
                {feature.enabled ? (
                  <ToggleRight size={32} className="text-lime-dark" />
                ) : (
                  <ToggleLeft size={32} className="text-neutral-300" />
                )}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* API configuration */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-5"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-blue/[0.08]">
            <Key size={16} className="text-accent-blue" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900">API Configuration</h2>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              API Endpoint
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-surface px-4 py-2.5">
              <span className="font-mono text-sm text-neutral-600">https://api.ballinthe6.com/v1</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              API Key
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 rounded-2xl border border-black/[0.06] bg-surface px-4 py-2.5">
                <span className="font-mono text-sm text-neutral-400">b6_sk_••••••••••••••••••••••••</span>
              </div>
              <button className="rounded-2xl border border-black/[0.06] bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 transition-colors hover:bg-neutral-50">
                Regenerate
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Rate Limit
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-surface px-4 py-2.5">
                <span className="font-mono text-sm text-neutral-600">1000 requests/min</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Version
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-surface px-4 py-2.5">
                <span className="font-mono text-sm text-neutral-600">v0.22</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification settings */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="rounded-[20px] border border-black/[0.06] bg-white p-5"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-orange/[0.08]">
            <Bell size={16} className="text-accent-orange" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900">Admin Notifications</h2>
        </div>

        <div className="mt-5 divide-y divide-black/[0.04]">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span className="text-sm text-neutral-700">{notif.label}</span>
              <button
                onClick={() => toggleNotification(notif.id)}
                className="shrink-0"
              >
                {notif.enabled ? (
                  <ToggleRight size={28} className="text-lime-dark" />
                ) : (
                  <ToggleLeft size={28} className="text-neutral-300" />
                )}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
