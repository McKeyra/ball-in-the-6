import { COURTS } from '@/lib/mock-data';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();

  let filtered = [...COURTS];

  if (search) {
    filtered = filtered.filter(
      (court) =>
        court.name.toLowerCase().includes(search) ||
        court.area.toLowerCase().includes(search) ||
        court.address.toLowerCase().includes(search),
    );
  }

  return Response.json({
    data: filtered,
    meta: {
      total: filtered.length,
      search: search ?? null,
    },
  });
}
