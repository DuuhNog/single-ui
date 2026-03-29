import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import './Toast.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  duration?: number;
  variant?: ToastVariant;
}

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  title?: string;
  /** whether the item is animating out */
  dismissing: boolean;
}

interface ToastContextValue {
  addToast: (message: string, options?: ToastOptions) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Icons ────────────────────────────────────────────────────────────────────

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
        fill="currentColor"
      />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-13a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V5zm-1 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
        fill="currentColor"
      />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm-1-5a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1z"
        fill="currentColor"
      />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M18 10a8 8 0 1 0-16 0 8 8 0 0 0 16 0zm-7-4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm-1 7a1 1 0 0 1-1-1V9a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1z"
        fill="currentColor"
      />
    </svg>
  ),
};

// ─── Single ToastItem component ───────────────────────────────────────────────

interface ToastItemProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastItemComponent: React.FC<ToastItemProps> = ({ item, onDismiss }) => {
  const [paused, setPaused] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);

  // Auto-dismiss
  useEffect(() => {
    if (paused) return;

    const remaining = item.duration - elapsedRef.current;
    const timer = setTimeout(() => {
      onDismiss(item.id);
    }, remaining);

    const tick = setInterval(() => {
      if (!paused && progressRef.current) {
        const elapsed = elapsedRef.current + (Date.now() - startTimeRef.current);
        const pct = Math.min((elapsed / item.duration) * 100, 100);
        progressRef.current.style.transform = `scaleX(${1 - pct / 100})`;
      }
    }, 16);

    return () => {
      clearTimeout(timer);
      clearInterval(tick);
      elapsedRef.current += Date.now() - startTimeRef.current;
    };
  }, [paused, item.id, item.duration, onDismiss]);

  // Reset start time when unpaused
  useEffect(() => {
    if (!paused) {
      startTimeRef.current = Date.now();
    }
  }, [paused]);

  const classes = clsx(
    'single-toast',
    `single-toast--${item.variant}`,
    { 'single-toast--dismissing': item.dismissing }
  );

  return (
    <div
      className={classes}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className={clsx('single-toast__icon', `single-toast__icon--${item.variant}`)}>
        {ICONS[item.variant]}
      </span>

      <div className="single-toast__body">
        {item.title && <p className="single-toast__title">{item.title}</p>}
        <p className="single-toast__message">{item.message}</p>
      </div>

      <button
        type="button"
        className="single-toast__close"
        onClick={() => onDismiss(item.id)}
        aria-label="Fechar notificação"
      >
        ×
      </button>

      <div className={clsx('single-toast__progress', `single-toast__progress--${item.variant}`)}>
        <div
          ref={progressRef}
          className="single-toast__progress-bar"
          style={{ animationDuration: `${item.duration}ms`, animationPlayState: paused ? 'paused' : 'running' }}
        />
      </div>
    </div>
  );
};

// ─── ToastContainer ───────────────────────────────────────────────────────────

interface ToastContainerProps {
  items: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ items, onDismiss }) => {
  if (items.length === 0) return null;

  return createPortal(
    <div className="single-toast-container" aria-label="Notificações">
      {items.map((item) => (
        <ToastItemComponent key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  );
};

// ─── ToastProvider ────────────────────────────────────────────────────────────

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    // mark as dismissing first for animation
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t))
    );
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((message: string, options: ToastOptions = {}) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newItem: ToastItem = {
      id,
      message,
      variant: options.variant ?? 'info',
      duration: options.duration ?? 4000,
      title: options.title,
      dismissing: false,
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

// ─── useToast hook ────────────────────────────────────────────────────────────

type ToastFn = (message: string, options?: Omit<ToastOptions, 'variant'>) => void;

interface UseToastReturn {
  toast: {
    (message: string, options?: ToastOptions): void;
    success: ToastFn;
    error: ToastFn;
    warning: ToastFn;
    info: ToastFn;
  };
}

export function useToast(): UseToastReturn {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast } = ctx;

  const toast = useCallback(
    (message: string, options?: ToastOptions) => {
      addToast(message, options);
    },
    [addToast]
  ) as UseToastReturn['toast'];

  toast.success = useCallback(
    (message, options) => addToast(message, { ...options, variant: 'success' }),
    [addToast]
  );
  toast.error = useCallback(
    (message, options) => addToast(message, { ...options, variant: 'error' }),
    [addToast]
  );
  toast.warning = useCallback(
    (message, options) => addToast(message, { ...options, variant: 'warning' }),
    [addToast]
  );
  toast.info = useCallback(
    (message, options) => addToast(message, { ...options, variant: 'info' }),
    [addToast]
  );

  return { toast };
}
