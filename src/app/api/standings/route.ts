import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, badRequest } from '@/lib/api-response';

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const sport = searchParams.get('sport');
  const season = searchParams.get('season');
  const conference = searchParams.get('conference');
  const division = searchParams.get('division');

  if (!sport) {
    return badRequest('sport query parameter is required');
  }
  if (!season) {
    return badRequest('season query parameter is required');
  }

  try {
    const where: Record<string, unknown> = {
      sport: { equals: sport, mode: 'insensitive' },
      season,
    };

    if (conference) {
      where.conference = { equals: conference, mode: 'insensitive' };
    }
    if (division) {
      where.division = { equals: division, mode: 'insensitive' };
    }

    const standings = await prisma.standing.findMany({
      where,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            logo: true,
            color: true,
            league: true,
            division: true,
          },
        },
      },
      orderBy: [
        { winPct: 'desc' },
        { wins: 'desc' },
        { points: 'desc' },
      ],
    });

    const data = standings.map((s, index) => ({
      rank: index + 1,
      teamId: s.teamId,
      team: s.team,
      sport: s.sport,
      season: s.season,
      conference: s.conference,
      division: s.division,
      wins: s.wins,
      losses: s.losses,
      ties: s.ties,
      points: s.points,
      winPct: s.winPct,
      streak: s.streak,
      lastTen: s.lastTen,
      gamesPlayed: s.wins + s.losses + s.ties,
    }));

    return success(data, {
      total: data.length,
      sport,
      season,
      conference: conference ?? 'all',
      division: division ?? 'all',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch standings';
    return error(message, 500, 'FETCH_FAILED');
  }
}
