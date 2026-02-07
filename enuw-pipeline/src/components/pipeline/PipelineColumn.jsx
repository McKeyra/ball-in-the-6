import React from 'react';
import { Droppable, Draggable } from "@hello-pangea/dnd";
import DealCard from "./DealCard";
import { formatCurrency } from "../scoring/scoringUtils";

const stageColors = {
  "Discovery": "bg-blue-500",
  "Proposal": "bg-violet-500",
  "Negotiation": "bg-amber-500",
  "Contract": "bg-emerald-500",
  "Closed_Won": "bg-green-500",
  "Closed_Lost": "bg-red-500"
};

export default function PipelineColumn({ stage, deals, totalValue, onDealClick }) {
  return (
    <div className="flex flex-col min-w-[280px] max-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 rounded-t-lg bg-slate-900/70 border border-slate-800 border-b-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${stageColors[stage] || 'bg-slate-500'}`} />
          <span className="font-medium text-white text-sm">{stage.replace(/_/g, ' ')}</span>
          <span className="text-xs text-slate-500 ml-1">({deals.length})</span>
        </div>
        <span className="text-xs font-medium text-emerald-400">
          {formatCurrency(totalValue)}
        </span>
      </div>

      {/* Drop Zone */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 space-y-2 rounded-b-lg border border-slate-800 min-h-[400px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-slate-800/50 border-blue-500/50' : 'bg-slate-900/30'
            }`}
          >
            {deals.map((deal, index) => (
              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${snapshot.isDragging ? 'opacity-80' : ''}`}
                  >
                    <DealCard deal={deal} onClick={onDealClick} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {deals.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-24 text-slate-500 text-sm">
                No deals
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}