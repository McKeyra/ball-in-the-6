import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, badRequest } from '@/lib/api-response';
import { sendWebhookSafe } from '@/infrastructure/n8n';
import { COACH_NOTES } from '@/lib/parent-data';

const VALID_NOTE_TYPES = ['feedback', 'progress', 'concern', 'praise'] as const;
type NoteType = (typeof VALID_NOTE_TYPES)[number];

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { user } = auth;

  try {
    // Determine user role from their profile type
    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    const isCoach = profile?.type === 'coach';

    let notes;

    if (isCoach) {
      // Coach: return notes they wrote
      notes = await prisma.coachNote.findMany({
        where: { coachId: user.userId },
        include: {
          player: {
            include: { profile: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Parent: return notes for their verified children
      const parentChildren = await prisma.parentChild.findMany({
        where: {
          parentId: user.userId,
          status: 'verified',
        },
        select: { childId: true },
      });

      const childIds = parentChildren.map((pc) => pc.childId);

      notes = await prisma.coachNote.findMany({
        where: { playerId: { in: childIds } },
        include: {
          coach: {
            include: { profile: true },
          },
          player: {
            include: { profile: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const formatted = notes.map((note: Record<string, unknown>) => {
      const coachData = note.coach as { profile?: { displayName?: string }; name?: string } | undefined;
      const playerData = note.player as { profile?: { displayName?: string }; name: string };
      return {
        id: note.id as string,
        date: (note.createdAt as Date).toISOString().split('T')[0],
        coachName: coachData?.profile?.displayName ?? coachData?.name ?? 'Unknown Coach',
        childName: playerData.profile?.displayName ?? playerData.name,
        content: note.content as string,
        type: note.type as string,
      };
    });

    return success(formatted);
  } catch {
    // DB not connected — fall back to mock data
    return success(COACH_NOTES);
  }
}

interface CreateNoteBody {
  playerId: string;
  type: NoteType;
  content: string;
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { user } = auth;

  // Verify the user is a coach
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (profile?.type !== 'coach') {
      return error('Only coaches can create notes', 403, 'FORBIDDEN');
    }
  } catch {
    return error('Failed to verify coach role', 500, 'ROLE_CHECK_FAILED');
  }

  let body: CreateNoteBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { playerId, type, content } = body;

  if (!playerId || typeof playerId !== 'string') {
    return badRequest('playerId is required');
  }
  if (!type || !VALID_NOTE_TYPES.includes(type as NoteType)) {
    return badRequest(`type must be one of: ${VALID_NOTE_TYPES.join(', ')}`);
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return badRequest('content is required');
  }

  try {
    const note = await prisma.coachNote.create({
      data: {
        coachId: user.userId,
        playerId,
        type,
        content: content.trim(),
      },
      include: {
        player: {
          include: { profile: true },
        },
      },
    });

    // Fire n8n webhook
    await sendWebhookSafe('coach_note.created', {
      noteId: note.id,
      coachId: user.userId,
      coachEmail: user.token.email,
      playerId: note.playerId,
      playerName: note.player.profile?.displayName ?? note.player.name,
      type: note.type,
    });

    return success({
      id: note.id,
      coachId: note.coachId,
      playerId: note.playerId,
      type: note.type,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
    });
  } catch {
    return error('Failed to create coach note', 500, 'CREATE_NOTE_FAILED');
  }
}
