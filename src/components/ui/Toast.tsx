import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'info' | 'error';
interface Toast { id: number; type: ToastType; message: string; }

const ToastCtx = createContext<(type: ToastType, message: string) => void>(() => {});

export function useToast() { return useContext(ToastCtx); }

const icons = { success: CheckCircle2, warning: AlertTriangle, info: Info, error: XCircle };
const colors = {
  success: 'text-success-600 bg-success-50 border-success-200',
  warning: 'text-medium-600 bg-medium-50 border-medium-200',
  info: 'text-brand-600 bg-brand-50 border-brand-200',
  error: 'text-critical-600 bg-critical-50 border-critical-200',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2.5">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-pop bg-white animate-fade-in-up ${colors[t.type]}`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium text-slate-700">{t.message}</span>
              <button
                onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
                className="ml-2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
