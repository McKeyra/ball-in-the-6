import { prisma } from '@/infrastructure/database';
import { success } from '@/lib/api-response';
import { COURTS } from '@/lib/mock-data';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();

  try {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { area: { contains: search, mode: 'insensitive' as const } },
            { address: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const courts = await prisma.court.findMany({ where });

    return success(courts, {
      total: courts.length,
      search: search ?? null,
      source: 'database',
    });
  } catch {
    // Database not connected — fall back to mock data
    let filtered = [...COURTS];

    if (search) {
      filtered = filtered.filter(
        (court) =>
          court.name.toLowerCase().includes(search) ||
          court.area.toLowerCase().includes(search) ||
          court.address.toLowerCase().includes(search),
      );
    }

    return success(filtered, {
      total: filtered.length,
      search: search ?? null,
      source: 'mock',
    });
  }
}
