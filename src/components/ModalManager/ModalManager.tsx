import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import './ModalManager.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OpenModalOptions {
  id?: string;
  title?: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  minimizable?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  color?: string;
}

interface ModalEntry extends Required<Omit<OpenModalOptions, 'id'>> {
  id: string;
  minimized: boolean;
}

interface ModalManagerContextValue {
  openModal: (options: OpenModalOptions) => string;
  closeModal: (id: string) => void;
  minimizeModal: (id: string) => void;
  restoreModal: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ModalManagerContext = createContext<ModalManagerContextValue | null>(null);

export function useModal(): ModalManagerContextValue {
  const ctx = useContext(ModalManagerContext);
  if (!ctx) throw new Error('useModal must be used inside <ModalManagerProvider>');
  return ctx;
}

// ─── Size helpers ─────────────────────────────────────────────────────────────

const PRESET_SIZES: Record<string, number> = { sm: 400, md: 600, lg: 900, xl: 1200 };

function resolveSize(size: number | string): number {
  if (typeof size === 'number') return size;
  return PRESET_SIZES[size] ?? 600;
}

// ─── Single modal window ──────────────────────────────────────────────────────

function ModalWindow({
  entry,
  zIndex,
  onClose,
  onMinimize,
}: {
  entry: ModalEntry;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
}) {
  const width = resolveSize(entry.size);

  const handleOverlayClick = () => {
    if (entry.closeOnOverlayClick) onClose();
  };

  useEffect(() => {
    if (!entry.closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [entry.closeOnEscape, onClose]);

  return createPortal(
    <div className="smm-container" style={{ zIndex }} aria-modal="true" role="dialog">
      <div className="smm-overlay" onClick={handleOverlayClick} aria-hidden="true" />
      <div className="smm-window" style={{ maxWidth: width }}>
        <div className="smm-header">
          {entry.title && <span className="smm-title">{entry.title}</span>}
          <div className="smm-header-actions">
            {entry.minimizable && (
              <button
                type="button"
                className="smm-btn-icon"
                onClick={onMinimize}
                aria-label="Minimizar"
                title="Minimizar"
              >
                <MinimizeIcon />
              </button>
            )}
            <button
              type="button"
              className="smm-btn-icon"
              onClick={onClose}
              aria-label="Fechar"
              title="Fechar"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="smm-body">{entry.body}</div>
        {entry.footer && <div className="smm-footer">{entry.footer}</div>}
      </div>
    </div>,
    document.body
  );
}

// ─── Minimized tray ───────────────────────────────────────────────────────────

function MinimizedTray({
  modals,
  onRestore,
  onClose,
}: {
  modals: ModalEntry[];
  onRestore: (id: string) => void;
  onClose: (id: string) => void;
}) {
  if (modals.length === 0) return null;

  return createPortal(
    <div className="smm-tray">
      {modals.map((m) => {
        const bg = m.color || 'var(--single-primary)';
        return (
          <div key={m.id} className="smm-tray-item" style={{ backgroundColor: bg }}>
            <button
              type="button"
              className="smm-tray-restore"
              onClick={() => onRestore(m.id)}
              title="Restaurar"
            >
              <RestoreIcon />
              <span className="smm-tray-label">{m.title || 'Modal'}</span>
            </button>
            <button
              type="button"
              className="smm-tray-close"
              onClick={() => onClose(m.id)}
              aria-label="Fechar"
              title="Fechar"
            >
              <CloseIcon size={10} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

let _idCounter = 0;

export function ModalManagerProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalEntry[]>([]);
  const activeCount = useRef(0);

  // Lock body scroll when any modal is open (not minimized)
  const visibleCount = modals.filter((m) => !m.minimized).length;
  useEffect(() => {
    if (visibleCount > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visibleCount]);

  const openModal = useCallback((options: OpenModalOptions): string => {
    const id = options.id ?? `smm-${++_idCounter}`;
    const entry: ModalEntry = {
      id,
      title: options.title ?? '',
      body: options.body,
      footer: options.footer ?? null,
      size: options.size ?? 600,
      minimizable: options.minimizable ?? true,
      closeOnOverlayClick: options.closeOnOverlayClick ?? true,
      closeOnEscape: options.closeOnEscape ?? true,
      color: options.color ?? '',
      minimized: false,
    };
    setModals((prev) => {
      // Replace if same id already exists
      const exists = prev.findIndex((m) => m.id === id);
      if (exists !== -1) {
        const next = [...prev];
        next[exists] = entry;
        return next;
      }
      activeCount.current++;
      return [...prev, entry];
    });
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const minimizeModal = useCallback((id: string) => {
    setModals((prev) => prev.map((m) => m.id === id ? { ...m, minimized: true } : m));
  }, []);

  const restoreModal = useCallback((id: string) => {
    setModals((prev) => prev.map((m) => m.id === id ? { ...m, minimized: false } : m));
  }, []);

  const visible = modals.filter((m) => !m.minimized);
  const minimized = modals.filter((m) => m.minimized);

  return (
    <ModalManagerContext.Provider value={{ openModal, closeModal, minimizeModal, restoreModal }}>
      {children}
      {visible.map((m, i) => (
        <ModalWindow
          key={m.id}
          entry={m}
          zIndex={1000 + i * 10}
          onClose={() => closeModal(m.id)}
          onMinimize={() => minimizeModal(m.id)}
        />
      ))}
      <MinimizedTray
        modals={minimized}
        onRestore={restoreModal}
        onClose={closeModal}
      />
    </ModalManagerContext.Provider>
  );
}

ModalManagerProvider.displayName = 'ModalManagerProvider';

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

