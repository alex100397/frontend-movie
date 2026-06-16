import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});

export const createMovieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  releaseDate: z.string().min(1, 'Release date is required'),
  posterUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  runTime: z.coerce.number().int().min(1).max(600).optional().or(z.literal(0)),
  genres: z.string().optional(),
});

export const updateWatchlistSchema = z.object({
  status: z.enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED']),
  rating: z.coerce.number().int().min(0).max(10).optional().or(z.literal(0)),
  notes: z.string().max(500).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type CreateMovieFormData = z.infer<typeof createMovieSchema>;
export type UpdateWatchlistFormData = z.infer<typeof updateWatchlistSchema>;
