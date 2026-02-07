import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Building2 } from "lucide-react";
import { formatCurrency } from "../scoring/teamHealthScoring";

const SPONSOR_TYPE_COLORS = {
  "Title": "#c9a962",
  "Gold": "#FFD700",
  "Silver": "#C0C0C0",
  "Bronze": "#CD7F32",
  "In_Kind": "#3B82F6",
  "Media": "#8B5CF6"
};

export default function SponsorCard({ sponsor, onClick }) {
  const typeColor = SPONSOR_TYPE_COLORS[sponsor?.sponsor_type] || "#c9a962";

  return (
    <Card
      className="bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#c9a962]/50 cursor-pointer transition-all duration-200 group overflow-hidden"
      onClick={() => onClick?.(sponsor)}
    >
      <div className="flex">
        <div
          className="w-1"
          style={{ backgroundColor: typeColor }}
        />
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white truncate group-hover:text-[#c9a962] transition-colors">
                {sponsor?.company_name || sponsor?.name}
              </h4>
            </div>
            <Building2 className="w-4 h-4 text-[#c9a962]" />
          </div>

          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <DollarSign className="w-4 h-4 text-[#c9a962]" />
            {formatCurrency(sponsor?.deal_value || sponsor?.sponsorship_value || 0)}
          </div>

          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="text-xs border-[#2a2a2a]"
              style={{ color: typeColor, borderColor: typeColor + '40' }}
            >
              {sponsor?.sponsor_type?.replace(/_/g, ' ') || 'Sponsor'}
            </Badge>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span className="text-[#c9a962] font-medium">{sponsor?.probability || 0}%</span>
            </span>
          </div>

          {sponsor?.contact_name && (
            <div className="text-xs text-gray-500 truncate">
              Contact: {sponsor.contact_name}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
