import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import Navbar from '@/components/layout/Navbar';
import ToastContainer from '@/components/ui/ToastContainer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// ── Code-split pages ─────────────────────────────────────────────
const DiscoverPage = lazy(() => import('@/pages/DiscoverPage'));
const MovieDetailPage = lazy(() => import('@/pages/MovieDetailPage'));
const MovieFormPage = lazy(() => import('@/pages/MovieFormPage'));
const WatchlistPage = lazy(() => import('@/pages/WatchlistPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 size={32} className="animate-spin text-cinema-red" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <ToastContainer />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/movies/new" element={<ProtectedRoute><MovieFormPage /></ProtectedRoute>} />
            <Route path="/movies/:id/edit" element={<ProtectedRoute><MovieFormPage /></ProtectedRoute>} />
            <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
