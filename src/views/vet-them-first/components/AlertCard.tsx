'use client';

import { cn } from '@/lib/utils';
import { AlertTriangle, Info, AlertCircle, ShieldAlert } from 'lucide-react';

type Severity = 'info' | 'warning' | 'urgent' | 'critical';

interface AlertData {
  id: string;
  severity?: Severity;
  title?: string;
  message?: string;
  description?: string;
  created_date?: string;
}

interface SeverityConfig {
  bg: string;
  border: string;
  text: string;
  icon: typeof Info;
}

const SEVERITY_CONFIG: Record<Severity, SeverityConfig> = {
  info: { bg: 'bg-blue-600/10', border: 'border-blue-600/30', text: 'text-blue-400', icon: Info },
  warning: { bg: 'bg-amber-600/10', border: 'border-amber-600/30', text: 'text-amber-400', icon: AlertTriangle },
  urgent: { bg: 'bg-orange-600/10', border: 'border-orange-600/30', text: 'text-orange-400', icon: AlertCircle },
  critical: { bg: 'bg-red-600/10', border: 'border-red-600/30', text: 'text-red-400', icon: ShieldAlert },
};

interface AlertCardProps {
  alert: AlertData;
  variant?: 'dark' | 'light';
}

export function AlertCard({ alert, variant = 'dark' }: AlertCardProps): React.ReactElement {
  const config = SEVERITY_CONFIG[alert.severity ?? 'info'] ?? SEVERITY_CONFIG.info;
  const Icon = config.icon;
  const isLight = variant === 'light';

  return (
    <div className={cn(
      'flex items-start gap-3 p-4 rounded-lg border',
      config.bg,
      config.border,
    )}>
      <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.text)} />
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-medium',
          isLight ? 'text-xl text-slate-900' : 'text-sm text-white',
        )}>
          {alert.title ?? alert.message}
        </p>
        {alert.description && (
          <p className={cn(
            'mt-1',
            isLight ? 'text-base text-slate-600' : 'text-xs text-slate-400',
          )}>
            {alert.description}
          </p>
        )}
        {alert.created_date && (
          <p className={cn(
            'mt-1',
            isLight ? 'text-sm text-slate-500' : 'text-[10px] text-slate-500',
          )}>
            {new Date(alert.created_date).toLocaleString()}
          </p>
        )}
      </div>
      {alert.severity && (
        <span className={cn(
          'px-2 py-0.5 rounded-full font-medium uppercase tracking-wider flex-shrink-0',
          config.bg,
          config.text,
          isLight ? 'text-sm' : 'text-[9px]',
        )}>
          {alert.severity}
        </span>
      )}
    </div>
  );
}
