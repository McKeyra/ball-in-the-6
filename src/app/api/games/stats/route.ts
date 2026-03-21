import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';

// PATCH /api/games/stats — increment a player stat
export async function PATCH(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const body = (await request.json()) as {
    gameId: string;
    playerId: string;
    stat: string;
    delta: number;  // +1 or -1
  };

  const { gameId, playerId, stat, delta } = body;
  if (!gameId || !playerId || !stat) {
    return Response.json({ error: 'MISSING_FIELDS' }, { status: 400 });
  }

  const VALID_STATS = [
    'points', 'fgMade', 'fgAttempts', 'threeMade', 'threeAttempts',
    'ftMade', 'ftAttempts', 'offRebounds', 'defRebounds',
    'assists', 'steals', 'blocks', 'turnovers', 'fouls', 'minutes',
  ] as const;

  if (!VALID_STATS.includes(stat as typeof VALID_STATS[number])) {
    return Response.json({ error: 'INVALID_STAT', message: `Unknown stat: ${stat}` }, { status: 400 });
  }

  const updated = await prisma.playerStat.update({
    where: { gameId_playerId: { gameId, playerId } },
    data: { [stat]: { increment: delta } },
    include: { player: true },
  });

  // Auto-update game score when points change
  if (stat === 'points' || stat === 'fgMade' || stat === 'threeMade' || stat === 'ftMade') {
    const allStats = await prisma.playerStat.findMany({ where: { gameId } });
    const homeTotal = allStats.filter((s) => s.teamSide === 'home').reduce((sum, s) => sum + s.points, 0);
    const awayTotal = allStats.filter((s) => s.teamSide === 'away').reduce((sum, s) => sum + s.points, 0);
    await prisma.game.update({
      where: { id: gameId },
      data: { homeScore: homeTotal, awayScore: awayTotal },
    });
  }

  return Response.json(updated);
}
