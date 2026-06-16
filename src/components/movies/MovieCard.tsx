import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Plus, Check } from 'lucide-react';
import type { Movie } from '@/types';

interface Props {
  movie: Movie;
  isInWatchlist?: boolean;
  onAddToWatchlist?: (id: string) => void;
}

export default function MovieCard({ movie, isInWatchlist, onAddToWatchlist }: Props) {
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '';
  const runtime = movie.runTime ? `${Math.floor(movie.runTime / 60)}h ${movie.runTime % 60}m` : '';

  return (
    <motion.article className="group relative rounded-lg overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -8 }} transition={{ duration: 0.3 }} layout>
      <Link to={`/movie/${movie.id}`} className="block" id={`movie-card-${movie.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface-mid">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-high text-outline"><Star size={32} /><span className="text-sm">No Poster</span></div>
          )}
          <div className="scrim-bottom absolute inset-0 flex items-end justify-center pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-white">View Details</span>
          </div>
        </div>
      </Link>

      {onAddToWatchlist && (
        <button
          className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 cursor-pointer
            ${isInWatchlist ? 'border-success/50 bg-success/30 text-success opacity-100' : 'border-white/15 bg-black/60 text-white opacity-0 backdrop-blur-sm group-hover:opacity-100 hover:scale-110 hover:border-cinema-red hover:bg-cinema-red'}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!isInWatchlist) onAddToWatchlist(movie.id); }}
          disabled={isInWatchlist}
          aria-label={isInWatchlist ? 'In watchlist' : 'Add to watchlist'}
        >
          {isInWatchlist ? <Check size={14} /> : <Plus size={14} />}
        </button>
      )}

      <div className="px-1 pt-2">
        <h3 className="truncate font-headline text-sm font-semibold text-on-surface">{movie.title}</h3>
        <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-outline">
          {year && <span>{year}</span>}
          {runtime && <><span className="text-[10px]">·</span><span>{runtime}</span></>}
        </div>
        {movie.genres?.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((g) => <span key={g} className="chip !text-[10px]">{g}</span>)}
          </div>
        )}
      </div>
    </motion.article>
  );
}
