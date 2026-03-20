/**
 * Standard API response helpers — consistent shape across all routes.
 */

export function success<T>(data: T, meta?: Record<string, unknown>): Response {
  return Response.json({ data, meta });
}

export function paginated<T>(
  data: T[],
  opts: { page: number; limit: number; total: number; filter?: string },
): Response {
  const totalPages = Math.ceil(opts.total / opts.limit);
  return Response.json({
    data,
    meta: {
      page: opts.page,
      limit: opts.limit,
      total: opts.total,
      totalPages,
      hasNext: opts.page < totalPages,
      hasPrev: opts.page > 1,
      ...(opts.filter && { filter: opts.filter }),
    },
  });
}

export function error(
  message: string,
  status: number = 500,
  code: string = 'INTERNAL_ERROR',
): Response {
  return Response.json({ error: code, message }, { status });
}

export function notFound(message: string = 'Resource not found'): Response {
  return error(message, 404, 'NOT_FOUND');
}

export function badRequest(message: string): Response {
  return error(message, 400, 'BAD_REQUEST');
}

export function parsePageParams(searchParams: URLSearchParams): { page: number; limit: number } {
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '10', 10) || 10));
  return { page, limit };
}
