import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronRight, ChevronLeft, Check, Trophy, 
  Users, Upload, Loader2, Plus, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

export default function LeagueCreationWizard({ organizations, onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [leagueId, setLeagueId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const [leagueData, setLeagueData] = useState({
    name: "",
    organization_id: organizations[0]?.id || "",
    sport: "basketball",
    season: "",
    description: "",
    logo_url: "",
    start_date: "",
    end_date: "",
    divisions: [],
    teams: [],
    schedule_config: {
      games_per_team: 10,
      inter_division_games: true,
      playoff_format: "top_4"
    },
    status: "draft"
  });

  const [newDivision, setNewDivision] = useState("");

  const { data: availableTeams = [] } = useQuery({
    queryKey: ['teams', leagueData.organization_id],
    queryFn: async () => {
      if (!leagueData.organization_id) return [];
      const teams = await base44.entities.Team.list();
      return teams.filter(t => 
        t.organization_id === leagueData.organization_id &&
        t.sport === leagueData.sport
      );
    },
    enabled: !!leagueData.organization_id && !!leagueData.sport,
    initialData: []
  });

  const createLeagueMutation = useMutation({
    mutationFn: (data) => base44.entities.League.create(data),
    onSuccess: (data) => {
      setLeagueId(data.id);
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
      toast.success('League created!');
    }
  });

  const updateLeagueMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.League.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
    }
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Team.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });

  const handleFieldChange = async (field, value) => {
    const newData = { ...leagueData, [field]: value };
    setLeagueData(newData);

    if (leagueId) {
      await updateLeagueMutation.mutateAsync({ id: leagueId, data: { [field]: value } });
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!leagueData.name || !leagueData.organization_id || !leagueData.sport) {
        toast.error('Please fill in required fields');
        return;
      }

      if (!leagueId) {
        const newLeague = await createLeagueMutation.mutateAsync(leagueData);
        setLeagueId(newLeague.id);
      }
    }

    if (currentStep === 2 && leagueData.divisions.length > 0) {
      await updateLeagueMutation.mutateAsync({ 
        id: leagueId, 
        data: { divisions: leagueData.divisions } 
      });
    }

    if (currentStep === 3 && leagueData.teams.length > 0) {
      await updateLeagueMutation.mutateAsync({ 
        id: leagueId, 
        data: { teams: leagueData.teams } 
      });
      
      // Update each team with league info
      for (const teamId of leagueData.teams) {
        const team = availableTeams.find(t => t.id === teamId);
        if (team) {
          const divisionId = leagueData.divisions.find(d => 
            d.teams?.includes(teamId)
          )?.id;
          
          await updateTeamMutation.mutateAsync({
            id: teamId,
            data: { 
              league_id: leagueId,
              division_id: divisionId || null
            }
          });
        }
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await handleFieldChange('logo_url', file_url);
      toast.success('Logo uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const addDivision = () => {
    if (!newDivision.trim()) return;
    
    const divisions = [
      ...leagueData.divisions,
      {
        id: `div_${Date.now()}`,
        name: newDivision,
        teams: []
      }
    ];
    setLeagueData({ ...leagueData, divisions });
    setNewDivision("");
  };

  const removeDivision = (divisionId) => {
    const divisions = leagueData.divisions.filter(d => d.id !== divisionId);
    setLeagueData({ ...leagueData, divisions });
  };

  const toggleTeam = (teamId) => {
    const teams = leagueData.teams.includes(teamId)
      ? leagueData.teams.filter(id => id !== teamId)
      : [...leagueData.teams, teamId];
    setLeagueData({ ...leagueData, teams });
  };

  const assignTeamToDivision = (teamId, divisionId) => {
    const divisions = leagueData.divisions.map(div => ({
      ...div,
      teams: div.id === divisionId 
        ? [...(div.teams || []), teamId]
        : (div.teams || []).filter(id => id !== teamId)
    }));
    setLeagueData({ ...leagueData, divisions });
  };

  const handleComplete = async () => {
    await updateLeagueMutation.mutateAsync({
      id: leagueId,
      data: { status: 'active' }
    });
    toast.success('League created successfully!');
    onComplete();
  };

  const steps = [
    { number: 1, title: "League Details", icon: Trophy },
    { number: 2, title: "Divisions", icon: Users },
    { number: 3, title: "Add Teams", icon: Users },
    { number: 4, title: "Review", icon: Check }
  ];

  const progress = (currentStep / steps.length) * 100;
  const currentStepData = steps[currentStep - 1];
  const CurrentStepIcon = currentStepData.icon;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  currentStep === step.number 
                    ? 'border-orange-500 bg-orange-500 text-white' 
                    : currentStep > step.number
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-slate-300 bg-white text-slate-400'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className="text-sm font-medium text-slate-900">Step {step.number}</p>
                  <p className="text-xs text-slate-500">{step.title}</p>
                </div>
                {step.number < steps.length && (
                  <div className={`w-12 md:w-24 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <CurrentStepIcon className="w-5 h-5 text-orange-600" />
                {currentStepData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Step 1: League Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">League Name *</Label>
                      <Input
                        id="name"
                        placeholder="Premier Basketball League"
                        value={leagueData.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization *</Label>
                      <Select 
                        value={leagueData.organization_id} 
                        onValueChange={(value) => handleFieldChange('organization_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sport">Sport *</Label>
                      <Select 
                        value={leagueData.sport} 
                        onValueChange={(value) => handleFieldChange('sport', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basketball">Basketball</SelectItem>
                          <SelectItem value="soccer">Soccer</SelectItem>
                          <SelectItem value="baseball">Baseball</SelectItem>
                          <SelectItem value="football">Football</SelectItem>
                          <SelectItem value="hockey">Hockey</SelectItem>
                          <SelectItem value="volleyball">Volleyball</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="season">Season</Label>
                      <Input
                        id="season"
                        placeholder="2024-2025 Winter"
                        value={leagueData.season}
                        onChange={(e) => handleFieldChange('season', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={leagueData.start_date}
                        onChange={(e) => handleFieldChange('start_date', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={leagueData.end_date}
                        onChange={(e) => handleFieldChange('end_date', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="League description..."
                      value={leagueData.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>League Logo</Label>
                    <div className="flex items-center gap-4">
                      {leagueData.logo_url && (
                        <img 
                          src={leagueData.logo_url} 
                          alt="League logo" 
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                      )}
                      <div>
                        <input
                          type="file"
                          id="logo-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('logo-upload').click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Divisions */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <p className="text-slate-600">
                    Create divisions to organize teams. You can skip this step if you don't need divisions.
                  </p>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Division name (e.g., East, West)"
                      value={newDivision}
                      onChange={(e) => setNewDivision(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addDivision()}
                    />
                    <Button onClick={addDivision}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {leagueData.divisions.map((division) => (
                      <Card key={division.id} className="bg-slate-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-orange-600" />
                              <span className="font-semibold">{division.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDivision(division.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {leagueData.divisions.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <p>No divisions created yet</p>
                        <p className="text-sm mt-1">Add divisions to organize your league</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Add Teams */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <p className="text-slate-600">
                    Select teams to add to the league{leagueData.divisions.length > 0 && ' and assign them to divisions'}.
                  </p>

                  {availableTeams.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {availableTeams.map((team) => (
                        <Card key={team.id} className="bg-slate-50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={leagueData.teams.includes(team.id)}
                                  onCheckedChange={() => toggleTeam(team.id)}
                                />
                                {team.team_logo && (
                                  <img src={team.team_logo} alt="" className="w-10 h-10 rounded-full object-cover" />
                                )}
                                <div>
                                  <p className="font-semibold">{team.name}</p>
                                  <p className="text-sm text-slate-500">{team.age_group}</p>
                                </div>
                              </div>

                              {leagueData.teams.includes(team.id) && leagueData.divisions.length > 0 && (
                                <Select
                                  value={leagueData.divisions.find(d => d.teams?.includes(team.id))?.id || ""}
                                  onValueChange={(value) => assignTeamToDivision(team.id, value)}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Division" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {leagueData.divisions.map((division) => (
                                      <SelectItem key={division.id} value={division.id}>
                                        {division.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      <p>No teams available for this sport</p>
                      <p className="text-sm mt-1">Create teams in your organization first</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">League Ready!</h3>
                        <p className="text-slate-600">Review details below and launch</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">League Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          {leagueData.logo_url && (
                            <img src={leagueData.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
                          )}
                          <div>
                            <p className="font-semibold text-lg">{leagueData.name}</p>
                            <p className="text-sm text-slate-600 capitalize">{leagueData.sport}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Season:</span>
                            <span className="font-medium">{leagueData.season || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Start Date:</span>
                            <span className="font-medium">
                              {leagueData.start_date ? new Date(leagueData.start_date).toLocaleDateString() : 'Not set'}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">End Date:</span>
                            <span className="font-medium">
                              {leagueData.end_date ? new Date(leagueData.end_date).toLocaleDateString() : 'Not set'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-center py-2 bg-slate-50 rounded-lg">
                            <div className="text-3xl font-bold text-orange-600">
                              {leagueData.teams.length}
                            </div>
                            <p className="text-slate-600 text-sm">Teams</p>
                          </div>
                        </div>
                        <div>
                          <div className="text-center py-2 bg-slate-50 rounded-lg">
                            <div className="text-3xl font-bold text-purple-600">
                              {leagueData.divisions.length}
                            </div>
                            <p className="text-slate-600 text-sm">Divisions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handleBack}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>

        <Button
          onClick={currentStep === 4 ? handleComplete : handleNext}
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
        >
          {currentStep === 4 ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Launch League
            </>
          ) : (
            <>
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}