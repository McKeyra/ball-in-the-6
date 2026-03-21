'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  BaseballCap,
  Toque,
  Hoodie,
  LongSleeve,
} from '@/components/icons/AthleticIcons';
import type { FC, SVGProps } from 'react';

type IconComponent = FC<SVGProps<SVGSVGElement> & { size?: number }>;

interface Category {
  id: string;
  label: string;
  icon: IconComponent;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: 'fans', label: 'Fans', icon: BaseballCap, color: 'text-blue-500' },
  { id: 'players', label: 'Players', icon: Toque, color: 'text-green-500' },
  { id: 'coaches', label: 'Coaches', icon: Hoodie, color: 'text-purple-500' },
  { id: 'teams', label: 'Teams', icon: LongSleeve, color: 'text-orange-500' },
  { id: 'leagues', label: 'Leagues', icon: LongSleeve, color: 'text-yellow-500' },
  { id: 'organizations', label: 'Organizations', icon: BaseballCap, color: 'text-red-500' },
];

interface ChatUser {
  id: string;
  name: string;
  subtext: string;
  avatar: string;
  type?: string;
}

interface Team {
  id: string;
  name: string;
  league?: string;
  logo_url?: string;
  roster?: { name: string }[];
  staff?: { name: string }[];
}

interface Fan {
  id: string;
  name: string;
}

interface MessengerSidebarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onSelectUser: (user: ChatUser) => void;
  selectedUser: ChatUser | null;
  currentUserRole?: string;
}

export function MessengerSidebar({
  activeCategory,
  setActiveCategory,
  onSelectUser,
  selectedUser,
}: MessengerSidebarProps) {
  const [expanded, setExpanded] = useState<string[]>(['fans', 'players']);
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: Replace with actual API calls
  const { data: teams } = useQuery<Team[]>({
    queryKey: ['teams-chat'],
    queryFn: async () => {
      const res = await fetch('/api/teams');
      return res.json();
    },
  });

  const { data: fans } = useQuery<Fan[]>({
    queryKey: ['fans-chat'],
    queryFn: async () => {
      const res = await fetch('/api/fans');
      return res.json();
    },
  });

  const getUsersForCategory = (catId: string): ChatUser[] => {
    let users: ChatUser[] = [];
    if (catId === 'players') {
      users =
        teams?.flatMap(
          (t) =>
            t.roster?.map((p) => ({
              id: p.name,
              name: p.name,
              subtext: t.name,
              avatar: `https://ui-avatars.com/api/?name=${p.name}&background=22c55e&color=fff`,
            })) || []
        ) || [];
    } else if (catId === 'coaches') {
      users =
        teams?.flatMap(
          (t) =>
            t.staff?.map((s) => ({
              id: s.name,
              name: s.name,
              subtext: t.name,
              avatar: `https://ui-avatars.com/api/?name=${s.name}&background=a855f7&color=fff`,
            })) || []
        ) || [];
    } else if (catId === 'fans') {
      users =
        fans?.map((f) => ({
          id: f.id,
          name: f.name,
          subtext: 'Fan',
          avatar: `https://ui-avatars.com/api/?name=${f.name}&background=0D8ABC&color=fff`,
        })) || [];
    } else if (catId === 'teams') {
      users =
        teams?.map((t) => ({
          id: t.id,
          name: t.name,
          subtext: t.league || '',
          avatar:
            t.logo_url ||
            `https://ui-avatars.com/api/?name=${t.name}&background=f97316&color=fff`,
        })) || [];
    }

    if (searchTerm) {
      users = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return users;
  };

  const toggleCategory = (catId: string) => {
    setExpanded((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
    setActiveCategory(catId);
  };

  return (
    <div className="w-80 flex flex-col bg-[#1A1A1A] border-r border-white/5 h-full rounded-l-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <MessageCircle className="text-blue-500" /> Messenger
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151515] text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id} className="rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between p-3 transition-colors ${
                  activeCategory === category.id
                    ? 'bg-white/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={category.color} />
                  <span className="font-bold text-gray-200 text-sm">
                    {category.label}
                  </span>
                </div>
                {expanded.includes(category.id) ? (
                  <ChevronDown size={14} className="text-gray-500" />
                ) : (
                  <ChevronRight size={14} className="text-gray-500" />
                )}
              </button>

              {expanded.includes(category.id) && (
                <div className="bg-[#151515]/50">
                  {getUsersForCategory(category.id).map((chatUser, idx) => (
                    <button
                      key={chatUser.id || idx}
                      onClick={() =>
                        onSelectUser({ ...chatUser, type: category.id })
                      }
                      className={`w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors ${
                        selectedUser?.name === chatUser.name
                          ? 'bg-blue-600/20 border-l-2 border-blue-500'
                          : 'border-l-2 border-transparent'
                      }`}
                    >
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={chatUser.avatar}
                          alt={chatUser.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#151515] rounded-full" />
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <div className="text-sm font-medium text-gray-200 truncate">
                          {chatUser.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {chatUser.subtext}
                        </div>
                      </div>
                    </button>
                  ))}
                  {getUsersForCategory(category.id).length === 0 && (
                    <div className="p-3 text-xs text-gray-500 text-center italic">
                      No active users
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
