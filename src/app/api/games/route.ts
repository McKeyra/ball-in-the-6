import { prisma } from '@/infrastructure/database';
import { success } from '@/lib/api-response';
import { GAMES } from '@/lib/mock-data';
import type { Game, GameLevel } from '@/types/index';

const VALID_LEVELS: GameLevel[] = ['pro', 'collegiate', 'highschool', 'elementary'];
const VALID_STATUSES = ['live', 'upcoming', 'final'] as const;
type GameStatusFilter = (typeof VALID_STATUSES)[number];

function formatGameTime(date: Date, status: string): string {
  if (status === 'final') return 'Final';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

interface PrismaGameWithTeams {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: string;
  level: string;
  sport: string;
  venue: string | null;
  time: Date;
  mvpName: string | null;
  mvpStats: string | null;
  mvpAvatar: string | null;
  impactScore: number | null;
  homeTeam: {
    name: string;
    logo: string | null;
    color: string | null;
    record: string | null;
  };
  awayTeam: {
    name: string;
    logo: string | null;
    color: string | null;
    record: string | null;
  };
}

function mapPrismaGameToResponse(game: PrismaGameWithTeams): Game {
  const mvp =
    game.mvpName && game.mvpStats && game.mvpAvatar
      ? { name: game.mvpName, stats: game.mvpStats, avatar: game.mvpAvatar }
      : undefined;

  return {
    id: game.id,
    teamA: {
      name: game.homeTeam.name,
      score: game.homeScore,
      logo: game.homeTeam.logo ?? '',
      record: game.homeTeam.record ?? '0-0',
      color: game.homeTeam.color ?? '#6b7280',
    },
    teamB: {
      name: game.awayTeam.name,
      score: game.awayScore,
      logo: game.awayTeam.logo ?? '',
      record: game.awayTeam.record ?? '0-0',
      color: game.awayTeam.color ?? '#6b7280',
    },
    status: game.status as Game['status'],
    level: game.level as GameLevel,
    venue: game.venue ?? '',
    time: formatGameTime(game.time, game.status),
    mvp,
    impactScore: game.impactScore ?? undefined,
  };
}

async function fetchGamesFromDb(
  level: string | null,
  status: string | null,
  sport: string | null,
): Promise<Game[]> {
  const where: Record<string, unknown> = {};

  if (level && VALID_LEVELS.includes(level as GameLevel)) {
    where.level = level;
  }
  if (status && VALID_STATUSES.includes(status as GameStatusFilter)) {
    where.status = status;
  }
  if (sport) {
    where.sport = { equals: sport, mode: 'insensitive' };
  }

  const games = await prisma.game.findMany({
    where,
    include: {
      homeTeam: {
        select: { name: true, logo: true, color: true, record: true },
      },
      awayTeam: {
        select: { name: true, logo: true, color: true, record: true },
      },
    },
    orderBy: { time: 'desc' },
  });

  return games.map(mapPrismaGameToResponse);
}

function fetchGamesFromMock(level: string | null, status: string | null, _sport: string | null): Game[] {
  let filtered = [...GAMES];

  if (level && VALID_LEVELS.includes(level as GameLevel)) {
    filtered = filtered.filter((g) => g.level === level);
  }

  if (status && VALID_STATUSES.includes(status as GameStatusFilter)) {
    filtered = filtered.filter((g) => g.status === status);
  }

  return filtered;
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);

  const levelParam = searchParams.get('level');
  const statusParam = searchParams.get('status');
  const sportParam = searchParams.get('sport');

  let games: Game[];

  try {
    games = await fetchGamesFromDb(levelParam, statusParam, sportParam);
  } catch {
    // Database not connected or query failed — fall back to mock data
    games = fetchGamesFromMock(levelParam, statusParam, sportParam);
  }

  return success(games, {
    total: games.length,
    filters: {
      level: levelParam ?? 'all',
      status: statusParam ?? 'all',
      sport: sportParam ?? 'all',
    },
  });
}
