# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (component showcase)
npm run build        # tsc + vite build (outputs to dist/)
npm run preview      # Preview built output
npm run test         # Run tests with Vitest
npm run test:ui      # Run tests with Vitest UI dashboard
npm run lint         # ESLint with zero warnings tolerance
npm run typecheck    # Type-check without emitting
```

## Architecture

This is a React component library (`@single-ui/react`) built with Vite and TypeScript. It publishes dual-format output (ES module + UMD) from the `dist/` folder.

**Library entry point:** `src/index.ts` — exports all components, hooks, types, and CSS tokens.

**Dev showcase:** `src/main.tsx` + `src/App.tsx` — mounts a component playground used during development (not part of the published library). **Always add documentation for new or changed components here.** The showcase uses Tailwind CSS v4 for layout/styling — components themselves use only pure CSS tokens.

### Component structure

Each component lives in `src/components/[Name]/` and follows this pattern:
- `Name.tsx` — component using `forwardRef`, prop interface, `clsx` for conditional classes
- `Name.css` — scoped CSS using design token variables (no CSS-in-JS)

Current components: Button, Input, Textarea, Card, Modal, Select, Table, DatePicker, DateRangePicker, DatePickerInput, DateRangePickerInput, Switch, Checkbox, Chip, Toast, Tabs, Skeleton, Avatar, Drawer, Popover, Tooltip, Accordion, Pagination, InputOTP.

### Styling system

Design tokens are defined in `src/styles/tokens.css` as CSS custom properties on `:root`. Dark mode overrides are applied via `[data-theme="dark"]`. Accent color variants use `[data-accent="blue"]`, `[data-accent="red"]`, and `[data-accent="purple"]`. Consumers must import `dist/style.css` to get tokens and component styles.

The only runtime dependency is `clsx`. Tailwind CSS v4 is used only during development/build — no Tailwind classes are in the published output.

### Special component patterns

- **Toast**: context-based. `ToastProvider` must wrap the app root; `useToast()` returns `{ toast }` to trigger notifications. `ToastContainer` is rendered inside the provider.
- **Drawer / Modal**: use React Portal (`document.body`), scroll lock, and ESC key handling.
- **Tooltip / Popover**: use absolute positioning with placement logic; no external positioning library.

### Masks / hooks

`src/hooks/useMask.ts` exports `useMask(maskType)` which handles 7 Brazilian/international input formats: `currency-brl`, `currency-usd`, `cpf`, `cnpj`, `phone`, `cep`, `date`. The `Input` component integrates this hook via the `mask` prop.

### Build output

Vite library mode outputs:
- `dist/single-ui-react.js` (ES module)
- `dist/single-ui-react.umd.cjs` (UMD)
- `dist/index.d.ts` (TypeScript declarations via vite-plugin-dts)
- `dist/style.css` (all tokens + component styles)

`react`, `react-dom`, and `react/jsx-runtime` are externalized (peer dependencies).

### Testing

Tests live next to their component: `src/components/[Name]/Name.test.tsx`. Vitest config is in `vitest.config.ts` with `jsdom` environment and setup via `src/test/setup.ts` (imports `@testing-library/jest-dom`).

### Path aliases

`@/*` resolves to `src/*` in both TypeScript and Vite configs.

## App.tsx conventions

When adding a new component, do all of the following in `src/App.tsx`:
1. Add the component name to the `Section` type union
2. Add an entry to `SIDEBAR_ITEMS`
3. Write a `[Name]Section` function with: live demo inside `<DemoBox>`, usage `<CodeBlock>`, and `<PropsTable>`
4. Render `<[Name]Section />` inside `ComponentsPage`
5. Add a row to `tableData` in `HomePage`
