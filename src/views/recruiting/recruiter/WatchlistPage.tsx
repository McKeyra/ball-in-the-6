'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { VanceScoreBadge } from '@/components/recruiting/VanceScoreBadge';
import {
  Bookmark,
  Trash2,
  FolderPlus,
  X,
} from 'lucide-react';

// TODO: Replace with actual API route

interface WatchlistGroup {
  id: string;
  name?: string;
}

interface WatchlistItem {
  id: string;
  athlete_name?: string;
  position?: string;
  school?: string;
  vance_rating?: number;
  height?: string;
  stat_line?: string;
  group_id?: string;
  created_date?: string;
}

export function WatchlistPage(): React.ReactElement {
  const userId = 'current-user';
  const queryClient = useQueryClient();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');

  const { data: groups = [], isLoading: loadingGroups } = useQuery<WatchlistGroup[]>({
    queryKey: ['recruiter', 'watchlist-groups'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/recruiting/watchlist/groups')
      return [];
    },
    enabled: !!userId,
  });

  const { data: watchlist = [], isLoading: loadingWatchlist } = useQuery<WatchlistItem[]>({
    queryKey: ['recruiter', 'watchlist'],
    queryFn: async () => {
      // TODO: Replace with fetch('/api/recruiting/watchlist')
      return [];
    },
    enabled: !!userId,
  });

  const createGroupMutation = useMutation({
    mutationFn: async (name: string) => {
      // TODO: Replace with fetch('/api/recruiting/watchlist/groups', { method: 'POST' })
      return { name };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'watchlist-groups'] });
      setShowCreateGroup(false);
      setNewGroupName('');
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with fetch(`/api/recruiting/watchlist/${id}`, { method: 'DELETE' })
      return { id };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recruiter', 'watchlist'] }),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with fetch(`/api/recruiting/watchlist/groups/${id}`, { method: 'DELETE' })
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'watchlist-groups'] });
      setActiveGroup('all');
    },
  });

  const filteredWatchlist = activeGroup === 'all'
    ? watchlist
    : watchlist.filter((w) => w.group_id === activeGroup);

  const isLoading = loadingGroups || loadingWatchlist;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Watchlist</h1>
          <p className="text-slate-400 text-sm mt-1">
            {watchlist.length} athlete{watchlist.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <button
          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          onClick={() => setShowCreateGroup(true)}
        >
          <FolderPlus className="w-4 h-4 mr-1" /> New Group
        </button>
      </div>

      {/* Create Group Dialog */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Create Watchlist Group</h2>
              <button onClick={() => setShowCreateGroup(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Group Name</label>
              <input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. 2027 PG Targets"
                className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              onClick={() => createGroupMutation.mutate(newGroupName)}
              disabled={!newGroupName.trim() || createGroupMutation.isPending}
            >
              {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </div>
      )}

      {/* Group Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveGroup('all')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            activeGroup === 'all'
              ? 'bg-red-600 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
          )}
        >
          All ({watchlist.length})
        </button>
        {groups.map((group) => {
          const count = watchlist.filter((w) => w.group_id === group.id).length;
          return (
            <div key={group.id} className="flex items-center">
              <button
                onClick={() => setActiveGroup(group.id)}
                className={cn(
                  'px-4 py-2 rounded-l-lg text-sm font-medium transition-colors whitespace-nowrap',
                  activeGroup === group.id
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                )}
              >
                {group.name} ({count})
              </button>
              <button
                onClick={() => deleteGroupMutation.mutate(group.id)}
                className="px-2 py-2 bg-slate-900 border border-l-0 border-slate-800 rounded-r-lg text-slate-500 hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Athlete List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredWatchlist.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg py-12 text-center">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">
            {activeGroup === 'all' ? 'No Saved Athletes' : 'Empty Group'}
          </h3>
          <p className="text-sm text-slate-400">
            {activeGroup === 'all'
              ? 'Save athletes from search results to build your watchlist.'
              : 'Add athletes to this group from the search page.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWatchlist.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-red-400">
                    {(item.athlete_name || 'A').charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.athlete_name || 'Athlete'}</p>
                  <p className="text-xs text-slate-400">
                    {item.position || ''} {item.school && `| ${item.school}`}
                  </p>
                </div>
                <VanceScoreBadge score={item.vance_rating} size="sm" />
              </div>

              {(item.height || item.stat_line) && (
                <div className="text-xs text-slate-400">
                  {item.height && <span>{item.height} </span>}
                  {item.stat_line && <span className="text-slate-300">{item.stat_line}</span>}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500">
                  Saved {item.created_date ? new Date(item.created_date).toLocaleDateString() : ''}
                </span>
                <button
                  className="flex items-center text-xs text-red-400 hover:bg-red-600/20 px-2 py-1 rounded transition-colors disabled:opacity-50"
                  onClick={() => removeFromWatchlistMutation.mutate(item.id)}
                  disabled={removeFromWatchlistMutation.isPending}
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
