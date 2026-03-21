'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Plus,
  Mail,
  Send,
  Clock,
  FileEdit,
  CheckCircle,
  Users,
  Calendar,
  Eye,
  MousePointerClick,
  Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// TODO: Replace with API route types from Prisma schema
interface Campaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  audience_type: string;
  audience_target: string | null;
  status: 'draft' | 'scheduled' | 'sent';
  scheduled_at: string | null;
  sent_at: string | null;
  open_rate?: number;
  click_rate?: number;
  created_date: string;
}

interface Program {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

const STATUS_OPTIONS = ['draft', 'scheduled', 'sent'] as const;

const STATUS_CONFIG: Record<string, { color: string; icon: LucideIcon }> = {
  draft: { color: 'bg-slate-600/20 text-slate-400 border-slate-600/30', icon: FileEdit },
  scheduled: { color: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30', icon: Clock },
  sent: { color: 'bg-green-600/20 text-green-400 border-green-600/30', icon: CheckCircle },
};

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'All Contacts' },
  { value: 'program', label: 'By Program' },
  { value: 'team', label: 'By Team' },
  { value: 'parents', label: 'Parents Only' },
  { value: 'coaches', label: 'Coaches Only' },
] as const;

interface CampaignForm {
  name: string;
  subject: string;
  body: string;
  audience_type: string;
  audience_target: string;
  status: string;
  scheduled_at: string;
  scheduled_time: string;
}

const INITIAL_FORM: CampaignForm = {
  name: '',
  subject: '',
  body: '',
  audience_type: 'all',
  audience_target: '',
  status: 'draft',
  scheduled_at: '',
  scheduled_time: '',
};

export function CampaignsPage(): React.ReactElement {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CampaignForm>(INITIAL_FORM);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabFilter, setTabFilter] = useState('all');

  // TODO: Replace with fetch('/api/command-center/campaigns')
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['command-center', 'campaigns'],
    queryFn: async () => {
      const res = await fetch('/api/command-center/campaigns');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // TODO: Replace with fetch('/api/command-center/programs')
  const { data: programs = [] } = useQuery<Program[]>({
    queryKey: ['command-center', 'programs-list'],
    queryFn: async () => {
      const res = await fetch('/api/command-center/programs');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // TODO: Replace with fetch('/api/command-center/teams')
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['command-center', 'teams-list'],
    queryFn: async () => {
      const res = await fetch('/api/command-center/teams');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // TODO: Replace with fetch('/api/command-center/campaigns', { method: 'POST' })
  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/command-center/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['command-center', 'campaigns'] });
      setDialogOpen(false);
      setForm(INITIAL_FORM);
    },
  });

  // TODO: Replace with fetch('/api/command-center/campaigns/[id]', { method: 'PATCH' })
  const sendMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/command-center/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sent', sent_at: new Date().toISOString() }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['command-center', 'campaigns'] });
    },
  });

  const filtered = campaigns.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = tabFilter === 'all' || c.status === tabFilter;
    return matchesSearch && matchesTab;
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      name: form.name,
      subject: form.subject,
      body: form.body,
      audience_type: form.audience_type,
      audience_target: form.audience_target || null,
      status: form.status,
    };
    if (form.status === 'scheduled' && form.scheduled_at) {
      payload.scheduled_at = form.scheduled_time
        ? `${form.scheduled_at}T${form.scheduled_time}:00`
        : `${form.scheduled_at}T09:00:00`;
    }
    createMutation.mutate(payload);
  };

  const updateForm = (field: keyof CampaignForm, value: string): void =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const drafts = campaigns.filter((c) => c.status === 'draft').length;
  const scheduled = campaigns.filter((c) => c.status === 'scheduled').length;
  const sent = campaigns.filter((c) => c.status === 'sent').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-slate-400 text-sm mt-1">
            Email campaigns and mass communications
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Campaign Name</Label>
                <Input
                  className="bg-slate-800 border-slate-700 text-white"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="e.g. Spring Registration Reminder"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email Subject</Label>
                <Input
                  className="bg-slate-800 border-slate-700 text-white"
                  value={form.subject}
                  onChange={(e) => updateForm('subject', e.target.value)}
                  placeholder="Subject line for the email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Audience</Label>
                <Select value={form.audience_type} onValueChange={(v) => updateForm('audience_type', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {AUDIENCE_OPTIONS.map((a) => (
                      <SelectItem key={a.value} value={a.value} className="text-white hover:bg-slate-700">
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.audience_type === 'program' && (
                <div className="space-y-2">
                  <Label className="text-slate-300">Select Program</Label>
                  <Select value={form.audience_target} onValueChange={(v) => updateForm('audience_target', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Choose a program" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {programs.map((p) => (
                        <SelectItem key={p.id} value={p.name || String(p.id)} className="text-white hover:bg-slate-700">
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {form.audience_type === 'team' && (
                <div className="space-y-2">
                  <Label className="text-slate-300">Select Team</Label>
                  <Select value={form.audience_target} onValueChange={(v) => updateForm('audience_target', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Choose a team" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {teams.map((t) => (
                        <SelectItem key={t.id} value={t.name || String(t.id)} className="text-white hover:bg-slate-700">
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-slate-300">Email Body</Label>
                <Textarea
                  className="bg-slate-800 border-slate-700 text-white min-h-[160px]"
                  value={form.body}
                  onChange={(e) => updateForm('body', e.target.value)}
                  placeholder="Write your email content here. Use rich text formatting..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Status</Label>
                <Select value={form.status} onValueChange={(v) => updateForm('status', v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="draft" className="text-white hover:bg-slate-700">Save as Draft</SelectItem>
                    <SelectItem value="scheduled" className="text-white hover:bg-slate-700">Schedule Send</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.status === 'scheduled' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Send Date</Label>
                    <Input
                      type="date"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={form.scheduled_at}
                      onChange={(e) => updateForm('scheduled_at', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Send Time</Label>
                    <Input
                      type="time"
                      className="bg-slate-800 border-slate-700 text-white"
                      value={form.scheduled_time}
                      onChange={(e) => updateForm('scheduled_time', e.target.value)}
                    />
                  </div>
                </div>
              )}

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
                  {createMutation.isPending ? 'Creating...' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-slate-600/20 rounded-lg">
              <FileEdit className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Drafts</p>
              <p className="text-lg font-bold text-white">{drafts}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Scheduled</p>
              <p className="text-lg font-bold text-white">{scheduled}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Sent</p>
              <p className="text-lg font-bold text-white">{sent}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            className="bg-slate-900 border-slate-800 text-white pl-9"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={tabFilter} onValueChange={setTabFilter}>
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400 text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="draft" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400 text-xs">
              Drafts
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400 text-xs">
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="sent" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400 text-xs">
              Sent
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <Skeleton className="h-5 w-48 mb-2 bg-slate-800" />
                <Skeleton className="h-4 w-32 mb-3 bg-slate-800" />
                <Skeleton className="h-3 w-full bg-slate-800" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-12 text-center">
            <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No campaigns found</p>
            <p className="text-slate-500 text-sm mt-1">
              {searchQuery || tabFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first email campaign'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((campaign) => {
            const statusConfig = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.draft;
            const StatusIcon = statusConfig.icon;
            const audience = AUDIENCE_OPTIONS.find((a) => a.value === campaign.audience_type);

            return (
              <Card
                key={campaign.id}
                className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                        <h3 className="font-semibold text-white text-sm truncate">
                          {campaign.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] capitalize shrink-0', statusConfig.color)}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        Subject: {campaign.subject || 'No subject'}
                      </p>
                      {campaign.body && (
                        <p className="text-xs text-slate-500 line-clamp-2">{campaign.body}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Users className="w-3 h-3" />
                          <span>{audience?.label || campaign.audience_type || 'All'}</span>
                          {campaign.audience_target && (
                            <span className="text-slate-500">({campaign.audience_target})</span>
                          )}
                        </div>
                        {campaign.scheduled_at && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(campaign.scheduled_at).toLocaleString()}</span>
                          </div>
                        )}
                        {campaign.status === 'sent' && (
                          <>
                            {campaign.open_rate !== undefined && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Eye className="w-3 h-3" />
                                <span>{campaign.open_rate}% opened</span>
                              </div>
                            )}
                            {campaign.click_rate !== undefined && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <MousePointerClick className="w-3 h-3" />
                                <span>{campaign.click_rate}% clicked</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600/30 text-red-400 hover:bg-red-600/10 shrink-0"
                        onClick={() => sendMutation.mutate(campaign.id)}
                        disabled={sendMutation.isPending}
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Send Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
