# 🌟 Single-UI React

> Biblioteca moderna de componentes React construída com Vite + TypeScript

[![NPM Version](https://img.shields.io/npm/v/@single-ui/react.svg)](https://www.npmjs.com/package/@single-ui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 👀 Veja os componentes ao vivo

**[www.single-ui.com](https://www.single-ui.com)**

Acesse o site para explorar todos os componentes interativos com exemplos de código, dark mode, temas e props.

---

## ✨ Características

- ⚛️ **React 18** - Componentes modernos com hooks
- 📝 **TypeScript** - Tipagem completa
- ⚡ **Vite** - Build rápido e HMR
- 🎨 **CSS Puro** - Sem dependências de frameworks
- 🌓 **Dark Mode** - Suporte nativo
- 🎭 **Máscaras** - 7 tipos integrados (BRL, USD, CPF, CNPJ, etc)
- 📅 **DatePicker / DateRangePicker** - Seleção de datas com navegação completa
- 🎯 **Tree-shakeable** - Importe apenas o que usa
- ♿ **Acessível** - Seguindo padrões WCAG

## 📦 Instalação

```bash
npm install @single-ui/react
```

ou

```bash
yarn add @single-ui/react
```

ou

```bash
pnpm add @single-ui/react
```

## 🚀 Uso Rápido

### 1. Importe os estilos

```tsx
import '@single-ui/react/styles';
```

### 2. Use os componentes

```tsx
import { Button, Input, Card } from '@single-ui/react';

function App() {
  return (
    <div>
      <Button variant="primary" onClick={() => alert('Clicou!')}>
        Clique aqui
      </Button>

      <Input
        label="CPF"
        mask="cpf"
        placeholder="000.000.000-00"
        onChange={(value) => console.log(value)}
      />

      <Card title="Meu Card" bordered>
        Conteúdo do card
      </Card>
    </div>
  );
}
```

## 📚 Componentes

Para documentação completa com demos interativos, acesse **[www.single-ui.com](https://www.single-ui.com)**.

## 🛠️ Desenvolvimento

```bash
git clone https://github.com/DuuhNog/single-ui.git
cd single-ui
npm install
npm run dev       # showcase em http://localhost:5173
npm run build     # gera dist/
npm test          # roda os testes
```

---

## 🤝 Contribuindo

Achou um bug ou tem uma ideia? Abre uma [issue ou PR](https://github.com/DuuhNog/single-ui/issues) que a gente olha na sequência. Feito de dev para dev.

---

## 📄 Licença

MIT © Eduardo Nogueira - EN Technology Ltda
