import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Phone,
  Mail,
  ArrowRight,
  Flame,
  Snowflake,
  ThermometerSun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { VENTURE_COLORS, TIER_COLORS } from "../components/scoring/scoringUtils";

const statusColors = {
  "New": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Contacted": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Qualified": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Proposal": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Negotiation": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Won": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Lost": "bg-red-500/20 text-red-400 border-red-500/30",
  "Nurture": "bg-slate-500/20 text-slate-400 border-slate-500/30"
};

const TierIcon = ({ tier }) => {
  if (tier === "Tier_1_Hot") return <Flame className="w-4 h-4 text-red-400" />;
  if (tier === "Tier_2_Warm") return <ThermometerSun className="w-4 h-4 text-amber-400" />;
  return <Snowflake className="w-4 h-4 text-slate-400" />;
};

export default function Leads() {
  const [search, setSearch] = useState("");
  const [ventureFilter, setVentureFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 200),
  });

  const { data: leadScores = [] } = useQuery({
    queryKey: ['leadScores'],
    queryFn: () => base44.entities.LeadScore.list('-created_date', 200),
  });

  // Create a map of lead scores by lead_id
  const scoreMap = useMemo(() => {
    const map = {};
    leadScores.forEach(score => {
      map[score.lead_id] = score;
    });
    return map;
  }, [leadScores]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !search || 
        lead.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.industry?.toLowerCase().includes(search.toLowerCase()) ||
        lead.city?.toLowerCase().includes(search.toLowerCase());
      
      const matchesVenture = ventureFilter === "all" || lead.venture === ventureFilter;
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      
      const score = scoreMap[lead.id];
      const matchesTier = tierFilter === "all" || score?.tier === tierFilter;

      return matchesSearch && matchesVenture && matchesStatus && matchesTier;
    });
  }, [leads, search, ventureFilter, statusFilter, tierFilter, scoreMap]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Lead Management</h1>
          <p className="text-slate-400 text-sm mt-1">{filteredLeads.length} leads</p>
        </div>
        <Link to={createPageUrl("NewLead")}>
          <Button className="bg-red-500 hover:bg-red-600">
            <Plus className="w-4 h-4 mr-2" /> Add Lead
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-800 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search companies, industries, cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={ventureFilter} onValueChange={setVentureFilter}>
              <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Venture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ventures</SelectItem>
                <SelectItem value="Vance">Vance</SelectItem>
                <SelectItem value="Ball_in_the_6">Ball in the 6</SelectItem>
                <SelectItem value="Wear_US">Wear US</SelectItem>
                <SelectItem value="enuwWEB">enuwWEB</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="Tier_1_Hot">🔥 Tier 1 - Hot</SelectItem>
                <SelectItem value="Tier_2_Warm">🌡️ Tier 2 - Warm</SelectItem>
                <SelectItem value="Tier_3_Monitor">❄️ Tier 3 - Monitor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Company</TableHead>
                <TableHead className="text-slate-400">Industry</TableHead>
                <TableHead className="text-slate-400">Location</TableHead>
                <TableHead className="text-slate-400">Venture</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400 text-center">Score</TableHead>
                <TableHead className="text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredLeads.map((lead, index) => {
                  const score = scoreMap[lead.id];
                  const ventureColor = VENTURE_COLORS[lead.venture] || "#3B82F6";

                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-slate-800 hover:bg-slate-800/30 cursor-pointer group"
                    >
                      <TableCell>
                        <Link to={createPageUrl(`LeadDetail?id=${lead.id}`)} className="block">
                          <div className="flex items-center gap-3">
                            <TierIcon tier={score?.tier} />
                            <div>
                              <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                {lead.company_name}
                              </p>
                              {lead.owner_name && (
                                <p className="text-xs text-slate-500">{lead.owner_name}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-slate-300">{lead.industry}</TableCell>
                      <TableCell className="text-slate-400">{lead.city}, {lead.province}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className="text-xs border-slate-700"
                          style={{ color: ventureColor, borderColor: ventureColor + '40' }}
                        >
                          {lead.venture?.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[lead.status]} border text-xs`}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {score ? (
                          <span className={`font-semibold ${
                            score.overall_score >= 80 ? 'text-red-400' :
                            score.overall_score >= 60 ? 'text-amber-400' :
                            'text-slate-400'
                          }`}>
                            {score.overall_score}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Link to={createPageUrl(`LeadDetail?id=${lead.id}`)}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-400">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {filteredLeads.length === 0 && !isLoading && (
          <div className="p-12 text-center">
            <p className="text-slate-400">No leads found matching your filters.</p>
            <Link to={createPageUrl("NewLead")}>
              <Button className="mt-4 bg-red-500 hover:bg-red-600">
                <Plus className="w-4 h-4 mr-2" /> Add Your First Lead
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}