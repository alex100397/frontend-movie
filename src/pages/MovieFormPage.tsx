import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMovieSchema, type CreateMovieFormData } from '@/lib/schemas';
import { useCreateMovie, useUpdateMovie, useMovie } from '@/hooks/useMovies';
import { useToast } from '@/stores/toastStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useEffect } from 'react';

export default function MovieFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();
  const { data: existing } = useMovie(isEdit ? id : undefined);
  const create = useCreateMovie();
  const update = useUpdateMovie();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateMovieFormData>({
    resolver: zodResolver(createMovieSchema) as any,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (existing && isEdit) {
      reset({
        title: existing.title,
        description: existing.description,
        releaseDate: existing.releaseDate ? existing.releaseDate.slice(0, 10) : '',
        posterUrl: existing.posterUrl ?? '',
        runTime: existing.runTime ?? 0,
        genres: existing.genres?.join(', ') ?? '',
      });
    }
  }, [existing, isEdit, reset]);

  const onSubmit = async (data: CreateMovieFormData) => {
    const payload = {
      title: data.title,
      description: data.description,
      releaseDate: new Date(data.releaseDate).toISOString(),
      posterUrl: data.posterUrl || null,
      runTime: data.runTime || null,
      genres: data.genres ? data.genres.split(',').map((g) => g.trim()).filter(Boolean) : [],
    };

    try {
      if (isEdit) {
        await update.mutateAsync({ id, ...payload });
        toast.success('Movie updated!');
      } else {
        await create.mutateAsync(payload);
        toast.success('Movie created!');
      }
      navigate('/');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save movie');
    }
  };

  const fields: { name: keyof CreateMovieFormData; label: string; type?: string; placeholder: string; textarea?: boolean }[] = [
    { name: 'title', label: 'Movie Title', placeholder: 'Inception' },
    { name: 'description', label: 'Description', placeholder: 'A mind-bending thriller...', textarea: true },
    { name: 'releaseDate', label: 'Release Date', type: 'date', placeholder: '' },
    { name: 'posterUrl', label: 'Poster URL', placeholder: 'https://image.tmdb.org/...' },
    { name: 'runTime', label: 'Runtime (minutes)', type: 'number', placeholder: '148' },
    { name: 'genres', label: 'Genres (comma separated)', placeholder: 'Action, Sci-Fi, Thriller' },
  ];

  return (
    <div className="min-h-screen pb-20 pt-24">
      <div className="mx-auto max-w-2xl px-5 md:px-10">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-outline hover:text-on-surface cursor-pointer">
          <ArrowLeft size={16} />Back
        </button>

        <motion.div className="card-glass p-8 md:p-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-8 font-headline text-2xl font-bold">{isEdit ? 'Edit Movie' : 'Add New Movie'}</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="movie-form" noValidate>
            {fields.map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium text-secondary">{f.label}</label>
                {f.textarea ? (
                  <textarea {...register(f.name)} id={f.name} rows={4} placeholder={f.placeholder} className={`input-field resize-none ${errors[f.name] ? 'input-error' : ''}`} />
                ) : (
                  <input {...register(f.name)} id={f.name} type={f.type || 'text'} placeholder={f.placeholder} className={`input-field ${errors[f.name] ? 'input-error' : ''}`} />
                )}
                {errors[f.name] && <p className="mt-1 text-xs text-error">{errors[f.name]?.message}</p>}
              </div>
            ))}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full !py-3 mt-4" id="movie-submit-btn">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} />{isEdit ? 'Update Movie' : 'Create Movie'}</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
