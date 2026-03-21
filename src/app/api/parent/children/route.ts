import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error } from '@/lib/api-response';
import { PARENT_CHILDREN as CHILDREN } from '@/lib/parent-data';

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { user } = auth;

  try {
    const parentChildren = await prisma.parentChild.findMany({
      where: {
        parentId: user.userId,
        status: 'verified',
      },
      include: {
        child: {
          include: {
            profile: true,
            registrations: {
              include: {
                program: {
                  include: {
                    events: {
                      where: {
                        date: { gte: new Date() },
                      },
                      orderBy: { date: 'asc' },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const children = parentChildren.map((pc) => ({
      id: pc.child.id,
      name: pc.child.name,
      age: calculateAge(pc.child.ageBracket),
      avatar: pc.child.profile?.avatar ?? pc.child.name.charAt(0),
      programs: pc.child.registrations.map((reg) => ({
        programId: reg.program.id,
        programName: reg.program.name,
        teamName: reg.program.teamId ?? 'Unassigned',
        sport: reg.program.sport,
        nextEvent: reg.program.events[0]
          ? {
              id: reg.program.events[0].id,
              date: reg.program.events[0].date.toISOString().split('T')[0],
              time: reg.program.events[0].time,
              type: reg.program.events[0].type,
              title: reg.program.events[0].title,
              venue: reg.program.events[0].venue ?? '',
              childId: pc.child.id,
              childName: pc.child.name,
            }
          : null,
        paymentStatus: derivePaymentStatus(reg.amountDue, reg.amountPaid),
        amountPaid: reg.amountPaid,
        amountDue: reg.amountDue,
      })),
    }));

    return success(children);
  } catch {
    // DB not connected — fall back to mock data
    return success(CHILDREN);
  }
}

function derivePaymentStatus(
  due: number,
  paid: number,
): 'current' | 'upcoming' | 'overdue' {
  if (due <= 0) return 'current';
  if (paid > 0 && due > 0) return 'upcoming';
  return 'overdue';
}

function calculateAge(ageBracket: string): number {
  switch (ageBracket) {
    case 'child':
      return 10;
    case 'teen':
      return 14;
    case 'adult':
      return 18;
    default:
      return 0;
  }
}
