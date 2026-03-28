import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Button, Input, Card, Modal, Select, Table, DatePicker, DateRangePicker } from './index'
import type { TableColumn, DateRange } from './index'
import './styles/tokens.css'

type Page = 'home' | 'components'
type Section = 'install' | 'button' | 'input' | 'card' | 'modal' | 'table' | 'select' | 'themes' | 'datepicker' | 'daterangepicker'
type Accent = 'orange' | 'blue' | 'red'

const SIDEBAR_ITEMS: { id: Section; label: string }[] = [
  { id: 'install', label: 'Como Instalar' },
  { id: 'themes', label: 'Temas' },
  { id: 'button', label: 'Button' },
  { id: 'input', label: 'Input' },
  { id: 'card', label: 'Card' },
  { id: 'modal', label: 'Modal' },
  { id: 'table', label: 'Table' },
  { id: 'select', label: 'Select' },
  { id: 'datepicker', label: 'DatePicker' },
  { id: 'daterangepicker', label: 'DateRangePicker' },
]

const ACCENTS: { id: Accent; label: string; color: string; darkColor: string }[] = [
  { id: 'orange', label: 'Laranja', color: '#D97706', darkColor: '#F59E0B' },
  { id: 'blue',   label: 'Azul',    color: '#2563EB', darkColor: '#60A5FA' },
  { id: 'red',    label: 'Vermelho', color: '#DC2626', darkColor: '#F87171' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

// ─── CodeBlock ────────────────────────────────────────────────────────────────
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative bg-stone-950 rounded-xl border border-stone-800 overflow-hidden mb-1">
      <button
        onClick={copy}
        className="absolute top-2.5 right-2.5 bg-stone-800 border border-stone-700 text-stone-400 text-xs font-medium px-2.5 py-1 rounded-md cursor-pointer hover:bg-stone-700 hover:text-stone-100 transition-colors"
      >
        {copied ? 'Copiado!' : 'Copiar'}
      </button>
      <pre className="m-0 px-6 py-5 overflow-x-auto text-[0.8125rem] leading-[1.75]">
        <code className="font-mono text-stone-200 whitespace-pre">{code.trim()}</code>
      </pre>
    </div>
  )
}

// ─── PropsTable ───────────────────────────────────────────────────────────────
interface PropDef {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

function PropsTable({ props }: { props: PropDef[] }) {
  return (
    <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {['Prop', 'Tipo', 'Padrão', 'Descrição'].map(h => (
              <th key={h} className="text-left px-4 py-2.5 bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 text-[0.6875rem] font-bold uppercase tracking-widest border-b border-stone-200 dark:border-stone-800 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map(p => (
            <tr key={p.name} className="border-b border-stone-200 dark:border-stone-800 last:border-0">
              <td className="px-4 py-2.5 align-top">
                <code className="font-mono text-[0.8125rem] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                  {p.name}
                </code>
                {p.required && <span className="text-red-500 ml-1 font-bold text-xs">*</span>}
              </td>
              <td className="px-4 py-2.5 align-top">
                <code className="font-mono text-[0.8125rem] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-amber-600 dark:text-amber-400">
                  {p.type}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top">
                <code className="font-mono text-[0.8125rem] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400">
                  {p.default ?? '—'}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top text-stone-600 dark:text-stone-400 leading-relaxed">
                {p.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ theme, toggleTheme, accent, setAccent, page, navigate }: {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  accent: Accent
  setAccent: (a: Accent) => void
  page: Page
  navigate: (p: Page) => void
}) {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-[60px] bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center gap-1">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 mr-4 bg-transparent border-0 cursor-pointer p-0 shrink-0"
        >
          <span className="text-[1.0625rem] font-bold text-amber-600 dark:text-amber-500 tracking-tight">
            Single UI
          </span>
          <span className="text-[0.625rem] font-bold px-1.5 py-0.5 bg-amber-600 dark:bg-amber-500 text-white rounded-full uppercase tracking-wider">
            React
          </span>
        </button>

        <div className="flex gap-0.5 flex-1">
          {(['home', 'components'] as const).map(p => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className={clsx(
                'bg-transparent border-0 cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                page === p
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-800/60'
              )}
            >
              {p === 'home' ? 'Início' : 'Componentes'}
            </button>
          ))}
        </div>

        {/* Accent swatches */}
        <div className="flex items-center gap-1.5 ml-auto mr-2">
          {ACCENTS.map(a => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              aria-label={`Tema ${a.label}`}
              title={a.label}
              className="w-5 h-5 rounded-full border-2 cursor-pointer transition-transform hover:scale-110"
              style={{
                backgroundColor: theme === 'dark' ? a.darkColor : a.color,
                borderColor: accent === a.id ? (theme === 'dark' ? a.darkColor : a.color) : 'transparent',
                outline: accent === a.id ? `2px solid ${theme === 'dark' ? a.darkColor : a.color}` : 'none',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center bg-transparent cursor-pointer"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────
const FEATURES = [
  { title: 'TypeScript First', description: 'Todos os componentes são totalmente tipados. Autocomplete e verificação em tempo real.' },
  { title: 'Dark Mode Nativo', description: 'Suporte a dark mode via CSS custom properties. Troca de tema instantânea.' },
  { title: 'Zero Dependências', description: 'Apenas React como peer dependency. Sem bibliotecas externas desnecessárias.' },
  { title: 'Acessível', description: 'Navegação por teclado, ARIA attributes e estados de foco visíveis.' },
]

function HomePage({ onStart }: { onStart: () => void }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectValue, setSelectValue] = useState<string | number>('')

  interface ComponentRow { id: number; component: string; descricao: string; status: string }

  const tableColumns: TableColumn<ComponentRow>[] = [
    { key: 'component', label: 'Componente', sortable: true },
    { key: 'descricao', label: 'Descrição' },
    {
      key: 'status', label: 'Status', align: 'center',
      render: () => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
          Estável
        </span>
      ),
    },
  ]

  const tableData: ComponentRow[] = [
    { id: 1, component: 'Button', descricao: 'Botões com variantes e estados', status: 'Estável' },
    { id: 2, component: 'Input', descricao: 'Campos com máscara e validação', status: 'Estável' },
    { id: 3, component: 'Card', descricao: 'Containers de conteúdo', status: 'Estável' },
    { id: 4, component: 'Modal', descricao: 'Diálogos com portal', status: 'Estável' },
    { id: 5, component: 'Table', descricao: 'Tabelas com ordenação', status: 'Estável' },
    { id: 6, component: 'Select', descricao: 'Seleção com busca integrada', status: 'Estável' },
    { id: 7, component: 'DatePicker', descricao: 'Seleção de data com navegação mês/ano', status: 'Estável' },
    { id: 8, component: 'DateRangePicker', descricao: 'Seleção de intervalo entre duas datas', status: 'Estável' },
  ]

  return (
    <main className="bg-stone-50 dark:bg-stone-950 min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-[680px] mx-auto">
          <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 mb-6 tracking-wide">
            8 componentes · TypeScript · Dark Mode · v1.0.0
          </div>
          <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-stone-900 dark:text-stone-50 mb-5">
            Construa interfaces<br />com Single UI
          </h1>
          <p className="text-[1.0625rem] leading-[1.75] text-stone-500 dark:text-stone-400 mb-9">
            Biblioteca de componentes React moderna, acessível e pronta para produção.
            Totalmente tipada em TypeScript com suporte nativo a dark mode.
          </p>
          <div className="flex gap-3 justify-center mb-8 flex-wrap">
            <Button size="lg" onClick={onStart}>Começar agora</Button>
            <Button size="lg" variant="secondary">Ver no GitHub</Button>
          </div>
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-mono text-stone-700 dark:text-stone-300">
            <span className="text-stone-400 dark:text-stone-600 select-none">$</span>
            npm install @single-ui/react
          </div>
          <p className="mt-6 text-xs text-stone-400 dark:text-stone-600 leading-relaxed">
            Feito de dev para dev com vibecoding · Componentes em CSS puro · Esta showcase usa{' '}
            <span className="font-semibold text-stone-500 dark:text-stone-500">Tailwind CSS v4</span>{' '}
            (não incluso na lib) · Achou algo? Abre uma PR no GitHub que a gente olha na sequência.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-2 text-center">
            Por que Single UI?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {FEATURES.map(f => (
              <Card key={f.title} title={f.title} hoverable>
                <p className="text-stone-500 dark:text-stone-400 m-0 leading-relaxed text-sm">
                  {f.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demos */}
      <section className="py-16 px-4 sm:px-6 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/40">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-2 text-center">
            Demonstrações
          </h2>
          <p className="text-center text-stone-500 dark:text-stone-400 mb-12 text-base">
            Componentes interativos prontos para uso
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <Card title="Button" subtitle="Variantes, tamanhos e estados">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 flex-wrap">
                  <Button variant="primary" size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="success" size="sm">Success</Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="warning" size="sm">Warning</Button>
                  <Button variant="error" size="sm">Error</Button>
                  <Button variant="info" size="sm">Info</Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button loading size="sm">Carregando</Button>
                  <Button disabled size="sm">Desabilitado</Button>
                </div>
              </div>
            </Card>

            <Card title="Input" subtitle="Campos com máscara">
              <div className="flex flex-col gap-3">
                <Input label="CPF" mask="cpf" placeholder="000.000.000-00" />
                <Input label="Telefone" mask="phone" placeholder="(00) 00000-0000" />
                <Input label="Valor BRL" mask="currency-brl" placeholder="R$ 0,00" />
              </div>
            </Card>

            <Card title="Select" subtitle="Seleção com busca integrada">
              <div className="flex flex-col gap-3">
                <Select
                  label="Framework"
                  placeholder="Selecione um framework"
                  searchable
                  clearable
                  value={selectValue}
                  onChange={setSelectValue}
                  options={[
                    { value: 'react', label: 'React' },
                    { value: 'vue', label: 'Vue' },
                    { value: 'angular', label: 'Angular' },
                    { value: 'svelte', label: 'Svelte' },
                    { value: 'solid', label: 'SolidJS' },
                  ]}
                />
                {selectValue && (
                  <p className="m-0 text-sm text-stone-500 dark:text-stone-400">
                    Selecionado: <strong className="text-stone-700 dark:text-stone-300">{selectValue}</strong>
                  </p>
                )}
              </div>
            </Card>

            <Card title="Card" subtitle="Containers com hover e footer">
              <Card
                title="Card hoverable"
                subtitle="Passe o mouse"
                hoverable
                footer={
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Cancelar</Button>
                    <Button size="sm">Confirmar</Button>
                  </div>
                }
              >
                <p className="m-0 text-stone-500 dark:text-stone-400 text-sm">
                  Conteúdo com efeito hover e footer personalizado.
                </p>
              </Card>
            </Card>

            <Card title="Modal" subtitle="Diálogos com portal e animação">
              <div className="flex flex-col gap-3">
                <p className="m-0 text-stone-500 dark:text-stone-400 text-sm">
                  Feche com ESC, botão X ou clicando fora. Renderiza via React Portal.
                </p>
                <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>
                <Modal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="Exemplo de Modal"
                  footer={
                    <div className="flex gap-2 justify-end">
                      <Button variant="secondary" onClick={() => setModalOpen(false)}>Fechar</Button>
                      <Button onClick={() => setModalOpen(false)}>Confirmar</Button>
                    </div>
                  }
                >
                  <p className="text-stone-500 dark:text-stone-400 m-0">
                    Modal com portal, scroll lock, ESC e animação de entrada.
                  </p>
                </Modal>
              </div>
            </Card>

            <Card title="Table" subtitle="Ordenação e render customizado">
              <Table columns={tableColumns} data={tableData} rowKey="id" />
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}

// ─── Section helpers ──────────────────────────────────────────────────────────
function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-9">
      <h2 className="text-[1.875rem] font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-2">{title}</h2>
      <p className="text-base text-stone-500 dark:text-stone-400 leading-relaxed m-0">{description}</p>
    </div>
  )
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[0.9375rem] font-semibold text-stone-900 dark:text-stone-50 mt-8 mb-3">{children}</h3>
}

function StepDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.9375rem] text-stone-500 dark:text-stone-400 leading-relaxed mb-3 -mt-1">{children}</p>
}

function DemoBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6', className)}>
      {children}
    </div>
  )
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 px-4 py-3 rounded-lg text-sm text-stone-500 dark:text-stone-400 leading-relaxed bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 border-l-[3px] border-l-amber-500 dark:border-l-amber-400">
      {children}
    </div>
  )
}

function IC({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.875em] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-amber-600 dark:text-amber-400">
      {children}
    </code>
  )
}

// ─── Install Section ──────────────────────────────────────────────────────────
function InstallSection() {
  return (
    <section id="install" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Como Instalar" description="Configure o Single UI no seu projeto React em poucos passos." />
      <StepTitle>1. Instale o pacote</StepTitle>
      <CodeBlock code="npm install @single-ui/react" />
      <StepTitle>2. Importe os estilos</StepTitle>
      <StepDesc>Adicione no ponto de entrada da aplicação (<IC>main.tsx</IC>).</StepDesc>
      <CodeBlock code={`import '@single-ui/react/styles'`} />
      <StepTitle>3. Use os componentes</StepTitle>
      <CodeBlock code={`import { Button, Input, Card } from '@single-ui/react'

function App() {
  return (
    <Card title="Meu card">
      <Input label="Nome" placeholder="Digite seu nome" />
      <Button>Enviar</Button>
    </Card>
  )
}`} />
      <StepTitle>4. Dark Mode (opcional)</StepTitle>
      <StepDesc>Defina <IC>data-theme="dark"</IC> no elemento raiz para ativar o dark mode.</StepDesc>
      <CodeBlock code={`const [theme, setTheme] = useState<'light' | 'dark'>('dark')

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme)
}, [theme])`} />
      <InfoBox>
        <strong className="text-stone-700 dark:text-stone-300">Requisitos:</strong> React 18+, Node 20.19+, TypeScript 5+
      </InfoBox>
    </section>
  )
}

// ─── Button Section ───────────────────────────────────────────────────────────
function ButtonSection() {
  const [loading, setLoading] = useState(false)
  return (
    <section id="button" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Button" description="Botões de ação com variantes, tamanhos, ícones e estado de loading." />

      <StepTitle>Variantes</StepTitle>
      <DemoBox>
        <div className="flex gap-2 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="error">Error</Button>
          <Button variant="info">Info</Button>
        </div>
      </DemoBox>

      <StepTitle>Tamanhos</StepTitle>
      <DemoBox>
        <div className="flex gap-3 items-center flex-wrap">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </DemoBox>

      <StepTitle>Estados</StepTitle>
      <DemoBox>
        <div className="flex gap-3 flex-wrap items-start">
          <Button
            loading={loading}
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000) }}
          >
            {loading ? 'Carregando...' : 'Clique para loading'}
          </Button>
          <Button disabled>Desabilitado</Button>
          <div className="w-full mt-1"><Button fullWidth>Full Width</Button></div>
        </div>
      </DemoBox>

      <StepTitle>Com ícone</StepTitle>
      <DemoBox>
        <div className="flex gap-3 flex-wrap">
          <Button icon={<span className="text-base leading-none">+</span>} iconPosition="left">Adicionar</Button>
          <Button variant="secondary" icon={<span>→</span>} iconPosition="right">Próximo</Button>
          <Button variant="error" icon={<span>✕</span>} iconPosition="left">Remover</Button>
        </div>
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Button } from '@single-ui/react'

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button loading>Carregando...</Button>
<Button disabled>Desabilitado</Button>
<Button fullWidth>Largura total</Button>
<Button icon={<PlusIcon />} iconPosition="left">Adicionar</Button>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'variant', type: "'primary'|'secondary'|'success'|'warning'|'error'|'info'", default: "'primary'", description: 'Visual variant do botão' },
        { name: 'size', type: "'sm'|'md'|'lg'", default: "'md'", description: 'Tamanho do botão' },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Exibe spinner e desabilita' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Desabilita o botão' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Ocupa 100% da largura' },
        { name: 'icon', type: 'ReactNode', description: 'Ícone ao lado do texto' },
        { name: 'iconPosition', type: "'left'|'right'", default: "'left'", description: 'Posição do ícone' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Conteúdo do botão' },
      ]} />
    </section>
  )
}

// ─── Input Section ────────────────────────────────────────────────────────────
function InputSection() {
  const [erroVal, setErroVal] = useState('')
  return (
    <section id="input" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Input" description="Campo de texto com máscaras, validação, estados de erro e controle de valor." />

      <StepTitle>Básico</StepTitle>
      <DemoBox>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nome" placeholder="Digite seu nome" />
          <Input label="E-mail" placeholder="email@exemplo.com" />
          <Input label="Obrigatório" placeholder="Campo obrigatório" required />
          <Input label="Desabilitado" defaultValue="Valor fixo" disabled />
        </div>
      </DemoBox>

      <StepTitle>Máscaras</StepTitle>
      <DemoBox>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="CPF" mask="cpf" placeholder="000.000.000-00" />
          <Input label="CNPJ" mask="cnpj" placeholder="00.000.000/0000-00" />
          <Input label="Telefone" mask="phone" placeholder="(00) 00000-0000" />
          <Input label="CEP" mask="cep" placeholder="00000-000" />
          <Input label="Data" mask="date" placeholder="00/00/00" />
          <Input label="Valor BRL" mask="currency-brl" placeholder="R$ 0,00" />
          <Input label="Valor USD" mask="currency-usd" placeholder="$0.00" />
        </div>
      </DemoBox>

      <StepTitle>Estado de erro</StepTitle>
      <DemoBox>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Com validação"
            value={erroVal}
            onChange={(v) => setErroVal(v)}
            error={erroVal.length > 0 && erroVal.length < 3 ? 'Mínimo de 3 caracteres' : undefined}
            helperText="Digite ao menos 3 caracteres"
            placeholder="Digite algo..."
          />
          <Input label="Erro fixo" defaultValue="valor inválido" error="Este campo contém um erro" />
        </div>
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Input } from '@single-ui/react'

const [value, setValue] = useState('')

<Input
  label="CPF"
  mask="cpf"
  value={value}
  onChange={(value, event) => setValue(value)}
  placeholder="000.000.000-00"
  required
/>

// Máscaras: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date' | 'currency-brl' | 'currency-usd'`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'label', type: 'string', description: 'Rótulo acima do campo' },
        { name: 'mask', type: "'cpf'|'cnpj'|'phone'|'cep'|'date'|'currency-brl'|'currency-usd'", description: 'Máscara aplicada ao valor' },
        { name: 'value', type: 'string|number', description: 'Valor controlado' },
        { name: 'defaultValue', type: 'string|number', description: 'Valor inicial (não controlado)' },
        { name: 'onChange', type: '(value: string, event) => void', description: 'Callback de mudança' },
        { name: 'error', type: 'string', description: 'Mensagem de erro' },
        { name: 'helperText', type: 'string', description: 'Texto auxiliar abaixo do campo' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Indica campo obrigatório (*)' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Desabilita o campo' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Ocupa 100% da largura' },
      ]} />
    </section>
  )
}

// ─── Card Section ─────────────────────────────────────────────────────────────
function CardSection() {
  return (
    <section id="card" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Card" description="Container de conteúdo com título, subtítulo, footer e efeito de hover." />

      <StepTitle>Variações</StepTitle>
      <DemoBox>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card title="Card simples">
            <p className="m-0 text-stone-500 dark:text-stone-400 text-sm">Conteúdo básico.</p>
          </Card>
          <Card title="Com subtítulo" subtitle="Descrição opcional">
            <p className="m-0 text-stone-500 dark:text-stone-400 text-sm">Header com subtítulo.</p>
          </Card>
          <Card title="Hoverable" subtitle="Passe o mouse" hoverable footer={<Button size="sm" fullWidth>Ação</Button>}>
            <p className="m-0 text-stone-500 dark:text-stone-400 text-sm">Com footer e hover.</p>
          </Card>
          <Card title="Sem borda" bordered={false}>
            <p className="m-0 text-stone-500 dark:text-stone-400 text-sm">Card sem borda.</p>
          </Card>
        </div>
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Card, Button } from '@single-ui/react'

<Card
  title="Título do card"
  subtitle="Subtítulo opcional"
  hoverable
  footer={
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button variant="secondary" size="sm">Cancelar</Button>
      <Button size="sm">Confirmar</Button>
    </div>
  }
>
  <p>Conteúdo do card</p>
</Card>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'title', type: 'string', description: 'Título no header' },
        { name: 'subtitle', type: 'string', description: 'Subtítulo abaixo do título' },
        { name: 'footer', type: 'ReactNode', description: 'Conteúdo do rodapé' },
        { name: 'hoverable', type: 'boolean', default: 'false', description: 'Elevação ao passar o mouse' },
        { name: 'bordered', type: 'boolean', default: 'true', description: 'Exibe borda ao redor do card' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Conteúdo principal' },
      ]} />
    </section>
  )
}

// ─── Modal Section ────────────────────────────────────────────────────────────
function ModalSection() {
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')
  const openWith = (s: typeof size) => { setSize(s); setOpen(true) }

  return (
    <section id="modal" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Modal" description="Diálogos e overlays com portal, ESC, click fora, tamanhos e animação." />

      <StepTitle>Tamanhos</StepTitle>
      <DemoBox>
        <div className="flex gap-3 flex-wrap">
          {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
            <Button key={s} variant="secondary" size="sm" onClick={() => openWith(s)}>
              {s.toUpperCase()} — {s === 'sm' ? '400' : s === 'md' ? '600' : s === 'lg' ? '900' : '1200'}px
            </Button>
          ))}
        </div>
      </DemoBox>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Modal — ${size.toUpperCase()}`}
        size={size}
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Confirmar</Button>
          </div>
        }
      >
        <p className="text-stone-500 dark:text-stone-400 m-0 mb-3">
          Modal de tamanho <strong className="text-stone-700 dark:text-stone-300">{size.toUpperCase()}</strong>. Feche com X, ESC ou clicando fora.
        </p>
        <p className="text-stone-500 dark:text-stone-400 m-0">
          Renderiza via React Portal no <IC>document.body</IC> e trava o scroll da página.
        </p>
      </Modal>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Modal, Button } from '@single-ui/react'

const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Abrir Modal</Button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Título do Modal"
  size="md"
  footer={
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
      <Button onClick={() => setOpen(false)}>Confirmar</Button>
    </div>
  }
>
  <p>Conteúdo do modal</p>
</Modal>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'open', type: 'boolean', required: true, description: 'Visibilidade do modal' },
        { name: 'onClose', type: '() => void', required: true, description: 'Callback ao fechar' },
        { name: 'title', type: 'string', description: 'Título no header' },
        { name: 'size', type: "'sm'|'md'|'lg'|'xl'", default: "'md'", description: 'Largura máxima' },
        { name: 'closeOnOverlayClick', type: 'boolean', default: 'true', description: 'Fecha ao clicar no overlay' },
        { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Fecha ao pressionar ESC' },
        { name: 'showCloseButton', type: 'boolean', default: 'true', description: 'Exibe botão X no header' },
        { name: 'footer', type: 'ReactNode', description: 'Rodapé do modal' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Conteúdo do modal' },
      ]} />
    </section>
  )
}

// ─── Table Section ────────────────────────────────────────────────────────────
interface User { id: number; name: string; email: string; role: string; status: 'Ativo' | 'Inativo' }

function TableSection() {
  const [loading, setLoading] = useState(false)
  const columns: TableColumn<User>[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'email', label: 'E-mail', sortable: true },
    { key: 'role', label: 'Perfil', align: 'center' },
    {
      key: 'status', label: 'Status', align: 'center',
      render: (v) => (
        <span className={clsx(
          'px-2.5 py-0.5 rounded-full text-xs font-semibold',
          v === 'Ativo'
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
            : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
        )}>
          {v}
        </span>
      ),
    },
  ]
  const data: User[] = [
    { id: 1, name: 'Ana Souza', email: 'ana@empresa.com', role: 'Admin', status: 'Ativo' },
    { id: 2, name: 'Bruno Lima', email: 'bruno@empresa.com', role: 'Dev', status: 'Ativo' },
    { id: 3, name: 'Carla Neves', email: 'carla@empresa.com', role: 'Design', status: 'Inativo' },
    { id: 4, name: 'Diego Mota', email: 'diego@empresa.com', role: 'Dev', status: 'Ativo' },
    { id: 5, name: 'Elena Costa', email: 'elena@empresa.com', role: 'QA', status: 'Inativo' },
  ]
  return (
    <section id="table" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Table" description="Tabela com ordenação, loading, estado vazio e renderização customizada de colunas." />

      <StepTitle>Demo interativo</StepTitle>
      <DemoBox>
        <div className="mb-4">
          <Button size="sm" variant="secondary"
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500) }}>
            Simular carregamento
          </Button>
        </div>
        <Table columns={columns} data={data} rowKey="id" loading={loading}
          onRowClick={(row) => alert(`Clicou: ${row.name}`)} />
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Table } from '@single-ui/react'
import type { TableColumn } from '@single-ui/react'

interface User { id: number; name: string; status: 'Ativo' | 'Inativo' }

const columns: TableColumn<User>[] = [
  { key: 'name', label: 'Nome', sortable: true },
  {
    key: 'status', label: 'Status', align: 'center',
    render: (value) => (
      <span style={{ color: value === 'Ativo' ? 'green' : 'red' }}>{value}</span>
    ),
  },
]

<Table
  columns={columns}
  data={users}
  rowKey="id"
  loading={isLoading}
  onRowClick={(row, index) => console.log(row, index)}
/>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'columns', type: 'TableColumn<T>[]', required: true, description: 'Definição das colunas' },
        { name: 'data', type: 'T[]', required: true, description: 'Array de dados' },
        { name: 'rowKey', type: 'string', default: "'id'", description: 'Chave única por linha' },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Exibe spinner' },
        { name: 'emptyMessage', type: 'string', default: "'Nenhum registro encontrado'", description: 'Mensagem sem dados' },
        { name: 'onRowClick', type: '(row: T, index: number) => void', description: 'Callback ao clicar na linha' },
      ]} />

      <StepTitle>TableColumn</StepTitle>
      <PropsTable props={[
        { name: 'key', type: 'string', required: true, description: 'Chave do campo no objeto' },
        { name: 'label', type: 'string', required: true, description: 'Título no cabeçalho' },
        { name: 'width', type: 'string|number', description: 'Largura da coluna' },
        { name: 'align', type: "'left'|'center'|'right'", default: "'left'", description: 'Alinhamento' },
        { name: 'sortable', type: 'boolean', default: 'false', description: 'Habilita ordenação' },
        { name: 'render', type: '(value, row, index) => ReactNode', description: 'Renderização customizada' },
      ]} />
    </section>
  )
}

// ─── Select Section ───────────────────────────────────────────────────────────
function SelectSection() {
  const [val, setVal] = useState<string | number>('')
  return (
    <section id="select" className="py-[52px] [scroll-margin-top:76px]">
      <SectionHeader title="Select" description="Seleção customizada com busca, limpeza, opções desabilitadas e controle de valor." />

      <StepTitle>Demo</StepTitle>
      <DemoBox>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Select padrão" placeholder="Selecione..." options={[
            { value: 'sp', label: 'São Paulo' }, { value: 'rj', label: 'Rio de Janeiro' },
            { value: 'mg', label: 'Minas Gerais' }, { value: 'rs', label: 'Rio Grande do Sul' },
          ]} />
          <Select label="Com busca e limpar" placeholder="Pesquise..." searchable clearable value={val} onChange={setVal}
            options={[
              { value: 'sp', label: 'São Paulo' }, { value: 'rj', label: 'Rio de Janeiro' },
              { value: 'mg', label: 'Minas Gerais' }, { value: 'rs', label: 'Rio Grande do Sul' },
              { value: 'ba', label: 'Bahia' }, { value: 'pr', label: 'Paraná' },
            ]} />
          <Select label="Com opção desabilitada" placeholder="Selecione..." options={[
            { value: '1', label: 'Opção disponível' },
            { value: '2', label: 'Opção desabilitada', disabled: true },
            { value: '3', label: 'Outra opção' },
          ]} />
          <Select label="Desabilitado" placeholder="Select desabilitado" disabled
            options={[{ value: '1', label: 'Opção 1' }]} />
        </div>
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Select } from '@single-ui/react'
import type { SelectOption } from '@single-ui/react'

const options: SelectOption[] = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais', disabled: true },
]

const [value, setValue] = useState<string | number>('')

<Select
  label="Estado"
  placeholder="Selecione um estado"
  options={options}
  value={value}
  onChange={setValue}
  searchable
  clearable
/>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'options', type: 'SelectOption[]', required: true, description: 'Lista de opções' },
        { name: 'value', type: 'string|number', description: 'Valor selecionado (controlado)' },
        { name: 'defaultValue', type: 'string|number', description: 'Valor inicial (não controlado)' },
        { name: 'onChange', type: '(value: string|number) => void', description: 'Callback ao selecionar' },
        { name: 'placeholder', type: 'string', default: "'Selecione...'", description: 'Texto de placeholder' },
        { name: 'label', type: 'string', description: 'Rótulo acima do select' },
        { name: 'searchable', type: 'boolean', default: 'false', description: 'Campo de busca no dropdown' },
        { name: 'clearable', type: 'boolean', default: 'false', description: 'Botão para limpar seleção' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Desabilita o select' },
        { name: 'error', type: 'string', description: 'Mensagem de erro' },
        { name: 'helperText', type: 'string', description: 'Texto auxiliar' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Ocupa 100% da largura' },
      ]} />
    </section>
  )
}

// ─── DatePicker Section ───────────────────────────────────────────────────────
function DatePickerSection() {
  const [date, setDate] = useState<Date | null>(null)
  return (
    <section id="datepicker" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader
        title="DatePicker"
        description="Seleção de data com navegação mensal. Clique no mês para ver todos os meses, no ano para navegar pelos anos (100 anos para frente e para trás)."
      />

      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-6 items-start">
          <div>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">
              Data selecionada:{' '}
              <strong className="text-stone-800 dark:text-stone-200">
                {date ? date.toLocaleDateString('pt-BR') : '—'}
              </strong>
            </p>
            <DatePicker value={date} onChange={setDate} />
          </div>
        </div>
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { DatePicker } from '@single-ui/react'

const [date, setDate] = useState<Date | null>(null)

<DatePicker value={date} onChange={setDate} />`} />

      <StepTitle>Com limites de data</StepTitle>
      <CodeBlock code={`// Permite apenas datas a partir de hoje
<DatePicker
  value={date}
  onChange={setDate}
  minDate={new Date()}
/>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'value', type: 'Date | null', description: 'Data selecionada (controlado)' },
        { name: 'onChange', type: '(date: Date) => void', description: 'Callback ao selecionar uma data' },
        { name: 'minDate', type: 'Date', description: 'Menor data permitida' },
        { name: 'maxDate', type: 'Date', description: 'Maior data permitida' },
        { name: 'className', type: 'string', description: 'Classe CSS adicional' },
      ]} />

      <InfoBox>
        Clique no <strong className="text-stone-700 dark:text-stone-300">nome do mês</strong> para abrir a grade de meses.
        Clique no <strong className="text-stone-700 dark:text-stone-300">ano</strong> para abrir a grade de anos ({new Date().getFullYear() - 100}–{new Date().getFullYear() + 100}).
        Depois da seleção, o calendário retorna à visualização de dias automaticamente.
      </InfoBox>
    </section>
  )
}

// ─── DateRangePicker Section ──────────────────────────────────────────────────
function DateRangePickerSection() {
  const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })
  return (
    <section id="daterangepicker" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader
        title="DateRangePicker"
        description="Seleção de intervalo entre duas datas. Exibe dois meses lado a lado. O primeiro clique define o início, o segundo define o fim. Passe o mouse sobre as datas para pré-visualizar o intervalo."
      />

      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-col gap-4">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Início:{' '}
          <strong className="text-stone-800 dark:text-stone-200">
            {range.startDate ? range.startDate.toLocaleDateString('pt-BR') : '—'}
          </strong>
          {' · '}
          Fim:{' '}
          <strong className="text-stone-800 dark:text-stone-200">
            {range.endDate ? range.endDate.toLocaleDateString('pt-BR') : '—'}
          </strong>
        </p>
        <div className="overflow-x-auto">
          <DateRangePicker
            startDate={range.startDate}
            endDate={range.endDate}
            onChange={setRange}
          />
        </div>
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { DateRangePicker } from '@single-ui/react'
import type { DateRange } from '@single-ui/react'

const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })

<DateRangePicker
  startDate={range.startDate}
  endDate={range.endDate}
  onChange={setRange}
/>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'startDate', type: 'Date | null', description: 'Data de início (controlado)' },
        { name: 'endDate', type: 'Date | null', description: 'Data de fim (controlado)' },
        { name: 'onChange', type: '(range: DateRange) => void', description: 'Callback ao alterar o intervalo. DateRange = { startDate, endDate }' },
        { name: 'minDate', type: 'Date', description: 'Menor data permitida' },
        { name: 'maxDate', type: 'Date', description: 'Maior data permitida' },
        { name: 'className', type: 'string', description: 'Classe CSS adicional' },
      ]} />

      <InfoBox>
        O mesmo esquema de navegação do <IC>DatePicker</IC> se aplica aqui: clique no mês/ano do cabeçalho para navegar.
        Ambos os meses avançam juntos ao usar as setas de navegação lateral.
      </InfoBox>
    </section>
  )
}

// ─── Themes Section ───────────────────────────────────────────────────────────
function ThemesSection() {
  return (
    <section id="themes" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Temas" description="Single UI suporta dark mode via atributo data-theme e múltiplos temas de cor (accent) via data-accent." />

      <StepTitle>Dark / Light Mode</StepTitle>
      <StepDesc>
        Defina <IC>data-theme="dark"</IC> ou <IC>data-theme="light"</IC> no <IC>document.documentElement</IC> para alternar entre os modos.
        Você pode ver a troca acontecendo em tempo real pelo botão de lua/sol no navbar.
      </StepDesc>
      <CodeBlock code={`import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

const [theme, setTheme] = useState<Theme>('dark')

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme)
}, [theme])

// Alternar
<button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
  Alternar tema
</button>`} />

      <StepTitle>Temas de cor (Accent)</StepTitle>
      <StepDesc>
        Além do dark/light, você pode escolher um tema de cor principal: <IC>orange</IC> (padrão), <IC>blue</IC> ou <IC>red</IC>.
        O tema accent sobrescreve as variáveis <IC>--single-primary</IC> e <IC>--single-secondary</IC>, afetando botões, foco, links e qualquer componente que use essas tokens.
        Os três círculos coloridos no navbar demonstram isso ao vivo.
      </StepDesc>
      <CodeBlock code={`type Accent = 'orange' | 'blue' | 'red'

const [accent, setAccent] = useState<Accent>('orange')

useEffect(() => {
  if (accent === 'orange') {
    document.documentElement.removeAttribute('data-accent')
  } else {
    document.documentElement.setAttribute('data-accent', accent)
  }
}, [accent])`} />

      <StepTitle>Variáveis CSS sobrescritas por accent</StepTitle>
      <StepDesc>
        Cada accent redefine as seguintes CSS custom properties em <IC>:root</IC>. Você pode criar seus próprios temas seguindo o mesmo padrão.
      </StepDesc>
      <CodeBlock code={`/* Exemplo: tema azul */
[data-accent="blue"] {
  --single-primary:        #2563EB;
  --single-primary-hover:  #1D4ED8;
  --single-primary-active: #1E40AF;
  --single-primary-light:  #EFF6FF;
  --single-secondary:      #6B7280;
  --single-secondary-hover: #4B5563;
}

/* Combinação com dark mode */
[data-accent="blue"][data-theme="dark"] {
  --single-primary:        #60A5FA;
  --single-primary-hover:  #93C5FD;
  --single-primary-light:  #1E3A5F;
}`} />

      <StepTitle>Demo ao vivo</StepTitle>
      <DemoBox>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
          Clique nos círculos do navbar para trocar o accent e observe os botões mudando de cor abaixo:
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="error">Error</Button>
          <Button variant="info">Info</Button>
        </div>
      </DemoBox>

      <InfoBox>
        <strong className="text-stone-700 dark:text-stone-300">Dica:</strong> As variáveis de status (success, warning, error, info) não são afetadas pelo accent — apenas primary e secondary mudam. Isso garante que semântica de cor (verde = sucesso, vermelho = erro) seja preservada independente do tema escolhido.
      </InfoBox>
    </section>
  )
}

// ─── Components Page ──────────────────────────────────────────────────────────
function ComponentsPage({ initialSection }: { initialSection: Section }) {
  const [activeSection, setActiveSection] = useState<Section>(initialSection)

  useEffect(() => {
    const el = document.getElementById(initialSection)
    if (el && initialSection !== 'install') {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleScroll = () => {
      let current: Section = 'install'
      for (const { id } of SIDEBAR_ITEMS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 90) current = id
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: Section) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const linkClass = (id: Section) => clsx(
    'text-left w-full bg-transparent border-0 cursor-pointer px-2.5 py-2 rounded-lg text-sm font-medium transition-colors',
    activeSection === id
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 font-semibold'
      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-800/60'
  )

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-stone-50 dark:bg-stone-950">
      {/* Sidebar — desktop */}
      <aside className="hidden md:block w-[220px] shrink-0 border-r border-stone-200 dark:border-stone-800 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">
        <div className="py-7 px-3 flex flex-col gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600 px-2.5 pb-2">
              Guia
            </span>
            <button className={linkClass('install')} onClick={() => scrollTo('install')}>
              Como Instalar
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600 px-2.5 pb-2">
              Componentes
            </span>
            {SIDEBAR_ITEMS.filter(i => i.id !== 'install').map(item => (
              <button key={item.id} className={linkClass(item.id)} onClick={() => scrollTo(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Nav horizontal mobile */}
        <div className="md:hidden overflow-x-auto no-scrollbar flex gap-1 px-4 py-2 border-b border-stone-200 dark:border-stone-800 sticky top-[60px] z-10 bg-stone-50 dark:bg-stone-950">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={clsx(
                'shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors bg-transparent border-0 cursor-pointer',
                activeSection === item.id
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 font-semibold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 max-w-[860px] px-4 sm:px-8 lg:px-[52px] pb-24">
          <InstallSection />
          <ThemesSection />
          <ButtonSection />
          <InputSection />
          <CardSection />
          <ModalSection />
          <TableSection />
          <SelectSection />
          <DatePickerSection />
          <DateRangePickerSection />
        </main>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [accent, setAccent] = useState<Accent>('orange')
  const [page, setPage] = useState<Page>('home')
  const [initialSection, setInitialSection] = useState<Section>('install')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (accent === 'orange') {
      document.documentElement.removeAttribute('data-accent')
    } else {
      document.documentElement.setAttribute('data-accent', accent)
    }
  }, [accent])

  const navigate = (p: Page, section?: Section) => {
    setPage(p)
    if (section) setInitialSection(section)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Navbar
        theme={theme}
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        accent={accent}
        setAccent={setAccent}
        page={page}
        navigate={navigate}
      />
      <div className="pt-[60px]">
        {page === 'home' ? (
          <HomePage onStart={() => navigate('components', 'install')} />
        ) : (
          <ComponentsPage key={initialSection} initialSection={initialSection} />
        )}
      </div>
    </div>
  )
}
