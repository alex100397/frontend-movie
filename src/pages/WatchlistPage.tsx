import { useState, useMemo } from 'react';
import { useWatchlist, useRemoveFromWatchlist, useUpdateWatchlist } from '@/hooks/useWatchlist';
import { useToast } from '@/stores/toastStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookmarkPlus, Trash2, Loader2, Star, ChevronDown } from 'lucide-react';
import type { WatchListStatus } from '@/types';

const STATUS_COLORS: Record<WatchListStatus, string> = {
  PLANNED: 'bg-info/15 text-info border-info/30',
  WATCHING: 'bg-cinema-red/15 text-cinema-red border-cinema-red/30',
  COMPLETED: 'bg-success/15 text-success border-success/30',
  DROPPED: 'bg-outline/15 text-outline border-outline/30',
};
const STATUS_LABELS: Record<WatchListStatus, string> = { PLANNED: 'Planned', WATCHING: 'Watching', COMPLETED: 'Completed', DROPPED: 'Dropped' };
const ALL_STATUSES: WatchListStatus[] = ['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'];

export default function WatchlistPage() {
  const [filter, setFilter] = useState<WatchListStatus | 'ALL'>('ALL');
  const { data, isLoading } = useWatchlist(1, 100);
  const remove = useRemoveFromWatchlist();
  const updateWl = useUpdateWatchlist();
  const toast = useToast();

  const items = data?.items ?? [];
  const filtered = useMemo(() => filter === 'ALL' ? items : items.filter((i) => i.status === filter), [items, filter]);

  const handleRemove = async (id: string) => {
    try { await remove.mutateAsync(id); toast.success('Removed'); }
    catch { toast.error('Failed to remove'); }
  };

  const handleStatusChange = async (id: string, status: WatchListStatus) => {
    try { await updateWl.mutateAsync({ id, status }); toast.success('Updated'); }
    catch { toast.error('Failed to update'); }
  };

  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-headline text-4xl font-bold tracking-tight">My <span className="text-gradient">Watchlist</span></h1>
          <p className="mt-2 text-outline">Track your cinematic journey. {items.length} {items.length === 1 ? 'movie' : 'movies'} saved.</p>
        </motion.div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {(['ALL', ...ALL_STATUSES] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${filter === s ? 'bg-cinema-red text-white shadow-glow' : 'bg-surface-high text-secondary hover:bg-surface-bright'}`}>
              {s === 'ALL' ? `All (${items.length})` : `${STATUS_LABELS[s]} (${items.filter((i) => i.status === s).length})`}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-lg bg-surface-mid animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <BookmarkPlus size={48} className="text-outline/40" />
              <h2 className="font-headline text-xl font-semibold">Watchlist is empty</h2>
              <p className="text-sm text-outline">Start adding movies from the catalog</p>
              <Link to="/" className="btn-primary">Discover Movies</Link>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {filtered.map((item) => (
                  <motion.div key={item.id} className="card-glass flex items-center gap-4 p-4" layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Link to={`/movie/${item.movieId}`} className="shrink-0">
                      <div className="h-20 w-14 overflow-hidden rounded-md bg-surface-high">
                        {item.movie?.posterUrl ? <img src={item.movie.posterUrl} alt={item.movie?.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-outline"><Star size={16} /></div>}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/movie/${item.movieId}`} className="font-headline text-sm font-semibold text-on-surface hover:text-primary truncate block">{item.movie?.title ?? 'Unknown'}</Link>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        {item.movie?.releaseDate && <span className="text-xs text-outline">{new Date(item.movie.releaseDate).getFullYear()}</span>}
                        {item.movie?.genres?.slice(0, 2).map((g) => <span key={g} className="chip !text-[10px] !px-2 !py-0.5">{g}</span>)}
                      </div>
                      {item.notes && <p className="mt-1 text-xs text-outline/70 truncate">{item.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="relative">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as WatchListStatus)}
                          className={`appearance-none rounded-full border px-3 py-1.5 pr-7 text-xs font-semibold cursor-pointer ${STATUS_COLORS[item.status]}`}
                          id={`status-${item.id}`}
                        >
                          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>
                        <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-60" />
                      </div>
                      <button onClick={() => handleRemove(item.id)} disabled={remove.isPending} className="flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-error/10 hover:text-error transition-colors cursor-pointer" aria-label="Remove" id={`remove-${item.id}`}>
                        {remove.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
