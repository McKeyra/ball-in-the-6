export async function GET(): Promise<Response> {
  return Response.json({
    status: 'ok',
    version: '0.22',
    timestamp: new Date().toISOString(),
  });
}
