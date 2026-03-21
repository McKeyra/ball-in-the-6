'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Search, Users, Filter, Mail, Phone, UserCircle, Shield, GraduationCap, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  team_name?: string;
  team?: string;
}

const ROLE_OPTIONS = ['parent', 'coach', 'player', 'admin', 'volunteer', 'staff'] as const;

const ROLE_CONFIG: Record<string, { icon: LucideIcon; color: string; bg: string; badge: string }> = {
  parent: { icon: UserCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', badge: 'bg-blue-600/20 text-blue-400 border-blue-600/30' },
  coach: { icon: GraduationCap, color: 'text-green-400', bg: 'bg-green-500/20', badge: 'bg-green-600/20 text-green-400 border-green-600/30' },
  player: { icon: Shield, color: 'text-red-400', bg: 'bg-red-500/20', badge: 'bg-red-600/20 text-red-400 border-red-600/30' },
  admin: { icon: User, color: 'text-purple-400', bg: 'bg-purple-500/20', badge: 'bg-purple-600/20 text-purple-400 border-purple-600/30' },
  volunteer: { icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-500/20', badge: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' },
  staff: { icon: User, color: 'text-slate-400', bg: 'bg-slate-500/20', badge: 'bg-slate-600/20 text-slate-400 border-slate-600/30' },
};

export function ContactsPage(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // TODO: Replace with fetch('/api/command-center/contacts')
  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ['command-center', 'contacts'],
    queryFn: async () => { const r = await fetch('/api/command-center/contacts'); return r.ok ? r.json() : []; },
  });

  const filtered = contacts.filter((c) => {
    const matchesSearch = !searchQuery || (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.phone || '').includes(searchQuery);
    const matchesRole = roleFilter === 'all' || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = contacts.reduce<Record<string, number>>((acc, c) => {
    const role = c.role || 'other';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contacts</h1>
        <p className="text-slate-400 text-sm mt-1">Directory of parents, coaches, players, and staff</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {ROLE_OPTIONS.filter((r) => roleCounts[r]).map((role) => {
          const config = ROLE_CONFIG[role] || ROLE_CONFIG.staff;
          const Icon = config.icon;
          return (
            <Card key={role} className="bg-slate-900 border-slate-800 flex-1 min-w-[120px]">
              <CardContent className="p-3 flex items-center gap-2.5">
                <div className={cn('p-1.5 rounded-lg', config.bg)}><Icon className={cn('w-4 h-4', config.color)} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 capitalize">{role}s</p>
                  <p className="text-sm font-bold text-white">{roleCounts[role]}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input className="bg-slate-900 border-slate-800 text-white pl-9" placeholder="Search by name, email, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2 text-slate-500" /><SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">All Roles</SelectItem>
            {ROLE_OPTIONS.map((r) => (<SelectItem key={r} value={r} className="text-white hover:bg-slate-700 capitalize">{r}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Card className="bg-slate-900 border-slate-800"><CardContent className="p-0">{[1,2,3,4,5,6,7,8].map((i) => (<div key={i} className="flex items-center gap-4 p-4 border-b border-slate-800"><Skeleton className="w-9 h-9 rounded-full bg-slate-800" /><Skeleton className="h-4 w-32 bg-slate-800" /><Skeleton className="h-4 w-40 bg-slate-800" /><Skeleton className="h-4 w-24 bg-slate-800 ml-auto" /><Skeleton className="h-4 w-16 bg-slate-800" /></div>))}</CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800"><CardContent className="py-12 text-center"><Users className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400 font-medium">No contacts found</p><p className="text-slate-500 text-sm mt-1">{searchQuery || roleFilter !== 'all' ? 'Try adjusting your search or filters' : 'Contacts will appear here as people are added'}</p></CardContent></Card>
      ) : (
        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Phone</TableHead>
                  <TableHead className="text-slate-400">Role</TableHead>
                  <TableHead className="text-slate-400">Team</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((contact) => {
                  const role = contact.role || 'staff';
                  const config = ROLE_CONFIG[role] || ROLE_CONFIG.staff;
                  const Icon = config.icon;
                  return (
                    <TableRow key={contact.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell><div className="flex items-center gap-3"><div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', config.bg)}><Icon className={cn('w-4 h-4', config.color)} /></div><span className="text-sm text-white font-medium">{contact.name || 'Unknown'}</span></div></TableCell>
                      <TableCell>{contact.email ? (<a href={`mailto:${contact.email}`} className="text-sm text-slate-300 hover:text-red-400 flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-500" />{contact.email}</a>) : (<span className="text-sm text-slate-500">--</span>)}</TableCell>
                      <TableCell>{contact.phone ? (<a href={`tel:${contact.phone}`} className="text-sm text-slate-300 hover:text-red-400 flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-500" />{contact.phone}</a>) : (<span className="text-sm text-slate-500">--</span>)}</TableCell>
                      <TableCell><Badge variant="outline" className={cn('text-[10px] capitalize', config.badge)}>{role}</Badge></TableCell>
                      <TableCell className="text-sm text-slate-400">{contact.team_name || contact.team || '--'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="px-4 py-3 border-t border-slate-800"><p className="text-xs text-slate-500">Showing {filtered.length} of {contacts.length} contacts</p></div>
        </Card>
      )}
    </div>
  );
}
