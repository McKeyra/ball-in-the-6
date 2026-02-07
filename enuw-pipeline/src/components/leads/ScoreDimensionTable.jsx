import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SCORING_WEIGHTS } from "../scoring/scoringUtils";

const dimensionLabels = {
  industry_fit: "Industry Fit",
  mrr_potential: "MRR Potential",
  digital_maturity: "Digital Maturity",
  geographic_value: "Geographic Value",
  decision_authority: "Decision Authority",
  service_alignment: "Service Alignment",
  timing_signals: "Timing Signals"
};

export default function ScoreDimensionTable({ scores }) {
  if (!scores) return null;

  const dimensions = Object.entries(dimensionLabels).map(([key, label]) => {
    const scoreData = scores[key] || { score: 0, evidence: "" };
    const weight = SCORING_WEIGHTS[key] || 0;
    const contribution = (scoreData.score * weight).toFixed(2);

    return {
      key,
      label,
      score: scoreData.score,
      weight: (weight * 100).toFixed(0),
      contribution,
      evidence: scoreData.evidence
    };
  });

  const total = dimensions.reduce((sum, d) => sum + parseFloat(d.contribution), 0);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="rounded-lg border border-slate-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900/50 border-slate-800">
            <TableHead className="text-slate-400 font-medium">Dimension</TableHead>
            <TableHead className="text-slate-400 font-medium text-center">Score</TableHead>
            <TableHead className="text-slate-400 font-medium text-center">Weight</TableHead>
            <TableHead className="text-slate-400 font-medium text-center">Contribution</TableHead>
            <TableHead className="text-slate-400 font-medium">Evidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dimensions.map((dim) => (
            <TableRow key={dim.key} className="border-slate-800 hover:bg-slate-900/30">
              <TableCell className="text-white font-medium">{dim.label}</TableCell>
              <TableCell className={`text-center font-semibold ${getScoreColor(dim.score)}`}>
                {dim.score}
              </TableCell>
              <TableCell className="text-center text-slate-400">{dim.weight}%</TableCell>
              <TableCell className="text-center text-white">{dim.contribution}</TableCell>
              <TableCell className="text-slate-400 text-sm max-w-[200px] truncate">
                {dim.evidence}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-slate-900/50 border-slate-800">
            <TableCell className="text-white font-bold">TOTAL</TableCell>
            <TableCell className="text-center"></TableCell>
            <TableCell className="text-center text-slate-400 font-medium">100%</TableCell>
            <TableCell className={`text-center font-bold ${getScoreColor(total)}`}>
              {total.toFixed(2)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}