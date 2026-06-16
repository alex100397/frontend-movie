// ── API Response Types ──────────────────────────────────────────

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

// ── Auth ────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

// ── Movie ───────────────────────────────────────────────────────

export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  createdAt: string;
  createdBy: string;
  posterUrl: string | null;
  runTime: number | null;
  genres: string[];
  creator?: {
    id: string;
    name: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedMovies {
  movies: Movie[];
  pagination: PaginationMeta;
}

// ── Watchlist ───────────────────────────────────────────────────

export type WatchListStatus = 'PLANNED' | 'WATCHING' | 'COMPLETED' | 'DROPPED';

export interface WatchListItem {
  id: string;
  userId: string;
  movieId: string;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
  rating: number | null;
  status: WatchListStatus;
  movie?: {
    id: string;
    title: string;
    posterUrl: string | null;
    releaseDate: string;
    genres: string[];
  };
}

export interface PaginatedWatchlist {
  items: WatchListItem[];
  pagination: PaginationMeta;
}
