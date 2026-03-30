import React, { forwardRef, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import './Navbar.css';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface NavbarSubItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  /** Defaults to true */
  visible?: boolean;
}

export interface NavbarSubGroup {
  id: string;
  label: string;
  items: NavbarSubItem[];
}

export interface NavbarMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Defaults to true */
  visible?: boolean;
  /** Sub-items grouped by category — shown on the right panel */
  groups?: NavbarSubGroup[];
  /** Flat sub-items (no grouping) — shown on the right panel */
  items?: NavbarSubItem[];
  href?: string;
  onClick?: () => void;
}

export interface NavbarMenuConfig {
  items: NavbarMenuItem[];
  searchPlaceholder?: string;
}

export interface NavbarProfileAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  visible?: boolean;
  divider?: boolean;
  danger?: boolean;
}

export interface NavbarProfile {
  name?: string;
  email?: string;
  /** Extra rows like [{ label: 'Tenancy', value: 'acme' }] */
  info?: { label: string; value: string }[];
  avatar?: string;
  actions?: NavbarProfileAction[];
}

export interface NavbarProps {
  logo?: React.ReactNode;
  brand?: string;
  /** Show hamburger button. Default true */
  showMenu?: boolean;
  onMenuToggle?: (open: boolean) => void;
  menuOpen?: boolean;
  /** Structured menu — renders two-panel layout with search */
  menu?: NavbarMenuConfig;
  /** Legacy: arbitrary drawer content */
  menuContent?: React.ReactNode;
  /** Extra elements in the right side of the bar (before profile) */
  actions?: React.ReactNode;
  profile?: NavbarProfile;
  /**
   * Contained mode: the menu panel is positioned relative to the navbar wrapper
   * instead of fixed to the viewport. Useful for demos or embedded contexts.
   * Default false.
   */
  contained?: boolean;
  /**
   * Background color of the navbar bar.
   * Accepts any CSS color value (hex, rgb, hsl, etc.).
   * Overrides the default `#1a1a1a`.
   * For finer control use CSS: `--navbar-bg`, `--navbar-text`, `--navbar-text-strong`, `--navbar-border`.
   */
  color?: string;
  className?: string;
}

// ─── Internal search index ────────────────────────────────────────────────────

interface IndexEntry {
  uid: string;
  label: string;
  category: string;
  href?: string;
  onClickFn?: () => void;
}

function buildIndex(config: NavbarMenuConfig): IndexEntry[] {
  const out: IndexEntry[] = [];
  for (const item of config.items.filter(i => i.visible !== false)) {
    if (item.groups) {
      for (const g of item.groups) {
        for (const s of g.items.filter(s => s.visible !== false)) {
          out.push({ uid: `${item.id}__${g.id}__${s.id}`, label: s.label, category: g.label, href: s.href, onClickFn: s.onClick });
        }
      }
    }
    if (item.items) {
      for (const s of item.items.filter(s => s.visible !== false)) {
        out.push({ uid: `${item.id}__${s.id}`, label: s.label, category: item.label, href: s.href, onClickFn: s.onClick });
      }
    }
  }
  return out;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function XSmIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Search results right panel ───────────────────────────────────────────────

function SearchResultsPanel({ query, results, onClose }: { query: string; results: IndexEntry[]; onClose: () => void }) {
  return (
    <div className="single-navbar__submenu">
      <h2 className="single-navbar__submenu-title">
        Search results for <em>"{query}"</em>
      </h2>
      {results.length === 0 ? (
        <p className="single-navbar__submenu-empty">No results found for "{query}".</p>
      ) : (
        <div className="single-navbar__search-results">
          {results.map(r => (
            <button
              key={r.uid}
              className="single-navbar__search-result"
              onClick={() => {
                r.onClickFn?.();
                if (r.href) window.location.href = r.href;
                onClose();
              }}
            >
              <span className="single-navbar__search-result-label">{r.label}</span>
              <span className="single-navbar__search-result-cat">{r.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sub-menu right panel ─────────────────────────────────────────────────────

function SubMenuPanel({ item, onClose }: { item: NavbarMenuItem; onClose: () => void }) {
  return (
    <div className="single-navbar__submenu">
      <h2 className="single-navbar__submenu-title">{item.label}</h2>
      {item.groups ? (
        <div className="single-navbar__submenu-groups">
          {item.groups.map(group => (
            <div key={group.id} className="single-navbar__submenu-group">
              <h3 className="single-navbar__submenu-group-title">{group.label}</h3>
              <ul className="single-navbar__submenu-list">
                {group.items.filter(s => s.visible !== false).map(sub => (
                  <li key={sub.id}>
                    <button
                      className="single-navbar__submenu-link"
                      onClick={() => { sub.onClick?.(); if (sub.href) window.location.href = sub.href; onClose(); }}
                    >
                      {sub.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : item.items ? (
        <ul className="single-navbar__submenu-list single-navbar__submenu-list--flat">
          {item.items.filter(s => s.visible !== false).map(sub => (
            <li key={sub.id}>
              <button
                className="single-navbar__submenu-link"
                onClick={() => { sub.onClick?.(); if (sub.href) window.location.href = sub.href; onClose(); }}
              >
                {sub.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

// ─── Two-panel menu ───────────────────────────────────────────────────────────

function MenuPanel({ config, onClose }: { config: NavbarMenuConfig; onClose: () => void }) {
  const visibleItems = config.items.filter(i => i.visible !== false);
  const [activeId, setActiveId] = useState<string>(visibleItems[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const searchIndex = useMemo(() => buildIndex(config), [config]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex.filter(r =>
      r.label.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    );
  }, [query, searchIndex]);

  const isSearching = query.trim().length > 0;
  const activeItem = visibleItems.find(i => i.id === activeId);
  const hasSubContent = activeItem && (activeItem.groups?.length || activeItem.items?.length);

  return (
    <div className="single-navbar__panel">
      {/* Left nav column */}
      <div className="single-navbar__panel-left">
        {/* Search */}
        <div className="single-navbar__panel-search-wrap">
          <span className="single-navbar__panel-search-icon"><SearchIcon /></span>
          <input
            ref={inputRef}
            type="text"
            className="single-navbar__panel-search"
            placeholder={config.searchPlaceholder ?? 'Search'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search"
          />
          {query && (
            <button
              className="single-navbar__panel-search-clear"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              aria-label="Clear search"
            >
              <XSmIcon />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="single-navbar__panel-nav">
          {visibleItems.map(item => (
            <button
              key={item.id}
              className={clsx(
                'single-navbar__panel-nav-item',
                { 'single-navbar__panel-nav-item--active': activeId === item.id && !isSearching }
              )}
              onClick={() => {
                setActiveId(item.id);
                setQuery('');
                if (!item.groups?.length && !item.items?.length) {
                  item.onClick?.();
                  if (item.href) window.location.href = item.href;
                  onClose();
                }
              }}
            >
              {item.icon && <span className="single-navbar__panel-nav-icon">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right content column */}
      <div className="single-navbar__panel-right">
        {isSearching ? (
          <SearchResultsPanel query={query} results={searchResults} onClose={onClose} />
        ) : hasSubContent ? (
          <SubMenuPanel item={activeItem} onClose={onClose} />
        ) : null}
      </div>
    </div>
  );
}

// ─── Profile dropdown ─────────────────────────────────────────────────────────

function ProfileDropdown({ profile, onClose }: { profile: NavbarProfile; onClose: () => void }) {
  const visibleActions = (profile.actions ?? []).filter(a => a.visible !== false);
  return (
    <div className="single-navbar__profile-panel" role="menu">
      <div className="single-navbar__profile-header">
        <div className="single-navbar__profile-avatar-lg">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name ?? 'avatar'} />
          ) : (
            <UserIcon />
          )}
        </div>
        <div className="single-navbar__profile-info">
          {profile.name && <span className="single-navbar__profile-name">{profile.name}</span>}
          {profile.email && <span className="single-navbar__profile-email">{profile.email}</span>}
          {(profile.info ?? []).map((row, i) => (
            <span key={i} className="single-navbar__profile-row">
              <span className="single-navbar__profile-row-label">{row.label}:</span>{' '}{row.value}
            </span>
          ))}
        </div>
      </div>
      {visibleActions.length > 0 && (
        <div className="single-navbar__profile-actions">
          {visibleActions.map(action => (
            <React.Fragment key={action.id}>
              {action.divider && <div className="single-navbar__profile-divider" />}
              <button
                className={clsx('single-navbar__profile-action', { 'single-navbar__profile-action--danger': action.danger })}
                onClick={() => { action.onClick?.(); onClose(); }}
                role="menuitem"
              >
                {action.icon && <span className="single-navbar__profile-action-icon">{action.icon}</span>}
                {action.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Overlay + drawer ─────────────────────────────────────────────────────────

function MenuOverlay({ open, wide, contained, onClose, children }: {
  open: boolean;
  wide?: boolean;
  contained?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  return (
    <>
      <div
        className={clsx('single-navbar__overlay', {
          'single-navbar__overlay--open': open,
          'single-navbar__overlay--below': wide && !contained,
          'single-navbar__overlay--contained': contained,
        })}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={clsx('single-navbar__drawer', {
          'single-navbar__drawer--open': open,
          'single-navbar__drawer--wide': wide,
          'single-navbar__drawer--contained': contained,
        })}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ logo, brand, showMenu = true, onMenuToggle, menuOpen: controlledMenuOpen, menu, menuContent, actions, profile, contained = false, color, className }, ref) => {
    const isControlled = controlledMenuOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const menuOpen = isControlled ? controlledMenuOpen! : internalOpen;

    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const toggleMenu = useCallback(() => {
      const next = !menuOpen;
      if (!isControlled) setInternalOpen(next);
      onMenuToggle?.(next);
    }, [menuOpen, isControlled, onMenuToggle]);

    const closeMenu = useCallback(() => {
      if (!isControlled) setInternalOpen(false);
      onMenuToggle?.(false);
    }, [isControlled, onMenuToggle]);

    useEffect(() => {
      if (!profileOpen) return;
      const h = (e: MouseEvent) => {
        if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      };
      document.addEventListener('mousedown', h);
      return () => document.removeEventListener('mousedown', h);
    }, [profileOpen]);

    useEffect(() => {
      if (!profileOpen) return;
      const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setProfileOpen(false); };
      document.addEventListener('keydown', h);
      return () => document.removeEventListener('keydown', h);
    }, [profileOpen]);

    const hasDrawer = showMenu && (menu || menuContent);

    const wrapClass = contained ? 'single-navbar__contained-wrap' : undefined;

    return (
      <div className={wrapClass}>
        <header
          ref={ref}
          className={clsx('single-navbar', className)}
          style={color ? { '--navbar-bg': color } as React.CSSProperties : undefined}
        >
          <div className="single-navbar__inner">
            {/* Left */}
            <div className="single-navbar__left">
              {showMenu && (
                <button
                  className="single-navbar__menu-btn"
                  onClick={toggleMenu}
                  aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                  aria-expanded={menuOpen}
                >
                  <HamburgerIcon />
                </button>
              )}
              <div className="single-navbar__brand">
                {logo ?? (brand && <span className="single-navbar__brand-text">{brand}</span>)}
              </div>
            </div>

            {/* Right */}
            <div className="single-navbar__right">
              {actions && <div className="single-navbar__actions">{actions}</div>}
              {profile && (
                <div className="single-navbar__profile-wrap" ref={profileRef}>
                  <button
                    className={clsx('single-navbar__profile-btn', { 'single-navbar__profile-btn--open': profileOpen })}
                    onClick={() => setProfileOpen(o => !o)}
                    aria-label="Perfil"
                    aria-expanded={profileOpen}
                    aria-haspopup="menu"
                  >
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name ?? 'avatar'} className="single-navbar__profile-avatar" />
                    ) : (
                      <span className="single-navbar__profile-fallback">
                        {profile.name
                          ? profile.name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
                          : <UserIcon />}
                      </span>
                    )}
                  </button>
                  {profileOpen && (
                    <ProfileDropdown profile={profile} onClose={() => setProfileOpen(false)} />
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {hasDrawer && (
          <MenuOverlay open={menuOpen} wide={!!menu} contained={contained} onClose={closeMenu}>
            {menu ? (
              <MenuPanel config={menu} onClose={closeMenu} />
            ) : (
              menuContent
            )}
          </MenuOverlay>
        )}
      </div>
    );
  }
);

Navbar.displayName = 'Navbar';
