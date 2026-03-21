'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';

/**
 * Generic entity query/mutation hooks using fetch-based API patterns.
 * Replaces the base44 entity hooks from the Vite monorepo.
 */

interface EntityListOptions {
  sort?: Record<string, 'asc' | 'desc'>;
  limit?: number;
  filter?: Record<string, unknown>;
  enabled?: boolean;
}

const API_BASE = '/api';

async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => 'Unknown error');
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export function useEntityList<T = unknown>(
  entityName: string,
  options: EntityListOptions = {},
): UseQueryResult<T[]> {
  const { sort, limit, filter, enabled = true } = options;

  return useQuery<T[]>({
    queryKey: [entityName, 'list', { sort, limit, filter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (sort) params.set('sort', JSON.stringify(sort));
      if (limit) params.set('limit', String(limit));
      if (filter && Object.keys(filter).length > 0) {
        params.set('filter', JSON.stringify(filter));
      }
      const qs = params.toString();
      const url = `${API_BASE}/${entityName}${qs ? `?${qs}` : ''}`;
      return apiFetch<T[]>(url);
    },
    enabled,
  });
}

export function useEntityGet<T = unknown>(
  entityName: string,
  id: string | undefined | null,
  options: { enabled?: boolean } = {},
): UseQueryResult<T> {
  return useQuery<T>({
    queryKey: [entityName, 'get', id],
    queryFn: () => apiFetch<T>(`${API_BASE}/${entityName}/${id}`),
    enabled: !!id && (options.enabled !== false),
  });
}

export function useEntityCreate<T = unknown>(
  entityName: string,
): UseMutationResult<T, Error, Record<string, unknown>> {
  const queryClient = useQueryClient();

  return useMutation<T, Error, Record<string, unknown>>({
    mutationFn: (record) =>
      apiFetch<T>(`${API_BASE}/${entityName}`, {
        method: 'POST',
        body: JSON.stringify(record),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityName] });
    },
  });
}

export function useEntityUpdate<T = unknown>(
  entityName: string,
): UseMutationResult<T, Error, { id: string } & Record<string, unknown>> {
  const queryClient = useQueryClient();

  return useMutation<T, Error, { id: string } & Record<string, unknown>>({
    mutationFn: ({ id, ...updates }) =>
      apiFetch<T>(`${API_BASE}/${entityName}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityName] });
    },
  });
}

export function useEntityDelete(
  entityName: string,
): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      apiFetch<void>(`${API_BASE}/${entityName}/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityName] });
    },
  });
}
