import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Mail, User } from "lucide-react";

export default function PlayerRegistrationForm({ teamName, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    jersey_number: "",
    position: "",
    uniform_size: "",
    parent_first_name: "",
    parent_last_name: "",
    parent_email: "",
    parent_phone: "",
    emergency_contact: "",
    medical_info: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Player Registration</h3>
              <p className="text-slate-600">{teamName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Information */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-orange-600" />
            Player Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                required
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                required
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Details */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <CardTitle>Team Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jersey_number">Jersey Number</Label>
              <Input
                id="jersey_number"
                placeholder="23"
                value={formData.jersey_number}
                onChange={(e) => handleChange('jersey_number', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="Point Guard"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uniform_size">Uniform Size</Label>
              <Select
                value={formData.uniform_size}
                onValueChange={(value) => handleChange('uniform_size', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YS">Youth Small</SelectItem>
                  <SelectItem value="YM">Youth Medium</SelectItem>
                  <SelectItem value="YL">Youth Large</SelectItem>
                  <SelectItem value="S">Small</SelectItem>
                  <SelectItem value="M">Medium</SelectItem>
                  <SelectItem value="L">Large</SelectItem>
                  <SelectItem value="XL">X-Large</SelectItem>
                  <SelectItem value="XXL">XX-Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent/Guardian Information */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange-600" />
            Parent/Guardian Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent_first_name">First Name *</Label>
              <Input
                id="parent_first_name"
                required
                value={formData.parent_first_name}
                onChange={(e) => handleChange('parent_first_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent_last_name">Last Name *</Label>
              <Input
                id="parent_last_name"
                required
                value={formData.parent_last_name}
                onChange={(e) => handleChange('parent_last_name', e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent_email">Email *</Label>
              <Input
                id="parent_email"
                type="email"
                required
                value={formData.parent_email}
                onChange={(e) => handleChange('parent_email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent_phone">Phone *</Label>
              <Input
                id="parent_phone"
                type="tel"
                required
                value={formData.parent_phone}
                onChange={(e) => handleChange('parent_phone', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_contact">Emergency Contact</Label>
            <Input
              id="emergency_contact"
              placeholder="Name and phone number"
              value={formData.emergency_contact}
              onChange={(e) => handleChange('emergency_contact', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_info">Medical Information / Allergies</Label>
            <Input
              id="medical_info"
              placeholder="Any medical conditions or allergies we should know about"
              value={formData.medical_info}
              onChange={(e) => handleChange('medical_info', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
        >
          Complete Registration
        </Button>
      </div>
    </form>
  );
}