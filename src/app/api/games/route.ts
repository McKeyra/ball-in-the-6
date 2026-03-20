import { GAMES } from '@/lib/mock-data';
import type { GameLevel } from '@/types/index';

const VALID_LEVELS: GameLevel[] = ['pro', 'collegiate', 'highschool', 'elementary'];
const VALID_STATUSES = ['live', 'upcoming', 'final'] as const;
type GameStatusFilter = (typeof VALID_STATUSES)[number];

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);

  const levelParam = searchParams.get('level');
  const statusParam = searchParams.get('status');

  let filtered = [...GAMES];

  if (levelParam && VALID_LEVELS.includes(levelParam as GameLevel)) {
    filtered = filtered.filter((g) => g.level === levelParam);
  }

  if (statusParam && VALID_STATUSES.includes(statusParam as GameStatusFilter)) {
    filtered = filtered.filter((g) => g.status === statusParam);
  }

  return Response.json({
    data: filtered,
    meta: {
      total: filtered.length,
      filters: {
        level: levelParam ?? 'all',
        status: statusParam ?? 'all',
      },
    },
  });
}
