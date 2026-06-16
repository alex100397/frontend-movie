import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovie, useDeleteMovie } from '@/hooks/useMovies';
import { useAddToWatchlist, useWatchlist } from '@/hooks/useWatchlist';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/stores/toastStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag, User, Plus, Check, Trash2, Edit3, Loader2, Star } from 'lucide-react';
import { useMemo } from 'react';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, user } = useAuthStore();
  const { data: movie, isLoading, error } = useMovie(id);
  const del = useDeleteMovie();
  const addWl = useAddToWatchlist();
  const { data: wlData } = useWatchlist(1, 100);

  const inWl = useMemo(() => (wlData?.items ?? []).some((i) => i.movieId === id), [wlData, id]);
  const isOwner = movie?.createdBy === user?.id || movie?.creator?.id === user?.id;

  const handleDelete = async () => {
    if (!confirm('Delete this movie?')) return;
    try { await del.mutateAsync(id!); toast.success('Deleted'); navigate('/'); }
    catch { toast.error('Failed to delete'); }
  };

  const handleAdd = async () => {
    try { await addWl.mutateAsync({ movieId: id!, status: 'PLANNED' }); toast.success('Added!'); }
    catch (e: any) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center pt-20"><Loader2 size={32} className="animate-spin text-cinema-red" /></div>;
  if (error || !movie) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-20"><Star size={48} className="text-outline/40" /><h2 className="font-headline text-xl font-semibold">Not found</h2><Link to="/" className="btn-primary">Go Back</Link></div>;

  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '';
  const dateFmt = movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const runtime = movie.runTime ? `${Math.floor(movie.runTime / 60)}h ${movie.runTime % 60}m` : '';

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="mx-auto max-w-7xl px-5 py-4 md:px-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-outline hover:text-on-surface cursor-pointer" id="back-btn"><ArrowLeft size={16} />Back</button>
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div className="flex flex-col gap-8 md:flex-row md:gap-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="shrink-0" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="relative mx-auto w-64 md:w-80">
              <div className="overflow-hidden rounded-xl shadow-glass">
                {movie.posterUrl ? <img src={movie.posterUrl} alt={movie.title} className="aspect-[2/3] w-full object-cover" /> : <div className="flex aspect-[2/3] w-full items-center justify-center bg-surface-high text-outline"><Star size={48} /></div>}
              </div>
              <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-cinema-red/10 blur-[60px]" />
            </div>
          </motion.div>

          <motion.div className="flex-1 space-y-6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">{movie.title}</h1>
              {year && <span className="mt-1 inline-block text-lg text-outline">({year})</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              {dateFmt && <div className="chip"><Calendar size={14} className="mr-1.5" />{dateFmt}</div>}
              {runtime && <div className="chip"><Clock size={14} className="mr-1.5" />{runtime}</div>}
              {movie.creator && <div className="chip"><User size={14} className="mr-1.5" />{movie.creator.name}</div>}
            </div>
            {movie.genres?.length > 0 && <div className="flex flex-wrap gap-2">{movie.genres.map((g) => <span key={g} className="inline-flex items-center gap-1 rounded-full bg-cinema-red/10 px-3 py-1 text-xs font-semibold text-cinema-red"><Tag size={12} />{g}</span>)}</div>}
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-outline">Synopsis</h2>
              <p className="leading-relaxed text-on-surface/80">{movie.description}</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {isAuthenticated && (<>
                {inWl ? <span className="btn-secondary !opacity-70 !cursor-default"><Check size={18} />In Watchlist</span> : <button className="btn-primary" onClick={handleAdd} disabled={addWl.isPending} id="add-wl-btn">{addWl.isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}Add to Watchlist</button>}
                {isOwner && (<>
                  <Link to={`/movies/${id}/edit`} className="btn-secondary" id="edit-btn"><Edit3 size={16} />Edit</Link>
                  <button className="btn-secondary !border-error/30 !text-error hover:!bg-error/10" onClick={handleDelete} disabled={del.isPending} id="del-btn">{del.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}Delete</button>
                </>)}
              </>)}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
