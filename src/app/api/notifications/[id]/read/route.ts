import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, notFound } from '@/lib/api-response';
import { type NextRequest } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const { user } = auth;
  const { id } = await params;

  try {
    // Find the notification and ensure it belongs to this user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return notFound('Notification not found');
    }

    if (notification.userId !== user.userId) {
      return error('Not authorized to update this notification', 403, 'FORBIDDEN');
    }

    if (notification.read) {
      return success({ id: notification.id, read: true });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return success({
      id: updated.id,
      read: updated.read,
    });
  } catch {
    return error('Failed to mark notification as read', 500, 'UPDATE_FAILED');
  }
}
