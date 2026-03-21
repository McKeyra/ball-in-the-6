'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Building2,
  Globe,
  Calendar,
  CreditCard,
  Upload,
  Save,
  CheckCircle,
  Instagram,
  Twitter,
} from 'lucide-react';

const CURRENCY_OPTIONS = ['CAD', 'USD'] as const;
const PAYMENT_METHODS = ['stripe', 'square', 'paypal', 'manual'] as const;

interface OrgSettings {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  website: string;
  logo_url: string;
  description: string;
  instagram: string;
  twitter: string;
  facebook: string;
  tiktok: string;
  season_start: string;
  season_end: string;
  registration_open_date: string;
  registration_close_date: string;
  currency: string;
  default_payment_method: string;
  tax_rate: string;
  late_fee: string;
  refund_policy: string;
}

const INITIAL_ORG: OrgSettings = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postal_code: '',
  website: '',
  logo_url: '',
  description: '',
  instagram: '',
  twitter: '',
  facebook: '',
  tiktok: '',
  season_start: '',
  season_end: '',
  registration_open_date: '',
  registration_close_date: '',
  currency: 'CAD',
  default_payment_method: 'stripe',
  tax_rate: '',
  late_fee: '',
  refund_policy: '',
};

export function SettingsPage(): React.ReactElement {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('organization');
  const [form, setForm] = useState<OrgSettings>(INITIAL_ORG);
  const [saved, setSaved] = useState(false);

  // TODO: Replace with fetch('/api/command-center/settings')
  const { data: orgSettings, isLoading } = useQuery<OrgSettings | null>({
    queryKey: ['command-center', 'org-settings'],
    queryFn: async () => {
      const r = await fetch('/api/command-center/settings');
      if (!r.ok) return null;
      const results = await r.json();
      return Array.isArray(results) ? results[0] || null : results;
    },
  });

  useEffect(() => {
    if (orgSettings) {
      setForm((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(orgSettings).filter(([key]) => key in INITIAL_ORG).map(([k, v]) => [k, (v as string) || ''])
        ),
      }));
    }
  }, [orgSettings]);

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      // TODO: Replace with proper API call
      const method = orgSettings?.id ? 'PUT' : 'POST';
      const r = await fetch('/api/command-center/settings', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['command-center', 'org-settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = (): void => {
    const payload: Record<string, unknown> = {
      ...form,
      tax_rate: form.tax_rate ? Number(form.tax_rate) : null,
      late_fee: form.late_fee ? Number(form.late_fee) : null,
    };
    saveMutation.mutate(payload);
  };

  const updateForm = (field: keyof OrgSettings, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: Implement file upload to DigitalOcean Spaces
    try {
      const formData = new FormData();
      formData.append('file', file);
      const r = await fetch('/api/upload', { method: 'POST', body: formData });
      if (r.ok) {
        const result = await r.json() as { file_url?: string };
        if (result?.file_url) {
          updateForm('logo_url', result.file_url);
        }
      }
    } catch {
      // Upload failed silently
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Organization configuration</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 bg-slate-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">
            Organization settings and preferences
          </p>
        </div>
        <Button
          className={cn(
            'text-white',
            saved
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          )}
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" /> Saved
            </>
          ) : saveMutation.isPending ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger
            value="organization"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"
          >
            <Building2 className="w-4 h-4 mr-2" /> Organization
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"
          >
            <Globe className="w-4 h-4 mr-2" /> Social & Web
          </TabsTrigger>
          <TabsTrigger
            value="season"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"
          >
            <Calendar className="w-4 h-4 mr-2" /> Season
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400"
          >
            <CreditCard className="w-4 h-4 mr-2" /> Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="mt-4 space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">Organization Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                    {form.logo_url ? (
                      <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-8 h-8 text-slate-600" />
                    )}
                  </div>
                  <label className="mt-2 flex items-center gap-1.5 text-xs text-red-400 cursor-pointer hover:text-red-300">
                    <Upload className="w-3 h-3" /> Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Organization Name</Label>
                    <Input
                      className="bg-slate-800 border-slate-700 text-white"
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder="Ball in the 6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Description</Label>
                    <Textarea
                      className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                      value={form.description}
                      onChange={(e) => updateForm('description', e.target.value)}
                      placeholder="About your organization..."
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Email</Label>
                  <Input
                    type="email"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="admin@ballinthe6.ca"
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
                <Label className="text-slate-300">Address</Label>
                <Input
                  className="bg-slate-800 border-slate-700 text-white"
                  value={form.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">City</Label>
                  <Input
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    placeholder="Toronto"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Province</Label>
                  <Input
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.province}
                    onChange={(e) => updateForm('province', e.target.value)}
                    placeholder="Ontario"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Postal Code</Label>
                  <Input
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.postal_code}
                    onChange={(e) => updateForm('postal_code', e.target.value)}
                    placeholder="M5V 1A1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-4 space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">Website & Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    className="bg-slate-800 border-slate-700 text-white pl-9"
                    value={form.website}
                    onChange={(e) => updateForm('website', e.target.value)}
                    placeholder="https://ballinthe6.ca"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      className="bg-slate-800 border-slate-700 text-white pl-9"
                      value={form.instagram}
                      onChange={(e) => updateForm('instagram', e.target.value)}
                      placeholder="@ballinthe6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Twitter / X</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      className="bg-slate-800 border-slate-700 text-white pl-9"
                      value={form.twitter}
                      onChange={(e) => updateForm('twitter', e.target.value)}
                      placeholder="@ballinthe6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Facebook</Label>
                  <Input
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.facebook}
                    onChange={(e) => updateForm('facebook', e.target.value)}
                    placeholder="facebook.com/ballinthe6"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">TikTok</Label>
                  <Input
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.tiktok}
                    onChange={(e) => updateForm('tiktok', e.target.value)}
                    placeholder="@ballinthe6"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="season" className="mt-4 space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">Season Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Season Start</Label>
                  <Input
                    type="date"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.season_start}
                    onChange={(e) => updateForm('season_start', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Season End</Label>
                  <Input
                    type="date"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.season_end}
                    onChange={(e) => updateForm('season_end', e.target.value)}
                  />
                </div>
              </div>

              <Separator className="bg-slate-800" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Registration Opens</Label>
                  <Input
                    type="date"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.registration_open_date}
                    onChange={(e) => updateForm('registration_open_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Registration Closes</Label>
                  <Input
                    type="date"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.registration_close_date}
                    onChange={(e) => updateForm('registration_close_date', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4 space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Currency</Label>
                  <Select value={form.currency} onValueChange={(v) => updateForm('currency', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {CURRENCY_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c} className="text-white hover:bg-slate-700">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Default Payment Method</Label>
                  <Select value={form.default_payment_method} onValueChange={(v) => updateForm('default_payment_method', v)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m} value={m} className="text-white hover:bg-slate-700 capitalize">{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Tax Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.tax_rate}
                    onChange={(e) => updateForm('tax_rate', e.target.value)}
                    placeholder="13.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Late Payment Fee ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={form.late_fee}
                    onChange={(e) => updateForm('late_fee', e.target.value)}
                    placeholder="25.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Refund Policy</Label>
                <Textarea
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                  value={form.refund_policy}
                  onChange={(e) => updateForm('refund_policy', e.target.value)}
                  placeholder="Describe your refund policy..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
