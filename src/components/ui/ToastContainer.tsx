import { useToastStore } from '@/stores/toastStore';
import { X } from 'lucide-react';

const styles: Record<string, string> = {
  success: 'bg-success/15 border-success/30 text-success',
  error: 'bg-cinema-red/15 border-cinema-red/30 text-error',
  info: 'bg-info/15 border-info/30 text-info',
};

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);
  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-glass max-w-[380px] animate-[slide-in_0.3s_ease-out] ${styles[t.type]}`}>
          <span className="flex-1">{t.message}</span>
          <button className="opacity-60 hover:opacity-100 transition-opacity shrink-0 cursor-pointer" onClick={() => removeToast(t.id)} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
