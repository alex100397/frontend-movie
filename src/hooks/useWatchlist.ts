import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, WatchListItem, PaginatedWatchlist, WatchListStatus } from '@/types';

const KEY = ['watchlist'] as const;

export function useWatchlist(page = 1, limit = 50) {
  return useQuery({
    queryKey: [...KEY, { page, limit }],
    queryFn: async (): Promise<PaginatedWatchlist> => {
      const { data } = await api.get<ApiResponse<PaginatedWatchlist>>('/watchlist', { params: { page, limit } });
      return data.data;
    },
    placeholderData: (prev) => prev,
  });
}

interface AddPayload {
  movieId: string;
  status?: WatchListStatus;
  rating?: number;
  notes?: string;
}

export function useAddToWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddPayload) => {
      const { data } = await api.post<ApiResponse<{ watchlistItem: WatchListItem }>>('/watchlist', payload);
      return data.data.watchlistItem;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

interface UpdatePayload {
  id: string;
  status?: WatchListStatus;
  rating?: number;
  notes?: string;
}

export function useUpdateWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: UpdatePayload) => {
      const { data } = await api.put<ApiResponse<{ watchlistItem: WatchListItem }>>(`/watchlist/${id}`, body);
      return data.data.watchlistItem;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/watchlist/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
