import { useState, useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import { Button, Input, Card, Modal, Select, Table, DatePicker, DateRangePicker, DatePickerInput, DateRangePickerInput, Switch, Checkbox } from './index'
import type { TableColumn, DateRange } from './index'
import './styles/tokens.css'

type Page = 'home' | 'components'
type Section = 'install' | 'button' | 'input' | 'card' | 'modal' | 'table' | 'select' | 'themes' | 'datepicker' | 'daterangepicker' | 'datepickerinput' | 'daterangepickerinput' | 'switch' | 'checkbox' | 'form'
type Accent = 'orange' | 'blue' | 'red'

const SIDEBAR_ITEMS: { id: Section; label: string }[] = [
  { id: 'install', label: 'Como Instalar' },
  { id: 'themes', label: 'Temas' },
  { id: 'form', label: 'Formulário (react-hook-form)' },
  { id: 'button', label: 'Button' },
  { id: 'input', label: 'Input' },
  { id: 'card', label: 'Card' },
  { id: 'modal', label: 'Modal' },
  { id: 'table', label: 'Table' },
  { id: 'select', label: 'Select' },
  { id: 'switch', label: 'Switch' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'datepicker', label: 'DatePicker' },
  { id: 'daterangepicker', label: 'DateRangePicker' },
  { id: 'datepickerinput', label: 'DatePickerInput' },
  { id: 'daterangepickerinput', label: 'DateRangePickerInput' },
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
  const [selectValue, setSelectValue] = useState<string | number | null>(null)

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
                  onChange={v => setSelectValue(v as string | number | null)}
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

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function StepTitle({ children }: { children: React.ReactNode }) {
  const id = typeof children === 'string' ? slugify(children) : undefined
  return <h3 id={id} className="text-[0.9375rem] font-semibold text-stone-900 dark:text-stone-50 mt-8 mb-3 scroll-mt-6">{children}</h3>
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
  const [val, setVal] = useState<string | number | null>(null)
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
          <Select label="Com busca e limpar" placeholder="Pesquise..." searchable clearable value={val} onChange={v => setVal(v as string | number | null)}
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

// ─── Switch Section ───────────────────────────────────────────────────────────
function SwitchSection() {
  const [on, setOn] = useState(false)
  const [sm, setSm] = useState(true)
  const [lg, setLg] = useState(false)
  return (
    <section id="switch" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader
        title="Switch"
        description="Toggle switch acessível com três tamanhos, suporte a label, helper text e estado de erro."
      />

      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-col gap-4">
        <Switch label="Modo escuro" checked={on} onChange={e => setOn(e.target.checked)} />
        <Switch label="Desabilitado (on)" checked disabled />
        <Switch label="Desabilitado (off)" disabled />
        <Switch label="Com helper text" helperText="Ativa notificações por e-mail." checked={on} onChange={e => setOn(e.target.checked)} />
        <Switch label="Label à esquerda" labelPosition="left" checked={on} onChange={e => setOn(e.target.checked)} />
      </DemoBox>

      <StepTitle>Tamanhos</StepTitle>
      <DemoBox className="flex flex-col gap-4">
        <Switch label="Small (sm)" size="sm" checked={sm} onChange={e => setSm(e.target.checked)} />
        <Switch label="Medium (md) — padrão" size="md" checked={on} onChange={e => setOn(e.target.checked)} />
        <Switch label="Large (lg)" size="lg" checked={lg} onChange={e => setLg(e.target.checked)} />
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Switch } from '@single-ui/react'

const [enabled, setEnabled] = useState(false)

<Switch
  label="Ativar notificações"
  checked={enabled}
  onChange={e => setEnabled(e.target.checked)}
/>

// Com react-hook-form
<Switch label="Aceito os termos" {...register('terms')} />`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'label', type: 'string', description: 'Texto do label' },
        { name: 'labelPosition', type: "'left' | 'right'", default: "'right'", description: 'Posição do label em relação ao switch' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Tamanho do switch' },
        { name: 'checked', type: 'boolean', description: 'Estado controlado' },
        { name: 'disabled', type: 'boolean', description: 'Desabilita o switch' },
        { name: 'error', type: 'string', description: 'Mensagem de erro' },
        { name: 'helperText', type: 'string', description: 'Texto auxiliar' },
        { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', description: 'Callback de mudança' },
      ]} />
    </section>
  )
}

// ─── Checkbox Section ─────────────────────────────────────────────────────────
function CheckboxSection() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  const [checked, setChecked] = useState<boolean[]>([true, false, false])

  const allChecked = checked.every(Boolean)
  const someChecked = checked.some(Boolean) && !allChecked

  const toggleAll = () => {
    const next = !allChecked
    setChecked([next, next, next])
  }

  return (
    <section id="checkbox" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader
        title="Checkbox"
        description="Checkbox acessível com suporte a estado indeterminado, helper text e integração com react-hook-form."
      />

      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-col gap-3">
        <Checkbox label="Aceito os termos de uso" checked={a} onChange={e => setA(e.target.checked)} />
        <Checkbox label="Receber newsletter" checked={b} onChange={e => setB(e.target.checked)} />
        <Checkbox label="Desabilitado" disabled />
        <Checkbox label="Desabilitado e marcado" checked disabled />
        <Checkbox label="Com helper text" helperText="Opcional, você pode desmarcar a qualquer momento." checked={a} onChange={e => setA(e.target.checked)} />
      </DemoBox>

      <StepTitle>Estado indeterminado</StepTitle>
      <StepDesc>
        O estado indeterminado (<IC>indeterminate</IC>) é útil para "selecionar todos" quando apenas alguns itens estão marcados.
      </StepDesc>
      <DemoBox className="flex flex-col gap-2">
        <Checkbox
          label="Selecionar todos"
          checked={allChecked}
          indeterminate={someChecked}
          onChange={toggleAll}
        />
        <div className="ml-6 flex flex-col gap-2 mt-1">
          {['Item A', 'Item B', 'Item C'].map((label, i) => (
            <Checkbox
              key={label}
              label={label}
              checked={checked[i]}
              onChange={e => {
                const next = [...checked]
                next[i] = e.target.checked
                setChecked(next)
              }}
            />
          ))}
        </div>
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Checkbox } from '@single-ui/react'

const [agreed, setAgreed] = useState(false)

<Checkbox
  label="Aceito os termos"
  checked={agreed}
  onChange={e => setAgreed(e.target.checked)}
/>

// Indeterminado
<Checkbox
  label="Selecionar todos"
  checked={allChecked}
  indeterminate={someChecked}
  onChange={toggleAll}
/>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'label', type: 'string', description: 'Texto do label' },
        { name: 'checked', type: 'boolean', description: 'Estado controlado' },
        { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Exibe o estado indeterminado (traço) — útil para "selecionar todos"' },
        { name: 'disabled', type: 'boolean', description: 'Desabilita o checkbox' },
        { name: 'error', type: 'string', description: 'Mensagem de erro' },
        { name: 'helperText', type: 'string', description: 'Texto auxiliar' },
        { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', description: 'Callback de mudança' },
      ]} />
    </section>
  )
}

// ─── DatePickerInput Section ──────────────────────────────────────────────────
function DatePickerInputSection() {
  const [date, setDate] = useState<Date | null>(null)
  return (
    <section id="datepickerinput" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader
        title="DatePickerInput"
        description="Campo de input que abre um calendário ao ser clicado. Ao selecionar uma data o calendário fecha e o campo exibe a data formatada."
      />

      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-col gap-5 items-start">
        <DatePickerInput
          label="Data de nascimento"
          value={date}
          onChange={setDate}
          clearable
          helperText="Clique para abrir o calendário."
        />
        <DatePickerInput
          label="Com erro"
          value={date}
          onChange={setDate}
          error="Data inválida"
        />
        <DatePickerInput
          label="Desabilitado"
          value={new Date()}
          disabled
        />
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { DatePickerInput } from '@single-ui/react'

const [date, setDate] = useState<Date | null>(null)

<DatePickerInput
  label="Data"
  value={date}
  onChange={setDate}
  clearable
/>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'value', type: 'Date | null', description: 'Data selecionada (controlado)' },
        { name: 'onChange', type: '(date: Date | null) => void', description: 'Callback ao selecionar ou limpar a data' },
        { name: 'placeholder', type: 'string', default: "'Select date...'", description: 'Placeholder quando nenhuma data está selecionada' },
        { name: 'label', type: 'string', description: 'Label do campo' },
        { name: 'error', type: 'string', description: 'Mensagem de erro' },
        { name: 'helperText', type: 'string', description: 'Texto auxiliar' },
        { name: 'disabled', type: 'boolean', description: 'Desabilita o campo' },
        { name: 'clearable', type: 'boolean', description: 'Exibe botão para limpar a data' },
        { name: 'fullWidth', type: 'boolean', description: 'Ocupa toda a largura disponível' },
        { name: 'minDate', type: 'Date', description: 'Menor data permitida no calendário' },
        { name: 'maxDate', type: 'Date', description: 'Maior data permitida no calendário' },
        { name: 'dateFormat', type: '(date: Date) => string', description: 'Função de formatação customizada da data exibida no campo' },
      ]} />
    </section>
  )
}

// ─── DateRangePickerInput Section ─────────────────────────────────────────────
function DateRangePickerInputSection() {
  const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })
  return (
    <section id="daterangepickerinput" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader
        title="DateRangePickerInput"
        description="Campo de input que abre o DateRangePicker (dois meses) ao ser clicado. O calendário fecha automaticamente quando início e fim são selecionados."
      />

      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-col gap-5 items-start">
        <DateRangePickerInput
          label="Período"
          startDate={range.startDate}
          endDate={range.endDate}
          onChange={setRange}
          clearable
          helperText="Selecione data de início e fim."
        />
        <DateRangePickerInput
          label="Desabilitado"
          startDate={new Date()}
          endDate={new Date(Date.now() + 7 * 86400000)}
          disabled
        />
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { DateRangePickerInput } from '@single-ui/react'
import type { DateRange } from '@single-ui/react'

const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })

<DateRangePickerInput
  label="Período"
  startDate={range.startDate}
  endDate={range.endDate}
  onChange={setRange}
  clearable
/>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'startDate', type: 'Date | null', description: 'Data de início (controlado)' },
        { name: 'endDate', type: 'Date | null', description: 'Data de fim (controlado)' },
        { name: 'onChange', type: '(range: DateRange) => void', description: 'Callback ao alterar o intervalo' },
        { name: 'placeholder', type: 'string', default: "'Select date range...'", description: 'Placeholder quando nenhuma data está selecionada' },
        { name: 'label', type: 'string', description: 'Label do campo' },
        { name: 'error', type: 'string', description: 'Mensagem de erro' },
        { name: 'helperText', type: 'string', description: 'Texto auxiliar' },
        { name: 'disabled', type: 'boolean', description: 'Desabilita o campo' },
        { name: 'clearable', type: 'boolean', description: 'Exibe botão para limpar as datas' },
        { name: 'fullWidth', type: 'boolean', description: 'Ocupa toda a largura disponível' },
        { name: 'minDate', type: 'Date', description: 'Menor data permitida' },
        { name: 'maxDate', type: 'Date', description: 'Maior data permitida' },
        { name: 'dateFormat', type: '(date: Date) => string', description: 'Função de formatação customizada das datas exibidas no campo' },
      ]} />
    </section>
  )
}

// ─── Form Section ─────────────────────────────────────────────────────────────
interface FormValues {
  name: string
  email: string
  framework: string | number | null
  tags: (string | number)[]
  birthdate: Date | null
  newsletter: boolean
  terms: boolean
}

function FormSection() {
  const { control, register, handleSubmit, setValue, watch, formState: { errors, isSubmitSuccessful, isSubmitting } } = useForm<FormValues>({
    defaultValues: { name: '', email: '', framework: null, tags: [], birthdate: null, newsletter: false, terms: false },
  })

  // Register controlled fields so react-hook-form can validate them
  register('framework', { validate: v => v !== null || 'Selecione um framework' })
  register('tags', { validate: v => (v as (string | number)[]).length > 0 || 'Selecione pelo menos uma tecnologia' })
  register('birthdate', { validate: v => v !== null || 'Data de nascimento é obrigatória' })
  register('terms', { validate: v => v === true || 'Você deve aceitar os termos de uso' })

  const birthdate = watch('birthdate')
  const framework = watch('framework')
  const tags = watch('tags')
  const newsletter = watch('newsletter')
  const terms = watch('terms')
  const [submitted, setSubmitted] = useState<FormValues | null>(null)

  const onSubmit = (data: FormValues) => {
    setSubmitted(data)
  }

  return (
    <section id="form" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader
        title="Formulário com react-hook-form"
        description="Integração dos componentes Single UI com react-hook-form. Todos os campos são obrigatórios. Select retorna null quando vazio (single) e [] quando vazio (múltiplo)."
      />

      <StepTitle>Demo completo</StepTitle>
      <DemoBox>
        {isSubmitSuccessful && submitted ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Formulário enviado com sucesso!</p>
            <pre className="text-xs bg-stone-950 text-stone-200 p-4 rounded-lg overflow-x-auto">{JSON.stringify({ ...submitted, birthdate: submitted.birthdate?.toLocaleDateString('pt-BR') ?? null }, null, 2)}</pre>
            <Button variant="secondary" size="sm" onClick={() => setSubmitted(null)}>Resetar</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field }) => (
                <Input
                  label="Nome completo *"
                  placeholder="João Silva"
                  error={errors.name?.message}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'E-mail é obrigatório',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' },
              }}
              render={({ field }) => (
                <Input
                  label="E-mail *"
                  placeholder="joao@exemplo.com"
                  error={errors.email?.message}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                />
              )}
            />
            <Select
              label="Framework favorito *"
              placeholder="Selecione..."
              searchable
              clearable
              value={framework}
              onChange={v => setValue('framework', v as string | number | null, { shouldValidate: true })}
              error={errors.framework?.message}
              options={[
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue' },
                { value: 'angular', label: 'Angular' },
                { value: 'svelte', label: 'Svelte' },
              ]}
            />
            <Select
              label="Tecnologias *"
              placeholder="Selecione uma ou mais..."
              multiple
              clearable
              value={tags}
              onChange={v => setValue('tags', v as (string | number)[], { shouldValidate: true })}
              error={errors.tags?.message}
              options={[
                { value: 'ts', label: 'TypeScript' },
                { value: 'css', label: 'CSS' },
                { value: 'node', label: 'Node.js' },
                { value: 'docker', label: 'Docker' },
                { value: 'graphql', label: 'GraphQL' },
              ]}
            />
            <DatePickerInput
              label="Data de nascimento *"
              value={birthdate}
              onChange={d => setValue('birthdate', d, { shouldValidate: true })}
              clearable
              error={errors.birthdate?.message}
            />
            <Switch
              label="Receber newsletter"
              checked={newsletter}
              onChange={e => setValue('newsletter', e.target.checked)}
            />
            <Checkbox
              label="Concordo com os termos de uso *"
              checked={terms}
              onChange={e => setValue('terms', e.target.checked, { shouldValidate: true })}
              error={errors.terms?.message}
            />
            <Button type="submit" loading={isSubmitting}>Enviar formulário</Button>
          </form>
        )}
      </DemoBox>

      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { useForm, Controller } from 'react-hook-form'
import { Input, Select, DatePickerInput, Switch, Checkbox, Button } from '@single-ui/react'

interface FormValues {
  name: string
  email: string
  framework: string | number | null  // null quando vazio (single)
  tags: (string | number)[]          // [] quando vazio (multiple)
  birthdate: Date | null
  newsletter: boolean
  terms: boolean
}

function MyForm() {
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { name: '', email: '', framework: null, tags: [], birthdate: null, newsletter: false, terms: false },
  })

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      {/* Input — use Controller para compatibilidade com onChange customizado */}
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Obrigatório' }}
        render={({ field }) => (
          <Input label="Nome" error={errors.name?.message}
            value={field.value} onChange={v => field.onChange(v)} />
        )}
      />

      {/* Select single — retorna null quando limpo */}
      <Select
        label="Framework"
        value={watch('framework')}
        onChange={v => setValue('framework', v as string | number | null, { shouldValidate: true })}
        clearable
        options={[...]}
      />

      {/* Select múltiplo — retorna [] quando vazio */}
      <Select
        label="Tags"
        multiple
        value={watch('tags')}
        onChange={v => setValue('tags', v as (string | number)[], { shouldValidate: true })}
        options={[...]}
      />

      {/* DatePickerInput */}
      <DatePickerInput
        label="Data"
        value={watch('birthdate')}
        onChange={d => setValue('birthdate', d)}
        clearable
      />

      <Switch label="Newsletter" checked={watch('newsletter')}
        onChange={e => setValue('newsletter', e.target.checked)} />

      <Checkbox label="Aceito os termos" checked={watch('terms')}
        onChange={e => setValue('terms', e.target.checked, { shouldValidate: true })} />

      <Button type="submit">Enviar</Button>
    </form>
  )
}`} />

      <InfoBox>
        <strong className="text-stone-700 dark:text-stone-300">Select null/[]:</strong> Single select retorna <IC>null</IC> quando nada está selecionado (ou ao limpar). Multiple select retorna <IC>[]</IC> quando nada está selecionado. Use <IC>Controller</IC> do react-hook-form para o <IC>Input</IC>, pois seu <IC>onChange</IC> tem assinatura customizada.
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

// ─── MenuIcon ─────────────────────────────────────────────────────────────────
function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ─── TOC data per section ──────────────────────────────────────────────────────
type TocItem = { id: string; label: string }
const SECTION_TOC: Partial<Record<Section, TocItem[]>> = {
  install: [
    { id: '1-instale-o-pacote', label: '1. Instale o pacote' },
    { id: '2-importe-os-estilos', label: '2. Importe os estilos' },
    { id: '3-use-os-componentes', label: '3. Use os componentes' },
    { id: '4-dark-mode-opcional', label: '4. Dark Mode' },
  ],
  themes: [
    { id: 'dark-light-mode', label: 'Dark / Light Mode' },
    { id: 'temas-de-cor-accent', label: 'Temas de cor' },
    { id: 'variaveis-css-sobrescritas-por-accent', label: 'Variáveis CSS' },
    { id: 'demo-ao-vivo', label: 'Demo ao vivo' },
  ],
  button: [
    { id: 'variantes', label: 'Variantes' },
    { id: 'tamanhos', label: 'Tamanhos' },
    { id: 'estados', label: 'Estados' },
    { id: 'com-icone', label: 'Com ícone' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  input: [
    { id: 'basico', label: 'Básico' },
    { id: 'mascaras', label: 'Máscaras' },
    { id: 'estado-de-erro', label: 'Estado de erro' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  card: [
    { id: 'variacoes', label: 'Variações' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  modal: [
    { id: 'tamanhos', label: 'Tamanhos' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  table: [
    { id: 'demo-interativo', label: 'Demo interativo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
    { id: 'tablecolumn', label: 'TableColumn' },
  ],
  select: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  datepicker: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'com-limites-de-data', label: 'Com limites de data' },
    { id: 'props', label: 'Props' },
  ],
  daterangepicker: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  datepickerinput: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  daterangepickerinput: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  switch: [
    { id: 'demo', label: 'Demo' },
    { id: 'tamanhos', label: 'Tamanhos' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  checkbox: [
    { id: 'demo', label: 'Demo' },
    { id: 'estado-indeterminado', label: 'Indeterminate' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  form: [
    { id: 'demo-completo', label: 'Demo completo' },
    { id: 'uso-basico', label: 'Uso básico' },
  ],
}

const GUIDE_ITEMS: Section[] = ['install', 'themes', 'form']
const COMPONENT_ITEMS: Section[] = ['button', 'input', 'card', 'modal', 'table', 'select', 'switch', 'checkbox', 'datepicker', 'daterangepicker', 'datepickerinput', 'daterangepickerinput']

// ─── Components Page ──────────────────────────────────────────────────────────
function ComponentsPage({ initialSection }: { initialSection: Section }) {
  const [activeSection, setActiveSection] = useState<Section>(initialSection)
  const [activeTocId, setActiveTocId] = useState<string>(SECTION_TOC[initialSection]?.[0]?.id ?? '')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  const sectionLabel = (id: Section) => SIDEBAR_ITEMS.find(i => i.id === id)?.label ?? id

  const navigate = (id: Section) => {
    setActiveSection(id)
    setSidebarOpen(false)
    if (mainRef.current) mainRef.current.scrollTop = 0
    setActiveTocId(SECTION_TOC[id]?.[0]?.id ?? '')
  }

  // Track active TOC heading as user scrolls within main
  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const toc = SECTION_TOC[activeSection] ?? []
    const handleScroll = () => {
      let current = toc[0]?.id ?? ''
      for (const { id } of toc) {
        const heading = document.getElementById(id)
        if (heading && heading.getBoundingClientRect().top <= 120) current = id
      }
      setActiveTocId(current)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [activeSection])

  const scrollToToc = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navLinkClass = (id: Section) => clsx(
    'text-left w-full bg-transparent border-0 cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
    activeSection === id
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-800/60'
  )

  const sections: Record<Section, () => JSX.Element> = {
    install: InstallSection,
    themes: ThemesSection,
    form: FormSection,
    button: ButtonSection,
    input: InputSection,
    card: CardSection,
    modal: ModalSection,
    table: TableSection,
    select: SelectSection,
    switch: SwitchSection,
    checkbox: CheckboxSection,
    datepicker: DatePickerSection,
    daterangepicker: DateRangePickerSection,
    datepickerinput: DatePickerInputSection,
    daterangepickerinput: DateRangePickerInputSection,
  }
  const ActiveSection = sections[activeSection]
  const toc = SECTION_TOC[activeSection] ?? []

  const SidebarContent = () => (
    <div className="py-6 px-3 flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600 px-3 pb-1.5">
          Guia
        </span>
        {GUIDE_ITEMS.map(id => (
          <button key={id} className={navLinkClass(id)} onClick={() => navigate(id)}>
            {sectionLabel(id)}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600 px-3 pb-1.5">
          Componentes
        </span>
        {COMPONENT_ITEMS.map(id => (
          <button key={id} className={navLinkClass(id)} onClick={() => navigate(id)}>
            {sectionLabel(id)}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col bg-stone-50 dark:bg-stone-950" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile slide-in sidebar */}
      <aside className={clsx(
        'fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-stone-50 dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 overflow-y-auto transition-transform duration-200 md:hidden pt-[60px]',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex justify-end px-3 pt-2">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-800 border-0 bg-transparent cursor-pointer"
            aria-label="Fechar menu"
          >
            <XIcon />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 bg-transparent cursor-pointer flex items-center gap-1.5 text-sm font-medium"
        >
          <MenuIcon />
          Menu
        </button>
        <span className="text-stone-300 dark:text-stone-700">/</span>
        <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">{sectionLabel(activeSection)}</span>
      </div>

      {/* Three-column content row */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar — desktop */}
        <aside className="hidden md:block w-[240px] shrink-0 border-r border-stone-200 dark:border-stone-800 overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* Main scrollable article */}
        <main ref={mainRef} className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-[760px] mx-auto px-4 sm:px-8 lg:px-14 pb-24 pt-2">
            <ActiveSection />
          </div>
        </main>

        {/* Right TOC — xl screens */}
        {toc.length > 0 && (
          <aside className="hidden xl:flex flex-col w-[220px] shrink-0 border-l border-stone-200 dark:border-stone-800 overflow-y-auto">
            <div className="py-8 px-5 sticky top-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-600 mb-3">
                On This Page
              </p>
              <ul className="flex flex-col gap-0.5">
                {toc.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToToc(item.id)}
                      className={clsx(
                        'text-left w-full bg-transparent border-0 cursor-pointer text-sm py-1 transition-colors leading-snug',
                        activeTocId === item.id
                          ? 'text-amber-600 dark:text-amber-400 font-medium'
                          : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50'
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
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
