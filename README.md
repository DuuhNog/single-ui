# 🌟 Aurora UI React

> Biblioteca moderna de componentes React construída com Vite + TypeScript

[![NPM Version](https://img.shields.io/npm/v/@aurora-ui/react.svg)](https://www.npmjs.com/package/@aurora-ui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Características

- ⚛️ **React 18** - Componentes modernos com hooks
- 📝 **TypeScript** - Tipagem completa
- ⚡ **Vite** - Build rápido e HMR
- 🎨 **CSS Puro** - Sem dependências de frameworks
- 🌓 **Dark Mode** - Suporte nativo
- 🎭 **Máscaras** - 7 tipos integrados (BRL, USD, CPF, CNPJ, etc)
- 🎯 **Tree-shakeable** - Importe apenas o que usa
- ♿ **Acessível** - Seguindo padrões WCAG

## 📦 Instalação

```bash
npm install @aurora-ui/react
```

ou

```bash
yarn add @aurora-ui/react
```

ou

```bash
pnpm add @aurora-ui/react
```

## 🚀 Uso Rápido

### 1. Importe os estilos

```tsx
import '@aurora-ui/react/styles';
```

### 2. Use os componentes

```tsx
import { Button, Input, Card } from '@aurora-ui/react';

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

### Button

```tsx
import { Button } from '@aurora-ui/react';

// Variantes
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="error">Error</Button>
<Button variant="info">Info</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Estados
<Button loading>Carregando...</Button>
<Button disabled>Desabilitado</Button>
<Button fullWidth>Full Width</Button>

// Com ícone
<Button 
  variant="primary" 
  icon={<span>🚀</span>}
  iconPosition="left"
>
  Com Ícone
</Button>
```

#### Props do Button

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| variant | 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info' | 'primary' | Variante de cor |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Tamanho do botão |
| fullWidth | boolean | false | Largura total |
| loading | boolean | false | Estado de carregamento |
| icon | ReactNode | - | Ícone |
| iconPosition | 'left' \| 'right' | 'left' | Posição do ícone |

---

### Input

```tsx
import { Input } from '@aurora-ui/react';

// Básico
<Input
  label="Nome"
  placeholder="Digite seu nome"
  onChange={(value) => console.log(value)}
/>

// Com máscara de CPF
<Input
  label="CPF"
  mask="cpf"
  placeholder="000.000.000-00"
  onChange={(value) => console.log(value)}
/>

// Com máscara de moeda BRL
<Input
  label="Preço"
  mask="currency-brl"
  placeholder="R$ 0,00"
  onChange={(value) => console.log(value)}
/>

// Com erro
<Input
  label="Email"
  type="email"
  error="Email inválido"
  value={email}
  onChange={(value) => setEmail(value)}
/>

// Com helper text
<Input
  label="Telefone"
  mask="phone"
  helperText="Digite com DDD"
  onChange={(value) => console.log(value)}
/>
```

#### Máscaras Disponíveis

- `currency-brl` - R$ 1.000,00
- `currency-usd` - $1,000.00
- `cpf` - 000.000.000-00
- `cnpj` - 00.000.000/0000-00
- `phone` - (00) 00000-0000
- `cep` - 00000-000
- `date` - DD/MM/YYYY

#### Props do Input

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| label | string | - | Label do input |
| mask | MaskType | - | Máscara aplicada |
| error | string | - | Mensagem de erro |
| helperText | string | - | Texto de ajuda |
| fullWidth | boolean | false | Largura total |
| onChange | (value: string, event) => void | - | Callback de mudança |

---

### Card

```tsx
import { Card } from '@aurora-ui/react';

// Básico
<Card>
  Conteúdo do card
</Card>

// Com título
<Card title="Título do Card">
  Conteúdo
</Card>

// Com título e subtítulo
<Card 
  title="Título" 
  subtitle="Subtítulo"
>
  Conteúdo
</Card>

// Com footer
<Card 
  title="Card com Footer"
  footer={
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant="secondary">Cancelar</Button>
      <Button variant="primary">Salvar</Button>
    </div>
  }
>
  Conteúdo
</Card>

// Hoverable
<Card hoverable bordered>
  Card com efeito hover
</Card>
```

#### Props do Card

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| title | string | - | Título do card |
| subtitle | string | - | Subtítulo |
| footer | ReactNode | - | Conteúdo do footer |
| hoverable | boolean | false | Efeito hover |
| bordered | boolean | true | Exibir borda |

---

## 🎨 Customização

### CSS Variables

Você pode customizar as cores globalmente:

```css
:root {
  --aurora-primary: #3b82f6;
  --aurora-secondary: #8b5cf6;
  --aurora-success: #10b981;
  --aurora-warning: #f59e0b;
  --aurora-error: #ef4444;
  --aurora-info: #06b6d4;
}
```

### Dark Mode

```css
[data-theme="dark"] {
  --aurora-primary: #60a5fa;
  --aurora-background: #0f172a;
  /* ... outras variáveis */
}
```

Para ativar o dark mode, adicione o atributo `data-theme="dark"` no elemento raiz:

```tsx
// No seu componente principal
useEffect(() => {
  document.documentElement.setAttribute('data-theme', 'dark');
}, []);
```

---

## 📖 Exemplos Completos

### Formulário de Cadastro

```tsx
import { useState } from 'react';
import { Button, Input, Card } from '@aurora-ui/react';

function RegisterForm() {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Lógica de envio
    await sendData({ name, cpf, phone });
    setLoading(false);
  };

  return (
    <Card 
      title="Cadastro" 
      subtitle="Preencha seus dados"
      footer={
        <Button 
          variant="primary" 
          fullWidth 
          loading={loading}
          onClick={handleSubmit}
        >
          Cadastrar
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Nome Completo"
          value={name}
          onChange={(value) => setName(value)}
          required
          fullWidth
        />

        <Input
          label="CPF"
          mask="cpf"
          value={cpf}
          onChange={(value) => setCpf(value)}
          required
          fullWidth
        />

        <Input
          label="Telefone"
          mask="phone"
          value={phone}
          onChange={(value) => setPhone(value)}
          helperText="Digite com DDD"
          fullWidth
        />
      </div>
    </Card>
  );
}
```

---

## 🛠️ Desenvolvimento

### Clonar o repositório

```bash
git clone https://github.com/your-username/aurora-ui-react
cd aurora-ui-react
```

### Instalar dependências

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

### Build da biblioteca

```bash
npm run build
```

### Rodar testes

```bash
npm test
```

---

## 📄 Licença

MIT © Eduardo Nogueira - EN Technology Ltda

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou PR.

---

## 📞 Suporte

- 📧 Email: eduardo@entechnology.com.br
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/aurora-ui-react/issues)

---

**Desenvolvido com ❤️ por Eduardo Nogueira - EN Technology Ltda**
