import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';

// GET /api/games/live?id=<gameId> — get full live game state
export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('id');

  if (!gameId) {
    // Return all live games
    const liveGames = await prisma.game.findMany({
      where: { status: 'live', sport: 'basketball' },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { createdAt: 'desc' },
    });
    return Response.json(liveGames);
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      homeTeam: { include: { players: true } },
      awayTeam: { include: { players: true } },
      playerStats: { include: { player: true } },
      gameEvents: { orderBy: { createdAt: 'desc' }, take: 50 },
    },
  });

  if (!game) {
    return Response.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  return Response.json(game);
}

// PATCH /api/games/live — update game state (clock, quarter, score)
export async function PATCH(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const body = (await request.json()) as {
    gameId: string;
    gameClock?: number;
    shotClock?: number;
    quarter?: number;
    homeScore?: number;
    awayScore?: number;
    status?: string;
    timeoutsHome?: number;
    timeoutsAway?: number;
  };

  const { gameId, ...updates } = body;
  if (!gameId) {
    return Response.json({ error: 'MISSING_GAME_ID' }, { status: 400 });
  }

  const game = await prisma.game.update({
    where: { id: gameId },
    data: updates,
    include: { homeTeam: true, awayTeam: true },
  });

  return Response.json(game);
}
