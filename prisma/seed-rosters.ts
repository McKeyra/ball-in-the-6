import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seed(): Promise<void> {
  const existingPlayers = await prisma.player.count();
  if (existingPlayers > 0) {
    console.log(`Players already exist: ${existingPlayers}`);
    await prisma.$disconnect();
    return;
  }

  let teams = await prisma.team.findMany({ where: { sport: 'basketball' } });
  console.log(`Basketball teams found: ${teams.length}`);

  if (teams.length < 2) {
    console.log('Creating basketball teams...');
    const t1 = await prisma.team.create({
      data: { name: 'B.M.T. Titans', color: '#c8ff00', sport: 'basketball', league: 'Toronto Pro-Am', division: 'East', record: '0-0' },
    });
    const t2 = await prisma.team.create({
      data: { name: 'Scarborough Elite', color: '#ef4444', sport: 'basketball', league: 'Toronto Pro-Am', division: 'East', record: '0-0' },
    });
    teams = [...teams, t1, t2];
  }

  const roster1 = [
    { name: 'Marcus Johnson', number: 1, position: 'PG' },
    { name: 'Tyrese Williams', number: 3, position: 'SG' },
    { name: 'DeAndre Mitchell', number: 7, position: 'SF' },
    { name: 'Jalen Brooks', number: 12, position: 'PF' },
    { name: 'Amir Hassan', number: 34, position: 'C' },
    { name: 'Chris Baptiste', number: 5, position: 'PG' },
    { name: 'Devon Clarke', number: 11, position: 'SG' },
    { name: 'Isaiah Thompson', number: 22, position: 'SF' },
    { name: 'Andre Lewis', number: 44, position: 'PF' },
    { name: 'Kwame Mensah', number: 50, position: 'C' },
  ];

  const roster2 = [
    { name: 'Jamal Crawford Jr', number: 2, position: 'PG' },
    { name: 'Malik Robertson', number: 4, position: 'SG' },
    { name: 'Damian Price', number: 10, position: 'SF' },
    { name: 'Trevor Booker', number: 15, position: 'PF' },
    { name: 'Hassan Whiteside Jr', number: 33, position: 'C' },
    { name: 'Kyle Lowry III', number: 7, position: 'PG' },
    { name: 'Terrence Ross Jr', number: 21, position: 'SG' },
    { name: 'Pascal Smith', number: 43, position: 'SF' },
    { name: 'OG Barrett', number: 8, position: 'PF' },
    { name: 'Chris Boucher Jr', number: 25, position: 'C' },
  ];

  for (let i = 0; i < roster1.length; i++) {
    await prisma.player.create({
      data: { ...roster1[i], teamId: teams[0].id, onCourt: i < 5 },
    });
  }
  for (let i = 0; i < roster2.length; i++) {
    await prisma.player.create({
      data: { ...roster2[i], teamId: teams[1].id, onCourt: i < 5 },
    });
  }

  console.log('Seeded 20 players across 2 teams');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
