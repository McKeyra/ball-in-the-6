import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function seed(): Promise<void> {
  console.log('Seeding Ball in the 6 database...');

  // ─── Sport Configs ─────────────────────────────────────────────────────────
  const sports = [
    {
      id: 'basketball',
      name: 'Basketball',
      icon: 'basketball',
      positions: ['PG', 'SG', 'SF', 'PF', 'C'],
      statCategories: ['PPG', 'RPG', 'APG', 'SPG', 'BPG', 'FG%', '3P%', 'FT%'],
      scoringSystem: { pointsPerBasket: 2, threePointer: 3, freeThrow: 1 },
      periods: { count: 4, duration: 12, name: 'Quarter', overtime: 5 },
      conferences: ['Eastern', 'Western'],
      divisions: ['Atlantic', 'Central', 'Southeast', 'Northwest', 'Pacific', 'Southwest'],
    },
    {
      id: 'soccer',
      name: 'Soccer',
      icon: 'soccer',
      positions: ['GK', 'LB', 'CB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'],
      statCategories: ['Goals', 'Assists', 'Shots', 'Pass%', 'Tackles', 'Saves'],
      scoringSystem: { goal: 1 },
      periods: { count: 2, duration: 45, name: 'Half', overtime: 15 },
      conferences: ['East', 'West'],
      divisions: ['North', 'South', 'Central'],
    },
    {
      id: 'hockey',
      name: 'Hockey',
      icon: 'hockey',
      positions: ['C', 'LW', 'RW', 'LD', 'RD', 'G'],
      statCategories: ['Goals', 'Assists', 'Points', '+/-', 'PIM', 'SOG', 'SV%'],
      scoringSystem: { goal: 1 },
      periods: { count: 3, duration: 20, name: 'Period', overtime: 5 },
      conferences: ['Eastern', 'Western'],
      divisions: ['Atlantic', 'Metropolitan', 'Central', 'Pacific'],
    },
    {
      id: 'football',
      name: 'Football',
      icon: 'football',
      positions: ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P'],
      statCategories: ['PassYds', 'RushYds', 'RecYds', 'TD', 'INT', 'Sacks', 'FG'],
      scoringSystem: { touchdown: 6, fieldGoal: 3, extraPoint: 1, twoPoint: 2, safety: 2 },
      periods: { count: 4, duration: 15, name: 'Quarter', overtime: 10 },
      conferences: ['AFC', 'NFC'],
      divisions: ['North', 'South', 'East', 'West'],
    },
  ];

  for (const sport of sports) {
    await prisma.sportConfig.upsert({
      where: { id: sport.id },
      update: sport,
      create: sport,
    });
  }
  console.log(`  Seeded ${sports.length} sport configs`);

  // ─── Courts ────────────────────────────────────────────────────────────────
  const courts = [
    { name: 'Christie Pits Courts', area: 'Downtown', address: '750 Bloor St W, Toronto', type: 'outdoor', courts: 2, activePlayers: 12, hot: true, rating: 4.5, lat: 43.6644, lng: -79.4208 },
    { name: 'Regent Park Community Centre', area: 'Downtown East', address: '402 Shuter St, Toronto', type: 'indoor', courts: 1, activePlayers: 8, hot: false, rating: 4.2, lat: 43.6593, lng: -79.3614 },
    { name: 'Scarborough Town Centre Courts', area: 'Scarborough', address: '300 Borough Dr, Scarborough', type: 'outdoor', courts: 3, activePlayers: 18, hot: true, rating: 4.0, lat: 43.7735, lng: -79.2578 },
    { name: 'Downsview Park', area: 'North York', address: '35 Carl Hall Rd, Toronto', type: 'outdoor', courts: 2, activePlayers: 6, hot: false, rating: 3.8, lat: 43.7529, lng: -79.4653 },
    { name: 'Mattamy Athletic Centre', area: 'Downtown', address: '50 Carlton St, Toronto', type: 'indoor', courts: 4, activePlayers: 24, hot: true, rating: 4.8, lat: 43.6622, lng: -79.3791 },
    { name: 'Malvern Community Centre', area: 'Scarborough', address: '30 Sewells Rd, Scarborough', type: 'indoor', courts: 2, activePlayers: 10, hot: false, rating: 4.1, lat: 43.8066, lng: -79.2218 },
  ];

  for (const court of courts) {
    await prisma.court.create({ data: court });
  }
  console.log(`  Seeded ${courts.length} courts`);

  // ─── Teams ─────────────────────────────────────────────────────────────────
  const teams = [
    { name: 'B6 Originals', sport: 'basketball', color: '#C8FF00', league: 'Toronto Community League', division: 'East' },
    { name: 'B.M.T. Titans', sport: 'basketball', color: '#6B21A8', league: 'Toronto Community League', division: 'West' },
    { name: 'Northside Kings', sport: 'basketball', color: '#DC2626', league: 'Toronto Community League', division: 'East' },
    { name: 'Scarborough Shooters', sport: 'basketball', color: '#059669', league: 'Toronto Community League', division: 'Central' },
    { name: 'Etobicoke Thunder', sport: 'basketball', color: '#2563EB', league: 'Toronto Community League', division: 'West' },
    { name: 'FC Parkdale', sport: 'soccer', color: '#EF4444', league: 'Toronto Soccer League', division: 'Central' },
    { name: 'North York United', sport: 'soccer', color: '#10B981', league: 'Toronto Soccer League', division: 'North' },
    { name: 'Vaughan FC', sport: 'soccer', color: '#F59E0B', league: 'Toronto Soccer League', division: 'North' },
  ];

  const createdTeams: Record<string, string> = {};
  for (const team of teams) {
    const t = await prisma.team.create({ data: team });
    createdTeams[team.name] = t.id;
  }
  console.log(`  Seeded ${teams.length} teams`);

  // ─── Games ─────────────────────────────────────────────────────────────────
  const now = new Date();
  const games = [
    { homeTeamId: createdTeams['B6 Originals'], awayTeamId: createdTeams['B.M.T. Titans'], homeScore: 88, awayScore: 82, status: 'final', level: 'pro', sport: 'basketball', venue: 'Mattamy Athletic Centre', time: new Date(now.getTime() - 86400000), impactScore: 92 },
    { homeTeamId: createdTeams['Northside Kings'], awayTeamId: createdTeams['Scarborough Shooters'], homeScore: 0, awayScore: 0, status: 'upcoming', level: 'highschool', sport: 'basketball', venue: 'Regent Park Community Centre', time: new Date(now.getTime() + 86400000 * 2) },
    { homeTeamId: createdTeams['FC Parkdale'], awayTeamId: createdTeams['North York United'], homeScore: 2, awayScore: 1, status: 'live', level: 'pro', sport: 'soccer', venue: 'BMO Field', time: now, impactScore: 78 },
    { homeTeamId: createdTeams['Etobicoke Thunder'], awayTeamId: createdTeams['B6 Originals'], homeScore: 0, awayScore: 0, status: 'upcoming', level: 'collegiate', sport: 'basketball', venue: 'Downsview Park', time: new Date(now.getTime() + 86400000 * 5) },
  ];

  for (const game of games) {
    await prisma.game.create({ data: game });
  }
  console.log(`  Seeded ${games.length} games`);

  console.log('Seed completed successfully!');
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
