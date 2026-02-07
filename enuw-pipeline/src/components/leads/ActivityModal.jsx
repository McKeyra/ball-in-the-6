import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function ActivityModal({ 
  isOpen, 
  onClose, 
  onSave, 
  activityType, 
  leadEmail = "",
  isLoading = false 
}) {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    outcome: activityType === "Email" ? "Sent" : "",
    follow_up_date: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ subject: "", description: "", outcome: "", follow_up_date: "" });
  };

  const outcomes = activityType === "Email" 
    ? ["Sent"]
    : ["Completed", "No Answer", "Left Voicemail", "Scheduled Follow-up", "Not Interested"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log {activityType}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {activityType === "Email" && (
            <div className="space-y-2">
              <Label className="text-slate-300">To</Label>
              <Input
                value={leadEmail}
                disabled
                className="bg-slate-800 border-slate-700 text-slate-400"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-slate-300">Subject *</Label>
            <Input
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder={activityType === "Email" ? "Email subject" : "Brief description"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">
              {activityType === "Email" ? "Body" : "Description"}
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
              placeholder={activityType === "Email" ? "Email content..." : "Activity details..."}
            />
          </div>

          {activityType !== "Email" && (
            <div className="space-y-2">
              <Label className="text-slate-300">Outcome</Label>
              <Select value={formData.outcome} onValueChange={(v) => handleChange("outcome", v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  {outcomes.map(outcome => (
                    <SelectItem key={outcome} value={outcome}>{outcome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-slate-300">Follow-up Date</Label>
            <Input
              type="date"
              value={formData.follow_up_date}
              onChange={(e) => handleChange("follow_up_date", e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}