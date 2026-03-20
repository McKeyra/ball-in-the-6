import { prisma } from '@/infrastructure/database';

export async function GET(): Promise<Response> {
  const services: Record<string, string> = {
    database: 'disconnected',
    auth: 'configured',
    n8n: 'configured',
    storage: 'configured',
  };

  // Check database connectivity
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    services.database = 'connected';
  } catch {
    services.database = 'disconnected';
  }

  // Check auth service
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.226.wtf';
  try {
    const res = await fetch(`${authUrl}/.well-known/jwks.json`, {
      signal: AbortSignal.timeout(3000),
    });
    services.auth = res.ok ? 'connected' : 'error';
  } catch {
    services.auth = 'unreachable';
  }

  // Check n8n
  const n8nUrl = process.env.N8N_BASE_URL || 'https://n8n.226.wtf';
  services.n8n = n8nUrl ? 'configured' : 'not_configured';

  const allConnected = Object.values(services).every(
    (s) => s === 'connected' || s === 'configured',
  );

  return Response.json({
    status: allConnected ? 'ok' : 'degraded',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services,
  });
}
