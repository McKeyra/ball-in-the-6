import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';

export async function POST(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const body = (await request.json()) as {
    homeTeamId: string;
    awayTeamId: string;
    venue?: string;
    quarterLength?: number;
    overtimeLength?: number;
    shotClockSec?: number;
    timeoutsPerHalf?: number;
    foulOutLimit?: number;
  };

  const { homeTeamId, awayTeamId } = body;
  if (!homeTeamId || !awayTeamId) {
    return Response.json({ error: 'MISSING_TEAMS', message: 'Both teams required' }, { status: 400 });
  }

  const quarterLength = body.quarterLength ?? 10;
  const gameClock = quarterLength * 60;

  const game = await prisma.game.create({
    data: {
      homeTeamId,
      awayTeamId,
      status: 'live',
      level: 'pro',
      sport: 'basketball',
      venue: body.venue ?? '',
      time: new Date(),
      quarter: 1,
      gameClock,
      shotClock: body.shotClockSec ?? 24,
      quarterLength,
      overtimeLength: body.overtimeLength ?? 5,
      shotClockSec: body.shotClockSec ?? 24,
      timeoutsHome: body.timeoutsPerHalf ?? 2,
      timeoutsAway: body.timeoutsPerHalf ?? 2,
      foulOutLimit: body.foulOutLimit ?? 5,
    },
    include: { homeTeam: true, awayTeam: true },
  });

  // Create PlayerStat rows for all roster players on both teams
  const [homePlayers, awayPlayers] = await Promise.all([
    prisma.player.findMany({ where: { teamId: homeTeamId } }),
    prisma.player.findMany({ where: { teamId: awayTeamId } }),
  ]);

  const statRows = [
    ...homePlayers.map((p) => ({ gameId: game.id, playerId: p.id, teamSide: 'home' })),
    ...awayPlayers.map((p) => ({ gameId: game.id, playerId: p.id, teamSide: 'away' })),
  ];

  if (statRows.length > 0) {
    await prisma.playerStat.createMany({ data: statRows });
  }

  return Response.json(game, { status: 201 });
}
