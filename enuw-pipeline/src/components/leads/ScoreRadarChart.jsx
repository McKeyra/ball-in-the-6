import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function ScoreRadarChart({ scores }) {
  const data = [
    { dimension: 'Industry', value: scores?.industry_fit?.score || 0, fullMark: 100 },
    { dimension: 'MRR', value: scores?.mrr_potential?.score || 0, fullMark: 100 },
    { dimension: 'Digital', value: scores?.digital_maturity?.score || 0, fullMark: 100 },
    { dimension: 'Geography', value: scores?.geographic_value?.score || 0, fullMark: 100 },
    { dimension: 'Authority', value: scores?.decision_authority?.score || 0, fullMark: 100 },
    { dimension: 'Service', value: scores?.service_alignment?.score || 0, fullMark: 100 },
    { dimension: 'Timing', value: scores?.timing_signals?.score || 0, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis 
            dataKey="dimension" 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#E94560"
            fill="#E94560"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}