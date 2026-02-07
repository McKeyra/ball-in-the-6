import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings as SettingsIcon, Zap, Bell, Users, Loader2, Save, RotateCcw, Edit, UserX, Trash2 } from "lucide-react";
import TeamManagementModal from "../components/settings/TeamManagementModal";
import { toast } from "sonner";

const DEFAULT_WEIGHTS = {
  industry_fit_weight: 0.25,
  mrr_potential_weight: 0.20,
  digital_maturity_weight: 0.15,
  geographic_value_weight: 0.15,
  decision_authority_weight: 0.10,
  service_alignment_weight: 0.10,
  timing_signals_weight: 0.05
};

export default function Settings() {
  const queryClient = useQueryClient();
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [localWeights, setLocalWeights] = useState(null);

  const { data: scoringSettings, isLoading: loadingSettings } = useQuery({
    queryKey: ['scoringSettings'],
    queryFn: async () => {
      const settings = await base44.entities.ScoringSettings.list();
      return settings[0] || null;
    }
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => base44.entities.TeamMember.list()
  });

  const saveWeightsMutation = useMutation({
    mutationFn: async (weights) => {
      if (scoringSettings) {
        return base44.entities.ScoringSettings.update(scoringSettings.id, weights);
      } else {
        return base44.entities.ScoringSettings.create(weights);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoringSettings'] });
      setLocalWeights(null);
      toast.success("Scoring weights saved successfully");
    }
  });

  const resetWeightsMutation = useMutation({
    mutationFn: async () => {
      if (scoringSettings) {
        return base44.entities.ScoringSettings.update(scoringSettings.id, DEFAULT_WEIGHTS);
      } else {
        return base44.entities.ScoringSettings.create(DEFAULT_WEIGHTS);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoringSettings'] });
      setLocalWeights(null);
      toast.success("Weights reset to defaults");
    }
  });

  const inviteTeamMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.TeamMember.create({
        ...data,
        status: "Pending",
        invited_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      setTeamModalOpen(false);
      toast.success("Team member invited successfully");
    }
  });

  const deactivateTeamMutation = useMutation({
    mutationFn: async (memberId) => {
      return base44.entities.TeamMember.update(memberId, { status: "Deactivated" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast.success("Team member deactivated");
    }
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (memberId) => {
      return base44.entities.TeamMember.delete(memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      toast.success("Team member removed");
    }
  });

  const currentWeights = localWeights || scoringSettings || DEFAULT_WEIGHTS;

  const handleWeightChange = (key, value) => {
    setLocalWeights(prev => ({
      ...(prev || scoringSettings || DEFAULT_WEIGHTS),
      [key]: value[0] / 100
    }));
  };

  const handleSaveWeights = () => {
    if (localWeights) {
      saveWeightsMutation.mutate(localWeights);
    }
  };

  const handleResetWeights = () => {
    resetWeightsMutation.mutate();
  };

  const statusColors = {
    Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Deactivated: "bg-slate-500/20 text-slate-400 border-slate-500/30"
  };

  const roleColors = {
    Admin: "bg-red-500/20 text-red-400 border-red-500/30",
    Manager: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Sales Rep": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Viewer: "bg-slate-500/20 text-slate-400 border-slate-500/30"
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-slate-400" />
          Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Configure your ENUW Command Center</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI6 Scoring Weights */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI6 Scoring Weights</h3>
              <p className="text-xs text-slate-400">Adjust dimension weights for prospect scoring</p>
            </div>
          </div>

          {loadingSettings ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {Object.entries(currentWeights).filter(([key]) => key.endsWith('_weight')).map(([key, weight]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300 capitalize">{key.replace(/_weight$/, '').replace(/_/g, ' ')}</Label>
                      <Badge className="bg-slate-800 text-slate-300">{((weight || 0) * 100).toFixed(0)}%</Badge>
                    </div>
                    <Slider
                      value={[(weight || 0) * 100]}
                      onValueChange={(value) => handleWeightChange(key, value)}
                      max={50}
                      step={5}
                      className="[&_[role=slider]]:bg-red-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={handleSaveWeights}
                  disabled={!localWeights || saveWeightsMutation.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {saveWeightsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Settings
                </Button>
                <Button 
                  onClick={handleResetWeights}
                  disabled={resetWeightsMutation.isPending}
                  variant="outline"
                  className="border-slate-700 text-slate-300"
                >
                  {resetWeightsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4 mr-2" />
                  )}
                  Reset to Defaults
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Notifications */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Notifications</h3>
              <p className="text-xs text-slate-400">Configure alert preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div>
                <p className="text-sm text-white">Hot Lead Alerts</p>
                <p className="text-xs text-slate-400">Get notified when Tier 1 leads are scored</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div>
                <p className="text-sm text-white">Deal Stage Changes</p>
                <p className="text-xs text-slate-400">Notifications when deals advance stages</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div>
                <p className="text-sm text-white">Stale Lead Warnings</p>
                <p className="text-xs text-slate-400">Alert when leads haven't been contacted (48h+)</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div>
                <p className="text-sm text-white">Weekly Digest</p>
                <p className="text-xs text-slate-400">Weekly pipeline summary email</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>



        {/* Team */}
        <Card className="bg-slate-900/50 border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Team</h3>
              <p className="text-xs text-slate-400">Manage team access</p>
            </div>
          </div>

          {teamMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-400">Name</TableHead>
                    <TableHead className="text-slate-400">Email</TableHead>
                    <TableHead className="text-slate-400">Role</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id} className="border-slate-800">
                      <TableCell className="text-white">{member.name}</TableCell>
                      <TableCell className="text-slate-400">{member.email}</TableCell>
                      <TableCell>
                        <Badge className={roleColors[member.role]}>{member.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[member.status]}>{member.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {member.status !== "Deactivated" && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => deactivateTeamMutation.mutate(member.id)}
                              disabled={deactivateTeamMutation.isPending}
                              className="text-amber-400 hover:text-amber-300"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteTeamMutation.mutate(member.id)}
                            disabled={deleteTeamMutation.isPending}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No team members yet</p>
            </div>
          )}

          <Button 
            className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300"
            onClick={() => setTeamModalOpen(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Invite Team Member
          </Button>
        </Card>
      </div>

      {/* Footer Info */}
      <Card className="bg-slate-900/50 border-slate-800 p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">ENUW Portfolio Command Center</h4>
            <p className="text-xs text-slate-400">Version 2.0 | $100B Trajectory</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">4 Active Ventures</p>
            <p className="text-xs text-slate-400">AI6 Scoring Engine v1.0</p>
          </div>
        </div>
      </Card>

      {/* Team Management Modal */}
      <TeamManagementModal
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        onSave={(data) => inviteTeamMutation.mutate(data)}
        isLoading={inviteTeamMutation.isPending}
      />
    </div>
  );
}