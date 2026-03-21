import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';

// POST /api/games/events — create a game event
export async function POST(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const body = (await request.json()) as {
    gameId: string;
    type: string;
    description: string;
    quarter: number;
    gameClock: number;
    teamSide?: string;
    playerName?: string;
    points?: number;
  };

  const { gameId, type, description, quarter, gameClock, teamSide, playerName, points } = body;
  if (!gameId || !type || !description) {
    return Response.json({ error: 'MISSING_FIELDS' }, { status: 400 });
  }

  const event = await prisma.gameEvent.create({
    data: {
      gameId,
      type,
      description,
      quarter,
      gameClock,
      teamSide: teamSide ?? null,
      playerName: playerName ?? null,
      points: points ?? null,
    },
  });

  return Response.json(event, { status: 201 });
}
