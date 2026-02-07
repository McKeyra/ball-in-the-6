import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronLeft, Check, Search, Upload, Plus, Trash2, ArrowLeft } from "lucide-react";

export default function AddNewProgram() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    programType: "",
    searchQuery: "",
    specificType: "",
    customLeague: "",
    programName: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    ageGroup: "",
    
    // Team-specific
    maxRosterSize: "",
    practiceSchedule: "",
    uniformRequired: false,
    
    // League-specific
    numberOfTeams: "",
    seasonLength: "",
    playoffFormat: "",
    
    // Event-specific
    eventDate: "",
    eventTime: "",
    capacity: "",
    registrationDeadline: "",
    
    // Cost & Payment
    cost: "",
    paymentEnabled: false,
    paymentProcessor: "",
    
    // Media
    flyerUrl: "",
    galleryUrls: [],
    
    // Registration form
    buildRegistrationForm: false,
    registrationFields: []
  });

  const getTotalSteps = () => {
    return 7; // Program Type -> Specific Type -> Details -> Cost -> Media -> Form -> Review
  };

  const handleNext = () => {
    if (step < getTotalSteps()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (type === 'flyer') {
        setFormData({ ...formData, flyerUrl: file_url });
      } else if (type === 'gallery') {
        setFormData({ ...formData, galleryUrls: [...formData.galleryUrls, file_url] });
      }
    }
  };

  const addRegistrationField = () => {
    setFormData({
      ...formData,
      registrationFields: [
        ...formData.registrationFields,
        { id: Date.now(), label: "", type: "text", required: false }
      ]
    });
  };

  const updateRegistrationField = (id, field, value) => {
    setFormData({
      ...formData,
      registrationFields: formData.registrationFields.map(f =>
        f.id === id ? { ...f, [field]: value } : f
      )
    });
  };

  const removeRegistrationField = (id) => {
    setFormData({
      ...formData,
      registrationFields: formData.registrationFields.filter(f => f.id !== id)
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const programData = {
        program_type: formData.programType,
        specific_type: formData.specificType,
        name: formData.programName,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        location_name: formData.location,
        age_group: formData.ageGroup,
        max_roster_size: formData.maxRosterSize ? parseInt(formData.maxRosterSize) : null,
        practice_schedule: formData.practiceSchedule,
        uniform_required: formData.uniformRequired,
        number_of_teams: formData.numberOfTeams ? parseInt(formData.numberOfTeams) : null,
        season_length: formData.seasonLength ? parseInt(formData.seasonLength) : null,
        playoff_format: formData.playoffFormat,
        event_date: formData.eventDate,
        event_time: formData.eventTime,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        registration_deadline: formData.registrationDeadline,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        payment_enabled: formData.paymentEnabled,
        payment_processor: formData.paymentProcessor,
        flyer_url: formData.flyerUrl,
        gallery_urls: formData.galleryUrls,
        registration_form_enabled: formData.buildRegistrationForm,
        registration_fields: formData.registrationFields.map(f => ({
          id: String(f.id),
          label: f.label,
          type: f.type,
          required: f.required
        })),
        status: 'active'
      };

      await base44.entities.Program.create(programData);
      navigate(createPageUrl("LeagueManagement"));
    } catch (error) {
      console.error("Error creating program:", error);
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.programType !== "";
      case 2:
        return formData.specificType !== "";
      case 3:
        return formData.programName !== "";
      case 4:
        return !formData.paymentEnabled || (formData.cost !== "" && formData.paymentProcessor !== "");
      default:
        return true;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "What do you want to build?";
      case 2: return getSpecificTypeTitle();
      case 3: return "Program Details";
      case 4: return "Cost & Payment Setup";
      case 5: return "Media & Marketing";
      case 6: return "Registration Form";
      case 7: return "Review Your Program";
      default: return "";
    }
  };

  const getSpecificTypeTitle = () => {
    if (formData.programType === "Team Program") return "Select Team Type";
    if (formData.programType === "League Program") return "Select League Type";
    if (formData.programType === "Event Program") return "Select Event Type";
    return "Select Type";
  };

  const getSpecificTypeOptions = () => {
    if (formData.programType === "Team Program") {
      return ['Team', 'Rep Team', 'AAU Team', 'Club Team', 'School Team'];
    }
    if (formData.programType === "League Program") {
      return ['Mens League', 'Womens League', 'Youth League', 'House League', 'Competitive League', 'Recreational League', 'Mixed League', 'Other League'];
    }
    if (formData.programType === "Event Program") {
      return ['Tournament', 'Game', 'Pick Up Game', 'Camp', 'Training', 'Tryout', 'Scrimmage', 'Championship'];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 md:p-6 lg:p-8 pb-24">
      <div
        className="w-full max-w-3xl p-4 sm:p-6 md:p-8 lg:p-12 rounded-3xl relative"
        style={{
          background: '#0f0f0f',
          boxShadow: '0 10px 26px rgba(0,0,0,.10)'
        }}
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("LeagueManagement"))}
          className="absolute top-4 left-4 min-w-[44px] min-h-[44px] p-2"
          style={{
            boxShadow: '0 10px 26px rgba(0,0,0,.10)',
            background: '#1a1a1a'
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-white/60">
              Step {step} of {getTotalSteps()}
            </span>
            <span className="text-sm text-white/40">
              {Math.round((step / getTotalSteps()) * 100)}% Complete
            </span>
          </div>
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{
              background: '#1a1a1a',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <div 
              className="h-full transition-all duration-300"
              style={{
                width: `${(step / getTotalSteps()) * 100}%`,
                background: 'linear-gradient(90deg, #c9a962, #b8943f)',
              }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Step 1: Program Type Selection */}
          {step === 1 && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">{getStepTitle()}</h2>
              <p className="text-sm md:text-base text-white/60 mb-4 md:mb-6">Choose the type of program you'd like to create</p>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input
                  value={formData.searchQuery}
                  onChange={(e) => setFormData({ ...formData, searchQuery: e.target.value })}
                  placeholder="Search existing programs..."
                  className="pl-12 py-6 text-lg"
                  style={{
                    background: '#1a1a1a',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {['Team Program', 'League Program', 'Event Program', 'Training Program'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, programType: type })}
                    className={`p-4 md:p-6 rounded-2xl text-left transition-all min-h-[80px] ${
                      formData.programType === type ? 'scale-[1.02]' : ''
                    }`}
                    style={{
                      background: formData.programType === type
                        ? 'linear-gradient(135deg, #c9a962, #b8943f)'
                        : '#1a1a1a',
                      boxShadow: formData.programType === type
                        ? '6px 6px 12px rgba(0,0,0,0.2)'
                        : '0 10px 26px rgba(0,0,0,.10)',
                      color: formData.programType === type ? 'white' : 'rgba(255,255,255,0.7)'
                    }}
                  >
                    <div className="text-lg md:text-xl font-bold mb-1 md:mb-2">{type}</div>
                    <div className={`text-xs md:text-sm ${formData.programType === type ? 'text-white/70' : 'text-white/40'}`}>
                      {type === 'Team Program' && 'Create and manage a team'}
                      {type === 'League Program' && 'Organize a competitive league'}
                      {type === 'Event Program' && 'Schedule games and tournaments'}
                      {type === 'Training Program' && 'Set up practice sessions'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Specific Type Selection */}
          {step === 2 && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">{getStepTitle()}</h2>
              <p className="text-sm md:text-base text-white/60 mb-4 md:mb-6">
                {formData.programType === 'Team Program' && 'What kind of team structure are you building?'}
                {formData.programType === 'League Program' && 'What type of league will this be?'}
                {formData.programType === 'Event Program' && 'What kind of event are you organizing?'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {getSpecificTypeOptions().map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, specificType: type })}
                    className={`p-4 md:p-6 rounded-2xl text-left transition-all min-h-[56px] ${
                      formData.specificType === type ? 'scale-[1.02]' : ''
                    }`}
                    style={{
                      background: formData.specificType === type
                        ? 'linear-gradient(135deg, #c9a962, #b8943f)'
                        : '#1a1a1a',
                      boxShadow: formData.specificType === type
                        ? '6px 6px 12px rgba(0,0,0,0.2)'
                        : '0 10px 26px rgba(0,0,0,.10)',
                      color: formData.specificType === type ? 'white' : 'rgba(255,255,255,0.7)'
                    }}
                  >
                    <div className="text-lg md:text-xl font-bold">{type}</div>
                  </button>
                ))}
              </div>

              {formData.specificType === 'Other League' && (
                <Input
                  value={formData.customLeague}
                  onChange={(e) => setFormData({ ...formData, customLeague: e.target.value })}
                  placeholder="Enter custom league name..."
                  className="mt-4 py-6 text-lg"
                  style={{
                    background: '#1a1a1a',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                />
              )}
            </div>
          )}

          {/* Step 3: Program Details */}
          {step === 3 && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">{getStepTitle()}</h2>
              <p className="text-sm md:text-base text-white/60 mb-4 md:mb-6">Provide information about your {formData.programType}</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-white/60 mb-2 block">Program Name *</label>
                  <Input
                    value={formData.programName}
                    onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                    placeholder="e.g., Summer Basketball League 2025"
                    className="py-6"
                    style={{
                      background: '#1a1a1a',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-white/60 mb-2 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the program..."
                    rows={4}
                    className="w-full p-4 rounded-xl"
                    style={{
                      background: '#1a1a1a',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                      border: 'none',
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-white/60 mb-2 block">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      style={{
                        background: '#1a1a1a',
                        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-white/60 mb-2 block">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      style={{
                        background: '#1a1a1a',
                        boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-white/60 mb-2 block">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Community Sports Center"
                    style={{
                      background: '#1a1a1a',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-white/60 mb-2 block">Age Group</label>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                    className="w-full p-3 rounded-xl"
                    style={{
                      background: '#1a1a1a',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                      border: 'none'
                    }}
                  >
                    <option value="">Select age group</option>
                    <option value="u10">Under 10</option>
                    <option value="u12">Under 12</option>
                    <option value="u14">Under 14</option>
                    <option value="u16">Under 16</option>
                    <option value="u18">Under 18</option>
                    <option value="adult">Adult</option>
                    <option value="open">Open</option>
                  </select>
                </div>

                {/* Team-specific fields */}
                {formData.programType === 'Team Program' && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-white/60 mb-2 block">Max Roster Size</label>
                      <Input
                        type="number"
                        value={formData.maxRosterSize}
                        onChange={(e) => setFormData({ ...formData, maxRosterSize: e.target.value })}
                        placeholder="e.g., 15"
                        style={{
                          background: '#1a1a1a',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-white/60 mb-2 block">Practice Schedule</label>
                      <Input
                        value={formData.practiceSchedule}
                        onChange={(e) => setFormData({ ...formData, practiceSchedule: e.target.value })}
                        placeholder="e.g., Monday & Wednesday 6-8pm"
                        style={{
                          background: '#1a1a1a',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.uniformRequired}
                        onChange={(e) => setFormData({ ...formData, uniformRequired: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <label className="text-sm font-semibold text-white/60">Uniform Required</label>
                    </div>
                  </>
                )}

                {/* League-specific fields */}
                {formData.programType === 'League Program' && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-white/60 mb-2 block">Number of Teams</label>
                      <Input
                        type="number"
                        value={formData.numberOfTeams}
                        onChange={(e) => setFormData({ ...formData, numberOfTeams: e.target.value })}
                        placeholder="e.g., 8"
                        style={{
                          background: '#1a1a1a',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-white/60 mb-2 block">Season Length (weeks)</label>
                      <Input
                        type="number"
                        value={formData.seasonLength}
                        onChange={(e) => setFormData({ ...formData, seasonLength: e.target.value })}
                        placeholder="e.g., 12"
                        style={{
                          background: '#1a1a1a',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-white/60 mb-2 block">Playoff Format</label>
                      <select
                        value={formData.playoffFormat}
                        onChange={(e) => setFormData({ ...formData, playoffFormat: e.target.value })}
                        className="w-full p-3 rounded-xl"
                        style={{
                          background: '#1a1a1a',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                          border: 'none'
                        }}
                      >
                        <option value="">Select format</option>
                        <option value="single">Single Elimination</option>
                        <option value="double">Double Elimination</option>
                        <option value="round_robin">Round Robin</option>
                        <option value="bracket">4-Team Bracket</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Event-specific fields */}
                {formData.programType === 'Event Program' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-white/60 mb-2 block">Event Date</label>
                        <Input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          style={{
                            background: '#1a1a1a',
                            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-white/60 mb-2 block">Event Time</label>
                        <Input
                          type="time"
                          value={formData.eventTime}
                          onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                          style={{
                            background: '#1a1a1a',
                            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-white/60 mb-2 block">Capacity</label>
                      <Input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="Maximum participants"
                        style={{
                          background: '#1a1a1a',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-white/60 mb-2 block">Registration Deadline</label>
                      <Input
                        type="date"
                        value={formData.registrationDeadline}
                        onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                        style={{
                          background: '#1a1a1a',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Cost & Payment */}
          {step === 4 && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">{getStepTitle()}</h2>
              <p className="text-sm md:text-base text-white/60 mb-4 md:mb-6">Set up pricing and payment options</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-white/60 mb-2 block">Program Cost ($)</label>
                  <Input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="0.00"
                    style={{
                      background: '#1a1a1a',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  />
                  <p className="text-xs text-white/40 mt-1">Leave blank for free programs</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.paymentEnabled}
                    onChange={(e) => setFormData({ ...formData, paymentEnabled: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label className="text-sm font-semibold text-white/60">Enable Online Payments</label>
                </div>

                {formData.paymentEnabled && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-white/60 mb-2 block">Payment Processor</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Stripe', 'PayPal'].map((processor) => (
                          <button
                            key={processor}
                            onClick={() => setFormData({ ...formData, paymentProcessor: processor })}
                            className={`p-4 rounded-xl text-left transition-all`}
                            style={{
                              background: formData.paymentProcessor === processor 
                                ? 'linear-gradient(135deg, #c9a962, #b8943f)' 
                                : '#1a1a1a',
                              boxShadow: formData.paymentProcessor === processor
                                ? '4px 4px 8px rgba(0,0,0,0.2)'
                                : '0 10px 26px rgba(0,0,0,.10)',
                              color: formData.paymentProcessor === processor ? 'white' : 'rgba(255,255,255,0.7)'
                            }}
                          >
                            <div className="font-bold mb-1">{processor}</div>
                            <div className={`text-xs ${formData.paymentProcessor === processor ? 'text-white/70' : 'text-white/40'}`}>
                              $0.30 + 3% per transaction
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div 
                      className="p-4 rounded-xl"
                      style={{
                        background: '#1a1a1a',
                        boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.7)'
                      }}
                    >
                      <div className="text-sm text-white/60">
                        <strong>Transaction Fees:</strong> Each payment will incur a $0.30 + 3% processing fee
                      </div>
                      {formData.cost && (
                        <div className="text-sm text-white/60 mt-2">
                          <strong>You'll receive:</strong> ${(parseFloat(formData.cost) - (parseFloat(formData.cost) * 0.03 + 0.30)).toFixed(2)} per registration
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Media & Marketing */}
          {step === 5 && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">{getStepTitle()}</h2>
              <p className="text-sm md:text-base text-white/60 mb-4 md:mb-6">Add promotional materials and images</p>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-white/60 mb-2 block">Program Flyer</label>
                  {formData.flyerUrl ? (
                    <div className="relative">
                      <img src={formData.flyerUrl} alt="Flyer" className="w-full rounded-xl" />
                      <button
                        onClick={() => setFormData({ ...formData, flyerUrl: "" })}
                        className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label 
                      className="cursor-pointer block p-8 rounded-xl border-2 border-dashed text-center"
                      style={{
                        background: '#1a1a1a',
                        borderColor: 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-white/30" />
                      <span className="text-sm text-white/60">Click to upload flyer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'flyer')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-white/60 mb-2 block">Gallery Images</label>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {formData.galleryUrls.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-32 object-cover rounded-xl" />
                        <button
                          onClick={() => setFormData({ 
                            ...formData, 
                            galleryUrls: formData.galleryUrls.filter((_, i) => i !== idx) 
                          })}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label 
                    className="cursor-pointer block p-6 rounded-xl border-2 border-dashed text-center"
                    style={{
                      background: '#1a1a1a',
                      borderColor: 'rgba(255,255,255,0.08)'
                    }}
                  >
                    <Plus className="w-6 h-6 mx-auto mb-1 text-white/30" />
                    <span className="text-sm text-white/60">Add gallery image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'gallery')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Registration Form Builder */}
          {step === 6 && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">{getStepTitle()}</h2>
              <p className="text-sm md:text-base text-white/60 mb-4 md:mb-6">Create a custom registration form for players/parents</p>

              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  checked={formData.buildRegistrationForm}
                  onChange={(e) => setFormData({ ...formData, buildRegistrationForm: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm font-semibold text-white/60">
                  Build a registration form for this program
                </label>
              </div>

              {formData.buildRegistrationForm && (
                <>
                  <div className="space-y-4">
                    {formData.registrationFields.map((field) => (
                      <div 
                        key={field.id}
                        className="p-4 rounded-xl"
                        style={{
                          background: '#1a1a1a',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        <div className="grid grid-cols-12 gap-3 items-center">
                          <div className="col-span-5">
                            <Input
                              value={field.label}
                              onChange={(e) => updateRegistrationField(field.id, 'label', e.target.value)}
                              placeholder="Field label"
                              className="bg-white/[0.07]"
                            />
                          </div>
                          <div className="col-span-3">
                            <select
                              value={field.type}
                              onChange={(e) => updateRegistrationField(field.id, 'type', e.target.value)}
                              className="w-full p-2 rounded-lg bg-white/[0.07]"
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="phone">Phone</option>
                              <option value="date">Date</option>
                              <option value="number">Number</option>
                              <option value="textarea">Long Text</option>
                            </select>
                          </div>
                          <div className="col-span-3 flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateRegistrationField(field.id, 'required', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-white/60">Required</span>
                          </div>
                          <div className="col-span-1">
                            <button
                              onClick={() => removeRegistrationField(field.id)}
                              className="p-2 text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={addRegistrationField}
                    className="w-full"
                    style={{
                      background: '#1a1a1a',
                      boxShadow: '0 10px 26px rgba(0,0,0,.10)',
                      color: 'rgba(255,255,255,0.5)'
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>

                  <div 
                    className="p-4 rounded-xl"
                    style={{
                      background: '#1a1a1a',
                      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.7)'
                    }}
                  >
                    <p className="text-xs text-white/60">
                      💡 Default fields (Name, Email, Emergency Contact) are automatically included
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 7: Review */}
          {step === 7 && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-2">{getStepTitle()}</h2>
              <p className="text-sm md:text-base text-white/60 mb-4 md:mb-6">Please review before creating your program</p>

              <div 
                className="p-6 rounded-2xl space-y-4"
                style={{
                  background: '#1a1a1a',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                <div>
                  <div className="text-xs font-semibold text-white/40 uppercase mb-1">Program Type</div>
                  <div className="text-lg font-bold text-white/90">{formData.programType}</div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-white/40 uppercase mb-1">Specific Type</div>
                  <div className="text-lg font-bold text-white/90">{formData.specificType}</div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-white/40 uppercase mb-1">Program Name</div>
                  <div className="text-lg font-bold text-white/90">{formData.programName}</div>
                </div>

                {formData.cost && (
                  <div>
                    <div className="text-xs font-semibold text-white/40 uppercase mb-1">Cost</div>
                    <div className="text-lg font-bold text-white/90">${formData.cost}</div>
                  </div>
                )}

                {formData.paymentEnabled && (
                  <div>
                    <div className="text-xs font-semibold text-white/40 uppercase mb-1">Payment Processor</div>
                    <div className="text-lg font-bold text-white/90">{formData.paymentProcessor}</div>
                  </div>
                )}

                {formData.flyerUrl && (
                  <div>
                    <div className="text-xs font-semibold text-white/40 uppercase mb-1">Flyer</div>
                    <img src={formData.flyerUrl} alt="Flyer" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}

                {formData.galleryUrls.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-white/40 uppercase mb-1">Gallery Images</div>
                    <div className="text-sm text-white/70">{formData.galleryUrls.length} images uploaded</div>
                  </div>
                )}

                {formData.buildRegistrationForm && (
                  <div>
                    <div className="text-xs font-semibold text-white/40 uppercase mb-1">Registration Form</div>
                    <div className="text-sm text-white/70">
                      {formData.registrationFields.length} custom fields
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/[0.06]">
          <Button
            onClick={handleBack}
            disabled={step === 1}
            variant="outline"
            className="flex items-center gap-2 min-h-[44px] px-3 md:px-4"
            style={{
              background: '#1a1a1a',
              boxShadow: step === 1
                ? 'none'
                : '0 10px 26px rgba(0,0,0,.10)',
              opacity: step === 1 ? 0.4 : 1
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          {step < getTotalSteps() ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-4 md:px-8 min-h-[44px]"
              style={{
                background: canProceed()
                  ? 'linear-gradient(90deg, #c9a962, #b8943f)'
                  : '#1a1a1a',
                color: canProceed() ? 'white' : 'rgba(255,255,255,0.4)',
                boxShadow: canProceed()
                  ? '4px 4px 12px rgba(0,0,0,0.2)'
                  : 'none',
                opacity: canProceed() ? 1 : 0.4
              }}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 md:px-8 min-h-[44px]"
              style={{
                background: 'linear-gradient(90deg, #10b981, #059669)',
                color: 'white',
                boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span className="hidden sm:inline">Creating...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span className="hidden sm:inline">Create Program</span>
                </>
              )}
            </Button>
          )}
        </div>

        <div className="text-center mt-4 md:mt-6">
          <button
            onClick={() => navigate(createPageUrl("LeagueManagement"))}
            className="text-sm text-white/40 hover:text-white/70 underline min-h-[44px] px-4"
          >
            Skip wizard and go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}