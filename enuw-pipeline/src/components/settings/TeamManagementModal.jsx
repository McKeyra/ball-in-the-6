import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function TeamManagementModal({ isOpen, onClose, onSave, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Viewer"
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ name: "", email: "", role: "Viewer" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Role *</Label>
            <Select value={formData.role} onValueChange={(v) => handleChange("role", v)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              {formData.role === "Admin" && "Full access to all features"}
              {formData.role === "Manager" && "Can view all leads and edit assigned leads"}
              {formData.role === "Sales Rep" && "Can only see and edit assigned leads"}
              {formData.role === "Viewer" && "Read-only access"}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-700 text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Send Invitation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}