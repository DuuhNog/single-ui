import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
} from 'react';
import { clsx } from 'clsx';
import './RichEditor.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PageModel = 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal';

export interface RichEditorMargin {
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
}

export interface RichEditorConfig {
  modelpage: PageModel;
  margin: RichEditorMargin;
}

export interface RichEditorValue {
  header: string;
  footer: string;
  body: string;
}

export interface RichEditorSnippet {
  value: string;
  label: string;
}

export interface RichEditorSnippetGroup {
  group: string;
  items: RichEditorSnippet[];
}

export interface RichEditorProps {
  config: RichEditorConfig;
  value: RichEditorValue;
  onChange: (value: RichEditorValue) => void;
  snippets?: RichEditorSnippet[] | RichEditorSnippetGroup[];
  snippetLabel?: string;
  placeholder?: string;
  readOnly?: boolean;
  /** Fixed height of the canvas area (enables scroll). Eg: 600 or '70vh' */
  height?: number | string;
  /** Initial zoom level (50–200). Default: 100 */
  defaultZoom?: number;
  /**
   * Called when the print button is clicked.
   * Receives the current HTML value so you can use your own print/export logic.
   * If not provided, generates a PDF via the browser print dialog (no new window).
   */
  onPrint?: (value: RichEditorValue) => void;
  className?: string;
}

export interface RichEditorRef {
  print: () => void;
  getHTML: () => RichEditorValue;
  focus: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MM_TO_PX   = 3.7795;
const PAGE_SEP   = '<!--RE_PAGE-->'; // serialization separator for multi-page body
const ZOOM_OPTS  = [50, 75, 90, 100, 110, 125, 150, 200];

const PAGE_DIMENSIONS: Record<PageModel, { width: number; height: number }> = {
  A4:     { width: Math.round(210   * MM_TO_PX), height: Math.round(297   * MM_TO_PX) },
  A3:     { width: Math.round(297   * MM_TO_PX), height: Math.round(420   * MM_TO_PX) },
  A5:     { width: Math.round(148   * MM_TO_PX), height: Math.round(210   * MM_TO_PX) },
  Letter: { width: Math.round(215.9 * MM_TO_PX), height: Math.round(279.4 * MM_TO_PX) },
  Legal:  { width: Math.round(215.9 * MM_TO_PX), height: Math.round(355.6 * MM_TO_PX) },
};

const FONT_FAMILIES = [
  'Arial', 'Courier New', 'Georgia', 'Helvetica Neue',
  'Segoe UI', 'Times New Roman', 'Trebuchet MS', 'Verdana',
];
const FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

// Header/footer zone height inside each page box
const HEADER_H = 44;
const FOOTER_H = 36;

// Approximate px width of each snippet group column (label + 2 buttons)
const SNIP_COL_W = 132;

type ActiveFocus = 'header' | 'footer' | 'body' | null;
type ActiveTab   = 'home' | string; // 'snippets_0', 'snippets_1', ...

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mmToPx(mm: number): number {
  return Math.round(mm * MM_TO_PX);
}

function applyFontSize(container: HTMLElement, sizePt: string): void {
  document.execCommand('fontSize', false, '7');
  container.querySelectorAll<HTMLElement>('font[size="7"]').forEach(el => {
    const span = document.createElement('span');
    span.style.fontSize = `${sizePt}pt`;
    while (el.firstChild) span.appendChild(el.firstChild);
    el.replaceWith(span);
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function parsePages(body: string): string[] {
  const parts = body.split(PAGE_SEP);
  return parts.length > 0 ? parts : [''];
}

function serializePages(pages: string[]): string {
  return pages.join(PAGE_SEP);
}

function isGrouped(arr: RichEditorSnippet[] | RichEditorSnippetGroup[]): arr is RichEditorSnippetGroup[] {
  return arr.length > 0 && 'group' in arr[0];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const icons = {
  undo:    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>,
  redo:    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>,
  bold:    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 11.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>,
  italic:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>,
  under:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>,
  strike:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>,
  sub:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 18h-2v1h3v1h-4v-2c0-.55.45-1 1-1h2v-1h-3v-1h3c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1zM5.88 18h2.66l3.49-5.47L15.53 18h2.66l-4.81-7.47 4.54-7.03h-2.66L12 8.38 8.73 3.5H6.08l4.56 7.03L5.88 18z"/></svg>,
  sup:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-2v1h3v1h-4V7c0-.55.45-1 1-1h2V5h-3V4h3c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1zM5.88 20h2.66l3.49-5.47L15.53 20h2.66l-4.81-7.47 4.54-7.03h-2.66L12 10.38 8.73 5.5H6.08l4.56 7.03L5.88 20z"/></svg>,
  alignL:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>,
  alignC:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>,
  alignR:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>,
  justify: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg>,
  ulList:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>,
  olList:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>,
  indentR: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>,
  indentL: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 17h10v-2H11v2zM3 12l4 4V8l-4 4zm-2 9h18v-2H1v2zM1 3v2h18V3H1zm10 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>,
  image:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  print:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>,
  textA:   <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"/></svg>,
  highlight:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l-3 3 1 3 3-1 9-9-4-4-6 8zM18.5 3c-.37 0-.74.14-1.02.42l-2.08 2.08 4 4 2.08-2.08A1.45 1.45 0 0 0 18.5 3z"/></svg>,
};

// ─── ToolBtn ──────────────────────────────────────────────────────────────────

interface ToolBtnProps {
  title: string;
  active?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}
function ToolBtn({ title, active, onMouseDown, children }: ToolBtnProps) {
  return (
    <button
      type="button"
      title={title}
      className={clsx('re-btn', { 're-btn--on': active })}
      onMouseDown={onMouseDown}
    >
      {children}
    </button>
  );
}

// ─── ImgOverlay ───────────────────────────────────────────────────────────────

interface ImgOverlayProps {
  img: HTMLImageElement | null;
  visible: boolean;
  getRect: () => { left: number; top: number; width: number; height: number } | null;
  onResizeE:  (e: React.MouseEvent) => void;
  onResizeSE: (e: React.MouseEvent) => void;
  onResizeS:  (e: React.MouseEvent) => void;
  onDeselect: () => void;
}
function ImgOverlay({ img, visible, getRect, onResizeE, onResizeSE, onResizeS, onDeselect }: ImgOverlayProps) {
  if (!img || !visible) return null;
  const r = getRect();
  if (!r) return null;
  return (
    <div className="re-img-sel" style={{ left: r.left, top: r.top, width: r.width, height: r.height }}>
      <div className="re-img-handle re-img-handle--se" onMouseDown={onResizeSE} />
      <div className="re-img-handle re-img-handle--e"  onMouseDown={onResizeE} />
      <div className="re-img-handle re-img-handle--s"  onMouseDown={onResizeS} />
      <button className="re-img-close" onMouseDown={e => { e.preventDefault(); onDeselect(); }} title="Deselecionar">✕</button>
    </div>
  );
}

// ─── RichEditor ───────────────────────────────────────────────────────────────

const RichEditor = forwardRef<RichEditorRef, RichEditorProps>(
  (
    {
      config,
      value,
      onChange,
      snippets = [],
      snippetLabel: _sl = 'Inserir campo:', // eslint-disable-line @typescript-eslint/no-unused-vars
      placeholder = 'Digite o conteúdo aqui...',
      readOnly = false,
      height,
      defaultZoom = 100,
      onPrint,
      className,
    },
    ref
  ) => {
    // ── State ─────────────────────────────────────────────────────────────────
    const [activeTab,       setActiveTab]       = useState<ActiveTab>('home');
    const [activeFocus,     setActiveFocus]     = useState<ActiveFocus>(null);
    const [activePageIdx,   setActivePageIdx]   = useState(0);
    const [zoom,            setZoom]            = useState(defaultZoom);
    const [pages,           setPages]           = useState<string[]>(() => parsePages(value.body));
    const [fontFamily,      setFontFamily]      = useState('Arial');
    const [fontSize,        setFontSize]        = useState('12');
    const [textColor,       setTextColor]       = useState('#000000');
    const [hiliteColor,     setHiliteColor]     = useState('#FFFF00');
    const [selectedImg,     setSelectedImg]     = useState<HTMLImageElement | null>(null);
    const [snipColsPerTab,  setSnipColsPerTab]  = useState(6);
    const [measuredHeaderH, setMeasuredHeaderH] = useState(HEADER_H);
    const [measuredFooterH, setMeasuredFooterH] = useState(FOOTER_H);

    // ── Refs ──────────────────────────────────────────────────────────────────
    const pageBodyRefs   = useRef<(HTMLDivElement | null)[]>([]);
    const allHeaderRefs  = useRef<(HTMLDivElement | null)[]>([]);
    const allFooterRefs  = useRef<(HTMLDivElement | null)[]>([]);
    const headerZoneRef  = useRef<HTMLDivElement>(null);
    const footerZoneRef  = useRef<HTMLDivElement>(null);
    const fileInputRef   = useRef<HTMLInputElement>(null);
    const savedRangeRef  = useRef<Range | null>(null);
    const savedFocusRef  = useRef<ActiveFocus>(null);
    const savedPageRef   = useRef(0);
    const toolbarRef     = useRef<HTMLDivElement>(null);
    const prevPagesLen   = useRef(pages.length);

    // ── Page dimensions ───────────────────────────────────────────────────────
    const pageSize       = PAGE_DIMENSIONS[config.modelpage];
    const marginTopPx    = mmToPx(config.margin.marginTop);
    const marginBottomPx = mmToPx(config.margin.marginBottom);
    const marginLeftPx   = mmToPx(config.margin.marginLeft);
    const marginRightPx  = mmToPx(config.margin.marginRight);

    // Use measured actual zone heights so body height stays accurate even when
    // header/footer have multiple lines added by the user.
    const pageBodyH = Math.max(100,
      pageSize.height - marginTopPx - marginBottomPx - measuredHeaderH - measuredFooterH
    );

    // ── Snippet groups normalization ──────────────────────────────────────────
    const snippetGroups = useMemo<RichEditorSnippetGroup[]>(() => {
      if (!snippets || snippets.length === 0) return [];
      if (isGrouped(snippets)) return snippets;
      // flat array → single unnamed group
      return [{ group: '', items: snippets as RichEditorSnippet[] }];
    }, [snippets]);

    // Distribute groups into tab pages based on available toolbar width
    const snippetTabPages = useMemo<RichEditorSnippetGroup[][]>(() => {
      if (snippetGroups.length === 0) return [];
      const pages: RichEditorSnippetGroup[][] = [];
      for (let i = 0; i < snippetGroups.length; i += snipColsPerTab) {
        pages.push(snippetGroups.slice(i, i + snipColsPerTab));
      }
      return pages;
    }, [snippetGroups, snipColsPerTab]);

    // Measure actual header zone height (page 0) to keep body height accurate
    useEffect(() => {
      if (!headerZoneRef.current) return;
      const ro = new ResizeObserver(() => {
        const h = headerZoneRef.current?.offsetHeight ?? HEADER_H;
        setMeasuredHeaderH(h);
      });
      ro.observe(headerZoneRef.current);
      return () => ro.disconnect();
    }, []);

    // Measure actual footer zone height (page 0)
    useEffect(() => {
      if (!footerZoneRef.current) return;
      const ro = new ResizeObserver(() => {
        const h = footerZoneRef.current?.offsetHeight ?? FOOTER_H;
        setMeasuredFooterH(h);
      });
      ro.observe(footerZoneRef.current);
      return () => ro.disconnect();
    }, []);

    // Measure toolbar width to compute columns per tab
    useEffect(() => {
      if (!toolbarRef.current) return;
      const ro = new ResizeObserver(() => {
        const w = toolbarRef.current?.clientWidth ?? 0;
        const cols = Math.max(1, Math.floor((w - 20) / SNIP_COL_W));
        setSnipColsPerTab(cols);
      });
      ro.observe(toolbarRef.current);
      return () => ro.disconnect();
    }, []);

    // ── Initial content load ──────────────────────────────────────────────────
    useLayoutEffect(() => {
      pages.forEach((html, i) => {
        const el = pageBodyRefs.current[i];
        if (el) el.innerHTML = html;
      });
      allHeaderRefs.current.forEach(r => { if (r) r.innerHTML = value.header; });
      allFooterRefs.current.forEach(r => { if (r) r.innerHTML = value.footer; });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Sync header/footer to all pages (including newly added) ──────────────
    useLayoutEffect(() => {
      allHeaderRefs.current.forEach(r => {
        if (r && r.innerHTML !== value.header) r.innerHTML = value.header;
      });
      allFooterRefs.current.forEach(r => {
        if (r && r.innerHTML !== value.footer) r.innerHTML = value.footer;
      });
    }, [pages.length]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Sync external body changes ────────────────────────────────────────────
    useEffect(() => {
      const currentSerialized = serializePages(pages);
      if (currentSerialized === value.body) return;
      const newPages = parsePages(value.body);
      setPages(newPages);
      newPages.forEach((html, i) => {
        const el = pageBodyRefs.current[i];
        if (el && document.activeElement !== el && el.innerHTML !== html) {
          el.innerHTML = html;
        }
      });
    }, [value.body]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Sync external header/footer changes ──────────────────────────────────
    useEffect(() => {
      allHeaderRefs.current.forEach(r => {
        if (r && document.activeElement !== r && r.innerHTML !== value.header) {
          r.innerHTML = value.header;
        }
      });
    }, [value.header]);

    useEffect(() => {
      allFooterRefs.current.forEach(r => {
        if (r && document.activeElement !== r && r.innerHTML !== value.footer) {
          r.innerHTML = value.footer;
        }
      });
    }, [value.footer]);

    // ── Auto-add page when last page overflows ────────────────────────────────
    useEffect(() => {
      const lastEl = pageBodyRefs.current[pages.length - 1];
      if (!lastEl || pageBodyH <= 0) return;
      const ro = new ResizeObserver(() => {
        if (lastEl.scrollHeight > pageBodyH + 40) {
          setPages(prev => {
            if (prev[prev.length - 1] === '') return prev;
            return [...prev, ''];
          });
        }
      });
      ro.observe(lastEl);
      return () => ro.disconnect();
    }, [pages.length, pageBodyH]);

    // ── Auto-focus new page when created due to overflow ─────────────────────
    useEffect(() => {
      const prev = prevPagesLen.current;
      prevPagesLen.current = pages.length;
      if (pages.length <= prev) return;
      // Only auto-focus if user was typing in body
      if (savedFocusRef.current !== 'body') return;
      const newIdx = pages.length - 1;
      requestAnimationFrame(() => {
        const el = pageBodyRefs.current[newIdx];
        if (!el) return;
        el.focus();
        const range = document.createRange();
        range.setStart(el, 0);
        range.collapse(true);
        const sel = window.getSelection();
        if (sel) { sel.removeAllRanges(); sel.addRange(range); }
        setActivePageIdx(newIdx);
        setActiveFocus('body');
        savedPageRef.current = newIdx;
        savedFocusRef.current = 'body';
        savedRangeRef.current = range.cloneRange();
      });
    }, [pages.length]);

    // ── Selection ─────────────────────────────────────────────────────────────
    const saveSelection = useCallback(() => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
        savedFocusRef.current = activeFocus;
        savedPageRef.current  = activePageIdx;
      }
    }, [activeFocus, activePageIdx]);

    const restoreSelection = useCallback(() => {
      const range = savedRangeRef.current;
      if (!range) return;
      const sel = window.getSelection();
      if (sel) { sel.removeAllRanges(); sel.addRange(range); }
    }, []);

    const getActiveContainer = useCallback((): HTMLDivElement | null => {
      const f    = savedFocusRef.current ?? activeFocus;
      const pIdx = savedPageRef.current;
      if (f === 'header') return allHeaderRefs.current[pIdx] ?? allHeaderRefs.current[0] ?? null;
      if (f === 'footer') return allFooterRefs.current[pIdx] ?? allFooterRefs.current[0] ?? null;
      return pageBodyRefs.current[pIdx] ?? null;
    }, [activeFocus]);

    // ── Emit change ───────────────────────────────────────────────────────────
    const emitChange = useCallback(
      (container: HTMLElement, focus: ActiveFocus) => {
        const pIdx = savedPageRef.current;
        if (focus === 'header') {
          const html = container.innerHTML;
          allHeaderRefs.current.forEach(r => { if (r && r !== container) r.innerHTML = html; });
          onChange({ ...value, header: html });
        } else if (focus === 'footer') {
          const html = container.innerHTML;
          allFooterRefs.current.forEach(r => { if (r && r !== container) r.innerHTML = html; });
          onChange({ ...value, footer: html });
        } else {
          const idx       = pageBodyRefs.current.indexOf(container as HTMLDivElement);
          const pageIndex = idx >= 0 ? idx : pIdx;
          const newPages  = [...pages];
          newPages[pageIndex] = container.innerHTML;
          setPages(newPages);
          onChange({ ...value, body: serializePages(newPages) });
        }
      },
      [onChange, value, pages]
    );

    const execOnActive = useCallback(
      (cmd: string, val?: string) => {
        restoreSelection();
        document.execCommand(cmd, false, val);
        const c = getActiveContainer();
        if (c) emitChange(c, savedFocusRef.current ?? activeFocus);
      },
      [restoreSelection, getActiveContainer, emitChange, activeFocus]
    );

    // ── Auto-remove empty trailing pages after content deletion ─────────────
    useEffect(() => {
      if (pages.length <= 1) return;
      const timer = setTimeout(() => {
        // Walk from last page backwards, remove consecutive empty pages
        const bodyCopy = pages.map((p, i) => {
          const el = pageBodyRefs.current[i];
          return el ? el.innerHTML : p;
        });
        let trimTo = bodyCopy.length;
        while (trimTo > 1) {
          const html = bodyCopy[trimTo - 1].replace(/<br\s*\/?>/gi, '').trim();
          if (html === '' || html === '<div></div>' || html === '<p></p>') {
            trimTo--;
          } else {
            break;
          }
        }
        if (trimTo < pages.length) {
          const newPages = bodyCopy.slice(0, trimTo);
          setPages(newPages);
          onChange({ ...value, body: serializePages(newPages) });
          // Move focus back to last kept page if user was on a removed page
          if (activePageIdx >= trimTo) {
            const lastIdx = trimTo - 1;
            const el = pageBodyRefs.current[lastIdx];
            if (el) {
              el.focus();
              const range = document.createRange();
              range.selectNodeContents(el);
              range.collapse(false);
              const sel = window.getSelection();
              if (sel) { sel.removeAllRanges(); sel.addRange(range); }
              setActivePageIdx(lastIdx);
              savedPageRef.current = lastIdx;
            }
          }
        }
      }, 400);
      return () => clearTimeout(timer);
    }, [pages]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Generate PDF and download (uses jsPDF + html2canvas) ─────────────────
    const handlePrint = useCallback(async () => {
      const header    = allHeaderRefs.current[0]?.innerHTML ?? value.header;
      const footer    = allFooterRefs.current[0]?.innerHTML ?? value.footer;
      const bodyPages = pages.map((p, i) => pageBodyRefs.current[i]?.innerHTML ?? p);

      if (onPrint) {
        onPrint({ header, footer, body: serializePages(bodyPages) });
        return;
      }

      const pw = pageSize.width;
      const ph = pageSize.height;
      const mt = mmToPx(config.margin.marginTop);
      const mb = mmToPx(config.margin.marginBottom);
      const ml = mmToPx(config.margin.marginLeft);
      const mr = mmToPx(config.margin.marginRight);

      // Build an off-screen container with all pages rendered at native size
      const container = document.createElement('div');
      container.style.cssText = `position:fixed;left:-9999px;top:-9999px;width:${pw}px;background:#fff;`;

      bodyPages.forEach((body, idx) => {
        const page = document.createElement('div');
        page.style.cssText = `width:${pw}px;height:${ph}px;display:flex;flex-direction:column;overflow:hidden;background:#fff;box-sizing:border-box;`;

        const hdr = document.createElement('div');
        hdr.style.cssText = `flex-shrink:0;padding:${Math.round(mt * 0.45)}px ${mr}px 4px ${ml}px;font-family:Arial,sans-serif;font-size:9pt;color:#555;box-sizing:border-box;`;
        hdr.innerHTML = header;

        const bdy = document.createElement('div');
        bdy.style.cssText = `flex:1;padding:${Math.round(mt * 0.25)}px ${mr}px ${Math.round(mb * 0.25)}px ${ml}px;font-family:Arial,sans-serif;font-size:12pt;line-height:1.65;color:#1a1a1a;word-break:break-word;overflow:hidden;box-sizing:border-box;`;
        bdy.innerHTML = body;

        const ftr = document.createElement('div');
        ftr.style.cssText = `flex-shrink:0;padding:4px ${mr}px ${Math.round(mb * 0.45)}px ${ml}px;font-family:Arial,sans-serif;font-size:9pt;color:#555;box-sizing:border-box;`;
        ftr.innerHTML = footer;

        page.appendChild(hdr);
        page.appendChild(bdy);
        page.appendChild(ftr);
        if (idx > 0) {
          const gap = document.createElement('div');
          gap.style.cssText = `height:0;`;
          container.appendChild(gap);
        }
        container.appendChild(page);
      });

      document.body.appendChild(container);

      try {
        const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
          import('html2canvas'),
          import('jspdf'),
        ]);

        // A4 in mm: 210 x 297
        const pageMmW = config.modelpage === 'A3' ? 297 : config.modelpage === 'A5' ? 148 : config.modelpage === 'Legal' ? 215.9 : config.modelpage === 'Letter' ? 215.9 : 210;
        const pageMmH = config.modelpage === 'A3' ? 420 : config.modelpage === 'A5' ? 210 : config.modelpage === 'Legal' ? 355.6 : config.modelpage === 'Letter' ? 279.4 : 297;
        const orientation = pageMmW > pageMmH ? 'landscape' : 'portrait';

        const pdf = new jsPDF({ orientation, unit: 'mm', format: [pageMmW, pageMmH] });
        const pageEls = container.querySelectorAll<HTMLDivElement>('div[style*="height:' + ph + 'px"]');

        for (let i = 0; i < pageEls.length; i++) {
          const canvas = await html2canvas(pageEls[i] as HTMLElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: pw,
            height: ph,
          });
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, 0, pageMmW, pageMmH);
        }

        pdf.save('documento.pdf');
      } finally {
        document.body.removeChild(container);
      }
    }, [value, pages, onPrint, pageSize, config]);

    useImperativeHandle(ref, () => ({
      print:   handlePrint,
      getHTML: () => ({
        header: allHeaderRefs.current[0]?.innerHTML ?? value.header,
        footer: allFooterRefs.current[0]?.innerHTML ?? value.footer,
        body:   serializePages(
          pages.map((p, i) => pageBodyRefs.current[i]?.innerHTML ?? p)
        ),
      }),
      focus:   () => pageBodyRefs.current[0]?.focus(),
    }));

    // ── Header / Footer input (syncs all clones) ──────────────────────────────
    const handleHeaderInput = useCallback(
      (el: HTMLDivElement) => {
        const html = el.innerHTML;
        allHeaderRefs.current.forEach(r => { if (r && r !== el) r.innerHTML = html; });
        onChange({ ...value, header: html });
      },
      [onChange, value]
    );

    const handleFooterInput = useCallback(
      (el: HTMLDivElement) => {
        const html = el.innerHTML;
        allFooterRefs.current.forEach(r => { if (r && r !== el) r.innerHTML = html; });
        onChange({ ...value, footer: html });
      },
      [onChange, value]
    );

    // ── Page body input ───────────────────────────────────────────────────────
    const handlePageInput = useCallback(
      (pageIdx: number) => {
        const el = pageBodyRefs.current[pageIdx];
        if (!el) return;
        const newPages = [...pages];
        newPages[pageIdx] = el.innerHTML;
        setPages(newPages);
        onChange({ ...value, body: serializePages(newPages) });
      },
      [onChange, value, pages]
    );

    // ── Image: paste ──────────────────────────────────────────────────────────
    const handlePaste = useCallback(
      async (
        e: React.ClipboardEvent<HTMLDivElement>,
        focus: ActiveFocus,
        pageIdx: number
      ) => {
        const items   = Array.from(e.clipboardData.items);
        const imgItem = items.find(i => i.type.startsWith('image/'));
        if (!imgItem) return;
        e.preventDefault();
        const file = imgItem.getAsFile();
        if (!file) return;
        const b64       = await fileToBase64(file);
        const container =
          focus === 'header' ? allHeaderRefs.current[pageIdx] :
          focus === 'footer' ? allFooterRefs.current[pageIdx] :
          pageBodyRefs.current[pageIdx];
        if (!container) return;
        savedFocusRef.current = focus;
        savedPageRef.current  = pageIdx;
        restoreSelection();
        document.execCommand('insertHTML', false,
          `<img src="${b64}" style="max-width:100%;cursor:pointer" />`
        );
        emitChange(container, focus);
      },
      [restoreSelection, emitChange]
    );

    // ── Image: file picker ────────────────────────────────────────────────────
    const handleImageFile = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const b64       = await fileToBase64(file);
        const pIdx      = savedPageRef.current;
        const container = pageBodyRefs.current[pIdx];
        if (!container) return;
        restoreSelection();
        if (savedFocusRef.current !== 'body') {
          container.focus();
          const range = document.createRange();
          range.selectNodeContents(container);
          range.collapse(false);
          const sel = window.getSelection();
          if (sel) { sel.removeAllRanges(); sel.addRange(range); }
        }
        document.execCommand('insertHTML', false,
          `<img src="${b64}" style="max-width:100%;cursor:pointer" />`
        );
        emitChange(container, 'body');
        e.target.value = '';
      },
      [restoreSelection, emitChange]
    );

    // ── Image: click to select ────────────────────────────────────────────────
    const handleBodyClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        setSelectedImg(target as HTMLImageElement);
      } else {
        setSelectedImg(null);
      }
    }, []);

    // ── Image resize via drag ─────────────────────────────────────────────────
    const startImgResize = useCallback((e: React.MouseEvent) => {
      if (!selectedImg) return;
      e.preventDefault();
      const startX  = e.clientX;
      const startW  = selectedImg.offsetWidth;
      const onMove  = (ev: MouseEvent) => {
        const newW = Math.max(40, startW + ev.clientX - startX);
        selectedImg.style.width  = `${newW}px`;
        selectedImg.style.height = 'auto';
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup',   onUp);
        const pIdx = pageBodyRefs.current.findIndex(el => el?.contains(selectedImg ?? null));
        if (pIdx >= 0) {
          const el = pageBodyRefs.current[pIdx]!;
          const newPages = [...pages];
          newPages[pIdx] = el.innerHTML;
          setPages(newPages);
          onChange({ ...value, body: serializePages(newPages) });
        }
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup',   onUp);
    }, [selectedImg, pages, onChange, value]);

    // ── Font handlers ─────────────────────────────────────────────────────────
    const handleFontFamily = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const f = e.target.value;
      setFontFamily(f);
      restoreSelection();
      document.execCommand('fontName', false, f);
      const c = getActiveContainer();
      if (c) emitChange(c, savedFocusRef.current ?? activeFocus);
    };

    const handleFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const s = e.target.value;
      setFontSize(s);
      restoreSelection();
      const c = getActiveContainer();
      if (c) { applyFontSize(c, s); emitChange(c, savedFocusRef.current ?? activeFocus); }
    };

    // ── Snippet insert at cursor ──────────────────────────────────────────────
    const insertSnippet = useCallback(
      (snippetVal: string) => {
        // If we have a saved range, restore it and insert there
        if (savedRangeRef.current) {
          restoreSelection();
          const container = getActiveContainer();
          if (container) {
            document.execCommand('insertHTML', false, snippetVal);
            emitChange(container, savedFocusRef.current);
            return;
          }
        }
        // Fallback: insert at end of current page body
        const pageIdx = savedPageRef.current;
        const container = pageBodyRefs.current[pageIdx] ?? pageBodyRefs.current[0];
        if (!container) return;
        container.focus();
        const range = document.createRange();
        range.selectNodeContents(container);
        range.collapse(false);
        const sel = window.getSelection();
        if (sel) { sel.removeAllRanges(); sel.addRange(range); }
        document.execCommand('insertHTML', false, snippetVal);
        const newPages = [...pages];
        const idx = pageBodyRefs.current.indexOf(container);
        newPages[idx >= 0 ? idx : pageIdx] = container.innerHTML;
        setPages(newPages);
        onChange({ ...value, body: serializePages(newPages) });
      },
      [restoreSelection, getActiveContainer, emitChange, pages, onChange, value]
    );

    // ── Ref helper ────────────────────────────────────────────────────────────
    const setPageBodyRef = (i: number) => (el: HTMLDivElement | null) => {
      pageBodyRefs.current[i] = el;
    };
    const setHeaderRef = (i: number) => (el: HTMLDivElement | null) => {
      allHeaderRefs.current[i] = el;
    };
    const setFooterRef = (i: number) => (el: HTMLDivElement | null) => {
      allFooterRefs.current[i] = el;
    };

    // ── Image overlay — position relative to body-wrap using getBoundingClientRect
    // This is robust against zoom transforms and nested positioning contexts.
    const selectedImgPageIdx = selectedImg
      ? pageBodyRefs.current.findIndex(el => el?.contains(selectedImg))
      : -1;

    const getImgOverlayRect = useCallback((img: HTMLImageElement, pageIdx: number) => {
      // body-wrap is the parent of the contenteditable (pageBodyRef)
      const bodyWrap = pageBodyRefs.current[pageIdx]?.parentElement;
      if (!bodyWrap) return null;
      const imgRect  = img.getBoundingClientRect();
      const wrapRect = bodyWrap.getBoundingClientRect();
      // Divide by zoom to convert from visual (CSS-pixel × scale) to layout pixels
      const scale = zoom / 100;
      return {
        left:   (imgRect.left   - wrapRect.left)   / scale,
        top:    (imgRect.top    - wrapRect.top)    / scale,
        width:  imgRect.width  / scale,
        height: imgRect.height / scale,
      };
    }, [zoom]);

    // ── Build tab list ────────────────────────────────────────────────────────
    const snippetTabLabels = snippetTabPages.map((_, i) =>
      i === 0 ? 'Snippets' : `Snippets ${i + 1}`
    );

    return (
      <div
        className={clsx('re-root', className)}
        style={{ height: height ?? '75vh' }}
      >

        {/* ── Toolbar ─────────────────────────────────────────────────── */}
        <div className="re-toolbar" ref={toolbarRef}>
          <div className="re-tabs">
            <button
              className={clsx('re-tab', { 're-tab--on': activeTab === 'home' })}
              onClick={() => setActiveTab('home')}
            >
              Início
            </button>
            {snippetTabLabels.map((label, i) => (
              <button
                key={i}
                className={clsx('re-tab', { 're-tab--on': activeTab === `snippets_${i}` })}
                onClick={() => setActiveTab(`snippets_${i}`)}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'home' && (
            <div className="re-ribbon">
              <ToolBtn title="Desfazer (Ctrl+Z)" onMouseDown={e => { e.preventDefault(); execOnActive('undo'); }}>{icons.undo}</ToolBtn>
              <ToolBtn title="Refazer (Ctrl+Y)"  onMouseDown={e => { e.preventDefault(); execOnActive('redo'); }}>{icons.redo}</ToolBtn>
              <span className="re-sep" />

              <select className="re-sel re-sel--font" value={fontFamily} title="Fonte"   onMouseDown={saveSelection} onChange={handleFontFamily}>
                {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <select className="re-sel re-sel--size" value={fontSize}   title="Tamanho" onMouseDown={saveSelection} onChange={handleFontSize}>
                {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="re-sep" />

              <ToolBtn title="Negrito (Ctrl+B)"    onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('bold'); }}>{icons.bold}</ToolBtn>
              <ToolBtn title="Itálico (Ctrl+I)"    onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('italic'); }}>{icons.italic}</ToolBtn>
              <ToolBtn title="Sublinhado (Ctrl+U)" onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('underline'); }}>{icons.under}</ToolBtn>
              <ToolBtn title="Tachado"             onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('strikeThrough'); }}>{icons.strike}</ToolBtn>
              <ToolBtn title="Subscrito"           onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('subscript'); }}>{icons.sub}</ToolBtn>
              <ToolBtn title="Sobrescrito"         onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('superscript'); }}>{icons.sup}</ToolBtn>
              <span className="re-sep" />

              <label className="re-color-btn" title="Cor do texto">
                <span className="re-color-icon">{icons.textA}<span className="re-color-bar" style={{ background: textColor }} /></span>
                <input type="color" className="re-color-input" value={textColor} onMouseDown={saveSelection}
                  onChange={e => {
                    setTextColor(e.target.value); restoreSelection();
                    document.execCommand('foreColor', false, e.target.value);
                    const c = getActiveContainer(); if (c) emitChange(c, savedFocusRef.current ?? activeFocus);
                  }} />
              </label>
              <label className="re-color-btn" title="Cor de realce">
                <span className="re-color-icon">{icons.highlight}<span className="re-color-bar" style={{ background: hiliteColor }} /></span>
                <input type="color" className="re-color-input" value={hiliteColor} onMouseDown={saveSelection}
                  onChange={e => {
                    setHiliteColor(e.target.value); restoreSelection();
                    document.execCommand('hiliteColor', false, e.target.value);
                    const c = getActiveContainer(); if (c) emitChange(c, savedFocusRef.current ?? activeFocus);
                  }} />
              </label>
              <span className="re-sep" />

              <ToolBtn title="Alinhar à esquerda" onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('justifyLeft'); }}>{icons.alignL}</ToolBtn>
              <ToolBtn title="Centralizar"        onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('justifyCenter'); }}>{icons.alignC}</ToolBtn>
              <ToolBtn title="Alinhar à direita"  onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('justifyRight'); }}>{icons.alignR}</ToolBtn>
              <ToolBtn title="Justificar"         onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('justifyFull'); }}>{icons.justify}</ToolBtn>
              <span className="re-sep" />

              <ToolBtn title="Lista com marcadores" onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('insertUnorderedList'); }}>{icons.ulList}</ToolBtn>
              <ToolBtn title="Lista numerada"       onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('insertOrderedList'); }}>{icons.olList}</ToolBtn>
              <ToolBtn title="Aumentar recuo"       onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('indent'); }}>{icons.indentR}</ToolBtn>
              <ToolBtn title="Diminuir recuo"       onMouseDown={e => { e.preventDefault(); saveSelection(); execOnActive('outdent'); }}>{icons.indentL}</ToolBtn>
              <span className="re-sep" />

              <ToolBtn title="Inserir imagem" onMouseDown={e => { e.preventDefault(); saveSelection(); fileInputRef.current?.click(); }}>
                {icons.image}
              </ToolBtn>
              <input ref={fileInputRef} type="file" accept="image/*" className="re-hidden" onChange={handleImageFile} />
              <span className="re-sep" />

              <ToolBtn title="Imprimir / Salvar como PDF" onMouseDown={e => { e.preventDefault(); handlePrint(); }}>
                {icons.print}
              </ToolBtn>
            </div>
          )}

          {snippetTabPages.map((groups, tabIdx) =>
            activeTab === `snippets_${tabIdx}` ? (
              <div key={tabIdx} className="re-ribbon re-ribbon--snippets">
                {groups.map((group, gIdx) => (
                  <div key={gIdx} className="re-snip-col">
                    {group.group && (
                      <span className="re-snip-col-label">{group.group}</span>
                    )}
                    {/* One searchable select per group — selecting inserts at cursor */}
                    <select
                      className="re-sel re-sel--snippet"
                      defaultValue=""
                      onFocus={saveSelection}
                      onChange={e => {
                        const v = e.target.value;
                        if (v) {
                          insertSnippet(v);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="" disabled>Selecione...</option>
                      {group.items.map(item => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>

        {/* ── Canvas ──────────────────────────────────────────────────── */}
        <div className="re-canvas">
          {/*
            Zoom sizer — width = visual (scaled) page width so the horizontal
            scrollbar tracks correctly for zoom > 100%.
            overflow:hidden clips the zoom-wrap layout overflow (which equals
            the un-scaled page width) at zoom < 100%, preventing the canvas
            from having an unwanted horizontal scrollbar and keeping the page
            visually centered.
          */}
          <div
            className="re-zoom-sizer"
            style={{ width: pageSize.width * (zoom / 100), overflow: 'hidden' }}
          >
          <div
            className="re-zoom-wrap"
            style={zoom !== 100 ? { transform: `scale(${zoom / 100})`, transformOrigin: 'top left' } : undefined}
          >
            {pages.map((_, pageIdx) => (
              <React.Fragment key={pageIdx}>
                {pageIdx > 0 && <div className="re-page-gap" />}

                <div className="re-page-box" style={{ width: pageSize.width }}>

                  {/* Header zone — page 0 ref is used to measure actual height */}
                  <div
                    ref={pageIdx === 0 ? headerZoneRef : undefined}
                    className={clsx('re-zone re-zone--header', { 're-zone--active': activeFocus === 'header' })}
                    style={{
                      paddingLeft:  marginLeftPx,
                      paddingRight: marginRightPx,
                      paddingTop:   Math.round(marginTopPx * 0.45),
                    }}
                  >
                    {activeFocus === 'header' && pageIdx === 0 && (
                      <div className="re-zone-label re-zone-label--top">Cabeçalho — Seção 1</div>
                    )}
                    <div
                      ref={setHeaderRef(pageIdx)}
                      className={clsx('re-editable re-header-editable', {
                        're-editable--ph': !value.header,
                        're-editable--ro': readOnly,
                      })}
                      contentEditable={!readOnly}
                      suppressContentEditableWarning
                      data-ph="Cabeçalho..."
                      onFocus={() => { setActiveFocus('header'); setActivePageIdx(pageIdx); savedPageRef.current = pageIdx; }}
                      onBlur={() => setActiveFocus(null)}
                      onInput={e => handleHeaderInput(e.currentTarget)}
                      onMouseUp={saveSelection}
                      onKeyUp={saveSelection}
                      onPaste={e => handlePaste(e, 'header', pageIdx)}
                    />
                    {activeFocus === 'header' && <div className="re-zone-line" />}
                  </div>

                  {/* Body zone — fixed height, overflow hidden to prevent page stretching */}
                  <div
                    className="re-page-body-wrap"
                    style={{
                      height:       pageBodyH,
                      overflow:     'hidden',
                      paddingLeft:  marginLeftPx,
                      paddingRight: marginRightPx,
                      paddingTop:   Math.round(marginTopPx * 0.25),
                      paddingBottom: Math.round(marginBottomPx * 0.25),
                      position: 'relative',
                    }}
                  >
                    <div
                      ref={setPageBodyRef(pageIdx)}
                      className={clsx('re-editable re-body-editable', {
                        're-editable--ph': !pages[pageIdx] && pageIdx === 0,
                        're-editable--ro': readOnly,
                      })}
                      style={{ minHeight: pageBodyH - Math.round(marginTopPx * 0.25) - Math.round(marginBottomPx * 0.25) }}
                      contentEditable={!readOnly}
                      suppressContentEditableWarning
                      data-ph={pageIdx === 0 ? placeholder : ''}
                      onFocus={() => { setActiveFocus('body'); setActivePageIdx(pageIdx); savedPageRef.current = pageIdx; }}
                      onBlur={() => { setActiveFocus(null); saveSelection(); }}
                      onInput={() => handlePageInput(pageIdx)}
                      onMouseUp={saveSelection}
                      onKeyUp={saveSelection}
                      onClick={handleBodyClick}
                      onPaste={e => handlePaste(e, 'body', pageIdx)}
                    />

                    {/* Image resize handles */}
                    <ImgOverlay
                      img={selectedImg}
                      visible={selectedImg !== null && selectedImgPageIdx === pageIdx}
                      getRect={() => selectedImg ? getImgOverlayRect(selectedImg, pageIdx) : null}
                      onResizeE={startImgResize}
                      onResizeSE={startImgResize}
                      onResizeS={(e: React.MouseEvent) => {
                        if (!selectedImg) return;
                        e.preventDefault();
                        const startY = e.clientY;
                        const startH = selectedImg.offsetHeight;
                        const onMove = (ev: MouseEvent) => {
                          selectedImg.style.height = `${Math.max(20, startH + ev.clientY - startY)}px`;
                          selectedImg.style.width  = 'auto';
                        };
                        const onUp = () => {
                          window.removeEventListener('mousemove', onMove);
                          window.removeEventListener('mouseup',   onUp);
                        };
                        window.addEventListener('mousemove', onMove);
                        window.addEventListener('mouseup',   onUp);
                      }}
                      onDeselect={() => setSelectedImg(null)}
                    />
                  </div>

                  {/* Footer zone — page 0 ref is used to measure actual height */}
                  <div
                    ref={pageIdx === 0 ? footerZoneRef : undefined}
                    className={clsx('re-zone re-zone--footer', { 're-zone--active': activeFocus === 'footer' })}
                    style={{
                      paddingLeft:  marginLeftPx,
                      paddingRight: marginRightPx,
                      paddingBottom: Math.round(marginBottomPx * 0.45),
                    }}
                  >
                    {activeFocus === 'footer' && <div className="re-zone-line" />}
                    <div
                      ref={setFooterRef(pageIdx)}
                      className={clsx('re-editable re-footer-editable', {
                        're-editable--ph': !value.footer,
                        're-editable--ro': readOnly,
                      })}
                      contentEditable={!readOnly}
                      suppressContentEditableWarning
                      data-ph="Rodapé..."
                      onFocus={() => { setActiveFocus('footer'); setActivePageIdx(pageIdx); savedPageRef.current = pageIdx; }}
                      onBlur={() => setActiveFocus(null)}
                      onInput={e => handleFooterInput(e.currentTarget)}
                      onMouseUp={saveSelection}
                      onKeyUp={saveSelection}
                      onPaste={e => handlePaste(e, 'footer', pageIdx)}
                    />
                    {activeFocus === 'footer' && pageIdx === pages.length - 1 && (
                      <div className="re-zone-label re-zone-label--bottom">Rodapé — Seção 1</div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          </div>
        </div>

        {/* ── Status bar ──────────────────────────────────────────────── */}
        <div className="re-status">
          <span>
            {activeFocus === 'header' ? 'Cabeçalho'
             : activeFocus === 'footer' ? 'Rodapé'
             : `Página ${activePageIdx + 1} de ${pages.length}`}
          </span>
          <span className="re-status-sep" />
          <span>{config.modelpage}</span>
          <span className="re-status-sep" />
          <span>Margens {config.margin.marginTop}/{config.margin.marginRight}/{config.margin.marginBottom}/{config.margin.marginLeft} mm</span>
          <div style={{ flex: 1 }} />
          <span className="re-status-zoom-label">Zoom</span>
          <select
            className="re-sel re-sel--zoom re-status-zoom-sel"
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
          >
            {ZOOM_OPTS.map(z => <option key={z} value={z}>{z}%</option>)}
          </select>
        </div>

        {/* ── Print styles ────────────────────────────────────────────── */}
        <style>{`
          @media print {
            body > *:not(.re-root) { display: none !important; }
            .re-toolbar, .re-status { display: none !important; }
            .re-canvas { background: transparent !important; padding: 0 !important; overflow: visible !important; height: auto !important; }
            .re-zoom-wrap { zoom: 1 !important; }
            .re-page-gap { display: none !important; }
            .re-page-box { box-shadow: none !important; margin-bottom: 0 !important; page-break-after: always; }
            .re-page-body-wrap { overflow: visible !important; height: auto !important; }
            .re-zone--active { background: transparent !important; }
            .re-zone-label, .re-zone-line { display: none !important; }
            .re-img-sel { display: none !important; }
          }
        `}</style>
      </div>
    );
  }
);

RichEditor.displayName = 'RichEditor';

export { RichEditor };
