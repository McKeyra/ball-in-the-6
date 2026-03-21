import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, notFound, badRequest } from '@/lib/api-response';
import { sendWebhookSafe } from '@/infrastructure/n8n';
import { PROGRAMS } from '@/lib/programs-data';
import type { ProgramType, ProgramStatus } from '@/types/programs';

const VALID_TYPES: ProgramType[] = ['league', 'camp', 'training', 'clinic'];
const VALID_STATUSES: ProgramStatus[] = ['draft', 'open', 'active', 'full', 'completed'];

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { id } = await context.params;

  try {
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true } },
        events: {
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!program) {
      return notFound('Program not found');
    }

    return success({
      ...program,
      registrationCount: program._count.registrations,
      _count: undefined,
    });
  } catch {
    // Database not connected — fall back to mock data
    const program = PROGRAMS.find((p) => p.id === id);

    if (!program) {
      return notFound('Program not found');
    }

    return success({
      ...program,
      registrationCount: program.spotsFilled,
      events: [],
    });
  }
}

export async function PUT(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { id } = await context.params;

  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  // Fetch existing program to verify ownership
  let existing;
  try {
    existing = await prisma.program.findUnique({
      where: { id },
    });
  } catch {
    return error('Database connection failed', 503, 'SERVICE_UNAVAILABLE');
  }

  if (!existing) {
    return notFound('Program not found');
  }

  // Verify the authenticated user owns the org that created this program
  let orgProfile;
  try {
    orgProfile = await prisma.profile.findFirst({
      where: {
        userId: auth.user.userId,
        type: 'organization',
      },
    });
  } catch {
    return error('Database connection failed', 503, 'SERVICE_UNAVAILABLE');
  }

  if (!orgProfile || orgProfile.id !== existing.orgId) {
    return error('You do not have permission to update this program', 403, 'FORBIDDEN');
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return badRequest('Invalid JSON body');
  }

  // Validate enum fields if present
  if (body.type !== undefined && !VALID_TYPES.includes(body.type as ProgramType)) {
    return badRequest(`type must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (body.status !== undefined && !VALID_STATUSES.includes(body.status as ProgramStatus)) {
    return badRequest(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  if (body.gender !== undefined && !['male', 'female', 'co-ed'].includes(body.gender as string)) {
    return badRequest('gender must be male, female, or co-ed');
  }
  if (
    body.skillLevel !== undefined &&
    !['recreational', 'competitive', 'elite'].includes(body.skillLevel as string)
  ) {
    return badRequest('skillLevel must be recreational, competitive, or elite');
  }
  if (body.spotsTotal !== undefined && (typeof body.spotsTotal !== 'number' || body.spotsTotal < 1)) {
    return badRequest('spotsTotal must be a positive integer');
  }
  if (body.price !== undefined && (typeof body.price !== 'number' || body.price < 0)) {
    return badRequest('price must be a non-negative number');
  }

  // Build update data — only include fields that were sent
  const updateData: Record<string, unknown> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.type !== undefined) updateData.type = body.type;
  if (body.sport !== undefined) updateData.sport = body.sport;
  if (body.ageGroups !== undefined) updateData.ageGroups = body.ageGroups;
  if (body.gender !== undefined) updateData.gender = body.gender;
  if (body.skillLevel !== undefined) updateData.skillLevel = body.skillLevel;
  if (body.season !== undefined) updateData.season = body.season;
  if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate as string);
  if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate as string);
  if (body.schedule !== undefined) updateData.schedule = body.schedule;
  if (body.price !== undefined) updateData.price = body.price;
  if (body.earlyBirdPrice !== undefined) updateData.earlyBirdPrice = body.earlyBirdPrice;
  if (body.earlyBirdDeadline !== undefined) {
    updateData.earlyBirdDeadline = new Date(body.earlyBirdDeadline as string);
  }
  if (body.siblingDiscount !== undefined) updateData.siblingDiscount = body.siblingDiscount;
  if (body.paymentPlans !== undefined) updateData.paymentPlans = body.paymentPlans;
  if (body.spotsTotal !== undefined) updateData.spotsTotal = body.spotsTotal;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.requirements !== undefined) updateData.requirements = body.requirements;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.coaches !== undefined) updateData.coaches = body.coaches;
  if (body.teamId !== undefined) updateData.teamId = body.teamId;

  if (Object.keys(updateData).length === 0) {
    return badRequest('No fields to update');
  }

  const statusChanged =
    body.status !== undefined && body.status !== existing.status;

  try {
    const updated = await prisma.program.update({
      where: { id },
      data: updateData,
      include: {
        _count: { select: { registrations: true } },
        events: {
          orderBy: { date: 'asc' },
        },
      },
    });

    if (statusChanged) {
      await sendWebhookSafe('program.status_changed', {
        programId: updated.id,
        name: updated.name,
        orgId: updated.orgId,
        previousStatus: existing.status,
        newStatus: updated.status,
      });
    }

    return success({
      ...updated,
      registrationCount: updated._count.registrations,
      _count: undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update program';
    return error(message, 500, 'UPDATE_FAILED');
  }
}
