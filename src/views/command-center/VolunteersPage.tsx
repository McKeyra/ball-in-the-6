'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Users,
  Clock,
  Heart,
  Award,
  Filter,
} from 'lucide-react';

interface Volunteer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  availability?: string;
  hours_logged?: number;
  notes?: string;
}

const ROLE_OPTIONS = [
  'Scorekeeper',
  'Referee',
  'Coach Assistant',
  'Event Coordinator',
  'Team Manager',
  'Concessions',
  'Field Maintenance',
  'Registration Desk',
  'Photographer',
  'Other',
] as const;

const AVAILABILITY_OPTIONS = ['weekdays', 'weekends', 'evenings', 'flexible', 'limited'] as const;

const AVAILABILITY_COLORS: Record<string, string> = {
  weekdays: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  weekends: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  evenings: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  flexible: 'bg-green-600/20 text-green-400 border-green-600/30',
  limited: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
};

interface VolunteerForm {
  name: string;
  email: string;
  phone: string;
  role: string;
  availability: string;
  notes: string;
}

const INITIAL_FORM: VolunteerForm = {
  name: '',
  email: '',
  phone: '',
  role: '',
  availability: 'flexible',
  notes: '',
};

export function VolunteersPage(): React.ReactElement {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<VolunteerForm>(INITIAL_FORM);

  // TODO: Replace with fetch('/api/command-center/volunteers')
  const { data: volunteers = [], isLoading } = useQuery<Volunteer[]>({
    queryKey: ['command-center', 'volunteers'],
    queryFn: async () => { const r = await fetch('/api/command-center/volunteers'); return r.ok ? r.json() : []; },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: Replace with fetch('/api/command-center/volunteers', { method: 'POST', body: JSON.stringify(data) })
      const r = await fetch('/api/command-center/volunteers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['command-center', 'volunteers'] });
      setDialogOpen(false);
      setForm(INITIAL_FORM);
    },
  });

  const filtered = volunteers.filter((v) => {
    const matchesSearch =
      !searchQuery ||
      (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || v.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalHours = volunteers.reduce((sum, v) => sum + (v.hours_logged || 0), 0);
  const activeVolunteers = volunteers.filter((v) => v.availability !== 'limited').length;
  const uniqueRoles = [...new Set(volunteers.map((v) => v.role).filter(Boolean))];

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      hours_logged: 0,
    });
  };

  const updateForm = (field: keyof VolunteerForm, value: string): void => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Volunteers</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage volunteer roster, roles, and hours
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Volunteer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Add Volunteer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Full Name</Label>
                <Input
                  className="bg-slate-800 border-slate-700 text-white"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Email</Label>
                  <Input
                    type="email"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="john@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Phone</Label>
                  <Input
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    placeholder="(416) 555-0123"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Role</Label>
                <Select value={form.role} onValueChange={(v) => updateForm('role', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r} className="text-white hover:bg-slate-700">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Availability</Label>
                <Select value={form.availability} onValueChange={(v) => updateForm('availability', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {AVAILABILITY_OPTIONS.map((a) => (
                      <SelectItem key={a} value={a} className="text-white hover:bg-slate-700 capitalize">
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Textarea
                  className="bg-slate-800 border-slate-700 text-white min-h-[60px]"
                  value={form.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  placeholder="Special skills, certifications, preferences..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Adding...' : 'Add Volunteer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Active Volunteers</p>
              <p className="text-xl font-bold text-white">{activeVolunteers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Hours</p>
              <p className="text-xl font-bold text-white">{totalHours.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Award className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Roles Covered</p>
              <p className="text-xl font-bold text-white">{uniqueRoles.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            className="bg-slate-900 border-slate-800 text-white pl-9"
            placeholder="Search volunteers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2 text-slate-500" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">All Roles</SelectItem>
            {ROLE_OPTIONS.map((r) => (
              <SelectItem key={r} value={r} className="text-white hover:bg-slate-700">{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-800">
                <Skeleton className="w-9 h-9 rounded-full bg-slate-800" />
                <Skeleton className="h-4 w-28 bg-slate-800" />
                <Skeleton className="h-4 w-24 bg-slate-800" />
                <Skeleton className="h-4 w-16 bg-slate-800 ml-auto" />
                <Skeleton className="h-4 w-12 bg-slate-800" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-12 text-center">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No volunteers found</p>
            <p className="text-slate-500 text-sm mt-1">
              {searchQuery || roleFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add volunteers to start tracking hours and roles'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Role</TableHead>
                  <TableHead className="text-slate-400">Availability</TableHead>
                  <TableHead className="text-slate-400">Contact</TableHead>
                  <TableHead className="text-slate-400 text-right">Hours Logged</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((vol) => (
                  <TableRow key={vol.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-red-400">
                            {(vol.name || 'V').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-white font-medium">{vol.name || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-300">{vol.role || '--'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] capitalize',
                          AVAILABILITY_COLORS[vol.availability || 'flexible'] || AVAILABILITY_COLORS.flexible
                        )}
                      >
                        {vol.availability || 'flexible'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-400">
                        {vol.email && <p>{vol.email}</p>}
                        {vol.phone && <p>{vol.phone}</p>}
                        {!vol.email && !vol.phone && <span className="text-slate-500">--</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-sm font-medium text-white">
                          {(vol.hours_logged || 0).toLocaleString()}h
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {filtered.length} volunteer{filtered.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-slate-500">
              Total: {filtered.reduce((s, v) => s + (v.hours_logged || 0), 0).toLocaleString()} hours
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
