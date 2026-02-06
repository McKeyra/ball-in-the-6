import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, CheckCircle } from "lucide-react";

export default function CleanupDuplicates() {
  const queryClient = useQueryClient();
  const [removing, setRemoving] = useState(false);
  const [result, setResult] = useState(null);

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => base44.entities.Team.list(),
    refetchOnWindowFocus: true,
  });

  const findDuplicates = () => {
    const seen = new Map();
    const duplicates = [];

    teams.forEach(team => {
      const key = `${team.team_name}_${team.division}_${team.league}`;
      if (seen.has(key)) {
        duplicates.push({
          original: seen.get(key),
          duplicate: team
        });
      } else {
        seen.set(key, team);
      }
    });

    return duplicates;
  };

  const handleRemoveDuplicates = async () => {
    setRemoving(true);
    setResult(null);

    try {
      const duplicates = findDuplicates();
      
      if (duplicates.length === 0) {
        setResult({ success: true, message: 'No duplicates found!', count: 0 });
        setRemoving(false);
        return;
      }

      for (const dup of duplicates) {
        await base44.entities.Team.delete(dup.duplicate.id);
      }

      await queryClient.invalidateQueries(['teams']);
      setResult({ 
        success: true, 
        message: `Successfully removed ${duplicates.length} duplicate teams!`,
        count: duplicates.length 
      });
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Error: ${error.message}` 
      });
    } finally {
      setRemoving(false);
    }
  };

  const duplicates = findDuplicates();

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">Cleanup Duplicate Teams</h1>
          <p className="text-white/60">Remove duplicate team entries from the database</p>
        </div>

        <div 
          className="p-6 rounded-3xl mb-6"
          style={{
            background: '#0f0f0f',
            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-white/60">Total Teams</div>
              <div className="text-3xl font-bold text-white/90">{teams.length}</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Duplicates Found</div>
              <div className="text-3xl font-bold text-red-600">{duplicates.length}</div>
            </div>
          </div>

          {duplicates.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="text-sm font-semibold text-white/70 mb-2">Duplicate Teams:</div>
              {duplicates.slice(0, 10).map((dup, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl text-sm"
                  style={{
                    background: '#0f0f0f',
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.1), -2px -2px 4px rgba(255,255,255,0.7)'
                  }}
                >
                  <div className="font-semibold text-white/90">{dup.duplicate.team_name}</div>
                  <div className="text-xs text-white/40">{dup.duplicate.league} • {dup.duplicate.division}</div>
                </div>
              ))}
              {duplicates.length > 10 && (
                <div className="text-xs text-white/40 text-center pt-2">
                  ...and {duplicates.length - 10} more
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleRemoveDuplicates}
            disabled={removing || duplicates.length === 0}
            className="w-full h-12 font-semibold"
            style={{
              background: duplicates.length > 0 ? '#ef4444' : '#9ca3af',
              color: 'white',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            {removing ? 'Removing...' : `Remove ${duplicates.length} Duplicate${duplicates.length !== 1 ? 's' : ''}`}
          </Button>
        </div>

        {result && (
          <div 
            className="p-6 rounded-3xl flex items-center gap-4"
            style={{
              background: result.success ? '#10b98120' : '#ef444420',
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.05)',
              border: `2px solid ${result.success ? '#10b981' : '#ef4444'}`
            }}
          >
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-white/90">{result.message}</div>
              {result.count > 0 && (
                <div className="text-sm text-white/60 mt-1">
                  Database has been cleaned. Refresh to see updated counts.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}