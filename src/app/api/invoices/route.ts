import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { paginated, parsePageParams } from '@/lib/api-response';
import { ALL_INVOICES, ALL_REGISTRATIONS } from '@/lib/programs-data';
import type { InvoiceStatus } from '@/types/programs';

const VALID_STATUSES: InvoiceStatus[] = ['pending', 'paid', 'overdue'];

// ─── GET /api/invoices ──────────────────────────────────────────────────────

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const userId = auth.user.sub;
  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePageParams(searchParams);
  const statusParam = searchParams.get('status');

  const statusFilter = statusParam && VALID_STATUSES.includes(statusParam as InvoiceStatus)
    ? (statusParam as InvoiceStatus)
    : undefined;

  try {
    const where: Record<string, unknown> = { userId };
    if (statusFilter) {
      where.status = statusFilter;
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          registration: {
            include: {
              program: true,
            },
          },
        },
        orderBy: { dueDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return paginated(invoices, {
      page,
      limit,
      total,
      ...(statusFilter && { filter: statusFilter }),
    });
  } catch {
    // Database not connected — fall back to mock data

    // Find registrations belonging to this user (as player or parent)
    const userRegistrationIds = ALL_REGISTRATIONS
      .filter((r) => r.playerId === userId || r.parentId === userId)
      .map((r) => r.id);

    let filtered = ALL_INVOICES.filter((inv) =>
      userRegistrationIds.includes(inv.registrationId),
    );

    if (statusFilter) {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    // Sort by due date ascending
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    // Enrich with registration/program data
    const enriched = paged.map((inv) => {
      const registration = ALL_REGISTRATIONS.find((r) => r.id === inv.registrationId) ?? null;
      return { ...inv, registration };
    });

    return paginated(enriched, {
      page,
      limit,
      total,
      ...(statusFilter && { filter: statusFilter }),
    });
  }
}
