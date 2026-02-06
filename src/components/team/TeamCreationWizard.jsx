import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  ChevronRight, ChevronLeft, Check, Users, 
  FileText, Upload, Loader2, Trophy 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function TeamCreationWizard({ onComplete, onCancel, userEmail }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [teamId, setTeamId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const queryClient = useQueryClient();

  const [teamData, setTeamData] = useState({
    name: "",
    sport: "basketball",
    age_group: "",
    season: "",
    coach_email: userEmail,
    team_logo: "",
    team_color: "#FF6B35",
    roster: []
  });

  const createTeamMutation = useMutation({
    mutationFn: (data) => base44.entities.Team.create(data),
    onSuccess: (data) => {
      setTeamId(data.id);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team created!');
    }
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Team.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });

  const handleFieldChange = async (field, value) => {
    const newData = { ...teamData, [field]: value };
    setTeamData(newData);

    // Auto-save if team exists
    if (teamId) {
      await updateTeamMutation.mutateAsync({ id: teamId, data: { [field]: value } });
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!teamData.name || !teamData.sport) {
        toast.error('Please fill in required fields');
        return;
      }

      if (!teamId) {
        const newTeam = await createTeamMutation.mutateAsync(teamData);
        setTeamId(newTeam.id);
      }
    }

    if (currentStep === 2 && teamData.roster.length > 0) {
      await updateTeamMutation.mutateAsync({ 
        id: teamId, 
        data: { roster: teamData.roster } 
      });
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
      
      if (currentStep === 1) {
        await handleFieldChange('team_logo', file_url);
        toast.success('Logo uploaded!');
      } else if (currentStep === 2) {
        await handleRosterUpload(file_url);
      }
    } catch (error) {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const handleRosterUpload = async (file_url) => {
    setExtracting(true);
    try {
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            players: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  player_email: { type: "string" },
                  first_name: { type: "string" },
                  last_name: { type: "string" },
                  jersey_number: { type: "string" },
                  position: { type: "string" },
                  uniform_size: { type: "string" },
                  phone: { type: "string" },
                  parent_email: { type: "string" }
                }
              }
            }
          }
        }
      });

      if (result.status === "success" && result.output?.players) {
        const roster = result.output.players.map(p => ({
          player_email: p.player_email || p.email || '',
          jersey_number: p.jersey_number || '',
          position: p.position || '',
          uniform_size: p.uniform_size || ''
        }));

        setTeamData({ ...teamData, roster });
        await updateTeamMutation.mutateAsync({ 
          id: teamId, 
          data: { roster } 
        });
        toast.success(`${roster.length} players extracted!`);
      } else {
        toast.error('Could not extract player data');
      }
    } catch (error) {
      toast.error('Extraction failed');
    }
    setExtracting(false);
  };

  const addManualPlayer = () => {
    const newRoster = [...teamData.roster, {
      player_email: "",
      jersey_number: "",
      position: "",
      uniform_size: ""
    }];
    setTeamData({ ...teamData, roster: newRoster });
  };

  const updatePlayer = async (index, field, value) => {
    const newRoster = [...teamData.roster];
    newRoster[index][field] = value;
    setTeamData({ ...teamData, roster: newRoster });

    if (teamId) {
      await updateTeamMutation.mutateAsync({ 
        id: teamId, 
        data: { roster: newRoster } 
      });
    }
  };

  const removePlayer = async (index) => {
    const newRoster = teamData.roster.filter((_, i) => i !== index);
    setTeamData({ ...teamData, roster: newRoster });

    if (teamId) {
      await updateTeamMutation.mutateAsync({ 
        id: teamId, 
        data: { roster: newRoster } 
      });
    }
  };

  const handleComplete = () => {
    toast.success('Team setup complete!');
    onComplete();
  };

  const steps = [
    { number: 1, title: "Team Details", icon: Trophy },
    { number: 2, title: "Add Players", icon: Users },
    { number: 3, title: "Review & Launch", icon: Check }
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
              {/* Step 1: Team Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Team Name *</Label>
                      <Input
                        id="name"
                        placeholder="Warriors U16"
                        value={teamData.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sport">Sport *</Label>
                      <Select 
                        value={teamData.sport} 
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
                      <Label htmlFor="age_group">Age Group</Label>
                      <Input
                        id="age_group"
                        placeholder="U16"
                        value={teamData.age_group}
                        onChange={(e) => handleFieldChange('age_group', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="season">Season</Label>
                      <Input
                        id="season"
                        placeholder="2024-2025"
                        value={teamData.season}
                        onChange={(e) => handleFieldChange('season', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team_color">Team Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="team_color"
                          type="color"
                          value={teamData.team_color}
                          onChange={(e) => handleFieldChange('team_color', e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={teamData.team_color}
                          onChange={(e) => handleFieldChange('team_color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Team Logo</Label>
                    <div className="flex items-center gap-4">
                      {teamData.team_logo && (
                        <img 
                          src={teamData.team_logo} 
                          alt="Team logo" 
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

              {/* Step 2: Add Players */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600">
                      Add players to your roster. You can upload a document or add them manually.
                    </p>
                  </div>

                  {/* Upload Option */}
                  <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">Quick Import</h4>
                            <p className="text-sm text-slate-600">Upload Excel, CSV, or PDF with player info</p>
                          </div>
                        </div>
                        <div>
                          <input
                            type="file"
                            id="roster-upload"
                            className="hidden"
                            accept=".pdf,.csv,.xlsx,.xls"
                            onChange={handleFileUpload}
                          />
                          <Button
                            onClick={() => document.getElementById('roster-upload').click()}
                            disabled={extracting}
                            className="bg-gradient-to-r from-orange-500 to-pink-600"
                          >
                            {extracting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Extracting...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload File
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Manual Entry */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900">Players ({teamData.roster.length})</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addManualPlayer}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Add Player
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {teamData.roster.map((player, index) => (
                        <Card key={index} className="bg-slate-50">
                          <CardContent className="p-4">
                            <div className="grid md:grid-cols-5 gap-3">
                              <Input
                                placeholder="Email *"
                                value={player.player_email}
                                onChange={(e) => updatePlayer(index, 'player_email', e.target.value)}
                              />
                              <Input
                                placeholder="Jersey #"
                                value={player.jersey_number}
                                onChange={(e) => updatePlayer(index, 'jersey_number', e.target.value)}
                              />
                              <Input
                                placeholder="Position"
                                value={player.position}
                                onChange={(e) => updatePlayer(index, 'position', e.target.value)}
                              />
                              <Select
                                value={player.uniform_size}
                                onValueChange={(value) => updatePlayer(index, 'uniform_size', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="YS">YS</SelectItem>
                                  <SelectItem value="YM">YM</SelectItem>
                                  <SelectItem value="YL">YL</SelectItem>
                                  <SelectItem value="S">S</SelectItem>
                                  <SelectItem value="M">M</SelectItem>
                                  <SelectItem value="L">L</SelectItem>
                                  <SelectItem value="XL">XL</SelectItem>
                                  <SelectItem value="XXL">XXL</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removePlayer(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                ×
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {teamData.roster.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                          <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
                          <p>No players added yet</p>
                          <p className="text-sm mt-1">Upload a file or add players manually</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Team Ready!</h3>
                        <p className="text-slate-600">Review your team details below</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Team Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          {teamData.team_logo && (
                            <img src={teamData.team_logo} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
                          )}
                          <div>
                            <p className="font-semibold text-lg">{teamData.name}</p>
                            <p className="text-sm text-slate-600 capitalize">{teamData.sport}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Age Group:</span>
                            <span className="font-medium">{teamData.age_group || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Season:</span>
                            <span className="font-medium">{teamData.season || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Coach:</span>
                            <span className="font-medium">{teamData.coach_email}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Roster Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-4">
                          <div className="text-4xl font-bold text-orange-600 mb-2">
                            {teamData.roster.length}
                          </div>
                          <p className="text-slate-600">Players Added</p>
                        </div>
                        <div className="pt-4 border-t">
                          <p className="text-sm text-slate-600 mb-2">Quick Stats:</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-slate-50 rounded-lg p-2 text-center">
                              <p className="font-medium">
                                {teamData.roster.filter(p => p.uniform_size).length}
                              </p>
                              <p className="text-xs text-slate-600">With Sizes</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2 text-center">
                              <p className="font-medium">
                                {teamData.roster.filter(p => p.position).length}
                              </p>
                              <p className="text-xs text-slate-600">With Positions</p>
                            </div>
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
          onClick={currentStep === 3 ? handleComplete : handleNext}
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
        >
          {currentStep === 3 ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Complete Setup
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