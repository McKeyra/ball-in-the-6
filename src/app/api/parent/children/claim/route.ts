import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, badRequest, notFound } from '@/lib/api-response';
import { sendWebhookSafe } from '@/infrastructure/n8n';

interface ClaimBody {
  childEmail: string;
  verificationCode: string;
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { user } = auth;

  let body: ClaimBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { childEmail, verificationCode } = body;

  if (!childEmail || typeof childEmail !== 'string') {
    return badRequest('childEmail is required');
  }
  if (!verificationCode || typeof verificationCode !== 'string') {
    return badRequest('verificationCode is required');
  }

  try {
    // Look up the child user by email
    const childUser = await prisma.user.findUnique({
      where: { email: childEmail },
    });

    if (!childUser) {
      return notFound('No user found with that email');
    }

    if (childUser.id === user.sub) {
      return badRequest('Cannot claim yourself as a child');
    }

    // Check if relationship already exists
    const existing = await prisma.parentChild.findUnique({
      where: {
        parentId_childId: {
          parentId: user.sub,
          childId: childUser.id,
        },
      },
    });

    if (existing) {
      return badRequest('Child already claimed');
    }

    // Create the parent-child relationship
    const parentChild = await prisma.parentChild.create({
      data: {
        parentId: user.sub,
        childId: childUser.id,
        status: 'pending',
        verificationCode,
      },
    });

    // Fire n8n webhook
    await sendWebhookSafe('parent.child_claimed', {
      parentChildId: parentChild.id,
      parentId: user.sub,
      parentEmail: user.email,
      childId: childUser.id,
      childEmail,
    });

    return success({
      id: parentChild.id,
      status: parentChild.status,
      childId: parentChild.childId,
      claimedAt: parentChild.claimedAt.toISOString(),
    });
  } catch {
    return error('Failed to claim child', 500, 'CLAIM_FAILED');
  }
}
