import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, badRequest } from '@/lib/api-response';
import { sendWebhookSafe } from '@/infrastructure/n8n';
import { ALL_REGISTRATIONS, ALL_PROGRAMS, ALL_INVOICES } from '@/lib/programs-data';
import type { PaymentPlan } from '@/types/programs';

// ─── GET /api/registrations ─────────────────────────────────────────────────

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const userId = auth.user.userId;

  try {
    const registrations = await prisma.registration.findMany({
      where: {
        OR: [{ playerId: userId }, { parentId: userId }],
      },
      include: {
        program: true,
        invoices: true,
      },
      orderBy: { registeredAt: 'desc' },
    });

    return success(registrations, {
      total: registrations.length,
      source: 'database',
    });
  } catch {
    // Database not connected — fall back to mock data
    const userRegistrations = ALL_REGISTRATIONS.filter(
      (r) => r.playerId === userId || r.parentId === userId,
    );

    const enriched = userRegistrations.map((reg) => {
      const program = ALL_PROGRAMS.find((p) => p.id === reg.programId) ?? null;
      const invoices = ALL_INVOICES.filter((inv) => inv.registrationId === reg.id);
      return { ...reg, program, invoices };
    });

    return success(enriched, {
      total: enriched.length,
      source: 'mock',
    });
  }
}

// ─── POST /api/registrations ────────────────────────────────────────────────

interface CreateRegistrationBody {
  programId: string;
  playerId: string;
  paymentPlan: PaymentPlan;
}

function isValidPaymentPlan(plan: unknown): plan is PaymentPlan {
  if (!plan || typeof plan !== 'object') return false;
  const p = plan as Record<string, unknown>;
  if (!['full', '2-part', 'monthly'].includes(p.type as string)) return false;
  if (!Array.isArray(p.amounts) || p.amounts.length === 0) return false;
  if (!Array.isArray(p.dueDates) || p.dueDates.length === 0) return false;
  if (p.amounts.length !== p.dueDates.length) return false;
  return true;
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const userId = auth.user.userId;

  let body: CreateRegistrationBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { programId, playerId, paymentPlan } = body;

  if (!programId || typeof programId !== 'string') {
    return badRequest('programId is required');
  }
  if (!playerId || typeof playerId !== 'string') {
    return badRequest('playerId is required');
  }
  if (!isValidPaymentPlan(paymentPlan)) {
    return badRequest('Invalid paymentPlan — requires type, amounts[], and dueDates[] of equal length');
  }

  const totalAmount = paymentPlan.amounts.reduce((sum, a) => sum + a, 0);

  try {
    // Verify program exists and has spots
    const program = await prisma.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return badRequest('Program not found');
    }

    if (program.spotsFilled >= program.spotsTotal) {
      return badRequest('Program is full — no spots available');
    }

    // Check for duplicate registration
    const existing = await prisma.registration.findUnique({
      where: { programId_playerId: { programId, playerId } },
    });

    if (existing) {
      return badRequest('Player is already registered for this program');
    }

    // Create registration + invoices in a transaction
    const registration = await prisma.$transaction(async (tx) => {
      const reg = await tx.registration.create({
        data: {
          programId,
          playerId,
          parentId: userId,
          status: 'pending',
          paymentPlan: paymentPlan as unknown as import('@/generated/prisma/client').Prisma.InputJsonValue,
          amountPaid: 0,
          amountDue: totalAmount,
        },
      });

      // Generate invoices from payment plan
      const invoiceData = paymentPlan.amounts.map((amount, index) => ({
        registrationId: reg.id,
        userId,
        amount,
        dueDate: new Date(paymentPlan.dueDates[index]),
        status: 'pending',
      }));

      await tx.invoice.createMany({ data: invoiceData });

      // Update spots filled
      await tx.program.update({
        where: { id: programId },
        data: { spotsFilled: { increment: 1 } },
      });

      // Return registration with invoices
      return tx.registration.findUnique({
        where: { id: reg.id },
        include: {
          program: true,
          invoices: true,
        },
      });
    });

    // Fire n8n webhook (non-blocking)
    sendWebhookSafe('registration.created', {
      registrationId: registration?.id,
      programId,
      playerId,
      parentId: userId,
      paymentPlan,
      totalAmount,
    });

    return success(registration, { source: 'database' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return error(message, 500, 'REGISTRATION_ERROR');
  }
}
