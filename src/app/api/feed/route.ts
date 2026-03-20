import { FEED_DATA } from '@/lib/mock-data';
import type { FeedPost } from '@/types/index';

const VALID_FILTERS = ['for-you', 'plays', 'games', 'courts', 'trending'] as const;
type FeedFilterParam = (typeof VALID_FILTERS)[number];

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function filterFeed(posts: FeedPost[], filter: FeedFilterParam): FeedPost[] {
  switch (filter) {
    case 'plays':
      return posts.filter((p) => p.type === 'play' || p.type === 'fullwidth' || p.type === 'nobleed' || p.type === 'headerfill' || p.type === 'slider');
    case 'games':
      return posts.filter((p) => p.type === 'game');
    case 'courts':
      return posts.filter((p) => {
        if ('caption' in p) {
          return p.caption.toLowerCase().includes('court') || p.caption.toLowerCase().includes('park');
        }
        return false;
      });
    case 'trending':
      return [...posts].sort((a, b) => {
        const scoreA = 'score' in a ? a.score : a.impactScore ?? 0;
        const scoreB = 'score' in b ? b.score : b.impactScore ?? 0;
        return scoreB - scoreA;
      });
    case 'for-you':
    default:
      return posts;
  }
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);

  const filterParam = searchParams.get('filter') ?? 'for-you';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT));

  const filter = VALID_FILTERS.includes(filterParam as FeedFilterParam)
    ? (filterParam as FeedFilterParam)
    : 'for-you';

  const filtered = filterFeed(FEED_DATA, filter);
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = filtered.slice(start, end);

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
