# Single-UI React

> A modern React component library built with Vite and TypeScript.

[![NPM Version](https://img.shields.io/npm/v/@single-ui/react.svg)](https://www.npmjs.com/package/@single-ui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-DuuhNog%2Fsingle--ui-181717?logo=github)](https://github.com/DuuhNog/single-ui)

## Live Documentation

Explore all components interactively, with code examples, dark mode, theming, and props: **[www.single-ui.com](https://www.single-ui.com)**

---

## Features

- **React 19** — built with modern hooks and patterns
- **TypeScript** — fully typed API
- **Vite** — fast builds and HMR during development
- **Pure CSS** — no framework dependency in the published output
- **Dark mode** — built-in support via a single data attribute
- **Input masks** — 7 built-in types (BRL, USD, CPF, CNPJ, and more)
- **DatePicker / DateRangePicker** — full date selection with navigation
- **Tree-shakeable** — import only what you use
- **Accessible** — built to WCAG standards

## Installation

```bash
npm install @single-ui/react
```

```bash
yarn add @single-ui/react
```

```bash
pnpm add @single-ui/react
```

## Getting Started

### 1. Import the stylesheet

```tsx
import '@single-ui/react/styles';
```

### 2. Use the components

```tsx
import { Button, Input, Card } from '@single-ui/react';

function App() {
  return (
    <div>
      <Button variant="primary" onClick={() => alert('Clicked!')}>
        Click here
      </Button>

      <Input
        label="CPF"
        mask="cpf"
        placeholder="000.000.000-00"
        onChange={(value) => console.log(value)}
      />

      <Card title="My Card" bordered>
        Card content
      </Card>
    </div>
  );
}
```

## Components

For full documentation with interactive demos, visit **[www.single-ui.com](https://www.single-ui.com)**.

## Development

```bash
git clone https://github.com/DuuhNog/single-ui.git
cd single-ui
npm install
npm run dev       # component showcase at http://localhost:5173
npm run build     # build to dist/
npm test          # run the test suite
```

---

## Contributing

Found a bug or have a suggestion? Open an [issue or pull request](https://github.com/DuuhNog/single-ui/issues) — contributions are welcome.

---

## License

MIT © Eduardo Nogueira — EN Technology Ltda
