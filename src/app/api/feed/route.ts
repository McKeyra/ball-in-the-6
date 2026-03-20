import { prisma } from '@/infrastructure/database';
import { FEED_DATA } from '@/lib/mock-data';
import type { FeedPost, PostAuthor } from '@/types/index';

const VALID_FILTERS = ['for-you', 'plays', 'games', 'courts', 'trending'] as const;
type FeedFilterParam = (typeof VALID_FILTERS)[number];

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const PLAY_TYPES = ['play', 'fullwidth', 'nobleed', 'headerfill', 'slider'] as const;

/** Map a filter to a Prisma `where` clause for the posts table. */
function buildWhereClause(filter: FeedFilterParam): Record<string, unknown> {
  switch (filter) {
    case 'plays':
      return { type: { in: [...PLAY_TYPES] } };
    case 'games':
      return { type: 'game' };
    case 'courts':
      return {
        OR: [
          { caption: { contains: 'court', mode: 'insensitive' } },
          { caption: { contains: 'park', mode: 'insensitive' } },
        ],
      };
    case 'trending':
    case 'for-you':
    default:
      return {};
  }
}

/** Map a filter to a Prisma `orderBy` clause. */
function buildOrderBy(filter: FeedFilterParam): Record<string, string>[] {
  if (filter === 'trending') {
    return [{ score: 'desc' }, { createdAt: 'desc' }];
  }
  return [{ createdAt: 'desc' }];
}

/** Format a Date into a relative-time string (e.g. "2h ago"). */
function relativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Transform a Prisma post row (with author->profile join and optional game
 * relation) into the FeedPost shape the client expects.
 */
function mapDbPostToFeedPost(row: {
  id: string;
  type: string;
  caption: string | null;
  imageUrl: string | null;
  imageUrls: string[];
  score: number;
  assists: number;
  drops: number;
  commentCount: number;
  createdAt: Date;
  author: {
    profile: {
      displayName: string;
      handle: string;
      avatar: string | null;
      verified: boolean;
    } | null;
  };
  game: {
    homeTeam: { name: string; logo: string | null; record: string | null; color: string | null };
    awayTeam: { name: string; logo: string | null; record: string | null; color: string | null };
    homeScore: number;
    awayScore: number;
    status: string;
    venue: string | null;
    mvpName: string | null;
    mvpStats: string | null;
    mvpAvatar: string | null;
    impactScore: number | null;
  } | null;
}): FeedPost {
  const profile = row.author.profile;
  const timestamp = relativeTime(row.createdAt);

  // Game-type posts use a different shape (no author, teams instead)
  if (row.type === 'game' && row.game) {
    const g = row.game;
    return {
      id: row.id,
      type: 'game',
      teamA: {
        name: g.homeTeam.name,
        score: g.homeScore,
        logo: g.homeTeam.logo ?? '',
        record: g.homeTeam.record ?? '',
        color: g.homeTeam.color ?? 'from-gray-500 to-gray-700',
      },
      teamB: {
        name: g.awayTeam.name,
        score: g.awayScore,
        logo: g.awayTeam.logo ?? '',
        record: g.awayTeam.record ?? '',
        color: g.awayTeam.color ?? 'from-gray-500 to-gray-700',
      },
      gameStatus: g.status,
      venue: g.venue ?? '',
      mvp: {
        name: g.mvpName ?? '',
        stats: g.mvpStats ?? '',
        avatar: g.mvpAvatar ?? '',
      },
      impactScore: g.impactScore ?? 0,
    };
  }

  const author: PostAuthor = {
    username: profile?.displayName ?? 'Unknown',
    handle: profile ? `@${profile.handle}` : '@unknown',
    avatarUrl: profile?.avatar ?? '',
    verified: profile?.verified ?? false,
  };

  const base = {
    id: row.id,
    author,
    caption: row.caption ?? '',
    score: row.score,
    assists: row.assists,
    timestamp,
  };

  switch (row.type) {
    case 'slider':
      return { ...base, type: 'slider', imageUrls: row.imageUrls, drops: row.drops };
    case 'headerfill':
      return { ...base, type: 'headerfill', imageUrl: row.imageUrl ?? '', drops: row.drops };
    case 'nobleed':
      return { ...base, type: 'nobleed', imageUrl: row.imageUrl ?? '', commentCount: row.commentCount };
    case 'fullwidth':
      return { ...base, type: 'fullwidth', imageUrl: row.imageUrl ?? '' };
    case 'play':
    default:
      return { ...base, type: 'play', imageUrl: row.imageUrl ?? '' };
  }
}

/** Fetch feed from Prisma. Returns null when the database is unreachable. */
async function fetchFromDatabase(
  filter: FeedFilterParam,
  page: number,
  limit: number,
): Promise<{ data: FeedPost[]; total: number } | null> {
  try {
    const where = buildWhereClause(filter);
    const orderBy = buildOrderBy(filter);
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            include: {
              profile: {
                select: {
                  displayName: true,
                  handle: true,
                  avatar: true,
                  verified: true,
                },
              },
            },
          },
          game: {
            include: {
              homeTeam: { select: { name: true, logo: true, record: true, color: true } },
              awayTeam: { select: { name: true, logo: true, record: true, color: true } },
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    const data = rows.map(mapDbPostToFeedPost);
    return { data, total };
  } catch (error: unknown) {
    // Log the connection/query error but don't crash — fall back to mock data
    if (process.env.NODE_ENV === 'development') {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[feed] Prisma query failed, falling back to mock data: ${message}`);
    }
    return null;
  }
}

// ─── Mock data fallback ──────────────────────────────────────────────────────

function filterMockFeed(posts: FeedPost[], filter: FeedFilterParam): FeedPost[] {
  switch (filter) {
    case 'plays':
      return posts.filter(
        (p) =>
          p.type === 'play' ||
          p.type === 'fullwidth' ||
          p.type === 'nobleed' ||
          p.type === 'headerfill' ||
          p.type === 'slider',
      );
    case 'games':
      return posts.filter((p) => p.type === 'game');
    case 'courts':
      return posts.filter((p) => {
        if ('caption' in p) {
          const caption = (p as { caption: string }).caption.toLowerCase();
          return caption.includes('court') || caption.includes('park');
        }
        return false;
      });
    case 'trending':
      return [...posts].sort((a, b) => {
        const scoreA = 'score' in a ? a.score : (a as { impactScore?: number }).impactScore ?? 0;
        const scoreB = 'score' in b ? b.score : (b as { impactScore?: number }).impactScore ?? 0;
        return scoreB - scoreA;
      });
    case 'for-you':
    default:
      return posts;
  }
}

function fetchFromMockData(
  filter: FeedFilterParam,
  page: number,
  limit: number,
): { data: FeedPost[]; total: number } {
  const filtered = filterMockFeed(FEED_DATA, filter);
  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  return { data, total };
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);

  const filterParam = searchParams.get('filter') ?? 'for-you';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
  );

  const filter: FeedFilterParam = VALID_FILTERS.includes(filterParam as FeedFilterParam)
    ? (filterParam as FeedFilterParam)
    : 'for-you';

  // Try Prisma first, fall back to mock data on connection failure
  const result = (await fetchFromDatabase(filter, page, limit)) ?? fetchFromMockData(filter, page, limit);

  const { data, total } = result;
  const totalPages = Math.ceil(total / limit);

  return Response.json({
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      filter,
    },
  });
}
