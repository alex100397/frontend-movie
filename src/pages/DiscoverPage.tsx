import { useState, useMemo } from 'react';
import { useMovies } from '@/hooks/useMovies';
import { useWatchlist, useAddToWatchlist } from '@/hooks/useWatchlist';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/stores/toastStore';
import MovieCard from '@/components/movies/MovieCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Film, Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation'];

export default function DiscoverPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading, isFetching } = useMovies(page, 20);
  const { data: wlData } = useWatchlist(1, 100);
  const addWl = useAddToWatchlist();
  const toast = useToast();

  const movies = data?.movies ?? [];
  const pg = data?.pagination ?? { page: 1, totalPages: 1, total: 0 };
  const wlIds = useMemo(() => new Set((wlData?.items ?? []).map((i) => i.movieId)), [wlData]);

  const filtered = useMemo(() => movies.filter((m) => {
    const s = !search || m.title.toLowerCase().includes(search.toLowerCase());
    const g = genre === 'All' || m.genres?.includes(genre);
    return s && g;
  }), [movies, search, genre]);

  const handleAdd = async (movieId: string) => {
    if (!isAuthenticated) { toast.info('Sign in to add movies'); return; }
    try { await addWl.mutateAsync({ movieId, status: 'PLANNED' }); toast.success('Added!'); }
    catch (e: any) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="min-h-screen pb-20 pt-24">
      <section className="relative overflow-hidden px-5 pb-12 pt-8 md:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-cinema-red/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-primary/5 blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface md:text-5xl">
              Discover <span className="text-gradient">Movies</span>
            </h1>
            <p className="mt-3 max-w-lg text-base text-outline md:text-lg">Explore our curated catalog and build your personal watchlist.</p>
          </motion.div>

          <motion.div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search movies..." className="input-field pl-11" id="search-input" />
            </div>
            {isAuthenticated && (
              <Link to="/movies/new" className="btn-primary shrink-0" id="add-movie-btn"><Plus size={18} /><span>Add Movie</span></Link>
            )}
          </motion.div>

          <motion.div className="mt-6 flex gap-2 overflow-x-auto pb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {GENRES.map((g) => (
              <button key={g} onClick={() => setGenre(g)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${genre === g ? 'bg-cinema-red text-white shadow-glow' : 'bg-surface-high text-secondary hover:bg-surface-bright'}`} id={`genre-${g.toLowerCase()}`}>
                {g}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-10">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-[2/3] rounded-lg bg-surface-mid animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-surface-mid animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <Film size={48} className="text-outline/40" />
            <h2 className="font-headline text-xl font-semibold">No movies found</h2>
            <p className="text-sm text-outline">{search ? 'Try a different search' : 'No movies match this genre'}</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              <motion.div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" layout>
                {filtered.map((m) => <MovieCard key={m.id} movie={m} isInWatchlist={wlIds.has(m.id)} onAddToWatchlist={handleAdd} />)}
              </motion.div>
            </AnimatePresence>
            {pg.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary !px-4 !py-2"><ChevronLeft size={18} />Prev</button>
                <span className="text-sm font-medium text-secondary">Page {pg.page} of {pg.totalPages}{isFetching && <Loader2 size={14} className="ml-2 inline animate-spin" />}</span>
                <button onClick={() => setPage((p) => Math.min(pg.totalPages, p + 1))} disabled={page === pg.totalPages} className="btn-secondary !px-4 !py-2">Next<ChevronRight size={18} /></button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
