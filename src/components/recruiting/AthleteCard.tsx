'use client';

import { cn } from '@/lib/utils';
import { MapPin, CheckCircle, Shield } from 'lucide-react';
import { VanceScoreBadge } from './VanceScoreBadge';

interface AthleteData {
  id: string;
  name?: string;
  photo_url?: string;
  position?: string;
  height_ft?: number;
  height_in?: number;
  weight?: number;
  school?: string;
  city?: string;
  stat_line?: string;
  vance_rating?: number;
  is_verified?: boolean;
  is_committed?: boolean;
  committed_to?: string;
  graduation_year?: number;
  sport?: string;
}

interface AthleteCardProps {
  athlete: AthleteData;
  variant?: 'grid' | 'list';
}

export function AthleteCard({ athlete, variant = 'grid' }: AthleteCardProps): React.ReactElement {
  const {
    name,
    photo_url,
    position,
    height_ft,
    height_in,
    weight,
    school,
    city,
    stat_line,
    vance_rating,
    is_verified,
    is_committed,
    committed_to,
    graduation_year,
    sport,
  } = athlete;

  const heightDisplay = height_ft && height_in !== undefined
    ? `${height_ft}'${height_in}"`
    : null;

  if (variant === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {photo_url ? (
            <img src={photo_url} alt={name ?? 'Athlete'} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-red-400">{(name ?? 'A').charAt(0)}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white truncate">{name}</p>
            {is_verified && <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
            {is_committed && (
              <span className="bg-green-600/20 text-green-400 border border-green-600/30 text-[9px] px-1.5 py-0.5 rounded-full">
                Committed
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {position} {heightDisplay && `| ${heightDisplay}`} {weight && `| ${weight} lbs`}
          </p>
          <p className="text-xs text-slate-500">{school} {graduation_year && `'${String(graduation_year).slice(2)}`}</p>
        </div>

        {stat_line && (
          <span className="text-xs text-slate-400 hidden md:block">{stat_line}</span>
        )}

        <VanceScoreBadge score={vance_rating} size="md" />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer rounded-lg">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-600/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {photo_url ? (
              <img src={photo_url} alt={name ?? 'Athlete'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-red-400">{(name ?? 'A').charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-white truncate">{name}</p>
              {is_verified && <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
            </div>
            <p className="text-xs text-slate-400">
              {position}
              {graduation_year && ` | Class of ${graduation_year}`}
            </p>
          </div>
          <VanceScoreBadge score={vance_rating} size="sm" />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          {heightDisplay && <span>{heightDisplay}</span>}
          {weight && <span>{weight} lbs</span>}
          {sport && (
            <span className="border border-slate-700 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full">
              {sport}
            </span>
          )}
        </div>

        {stat_line && (
          <p className="text-xs text-slate-300 bg-slate-800/50 px-2 py-1 rounded">
            {stat_line}
          </p>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">{school}</span>
          {city && (
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3 h-3" /> {city}
            </span>
          )}
        </div>

        {is_committed && (
          <div className="flex items-center gap-1">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Committed{committed_to ? ` to ${committed_to}` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
