import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function CreateFormDialog({ program, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    form_type: 'registration',
    title: `${program.name} Registration`,
    fields: [
      { id: '1', label: 'Full Name', type: 'text', required: true },
      { id: '2', label: 'Email', type: 'email', required: true },
      { id: '3', label: 'Phone', type: 'tel', required: true },
    ],
    payment_enabled: program.price > 0,
    payment_amount: program.price || 0,
    landing_page_slug: program.name.toLowerCase().replace(/\s+/g, '-'),
    is_published: false,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FormTemplate.create({
      program_id: program.id,
      ...data
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['forms']);
      onOpenChange(false);
    },
  });

  const addField = () => {
    setFormData({
      ...formData,
      fields: [
        ...formData.fields,
        { 
          id: Date.now().toString(), 
          label: '', 
          type: 'text', 
          required: false,
          placeholder: ''
        }
      ]
    });
  };

  const removeField = (id) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter(f => f.id !== id)
    });
  };

  const updateField = (id, updates) => {
    setFormData({
      ...formData,
      fields: formData.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'file', label: 'File Upload' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Registration Form for {program.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Form Settings */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Form Type</Label>
                <Select value={formData.form_type} onValueChange={(val) => setFormData({...formData, form_type: val})}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    <SelectItem value="registration">Registration</SelectItem>
                    <SelectItem value="early_access">Early Access</SelectItem>
                    <SelectItem value="more_info">More Info</SelectItem>
                    <SelectItem value="tryout">Tryout</SelectItem>
                    <SelectItem value="waiver">Waiver</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Form Title</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Landing Page URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">/register/</span>
                <Input 
                  value={formData.landing_page_slug}
                  onChange={(e) => setFormData({...formData, landing_page_slug: e.target.value})}
                  className="bg-white/5 border-white/10 flex-1"
                />
              </div>
            </div>

            {/* Payment Settings */}
            <div className="space-y-3 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#D0FF00]" />
                  <Label>Enable Payment Collection</Label>
                </div>
                <Switch 
                  checked={formData.payment_enabled}
                  onCheckedChange={(val) => setFormData({...formData, payment_enabled: val})}
                />
              </div>
              
              {formData.payment_enabled && (
                <div className="space-y-2">
                  <Label>Payment Amount ($)</Label>
                  <Input 
                    type="number"
                    value={formData.payment_amount}
                    onChange={(e) => setFormData({...formData, payment_amount: parseFloat(e.target.value)})}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-lg">Form Fields</Label>
              <Button 
                onClick={addField}
                size="sm"
                variant="outline"
                className="border-white/10 hover:border-[#D0FF00]/50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>

            <div className="space-y-3">
              {formData.fields.map((field, index) => (
                <div key={field.id} className="p-4 bg-white/5 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 mt-2 cursor-move" />
                    
                    <div className="flex-1 grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Field Label</Label>
                        <Input 
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          placeholder="e.g., Emergency Contact"
                          className="bg-white/5 border-white/10 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Field Type</Label>
                        <Select 
                          value={field.type} 
                          onValueChange={(val) => updateField(field.id, { type: val })}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-white/10">
                            {fieldTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Placeholder (Optional)</Label>
                        <Input 
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          placeholder="Hint text..."
                          className="bg-white/5 border-white/10 text-sm"
                        />
                      </div>

                      <div className="flex items-center gap-4 pt-6">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={field.required}
                            onCheckedChange={(val) => updateField(field.id, { required: val })}
                          />
                          <Label className="text-xs">Required</Label>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(field.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex gap-3">
          <Button 
            onClick={handleCreate}
            className="flex-1 bg-[#D0FF00] text-[#0A0A0A] hover:bg-[#D0FF00]/90"
            disabled={!formData.title || formData.fields.length === 0}
          >
            Create Form & Launch
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}