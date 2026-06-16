import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Film, BookmarkPlus, LogOut, LogIn, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setOpen(false);
  };

  const active = (p: string) => location.pathname === p;

  const links = [
    { to: '/', label: 'Discover', icon: <Film size={18} /> },
    ...(isAuthenticated ? [{ to: '/watchlist', label: 'Watchlist', icon: <BookmarkPlus size={18} /> }] : []),
  ];

  return (
    <nav className="glass fixed top-0 inset-x-0 z-50 border-b border-glass-border" id="main-navbar">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 md:px-10">
        <Link to="/" className="flex items-center gap-2 shrink-0" id="navbar-logo">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-cinema-red text-white"><Film size={20} /></div>
          <span className="text-gradient font-headline text-xl font-extrabold tracking-tight">CineVault</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${active(l.to) ? 'bg-cinema-red/15 text-cinema-red' : 'text-on-surface/70 hover:bg-white/5 hover:text-on-surface'}`}>
              {l.icon}<span>{l.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-high text-on-surface"><User size={16} /></div>
              <span className="max-w-[120px] truncate text-sm text-secondary">{user?.name}</span>
              <button className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-on-surface/60 transition-all hover:bg-white/5 hover:text-on-surface cursor-pointer" onClick={handleLogout} id="navbar-logout-btn">
                <LogOut size={16} /><span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary !py-2 !px-5 !text-sm" id="navbar-login-btn"><LogIn size={16} /><span>Sign In</span></Link>
          )}
        </div>

        <button className="text-on-surface md:hidden cursor-pointer" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="glass overflow-hidden border-t border-glass-border md:hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={`flex w-full items-center gap-3 px-5 py-4 text-base font-medium ${active(l.to) ? 'text-cinema-red' : 'text-on-surface hover:bg-white/5'}`} onClick={() => setOpen(false)}>
                {l.icon}<span>{l.label}</span>
              </Link>
            ))}
            <div className="border-t border-glass-border">
              {isAuthenticated ? (
                <button className="flex w-full items-center gap-3 px-5 py-4 text-base text-on-surface hover:bg-white/5 cursor-pointer" onClick={handleLogout}><LogOut size={18} /><span>Logout</span></button>
              ) : (
                <Link to="/login" className="flex w-full items-center gap-3 px-5 py-4 text-base text-cinema-red hover:bg-white/5" onClick={() => setOpen(false)}><LogIn size={18} /><span>Sign In</span></Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
