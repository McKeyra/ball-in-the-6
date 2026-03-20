import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, badRequest, paginated, parsePageParams } from '@/lib/api-response';
import { sendWebhookSafe } from '@/infrastructure/n8n';
import { PROGRAMS } from '@/lib/programs-data';
import type { ProgramType, ProgramStatus, AgeGroup } from '@/types/programs';

const VALID_TYPES: ProgramType[] = ['league', 'camp', 'training', 'clinic'];
const VALID_STATUSES: ProgramStatus[] = ['draft', 'open', 'active', 'full', 'completed'];
const VALID_AGE_GROUPS: AgeGroup[] = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'adult'];

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const { page, limit } = parsePageParams(searchParams);

  const sport = searchParams.get('sport');
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const ageGroup = searchParams.get('ageGroup');
  const search = searchParams.get('search');

  // Validate enum params when present
  if (type && !VALID_TYPES.includes(type as ProgramType)) {
    return badRequest(`Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (status && !VALID_STATUSES.includes(status as ProgramStatus)) {
    return badRequest(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  if (ageGroup && !VALID_AGE_GROUPS.includes(ageGroup as AgeGroup)) {
    return badRequest(`Invalid ageGroup. Must be one of: ${VALID_AGE_GROUPS.join(', ')}`);
  }

  try {
    const where: Record<string, unknown> = {};

    if (sport) where.sport = { equals: sport, mode: 'insensitive' };
    if (type) where.type = type;
    if (status) where.status = status;
    if (ageGroup) where.ageGroups = { has: ageGroup };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sport: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        include: {
          _count: { select: { registrations: true } },
        },
        orderBy: { startDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.program.count({ where }),
    ]);

    const data = programs.map((p) => ({
      ...p,
      registrationCount: p._count.registrations,
      _count: undefined,
    }));

    return paginated(data, { page, limit, total });
  } catch {
    // Database not connected — fall back to mock data
    let filtered = [...PROGRAMS];

    if (sport) {
      const sportLower = sport.toLowerCase();
      filtered = filtered.filter((p) => p.sport.toLowerCase() === sportLower);
    }
    if (type) {
      filtered = filtered.filter((p) => p.type === type);
    }
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (ageGroup) {
      filtered = filtered.filter((p) => p.ageGroups.includes(ageGroup as AgeGroup));
    }
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.sport.toLowerCase().includes(term),
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    const data = paged.map((p) => ({
      ...p,
      registrationCount: p.spotsFilled,
    }));

    return paginated(data, { page, limit, total });
  }
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  // Verify user has an org profile
  let orgProfile;
  try {
    orgProfile = await prisma.profile.findFirst({
      where: {
        userId: auth.user.sub,
        type: 'organization',
      },
    });
  } catch {
    return error('Database connection failed', 503, 'SERVICE_UNAVAILABLE');
  }

  if (!orgProfile) {
    return error('Only organization accounts can create programs', 403, 'FORBIDDEN');
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return badRequest('Invalid JSON body');
  }

  const {
    name,
    type: programType,
    sport,
    ageGroups,
    gender,
    skillLevel,
    season,
    startDate,
    endDate,
    schedule,
    price,
    earlyBirdPrice,
    earlyBirdDeadline,
    paymentPlans,
    spotsTotal,
    requirements,
    description,
    coaches,
    teamId,
  } = body;

  // Required field validation
  if (!name || typeof name !== 'string') {
    return badRequest('name is required');
  }
  if (!programType || !VALID_TYPES.includes(programType as ProgramType)) {
    return badRequest(`type must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (!sport || typeof sport !== 'string') {
    return badRequest('sport is required');
  }
  if (!Array.isArray(ageGroups) || ageGroups.length === 0) {
    return badRequest('ageGroups must be a non-empty array');
  }
  if (!gender || !['male', 'female', 'co-ed'].includes(gender as string)) {
    return badRequest('gender must be male, female, or co-ed');
  }
  if (!skillLevel || !['recreational', 'competitive', 'elite'].includes(skillLevel as string)) {
    return badRequest('skillLevel must be recreational, competitive, or elite');
  }
  if (!season || typeof season !== 'string') {
    return badRequest('season is required');
  }
  if (!startDate || typeof startDate !== 'string') {
    return badRequest('startDate is required');
  }
  if (!endDate || typeof endDate !== 'string') {
    return badRequest('endDate is required');
  }
  if (!schedule || typeof schedule !== 'object') {
    return badRequest('schedule is required');
  }
  if (typeof price !== 'number' || price < 0) {
    return badRequest('price must be a non-negative number');
  }
  if (typeof spotsTotal !== 'number' || spotsTotal < 1) {
    return badRequest('spotsTotal must be a positive integer');
  }

  try {
    const program = await prisma.program.create({
      data: {
        name: name as string,
        orgId: orgProfile.id,
        teamId: (teamId as string) ?? null,
        type: programType as string,
        sport: sport as string,
        ageGroups: ageGroups as string[],
        gender: gender as string,
        skillLevel: skillLevel as string,
        season: season as string,
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        schedule: schedule as object,
        price: price as number,
        earlyBirdPrice: (earlyBirdPrice as number) ?? (price as number),
        earlyBirdDeadline: earlyBirdDeadline
          ? new Date(earlyBirdDeadline as string)
          : new Date(startDate as string),
        paymentPlans: (paymentPlans as object[]) ?? [],
        spotsTotal: spotsTotal as number,
        status: 'draft',
        requirements: (requirements as string[]) ?? [],
        description: (description as string) ?? null,
        coaches: (coaches as string[]) ?? [],
      },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    await sendWebhookSafe('program.created', {
      programId: program.id,
      name: program.name,
      orgId: program.orgId,
      type: program.type,
      sport: program.sport,
      season: program.season,
    });

    return success(
      {
        ...program,
        registrationCount: program._count.registrations,
        _count: undefined,
      },
      { created: true },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create program';
    return error(message, 500, 'CREATE_FAILED');
  }
}
