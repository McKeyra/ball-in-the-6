'use client';

import { Droppable, Draggable } from '@hello-pangea/dnd';
import { SponsorCard } from './SponsorCard';
import { formatCurrency } from '@/components/scoring/teamHealthScoring';

const STAGE_COLORS: Record<string, string> = {
  Discovery: 'bg-blue-500',
  Proposal: 'bg-violet-500',
  Negotiation: 'bg-amber-500',
  Contract: 'bg-emerald-500',
  Closed_Won: 'bg-[#c9a962]',
};

interface Sponsor {
  id: string;
  company_name?: string;
  name?: string;
  sponsor_type?: string;
  deal_value?: number;
  sponsorship_value?: number;
  probability?: number;
  contact_name?: string;
}

interface SponsorColumnProps {
  stage: string;
  sponsors: Sponsor[];
  totalValue: number;
  onSponsorClick?: (sponsor: Sponsor) => void;
}

export function SponsorColumn({
  stage,
  sponsors,
  totalValue,
  onSponsorClick,
}: SponsorColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] max-w-[280px]">
      <div className="flex items-center justify-between p-3 rounded-t-lg bg-[#1a1a1a] border border-[#2a2a2a] border-b-0">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage] || 'bg-gray-500'}`}
          />
          <span className="font-medium text-white text-sm">
            {stage.replace(/_/g, ' ')}
          </span>
          <span className="text-xs text-gray-500 ml-1">
            ({sponsors.length})
          </span>
        </div>
        <span className="text-xs font-medium text-[#c9a962]">
          {formatCurrency(totalValue)}
        </span>
      </div>

      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 space-y-2 rounded-b-lg border border-[#2a2a2a] min-h-[400px] transition-colors ${
              snapshot.isDraggingOver
                ? 'bg-[#1a1a1a] border-[#c9a962]/50'
                : 'bg-[#0f0f0f]'
            }`}
          >
            {sponsors.map((sponsor, index) => (
              <Draggable
                key={sponsor.id}
                draggableId={sponsor.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${snapshot.isDragging ? 'opacity-80' : ''}`}
                  >
                    <SponsorCard
                      sponsor={sponsor}
                      onClick={onSponsorClick}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {sponsors.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-24 text-gray-500 text-sm">
                No sponsors
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
