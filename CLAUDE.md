# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Dev Commands

```bash
npm run dev          # Start dev server (component showcase)
npm run build        # tsc + vite build (outputs to dist/)
npm run preview      # Preview built output
npm run test         # Run tests with Vitest
npm run test:ui      # Run tests with Vitest UI dashboard
npm run lint         # ESLint with zero warnings tolerance
npm run typecheck    # Type-check without emitting
```

---

## Architecture

React component library (`@single-ui/react`) built with Vite and TypeScript. Publishes dual-format output (ES module + UMD) from `dist/`.

**Library entry point:** `src/index.ts` — exports all components, hooks, types, and CSS tokens.

**Dev showcase:** `src/main.tsx` + `src/App.tsx` — mounts a component playground (not part of published library). Always add documentation for new/changed components here. Uses Tailwind CSS v4 for layout — components use only pure CSS tokens.

### Component structure

Each component lives in `src/components/[Name]/`:
- `Name.tsx` — component using `forwardRef`, prop interface, `clsx` for conditional classes
- `Name.css` — scoped CSS using design token variables (no CSS-in-JS)

### Styling system

Design tokens in `src/styles/tokens.css` as CSS custom properties on `:root`.
- Dark mode: `[data-theme="dark"]`
- Accent colors: `[data-accent="blue"]`, `[data-accent="red"]`, `[data-accent="purple"]`
- Consumers must import `dist/style.css`

Only runtime dependency is `clsx`. Tailwind v4 is dev-only — no Tailwind classes in published output.

### Build output

- `dist/single-ui-react.js` (ES module)
- `dist/single-ui-react.umd.cjs` (UMD)
- `dist/index.d.ts` (TypeScript declarations)
- `dist/style.css` (all tokens + component styles)

`react`, `react-dom`, `react/jsx-runtime` are externalized (peer dependencies).

### Testing

Tests next to components: `src/components/[Name]/Name.test.tsx`. Vitest + jsdom + `@testing-library/jest-dom`.

### Path aliases

`@/*` resolves to `src/*` in TypeScript and Vite configs.

### App.tsx conventions

When adding a new component:
1. Add name to `Section` type union
2. Add entry to `SIDEBAR_ITEMS`
3. Write `[Name]Section` with `<DemoBox>`, `<CodeBlock>`, and `<PropsTable>`
4. Render `<[Name]Section />` inside `ComponentsPage`
5. Add row to `tableData` in `HomePage`

---

## Installation (consumer project)

```bash
npm install @single-ui/react
```

Import styles in your app entry point:

```ts
import '@single-ui/react/styles';
```

Peer dependencies required: `react >= 19`, `react-dom >= 19`.

---

## Theming

Apply attributes on any ancestor element (usually `<html>` or `<body>`):

```html
<!-- Dark mode -->
<html data-theme="dark">

<!-- Accent color -->
<html data-accent="blue">   <!-- blue | red | purple -->
```

---

## Components Reference

### Button

```tsx
import { Button } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `fullWidth` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `icon` | `React.ReactNode` | — |
| `iconPosition` | `'left' \| 'right'` | `'left'` |
| `children` | `React.ReactNode` | required |

Extends `ButtonHTMLAttributes<HTMLButtonElement>`.

---

### Input

```tsx
import { Input } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | — |
| `error` | `string` | — |
| `helperText` | `string` | — |
| `mask` | `MaskType` | — |
| `saveMask` | `boolean` | `true` |
| `isEdit` | `boolean` | `true` |
| `fullWidth` | `boolean` | `false` |
| `onChange` | `(value: string, event) => void` | — |
| `leftAddon` | `React.ReactNode` | — |
| `rightAddon` | `React.ReactNode` | — |
| `addonDivider` | `boolean` | `false` |

Extends `InputHTMLAttributes<HTMLInputElement>` (omits `onChange` and `size`). `leftAddon`/`rightAddon` render inside the input's border (e.g. a DDI/country code selector via `CountryCodeSelect`) without breaking the focus/error styling. Addon content is centered on both axes; by default there's no divider line between an addon and the field — set `addonDivider` to render one.

When `mask` is set, `saveMask` (default `true`) controls what `onChange` receives: the masked/formatted value (e.g. `"12.345.678/0001-90"` for `cnpj`) by default, or the raw unmasked digits when set to `false`.

When `isEdit` is `false`, the field renders as a read-only label showing the current (masked, if applicable) value instead of an editable input.

**Mask values:** `'currency-brl' | 'currency-usd' | 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date'`

---

### Textarea

```tsx
import { Textarea } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | — |
| `error` | `string` | — |
| `helperText` | `string` | — |
| `fullWidth` | `boolean` | `false` |
| `rows` | `number` | `3` |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` |

Extends `TextareaHTMLAttributes<HTMLTextAreaElement>` (omits `rows`).

---

### Card

```tsx
import { Card } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `title` | `string` | — |
| `subtitle` | `string` | — |
| `footer` | `React.ReactNode` | — |
| `hoverable` | `boolean` | `false` |
| `bordered` | `boolean` | `true` |
| `children` | `React.ReactNode` | required |

Extends `HTMLAttributes<HTMLDivElement>`.

---

### Modal

```tsx
import { Modal } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | required |
| `onClose` | `() => void` | required |
| `title` | `string` | — |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `closeOnOverlayClick` | `boolean` | `true` |
| `closeOnEscape` | `boolean` | `true` |
| `showCloseButton` | `boolean` | `true` |
| `footer` | `React.ReactNode` | — |
| `children` | `React.ReactNode` | required |

Uses React Portal. Locks scroll and handles ESC key.

---

### Select

```tsx
import { Select } from '@single-ui/react';
import type { SelectOption } from '@single-ui/react';
```

`SelectOption`: `{ value: string | number; label: string; disabled?: boolean }`

| Prop | Type | Default |
|------|------|---------|
| `options` | `SelectOption[]` | required |
| `value` | `string \| number \| null \| (string \| number)[]` | — |
| `defaultValue` | `string \| number \| null \| (string \| number)[]` | — |
| `placeholder` | `string` | `'Selecione...'` |
| `label` | `string` | — |
| `error` | `string` | — |
| `helperText` | `string` | — |
| `disabled` | `boolean` | `false` |
| `searchable` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `multiple` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |
| `isEdit` | `boolean` | `true` |
| `onChange` | `(value) => void` | — |

When `isEdit` is `false`, renders the selected option's label (or comma-joined labels when `multiple`) as a read-only label instead of the interactive trigger/dropdown.

The dropdown renders through a portal into `document.body`, anchored to the trigger and repositioned dynamically (flips above the trigger when there's no room below) — it always escapes clipping ancestors (`overflow: hidden` containers like `Accordion`) and stacking issues with later-in-DOM siblings (e.g. a `Table`).

---

### Table

```tsx
import { Table } from '@single-ui/react';
import type { TableColumn } from '@single-ui/react';
```

`TableColumn<T>`:

| Field | Type |
|-------|------|
| `key` | `string` |
| `label` | `string` |
| `width` | `string \| number` |
| `align` | `'left' \| 'center' \| 'right'` |
| `sortable` | `boolean` |
| `render` | `(value, row: T, index) => React.ReactNode` |
| `renderHeader` | `() => React.ReactNode` |

`TableProps<T>`:

| Prop | Type | Default |
|------|------|---------|
| `columns` | `TableColumn<T>[]` | required |
| `data` | `T[]` | required |
| `rowKey` | `string` | `'id'` |
| `loading` | `boolean` | `false` |
| `emptyMessage` | `string` | `'Nenhum registro encontrado'` |
| `onRowClick` | `(row: T, index: number) => void` | — |
| `filterContent` | `React.ReactNode` | — |
| `bordered` | `boolean` | `true` |
| `headerBordered` | `boolean` | `true` |
| `rowBordered` | `boolean` | `true` |

`bordered` controls the table's outer border, `headerBordered` the border below the header row, `rowBordered` the border below each body row. Clicking a row highlights it (darker than the hover background) until another row is clicked.

---

### DatePicker

```tsx
import { DatePicker } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `value` | `Date \| null` | — |
| `onChange` | `(date: Date) => void` | — |
| `minDate` | `Date` | — |
| `maxDate` | `Date` | — |

Inline calendar component (no input field). Use `DatePickerInput` for an input with popover.

---

### DateRangePicker

```tsx
import { DateRangePicker } from '@single-ui/react';
import type { DateRange } from '@single-ui/react';
```

`DateRange`: `{ startDate: Date | null; endDate: Date | null }`

| Prop | Type | Default |
|------|------|---------|
| `startDate` | `Date \| null` | — |
| `endDate` | `Date \| null` | — |
| `onChange` | `(range: DateRange) => void` | — |
| `minDate` | `Date` | — |
| `maxDate` | `Date` | — |

Inline component. Use `DateRangePickerInput` for input with popover.

---

### DatePickerInput

```tsx
import { DatePickerInput } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `value` | `Date \| null` | — |
| `onChange` | `(date: Date \| null) => void` | — |
| `placeholder` | `string` | — |
| `label` | `string` | — |
| `error` | `string` | — |
| `helperText` | `string` | — |
| `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |
| `minDate` | `Date` | — |
| `maxDate` | `Date` | — |
| `format` | `'DD/MM/YYYY' \| 'MM/DD/YYYY'` | `'DD/MM/YYYY'` |
| `dateFormat` | `(date: Date) => string` | — |

The calendar popup renders through a portal into `document.body`, anchored to the input and repositioned dynamically — escapes clipping ancestors and always renders above other page content.

---

### DateRangePickerInput

```tsx
import { DateRangePickerInput } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `startDate` | `Date \| null` | — |
| `endDate` | `Date \| null` | — |
| `onChange` | `(range: DateRange) => void` | — |
| `placeholder` | `string` | — |
| `label` | `string` | — |
| `error` | `string` | — |
| `helperText` | `string` | — |
| `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |
| `minDate` | `Date` | — |
| `maxDate` | `Date` | — |
| `format` | `'DD/MM/YYYY' \| 'MM/DD/YYYY'` | `'DD/MM/YYYY'` |
| `dateFormat` | `(date: Date) => string` | — |

The calendar popup renders through a portal into `document.body`, anchored to the input and repositioned dynamically — escapes clipping ancestors and always renders above other page content.

---

### Switch

```tsx
import { Switch } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | — |
| `labelPosition` | `'left' \| 'right'` | `'right'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `error` | `string` | — |
| `helperText` | `string` | — |

Extends `InputHTMLAttributes<HTMLInputElement>` (omits `size` and `type`).

---

### Checkbox

```tsx
import { Checkbox } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | — |
| `error` | `string` | — |
| `helperText` | `string` | — |
| `indeterminate` | `boolean` | `false` |

Extends `InputHTMLAttributes<HTMLInputElement>` (omits `type`).

---

### Chip

```tsx
import { Chip } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | required |
| `variant` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` |
| `size` | `'sm' \| 'md'` | `'md'` |
| `onRemove` | `(e: React.MouseEvent) => void` | — |

---

### Toast

```tsx
import { ToastProvider, useToast } from '@single-ui/react';
```

**Setup** — wrap app root:

```tsx
<ToastProvider>
  <App />
</ToastProvider>
```

**Usage** — inside any component:

```tsx
const { toast } = useToast();

toast.success('Salvo com sucesso!');
toast.error('Algo deu errado');
toast.warning('Atenção');
toast.info('Informação');

// With options
toast.success('Título', { title: 'Cabeçalho', duration: 5000 });
```

`ToastOptions`: `{ title?: string; duration?: number; variant?: 'success' | 'error' | 'warning' | 'info' }`

`ToastContainer` is rendered automatically inside `ToastProvider`.

---

### Tabs

```tsx
import { Tabs } from '@single-ui/react';
import type { TabItem } from '@single-ui/react';
```

`TabItem`: `{ id: string; label: string; content: React.ReactNode; disabled?: boolean; badge?: string | number }`

| Prop | Type | Default |
|------|------|---------|
| `items` | `TabItem[]` | required |
| `defaultTab` | `string` | — |
| `activeTab` | `string` | — |
| `onChange` | `(id: string) => void` | — |
| `variant` | `'underline' \| 'pills'` | `'underline'` |

---

### Skeleton

```tsx
import { Skeleton } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'text' \| 'rect' \| 'circle'` | `'rect'` |
| `width` | `string \| number` | — |
| `height` | `string \| number` | — |
| `lines` | `number` | — |

Extends `HTMLAttributes<HTMLDivElement>` (omits `children`).

---

### Avatar

```tsx
import { Avatar, AvatarGroup } from '@single-ui/react';
```

**Avatar props:**

| Prop | Type | Default |
|------|------|---------|
| `src` | `string` | — |
| `alt` | `string` | — |
| `name` | `string` | — |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | — |

**AvatarGroup props:**

| Prop | Type | Default |
|------|------|---------|
| `children` | `React.ReactNode` | required |
| `max` | `number` | — |
| `size` | `AvatarSize` | — |

---

### Drawer

```tsx
import { Drawer } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | required |
| `onClose` | `() => void` | required |
| `side` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `title` | `string` | — |
| `children` | `React.ReactNode` | required |
| `footer` | `React.ReactNode` | — |
| `closeOnBackdrop` | `boolean` | `true` |

Uses React Portal. Locks scroll and handles ESC key.

---

### Popover

```tsx
import { Popover } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `trigger` | `React.ReactElement` | required |
| `content` | `React.ReactNode` | required |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | `'bottom-start'` |
| `title` | `string` | — |
| `open` | `boolean` | — |
| `onOpenChange` | `(open: boolean) => void` | — |
| `closeOnOutside` | `boolean` | `true` |

No external positioning library. The panel renders through a portal into `document.body`, anchored to the trigger and repositioned dynamically (flips to the opposite side when there's no room) — escapes clipping ancestors and stacking issues with other page content.

---

### Tooltip

```tsx
import { Tooltip } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `content` | `React.ReactNode` | required |
| `children` | `React.ReactElement` | required |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |
| `delay` | `number` | `300` |
| `disabled` | `boolean` | `false` |

No external positioning library. The panel renders through a portal into `document.body`, anchored to the trigger and repositioned dynamically (flips to the opposite side when there's no room) — escapes clipping ancestors and stacking issues with other page content.

---

### Accordion

```tsx
import { Accordion } from '@single-ui/react';
import type { AccordionItem } from '@single-ui/react';
```

`AccordionItem`: `{ id: string; title: string; content: React.ReactNode; disabled?: boolean; badge?: string | number }`

| Prop | Type | Default |
|------|------|---------|
| `items` | `AccordionItem[]` | required |
| `defaultOpen` | `string \| string[]` | — |
| `open` | `string \| string[]` | — |
| `onChange` | `(id: string, isOpen: boolean) => void` | — |
| `multiple` | `boolean` | `false` |
| `variant` | `'default' \| 'bordered' \| 'separated'` | `'default'` |

---

### Pagination

```tsx
import { Pagination } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `totalPages` | `number` | required |
| `currentPage` | `number` | required |
| `onChange` | `(page: number) => void` | required |
| `siblingCount` | `number` | `1` |
| `showFirstLast` | `boolean` | `true` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

---

### InputOTP

```tsx
import { InputOTP } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `length` | `number` | `6` |
| `value` | `string` | `''` |
| `onChange` | `(value: string) => void` | — |
| `onComplete` | `(value: string) => void` | — |
| `disabled` | `boolean` | `false` |
| `error` | `string` | — |
| `helperText` | `string` | — |
| `label` | `string` | — |
| `separator` | `number \| number[]` | — |

---

### Badge

```tsx
import { Badge } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `children` | `React.ReactNode` | required |
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` |
| `size` | `'sm' \| 'md'` | `'sm'` |
| `dot` | `boolean` | `false` |

---

### Navbar

```tsx
import { Navbar } from '@single-ui/react';
import type { NavbarMenuConfig, NavbarProfile } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `logo` | `React.ReactNode` | — |
| `brand` | `string` | — |
| `showMenu` | `boolean` | `true` |
| `onMenuToggle` | `(open: boolean) => void` | — |
| `menuOpen` | `boolean` | — |
| `menu` | `NavbarMenuConfig` | — |
| `menuContent` | `React.ReactNode` | — |
| `actions` | `React.ReactNode` | — |
| `profile` | `NavbarProfile` | — |
| `contained` | `boolean` | `false` |
| `color` | `string` | — |

**Key types:**
- `NavbarMenuItem`: `{ label: string; href?: string; onClick?: () => void; icon?: ReactNode; children?: NavbarSubItem[] | NavbarSubGroup[] }`
- `NavbarSubItem`: `{ label: string; href?: string; onClick?: () => void; description?: string }`
- `NavbarSubGroup`: `{ groupLabel: string; items: NavbarSubItem[] }`
- `NavbarMenuConfig`: `{ items: NavbarMenuItem[] }`
- `NavbarProfile`: `{ name: string; email?: string; avatar?: string; actions?: NavbarProfileAction[] }`
- `NavbarProfileAction`: `{ label: string; onClick: () => void; icon?: ReactNode; danger?: boolean }`

---

### Slider

```tsx
import { Slider } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `min` | `number` | `0` |
| `max` | `number` | `100` |
| `step` | `number` | `1` |
| `value` | `number` | — |
| `defaultValue` | `number` | — |
| `onChange` | `(value: number) => void` | — |
| `disabled` | `boolean` | `false` |
| `label` | `string` | — |
| `helperText` | `string` | — |
| `showValue` | `boolean` | `false` |
| `formatValue` | `(value: number) => string` | — |

---

### CountryCodeSelect

```tsx
import { CountryCodeSelect, DEFAULT_COUNTRY_CODES } from '@single-ui/react';
import type { CountryCodeOption } from '@single-ui/react';
```

`CountryCodeOption`: `{ iso: string; name: string; dial: string }`

| Prop | Type | Default |
|------|------|---------|
| `countries` | `CountryCodeOption[]` | `DEFAULT_COUNTRY_CODES` |
| `value` | `string` | — |
| `defaultValue` | `string` | — |
| `onChange` | `(country: CountryCodeOption) => void` | — |
| `disabled` | `boolean` | `false` |
| `searchable` | `boolean` | `true` |
| `className` | `string` | — |
| `aria-label` | `string` | `'Código do país'` |

Renders a flag + dial code trigger with a searchable dropdown. Pairs with `Input`'s `leftAddon` to build a phone field with a DDI/country selector. The dropdown renders through a portal into `document.body`, anchored to the trigger and repositioned dynamically — escapes clipping ancestors (e.g. `Input`'s addon box) and stacking issues.

---

### Divider

```tsx
import { Divider } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `label` | `string` | — |
| `labelPosition` | `'start' \| 'center' \| 'end'` | `'center'` |
| `className` | `string` | — |
| `style` | `React.CSSProperties` | — |

Renders `<hr>` for a plain horizontal divider, or a labeled `<div>` when `label` is set. Vertical orientation renders a `<span>`.

---

### FloatButton

```tsx
import { FloatButton } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `threshold` | `number` | `300` |
| `onClick` | `() => void` | scrolls to top |
| `icon` | `React.ReactNode` | chevron-up icon |
| `position` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` |
| `className` | `string` | — |

Appears once the page is scrolled past `threshold` px. Defaults to a "back to top" action.

---

### Spinner

```tsx
import { Spinner } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'gear' \| 'circular' \| 'lifeline'` | `'circular'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `sizeNumber` | `number` | — |
| `color` | `string` | — |
| `className` | `string` | — |

`sizeNumber` overrides the `size` preset with an exact pixel value. `color` sets the icon's `currentColor`.

---

### Anchor

```tsx
import { Anchor } from '@single-ui/react';
```

| Prop | Type | Default |
|------|------|---------|
| `href` | `string` | required |
| `children` | `React.ReactNode` | required |
| `offset` | `number` | `0` |
| `className` | `string` | — |

Smooth-scrolls to the element whose `id` matches `href` (with or without a leading `#`). `offset` subtracts extra px from the scroll target — useful to compensate for a fixed header.

---

### ModalManager

```tsx
import { ModalManagerProvider, useModal } from '@single-ui/react';
import type { OpenModalOptions } from '@single-ui/react';
```

**Setup** — wrap app root:

```tsx
<ModalManagerProvider>
  <App />
</ModalManagerProvider>
```

**Usage:**

```tsx
const { openModal, closeModal, minimizeModal, restoreModal } = useModal();

const id = openModal({
  title: 'Título',
  body: <p>Conteúdo</p>,
  footer: <Button onClick={() => closeModal(id)}>Fechar</Button>,
  size: 'md',
  minimizable: true,
});
```

`OpenModalOptions`:

| Field | Type | Default |
|-------|------|---------|
| `id` | `string` | auto-generated |
| `title` | `string` | — |
| `body` | `React.ReactNode` | required |
| `footer` | `React.ReactNode` | — |
| `size` | `number \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `600`px (`'md'`) |
| `minimizable` | `boolean` | `true` |
| `closeOnOverlayClick` | `boolean` | `true` |
| `closeOnEscape` | `boolean` | `true` |
| `color` | `string` | — (used as the minimized tray item's background) |

Unlike `Modal`, this manages an imperative stack of windows — supports multiple simultaneous modals, each independently minimizable to a tray at the bottom of the viewport. Prefer `Modal` for a single declarative dialog; use `ModalManager` when the app needs to open modals from anywhere (e.g. outside React event handlers) or stack several at once.

---

## useMask Hook

```tsx
import { useMask } from '@single-ui/react';
import type { MaskType } from '@single-ui/react';
```

`MaskType`: `'currency-brl' | 'currency-usd' | 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date'`

```tsx
const { value, setValue } = useMask('', 'cpf');
```

Returns `{ value: string; setValue: (newValue: string) => string }`.

The `Input` component accepts a `mask` prop directly — `useMask` is for cases where you need the mask logic outside of an `Input`.

---

## Special Patterns

### Toast / ModalManager (context-based)

`ToastProvider` must wrap the app root. `useToast()` returns `{ toast }`. `ToastContainer` is rendered inside the provider automatically.

`ModalManagerProvider` must wrap the app root. `useModal()` returns `{ openModal, closeModal, minimizeModal, restoreModal }` for imperative, stackable modals.

### Drawer / Modal / ModalManager (portal-based)

All three use `ReactDOM.createPortal` to render into `document.body`. They lock scroll and handle ESC key.

### Select / CountryCodeSelect / DatePickerInput / DateRangePickerInput / Popover / Tooltip (anchored portals)

All six render their dropdown/panel through `ReactDOM.createPortal` into `document.body`, positioned with the internal `useAnchoredPosition` hook (`src/hooks/useAnchoredPosition.ts`) — no external library (no Popper, no Floating UI). The hook reads `getBoundingClientRect()` on the trigger and popup, computes `position: fixed` coordinates, flips to the opposite side when there's no room, and recalculates on scroll/resize. This keeps popups from being clipped by `overflow: hidden` ancestors (e.g. an `Accordion` item) and ensures they stack above later-in-DOM siblings (e.g. a `Table`) via the `--single-z-dropdown` / `--single-z-popover` / `--single-z-tooltip` tokens in `tokens.css`.

### Table (generic)

`Table<T>` is a generic component. Pass `data: T[]` and `columns: TableColumn<T>[]` — `render` callbacks receive the full typed row.

### Controlled vs Uncontrolled

- `Select`, `Tabs`, `Accordion`: support both controlled (`value`/`open` + `onChange`) and uncontrolled (`defaultValue`/`defaultOpen`).
- `DatePickerInput`, `DateRangePickerInput`: fully controlled via `value`/`onChange`.
- `Slider`: supports both `value` (controlled) and `defaultValue` (uncontrolled).
