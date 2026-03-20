'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Bell,
  Moon,
  Globe,
  Eye,
  MapPin,
  Activity,
  HardDrive,
  Info,
  AlertTriangle,
  Trash2,
  ChevronRight,
  Shield,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={() => onChange(!enabled)}
    className={cn(
      'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200',
      enabled ? 'bg-lime' : 'bg-neutral-200'
    )}
  >
    <motion.span
      layout
      className={cn(
        'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm',
        enabled ? 'left-[22px]' : 'left-0.5'
      )}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    />
  </button>
);

interface SettingRowProps {
  icon: typeof User;
  iconColor?: string;
  label: string;
  value?: string;
  action?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon: Icon, iconColor, label, value, action, danger, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface',
      danger && 'hover:bg-accent-red/[0.04]'
    )}
  >
    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]', danger ? 'bg-accent-red/10' : 'bg-surface')}>
      <Icon className={cn('h-4 w-4', danger ? 'text-accent-red' : iconColor || 'text-neutral-500')} strokeWidth={1.8} />
    </div>
    <div className="flex-1 min-w-0">
      <span className={cn('text-sm font-semibold', danger ? 'text-accent-red' : 'text-neutral-900')}>{label}</span>
    </div>
    {value && <span className="text-sm text-neutral-400 truncate max-w-[140px]">{value}</span>}
    {action || (!danger && <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />)}
  </button>
);

const Divider: React.FC = () => <div className="h-px bg-black/[0.04] mx-4" />;

const APP_VERSION = '1.0.0-beta';
const CACHE_SIZE = '24.3 MB';

export const SettingsPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-void/80 backdrop-blur-2xl border-b border-neutral-200/60"
      >
        <div className="flex items-center gap-3 px-4 pt-3 pb-3">
          <Link href="/profile" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100/60">
            <ArrowLeft className="h-[18px] w-[18px] text-neutral-500" strokeWidth={1.8} />
          </Link>
          <h1 className="text-lg font-black text-neutral-900">Settings</h1>
        </div>
      </motion.header>

      <div className="pt-4 space-y-4">
        {/* Account */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <h2 className="mb-2 px-5 text-xs font-black uppercase tracking-wider text-neutral-400">Account</h2>
          <div className="rounded-[20px] border border-black/[0.06] bg-white mx-4 overflow-hidden">
            <SettingRow icon={User} label="Name" value="McKeyra" />
            <Divider />
            <SettingRow icon={Mail} label="Email" value="mckey@enuw.ca" />
            <Divider />
            <SettingRow icon={Phone} label="Phone" value="+1 (416) ***-**89" />
          </div>
        </motion.section>

        {/* Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h2 className="mb-2 px-5 text-xs font-black uppercase tracking-wider text-neutral-400">Preferences</h2>
          <div className="rounded-[20px] border border-black/[0.06] bg-white mx-4 overflow-hidden">
            <SettingRow
              icon={Bell}
              iconColor="text-accent-orange"
              label="Push Notifications"
              action={<Toggle enabled={notificationsEnabled} onChange={setNotificationsEnabled} />}
            />
            <Divider />
            <SettingRow
              icon={Moon}
              iconColor="text-accent-purple"
              label="Dark Mode"
              action={<Toggle enabled={darkMode} onChange={setDarkMode} />}
            />
            <Divider />
            <SettingRow icon={Globe} iconColor="text-accent-blue" label="Language" value="English" />
          </div>
        </motion.section>

        {/* Privacy */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <h2 className="mb-2 px-5 text-xs font-black uppercase tracking-wider text-neutral-400">Privacy</h2>
          <div className="rounded-[20px] border border-black/[0.06] bg-white mx-4 overflow-hidden">
            <SettingRow
              icon={Eye}
              iconColor="text-accent-cyan"
              label="Profile Visibility"
              action={<Toggle enabled={profileVisible} onChange={setProfileVisible} />}
            />
            <Divider />
            <SettingRow
              icon={MapPin}
              iconColor="text-accent-emerald"
              label="Location Sharing"
              action={<Toggle enabled={locationSharing} onChange={setLocationSharing} />}
            />
            <Divider />
            <SettingRow
              icon={Activity}
              iconColor="text-lime-dark"
              label="Activity Status"
              action={<Toggle enabled={activityStatus} onChange={setActivityStatus} />}
            />
          </div>
        </motion.section>

        {/* App */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h2 className="mb-2 px-5 text-xs font-black uppercase tracking-wider text-neutral-400">App</h2>
          <div className="rounded-[20px] border border-black/[0.06] bg-white mx-4 overflow-hidden">
            <SettingRow icon={HardDrive} label="Clear Cache" value={CACHE_SIZE} />
            <Divider />
            <SettingRow icon={Smartphone} label="App Version" value={APP_VERSION} />
            <Divider />
            <SettingRow icon={Shield} label="Licenses & Legal" />
            <Divider />
            <SettingRow icon={Info} label="About Ball in the 6" />
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <h2 className="mb-2 px-5 text-xs font-black uppercase tracking-wider text-neutral-400">Danger Zone</h2>
          <div className="rounded-[20px] border border-accent-red/20 bg-white mx-4 overflow-hidden">
            <SettingRow icon={AlertTriangle} label="Deactivate Account" danger />
            <Divider />
            <SettingRow icon={Trash2} label="Delete Account" danger />
          </div>
          <p className="mt-2 px-5 text-[11px] text-neutral-300 leading-relaxed">
            Deactivating hides your profile temporarily. Deleting is permanent and removes all your data including plays, stats, and Impact Score.
          </p>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="pt-4 pb-8 text-center"
        >
          <p className="text-[11px] font-bold text-neutral-300">Ball in the 6 &middot; ENUW Inc.</p>
          <p className="text-[10px] text-neutral-200 mt-0.5">Toronto, Canada</p>
        </motion.div>
      </div>
    </div>
  );
};
