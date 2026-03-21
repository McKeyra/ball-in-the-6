import { prisma } from '@/infrastructure/database';
import { requireAuth } from '@/lib/auth/api-auth';
import { success, error, notFound, badRequest } from '@/lib/api-response';
import { sendWebhookSafe } from '@/infrastructure/n8n';
import type { NextRequest } from 'next/server';

// ─── POST /api/invoices/[id]/pay ────────────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const auth = await requireAuth(request);
  if ('error' in auth) return auth.error;

  const userId = auth.user.userId;
  const { id: invoiceId } = await params;

  if (!invoiceId || typeof invoiceId !== 'string') {
    return badRequest('Invoice ID is required');
  }

  try {
    // Fetch the invoice and verify ownership
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        registration: {
          include: { program: true },
        },
      },
    });

    if (!invoice) {
      return notFound('Invoice not found');
    }

    // Verify the user owns this invoice
    if (invoice.userId !== userId) {
      return notFound('Invoice not found');
    }

    if (invoice.status === 'paid') {
      return badRequest('Invoice is already paid');
    }

    const now = new Date();

    // Update invoice and registration in a transaction
    const updatedInvoice = await prisma.$transaction(async (tx) => {
      // Mark invoice as paid
      const paid = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'paid',
          paidAt: now,
        },
      });

      // Update registration amountPaid if linked
      if (invoice.registrationId) {
        await tx.registration.update({
          where: { id: invoice.registrationId },
          data: {
            amountPaid: { increment: invoice.amount },
            amountDue: { decrement: invoice.amount },
          },
        });

        // Check if all invoices for this registration are paid
        const unpaidCount = await tx.invoice.count({
          where: {
            registrationId: invoice.registrationId,
            status: { not: 'paid' },
            id: { not: invoiceId },
          },
        });

        // If all invoices are now paid, confirm the registration
        if (unpaidCount === 0) {
          await tx.registration.update({
            where: { id: invoice.registrationId },
            data: { status: 'confirmed' },
          });
        }
      }

      return tx.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          registration: {
            include: { program: true },
          },
        },
      });
    });

    // Fire n8n webhook (non-blocking)
    sendWebhookSafe('payment.completed', {
      invoiceId,
      registrationId: invoice.registrationId,
      userId,
      amount: invoice.amount,
      programId: invoice.registration?.programId,
      programName: invoice.registration?.program?.name,
      paidAt: now.toISOString(),
    });

    return success(updatedInvoice);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment processing failed';
    return error(message, 500, 'PAYMENT_ERROR');
  }
}
