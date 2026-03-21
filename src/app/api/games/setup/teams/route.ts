import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const teams = await prisma.team.findMany({
    where: { sport: 'basketball' },
    include: {
      players: {
        select: { id: true, name: true, number: true, position: true },
        orderBy: { number: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  return Response.json(teams);
}
