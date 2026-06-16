import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from '@/lib/schemas';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/stores/toastStore';
import { Film, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login, signup, isLoading } = useAuthStore();
  const toast = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SignupFormData>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema) as any,
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignupFormData) => {
    const result = isSignup
      ? await signup((data as SignupFormData).name, data.email, data.password)
      : await login(data.email, data.password);

    if (result.success) {
      toast.success(isSignup ? 'Account created!' : 'Welcome back!');
      navigate('/');
    } else {
      toast.error(result.message || 'Something went wrong');
    }
  };

  const toggle = () => {
    setIsSignup(!isSignup);
    reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cinema-red/20 blur-[120px]" />
      </div>

      <motion.div className="card-glass relative z-10 w-full max-w-md p-8 md:p-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 text-center">
          <Link to="/" className="mb-4 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-cinema-red text-white"><Film size={22} /></div>
            <span className="text-gradient font-headline text-2xl font-extrabold tracking-tight">CineVault</span>
          </Link>
          <h1 className="mt-4 font-headline text-2xl font-bold text-on-surface">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm text-outline">{isSignup ? 'Start curating your watchlist' : 'Sign in to your cinematic experience'}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="auth-form" noValidate>
          {isSignup && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-secondary">Full Name</label>
              <input {...register('name')} id="name" placeholder="John Doe" className={`input-field ${errors.name ? 'input-error' : ''}`} autoComplete="name" />
              {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-secondary">Email Address</label>
            <input {...register('email')} id="email" type="email" placeholder="you@example.com" className={`input-field ${errors.email ? 'input-error' : ''}`} autoComplete="email" />
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-secondary">Password</label>
            <div className="relative">
              <input {...register('password')} id="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`} autoComplete={isSignup ? 'new-password' : 'current-password'} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer" onClick={() => setShowPw(!showPw)} aria-label="Toggle password">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3 mt-2" id="auth-submit-btn">
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-outline">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" className="font-semibold text-cinema-red hover:text-cinema-red-hover cursor-pointer" onClick={toggle} id="auth-toggle-btn">
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
