import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, Movie, PaginatedMovies } from '@/types';

const MOVIES_KEY = ['movies'] as const;

export function useMovies(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...MOVIES_KEY, { page, limit }],
    queryFn: async (): Promise<PaginatedMovies> => {
      const { data } = await api.get<ApiResponse<PaginatedMovies>>('/movies', { params: { page, limit } });
      return data.data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useMovie(id: string | undefined) {
  return useQuery({
    queryKey: [...MOVIES_KEY, id],
    queryFn: async (): Promise<Movie> => {
      const { data } = await api.get<ApiResponse<{ movie: Movie }>>(`/movies/${id}`);
      return data.data.movie;
    },
    enabled: !!id,
  });
}

export function useCreateMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<Movie>) => {
      const { data } = await api.post<ApiResponse<{ movie: Movie }>>('/movies', body);
      return data.data.movie;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MOVIES_KEY }),
  });
}

export function useUpdateMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: Partial<Movie> & { id: string }) => {
      const { data } = await api.put<ApiResponse<{ movie: Movie }>>(`/movies/${id}`, body);
      return data.data.movie;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MOVIES_KEY }),
  });
}

export function useDeleteMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/movies/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: MOVIES_KEY }),
  });
}
