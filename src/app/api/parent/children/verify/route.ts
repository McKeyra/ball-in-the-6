import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, badRequest, notFound } from '@/lib/api-response';
import { sendWebhookSafe } from '@/infrastructure/n8n';

interface VerifyBody {
  parentChildId: string;
  code: string;
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { user } = auth;

  let body: VerifyBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { parentChildId, code } = body;

  if (!parentChildId || typeof parentChildId !== 'string') {
    return badRequest('parentChildId is required');
  }
  if (!code || typeof code !== 'string') {
    return badRequest('code is required');
  }

  try {
    // Look up the parent-child record
    const parentChild = await prisma.parentChild.findUnique({
      where: { id: parentChildId },
    });

    if (!parentChild) {
      return notFound('Parent-child relationship not found');
    }

    // Ensure the requesting user is the parent on this record
    if (parentChild.parentId !== user.sub) {
      return error('Not authorized to verify this relationship', 403, 'FORBIDDEN');
    }

    if (parentChild.status === 'verified') {
      return badRequest('Already verified');
    }

    // Check verification code
    if (parentChild.verificationCode !== code) {
      return badRequest('Invalid verification code');
    }

    // Update status to verified
    const updated = await prisma.parentChild.update({
      where: { id: parentChildId },
      data: {
        status: 'verified',
        verifiedAt: new Date(),
      },
    });

    // Fire n8n webhook
    await sendWebhookSafe('parent.child_verified', {
      parentChildId: updated.id,
      parentId: updated.parentId,
      childId: updated.childId,
      verifiedAt: updated.verifiedAt?.toISOString(),
    });

    return success({
      id: updated.id,
      status: updated.status,
      verifiedAt: updated.verifiedAt?.toISOString(),
    });
  } catch {
    return error('Failed to verify child', 500, 'VERIFY_FAILED');
  }
}
