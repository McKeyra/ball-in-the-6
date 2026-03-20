import { prisma } from '@/infrastructure/database';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://n8n.226.wtf';
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || '';

type WebhookEvent =
  | 'user.registered'
  | 'user.profile_created'
  | 'parent.child_claimed'
  | 'parent.child_verified'
  | 'registration.created'
  | 'registration.confirmed'
  | 'payment.completed'
  | 'payment.overdue'
  | 'game.started'
  | 'game.ended'
  | 'coach_note.created'
  | 'program.created'
  | 'program.status_changed';

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
}

class N8nWebhookError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'N8nWebhookError';
    this.statusCode = statusCode;
  }
}

async function logWebhook(
  event: string,
  payload: Record<string, unknown>,
  status: string,
  responseCode?: number,
  error?: string,
): Promise<void> {
  try {
    await prisma.webhookLog.create({
      data: {
        event,
        payload: payload as unknown as import('@/generated/prisma/client').Prisma.InputJsonValue,
        status,
        responseCode,
        error,
      },
    });
  } catch {
    // Don't let logging failures break the webhook flow
  }
}

export async function sendWebhook(
  event: WebhookEvent,
  data: Record<string, unknown>,
): Promise<void> {
  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  try {
    const response = await fetch(`${N8N_BASE_URL}/webhook/b6-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': N8N_WEBHOOK_SECRET,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = `n8n webhook failed: ${response.status} ${response.statusText}`;
      await logWebhook(event, data, 'failed', response.status, error);
      throw new N8nWebhookError(error, response.status);
    }

    await logWebhook(event, data, 'sent', response.status);
  } catch (err) {
    if (err instanceof N8nWebhookError) throw err;

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    await logWebhook(event, data, 'failed', undefined, errorMessage);

    // Don't throw on webhook failures — they're non-critical
    // The event is logged for retry by n8n or manual review
  }
}

export async function sendWebhookSafe(
  event: WebhookEvent,
  data: Record<string, unknown>,
): Promise<void> {
  try {
    await sendWebhook(event, data);
  } catch {
    // Silently swallow — used for fire-and-forget webhooks
  }
}

export { N8nWebhookError };
export type { WebhookEvent, WebhookPayload };
