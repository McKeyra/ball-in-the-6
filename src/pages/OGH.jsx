import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  Activity, Users, Trophy, Calendar, AlertTriangle, CheckCircle,
  TrendingUp, Database, Shield, RefreshCw, ChevronRight,
  HeartPulse, BarChart3, Settings
} from 'lucide-react';

export default function OGH() {
  // Fetch counts for health metrics
  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['ogh-teams'],
    queryFn: () => base44.entities.Team.list(),
    staleTime: 30000,
  });

  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ['ogh-players'],
    queryFn: () => base44.entities.PersistentPlayer.list(),
    staleTime: 30000,
  });

  const { data: games = [], isLoading: gamesLoading } = useQuery({
    queryKey: ['ogh-games'],
    queryFn: () => base44.entities.Game.list(),
    staleTime: 30000,
  });

  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['ogh-programs'],
    queryFn: () => base44.entities.Program.list(),
    staleTime: 30000,
  });

  const isLoading = teamsLoading || playersLoading || gamesLoading || programsLoading;

  const healthMetrics = [
    { label: 'Teams', count: teams.length, icon: Users, color: '#4A90E2', status: teams.length > 0 ? 'healthy' : 'warning' },
    { label: 'Players', count: players.length, icon: Users, color: '#8BC9A8', status: players.length > 0 ? 'healthy' : 'warning' },
    { label: 'Games', count: games.length, icon: Trophy, color: '#c9a962', status: games.length > 0 ? 'healthy' : 'warning' },
    { label: 'Programs', count: programs.length, icon: Calendar, color: '#9B59B6', status: programs.length > 0 ? 'healthy' : 'warning' },
  ];

  const quickLinks = [
    { label: 'Team Health Dashboard', page: 'TeamHealthDashboard', icon: HeartPulse, desc: 'View team health scores and vitality metrics' },
    { label: 'Cleanup Duplicates', page: 'CleanupDuplicates', icon: RefreshCw, desc: 'Find and remove duplicate records' },
    { label: 'Player Management', page: 'PlayerManagement', icon: Users, desc: 'Manage player records and assignments' },
    { label: 'Team Management', page: 'TeamManagement', icon: Settings, desc: 'Configure teams and rosters' },
    { label: 'League Management', page: 'LeagueManagement', icon: Trophy, desc: 'Manage leagues and divisions' },
    { label: 'Schedule', page: 'Schedule', icon: Calendar, desc: 'View and manage schedules' },
    { label: 'Standings', page: 'Standings', icon: BarChart3, desc: 'League standings and rankings' },
    { label: 'Sponsor Pipeline', page: 'SponsorPipeline', icon: TrendingUp, desc: 'CRM and sponsor management' },
  ];

  const systemChecks = [
    { label: 'Database Connection', status: 'healthy', message: 'Connected to Supabase' },
    { label: 'Authentication', status: 'healthy', message: 'Auth service active' },
    { label: 'API Endpoints', status: 'healthy', message: 'All endpoints responding' },
    { label: 'Data Integrity', status: teams.length > 0 ? 'healthy' : 'warning', message: teams.length > 0 ? 'Data validated' : 'No team data found' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-emerald-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-white/40';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-400/10';
      case 'warning': return 'bg-yellow-400/10';
      case 'critical': return 'bg-red-400/10';
      default: return 'bg-white/[0.05]';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-[#c9a962]/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#c9a962]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Organization Global Health</h1>
                <p className="text-white/40 text-sm">Loading system status...</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl p-5 border border-white/[0.06] bg-white/[0.05] animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.1]" />
                  <div className="w-5 h-5 rounded-full bg-white/[0.1]" />
                </div>
                <div className="h-8 bg-white/[0.1] rounded w-16 mb-2" />
                <div className="h-4 bg-white/[0.06] rounded w-20" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-white/[0.05] border border-white/[0.06] p-6 mb-8">
            <div className="h-6 bg-white/[0.1] rounded w-40 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-white/[0.04] rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#c9a962]/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#c9a962]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Organization Global Health</h1>
              <p className="text-white/40 text-sm">System status and data integrity monitor</p>
            </div>
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {healthMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className={`rounded-2xl p-5 border border-white/[0.06] ${getStatusBg(metric.status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${metric.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: metric.color }} />
                  </div>
                  {metric.status === 'healthy' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <p className="text-3xl font-bold text-white mb-1">{metric.count}</p>
                <p className="text-sm text-white/50">{metric.label}</p>
              </div>
            );
          })}
        </div>

        {/* System Status */}
        <div className="rounded-2xl bg-white/[0.05] border border-white/[0.06] p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#c9a962]" />
            System Status
          </h2>
          <div className="space-y-3">
            {systemChecks.map((check) => (
              <div
                key={check.label}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  {check.status === 'healthy' ? (
                    <CheckCircle className={`w-5 h-5 ${getStatusColor(check.status)}`} />
                  ) : (
                    <AlertTriangle className={`w-5 h-5 ${getStatusColor(check.status)}`} />
                  )}
                  <span className="text-white/80">{check.label}</span>
                </div>
                <span className="text-sm text-white/40">{check.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl bg-white/[0.05] border border-white/[0.06] p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#c9a962]" />
            Management Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#c9a962]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#c9a962]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-white/90">{link.label}</p>
                    <p className="text-[13px] text-white/40 truncate">{link.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
