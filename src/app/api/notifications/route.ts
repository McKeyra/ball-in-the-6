import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { paginated, error, parsePageParams } from '@/lib/api-response';

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { user } = auth;
  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePageParams(searchParams);
  const unreadParam = searchParams.get('unread');

  const unreadFilter = unreadParam === 'true'
    ? { read: false }
    : unreadParam === 'false'
      ? { read: true }
      : {};

  try {
    const where = {
      userId: user.userId,
      ...unreadFilter,
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    const formatted = notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: n.read,
      data: n.data,
      createdAt: n.createdAt.toISOString(),
    }));

    return paginated(formatted, { page, limit, total });
  } catch {
    // DB not connected — return empty paginated result
    return paginated([], { page, limit, total: 0 });
  }
}
