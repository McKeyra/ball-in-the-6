'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useSport } from '@/lib/athlete/sport-context';

const TEAM_TIERS = [
  { id: 'house', label: 'House League', icon: '\u{1F3E0}', color: '#84CC16', description: 'Recreational community leagues focused on participation and fun. All skill levels welcome.', teams: { basketball: [{ name: 'Toronto Community Basketball', type: 'Community', region: 'Toronto' }, { name: 'Scarborough House League', type: 'Recreation', region: 'Scarborough' }, { name: 'Mississauga Youth Basketball', type: 'Community', region: 'Mississauga' }, { name: 'Durham Region Rec League', type: 'Recreation', region: 'Durham' }], hockey: [{ name: 'Toronto House League Hockey', type: 'Community', region: 'Toronto' }, { name: 'North York Skating Club', type: 'Recreation', region: 'North York' }, { name: 'Etobicoke House League', type: 'Community', region: 'Etobicoke' }, { name: 'Brampton Minor Hockey', type: 'Recreation', region: 'Brampton' }] } },
  { id: 'regional', label: 'Regional / Rep', icon: '\u{1F3C5}', color: '#F59E0B', description: 'Competitive travel teams and rep programs. Tryout-based selection. More serious commitment.', teams: { basketball: [{ name: 'GTA Rising Stars', type: 'Travel', region: 'GTA' }, { name: 'Peel Region Elite', type: 'Rep', region: 'Peel' }, { name: 'York Region Wolverines', type: 'Travel', region: 'York' }, { name: 'Halton Hawks AAU', type: 'AAU', region: 'Halton' }], hockey: [{ name: 'Toronto Marlboros', type: 'AAA', region: 'Toronto' }, { name: 'Mississauga Rebels', type: 'AA', region: 'Mississauga' }, { name: 'Oakville Rangers', type: 'AA', region: 'Oakville' }, { name: 'Ajax-Pickering Raiders', type: 'AAA', region: 'Ajax' }] } },
  { id: 'provincial', label: 'Provincial', icon: '\u{1F3C6}', color: '#3B82F6', description: 'Provincial-level programs and teams. Highest level of amateur competition in your province.', teams: { basketball: [{ name: 'Ontario Basketball U16', type: 'Provincial', region: 'Ontario' }, { name: 'Basketball Ontario Development', type: 'Development', region: 'Ontario' }, { name: 'Team Ontario', type: 'Provincial', region: 'Ontario' }, { name: 'Ontario Scholastic Basketball', type: 'Scholastic', region: 'Ontario' }], hockey: [{ name: 'Ontario Hockey Federation', type: 'Provincial', region: 'Ontario' }, { name: 'Hockey Eastern Ontario', type: 'Provincial', region: 'Eastern Ontario' }, { name: 'Team Ontario U17', type: 'Development', region: 'Ontario' }, { name: 'Ontario Junior Hockey', type: 'Junior', region: 'Ontario' }] } },
  { id: 'national', label: 'National', icon: '\u{1F1E8}\u{1F1E6}', color: '#8B5CF6', description: 'National-level programs, university athletics, and professional development pathways.', teams: { basketball: [{ name: 'Canada Basketball', type: 'National', region: 'Canada' }, { name: 'USports Basketball', type: 'University', region: 'Canada' }, { name: 'CEBL (Canadian Elite)', type: 'Professional', region: 'Canada' }, { name: 'BioSteel All-Canadian', type: 'Showcase', region: 'Canada' }], hockey: [{ name: 'Hockey Canada', type: 'National', region: 'Canada' }, { name: 'USports Hockey', type: 'University', region: 'Canada' }, { name: 'OHL / QMJHL / WHL', type: 'Major Junior', region: 'Canada' }, { name: 'NHL Draft Prospects', type: 'Professional', region: 'North America' }] } },
];

export function FindTeamView(): React.ReactElement {
  const { sportConfig, activeSport } = useSport();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string | null>(null);

  const filteredTiers = useMemo(() => {
    return TEAM_TIERS.filter((tier) => !filterTier || tier.id === filterTier).map((tier) => {
      const teams = (tier.teams as unknown as Record<string, Array<{ name: string; type: string; region: string }>>)[activeSport] || tier.teams.basketball || [];
      const filtered = searchQuery
        ? teams.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.type.toLowerCase().includes(searchQuery.toLowerCase()) || t.region.toLowerCase().includes(searchQuery.toLowerCase()))
        : teams;
      return { ...tier, filteredTeams: filtered };
    });
  }, [activeSport, searchQuery, filterTier]);

  return (
    <div className="min-h-screen bg-neutral-950 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{'\u{1F50D}'}</span>
        <h1 className="text-2xl font-bold text-white">Find a Team</h1>
        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${sportConfig.color}20`, color: sportConfig.color }}>{sportConfig.name}</span>
      </div>
      <p className="text-neutral-400 text-sm">Browse teams across 4 tiers from house league to national. Find your next opportunity.</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500" placeholder="Search by name, type, or region..." />
        <div className="flex gap-2">
          <button onClick={() => setFilterTier(null)} className={cn('px-3 py-2 rounded-lg text-xs font-medium border transition-all', !filterTier ? 'bg-neutral-700 text-white border-neutral-600' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600')}>All</button>
          {TEAM_TIERS.map((tier) => (
            <button key={tier.id} onClick={() => setFilterTier(filterTier === tier.id ? null : tier.id)} className={cn('px-3 py-2 rounded-lg text-xs font-medium border transition-all', filterTier === tier.id ? 'text-white border-transparent' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600')} style={filterTier === tier.id ? { backgroundColor: `${tier.color}30`, borderColor: tier.color, color: tier.color } : undefined}>{tier.label}</button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredTiers.map((tier) => (
          <div key={tier.id} className="bg-neutral-900 border border-neutral-800 rounded-xl">
            <div className="p-5 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tier.icon}</span>
                <div>
                  <h3 className="text-white font-semibold">{tier.label}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{tier.description}</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              {tier.filteredTeams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tier.filteredTeams.map((team) => (
                    <div key={team.name} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50 hover:border-neutral-600 transition-all">
                      <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{team.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${tier.color}20`, color: tier.color }}>{team.type}</span>
                          <span className="text-xs text-neutral-500">{team.region}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-neutral-500">No teams match your search in this tier.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
