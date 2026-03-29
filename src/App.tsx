import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { clsx } from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import { Button, Input, Card, Modal, Select, Table, DatePicker, DateRangePicker, DatePickerInput, DateRangePickerInput, Switch, Checkbox, Chip, useToast, Textarea, Tabs, Skeleton, Avatar, AvatarGroup, Drawer, Popover, Tooltip, Accordion, Pagination, InputOTP, Badge, Slider } from './index'
import type { TableColumn, DateRange } from './index'
import './styles/tokens.css'

type Page = 'home' | 'components' | 'examples' | 'tasks'
type Section = 'install' | 'themes' | 'form' | 'button' | 'input' | 'textarea' | 'card' | 'modal' | 'drawer' | 'table' | 'select' | 'switch' | 'checkbox' | 'chip' | 'badge' | 'slider' | 'tabs' | 'accordion' | 'datepicker' | 'daterangepicker' | 'datepickerinput' | 'daterangepickerinput' | 'avatar' | 'skeleton' | 'tooltip' | 'popover' | 'toast' | 'pagination' | 'inputotp'
type Accent = 'orange' | 'blue' | 'red' | 'purple'

const SIDEBAR_ITEMS: { id: Section; label: string }[] = [
  { id: 'install', label: 'Como Instalar' },
  { id: 'themes', label: 'Temas' },
  { id: 'form', label: 'Formulário (react-hook-form)' },
  { id: 'button', label: 'Button' },
  { id: 'input', label: 'Input' },
  { id: 'textarea', label: 'Textarea' },
  { id: 'card', label: 'Card' },
  { id: 'modal', label: 'Modal' },
  { id: 'drawer', label: 'Drawer' },
  { id: 'table', label: 'Table' },
  { id: 'select', label: 'Select' },
  { id: 'switch', label: 'Switch' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'chip', label: 'Chip' },
  { id: 'badge', label: 'Badge' },
  { id: 'slider', label: 'Slider' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'accordion', label: 'Accordion' },
  { id: 'avatar', label: 'Avatar' },
  { id: 'skeleton', label: 'Skeleton' },
  { id: 'tooltip', label: 'Tooltip' },
  { id: 'popover', label: 'Popover' },
  { id: 'toast', label: 'Toast' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'inputotp', label: 'InputOTP' },
  { id: 'datepicker', label: 'DatePicker' },
  { id: 'daterangepicker', label: 'DateRangePicker' },
  { id: 'datepickerinput', label: 'DatePickerInput' },
  { id: 'daterangepickerinput', label: 'DateRangePickerInput' },
]

const ACCENTS: { id: Accent; label: string; color: string; darkColor: string }[] = [
  { id: 'orange', label: 'Laranja', color: '#D97706', darkColor: '#F59E0B' },
  { id: 'blue',   label: 'Azul',    color: '#2563EB', darkColor: '#60A5FA' },
  { id: 'red',    label: 'Vermelho', color: '#DC2626', darkColor: '#F87171' },
  { id: 'purple', label: 'Roxo',    color: '#7C3AED', darkColor: '#A78BFA' },
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

// ─── SectionNavContext ────────────────────────────────────────────────────────
const SectionNavContext = createContext<((id: Section) => void) | null>(null)

function SectionNav({ current }: { current: Section }) {
  const navigate = useContext(SectionNavContext)
  const all: Section[] = [...([] as Section[]).concat(
    SIDEBAR_ITEMS.map(i => i.id)
  )]
  const idx = all.indexOf(current)
  const prev = idx > 0 ? all[idx - 1] : null
  const next = idx < all.length - 1 ? all[idx + 1] : null
  const label = (id: Section) => SIDEBAR_ITEMS.find(i => i.id === id)?.label ?? id

  if (!navigate) return null

  return (
    <div className="flex items-center justify-between mt-12 pt-6 border-t border-stone-200 dark:border-stone-800">
      <div>
        {prev && (
          <button
            onClick={() => navigate(prev)}
            className="flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            <span>←</span>
            <span>{label(prev)}</span>
          </button>
        )}
      </div>
      <div>
        {next && (
          <button
            onClick={() => navigate(next)}
            className="flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            <span>{label(next)}</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
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
              <td className="px-4 py-2.5 align-top max-w-[260px]">
                <code className="font-mono text-[0.8125rem] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-amber-600 dark:text-amber-400 break-words whitespace-pre-wrap">
                  {p.type}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top whitespace-nowrap">
                <code className="font-mono text-[0.8125rem] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400">
                  {p.default ?? '—'}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top text-stone-600 dark:text-stone-400 leading-relaxed min-w-[200px]">
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
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center gap-1 min-w-0">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 mr-2 sm:mr-4 bg-transparent border-0 cursor-pointer p-0 shrink-0"
        >
          <span className="text-[1.0625rem] font-bold text-amber-600 dark:text-amber-500 tracking-tight">
            Single UI
          </span>
          <span className="hidden sm:inline text-[0.625rem] font-bold px-1.5 py-0.5 bg-amber-600 dark:bg-amber-500 text-white rounded-full uppercase tracking-wider">
            React
          </span>
        </button>

        <div className="flex gap-0.5">
          {([
            { id: 'home', label: 'Início' },
            { id: 'components', label: 'Componentes' },
          ] as { id: Page; label: string }[]).map(p => (
            <button
              key={p.id}
              onClick={() => navigate(p.id)}
              className={clsx(
                'bg-transparent border-0 cursor-pointer px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                page === p.id
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-800/60'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Accent swatches — hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-1.5 ml-auto mr-2">
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
          className="ml-auto sm:ml-0 p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center bg-transparent cursor-pointer shrink-0"
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
    { id: 3, component: 'Textarea', descricao: 'Área de texto com auto-resize', status: 'Estável' },
    { id: 4, component: 'Select', descricao: 'Seleção com busca e múltipla seleção', status: 'Estável' },
    { id: 5, component: 'Checkbox', descricao: 'Caixa de seleção acessível', status: 'Estável' },
    { id: 6, component: 'Switch', descricao: 'Toggle com animação suave', status: 'Estável' },
    { id: 7, component: 'Chip', descricao: 'Tags e etiquetas removíveis', status: 'Estável' },
    { id: 8, component: 'InputOTP', descricao: 'Entrada de código OTP por dígito', status: 'Estável' },
    { id: 9, component: 'Card', descricao: 'Containers de conteúdo', status: 'Estável' },
    { id: 10, component: 'Modal', descricao: 'Diálogos com portal', status: 'Estável' },
    { id: 11, component: 'Drawer', descricao: 'Painel lateral deslizante', status: 'Estável' },
    { id: 12, component: 'Popover', descricao: 'Painel flutuante com posicionamento', status: 'Estável' },
    { id: 13, component: 'Tooltip', descricao: 'Dicas contextuais com hover', status: 'Estável' },
    { id: 14, component: 'Toast', descricao: 'Notificações temporárias', status: 'Estável' },
    { id: 15, component: 'Table', descricao: 'Tabelas com ordenação', status: 'Estável' },
    { id: 16, component: 'Tabs', descricao: 'Abas com variantes underline e pills', status: 'Estável' },
    { id: 17, component: 'Accordion', descricao: 'Painéis colapsáveis com animação', status: 'Estável' },
    { id: 18, component: 'Pagination', descricao: 'Paginação com ellipsis', status: 'Estável' },
    { id: 19, component: 'Avatar', descricao: 'Avatares com fallback e grupos', status: 'Estável' },
    { id: 20, component: 'Skeleton', descricao: 'Placeholder animado de carregamento', status: 'Estável' },
    { id: 21, component: 'DatePicker', descricao: 'Seleção de data com navegação mês/ano', status: 'Estável' },
    { id: 22, component: 'DateRangePicker', descricao: 'Seleção de intervalo entre duas datas', status: 'Estável' },
    { id: 23, component: 'DatePickerInput', descricao: 'Input com popup de data', status: 'Estável' },
    { id: 24, component: 'DateRangePickerInput', descricao: 'Input com popup de intervalo', status: 'Estável' },
  ]

  return (
    <main className="bg-stone-50 dark:bg-stone-950 min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-[680px] mx-auto">
          <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 mb-6 tracking-wide">
            24 componentes · TypeScript · Dark Mode · v1.0.0
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
      <SectionNav current="button" />
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
      <SectionNav current="input" />
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

// ─── Textarea Section ────────────────────────────────────────────────────────
function TextareaSection() {
  return (
    <section id="textarea" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Textarea" description="Campo de texto multilinha com as mesmas variantes de estado do Input: erro, helper text, label e resize." />
      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-col gap-4">
        <Textarea label="Descrição" placeholder="Digite sua mensagem..." rows={3} />
        <Textarea label="Com erro" error="Campo obrigatório" defaultValue="Texto inválido" />
        <Textarea label="Sem resize" resize="none" placeholder="Não redimensionável..." />
        <Textarea label="Desabilitado" disabled defaultValue="Conteúdo desabilitado" />
      </DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Textarea } from '@single-ui/react'

<Textarea
  label="Mensagem"
  placeholder="Digite aqui..."
  rows={4}
  resize="vertical"
/>`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'label', type: 'string', description: 'Label do campo' },
        { name: 'error', type: 'string', description: 'Mensagem de erro' },
        { name: 'helperText', type: 'string', description: 'Texto auxiliar' },
        { name: 'rows', type: 'number', default: '3', description: 'Número de linhas visíveis' },
        { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Direção de redimensionamento' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Ocupa toda a largura' },
        { name: 'disabled', type: 'boolean', description: 'Desabilita o campo' },
      ]} />
      <SectionNav current="textarea" />
    </section>
  )
}

// ─── Drawer Section ───────────────────────────────────────────────────────────
function DrawerSection() {
  const [side, setSide] = useState<'right' | 'left' | 'top' | 'bottom'>('right')
  const [open, setOpen] = useState(false)
  return (
    <section id="drawer" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Drawer" description="Painel lateral deslizante com suporte a 4 lados, 4 tamanhos, header, footer e backdrop." />
      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          {(['right', 'left', 'bottom', 'top'] as const).map(s => (
            <Button key={s} variant="secondary" size="sm" onClick={() => { setSide(s); setOpen(true) }}>
              Abrir {s}
            </Button>
          ))}
        </div>
        <Drawer open={open} onClose={() => setOpen(false)} side={side} title={`Drawer — ${side}`}
          footer={<div className="flex justify-end gap-2"><Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Fechar</Button><Button size="sm" onClick={() => setOpen(false)}>Confirmar</Button></div>}>
          <p className="text-stone-500 dark:text-stone-400 text-sm">Conteúdo do drawer. Feche com ESC, clicando no backdrop ou no botão.</p>
        </Drawer>
      </DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Drawer, Button } from '@single-ui/react'

const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Abrir Drawer</Button>

<Drawer
  open={open}
  onClose={() => setOpen(false)}
  side="right"
  size="md"
  title="Título"
  footer={<Button onClick={() => setOpen(false)}>Fechar</Button>}
>
  Conteúdo aqui
</Drawer>`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'open', type: 'boolean', required: true, description: 'Controla a visibilidade' },
        { name: 'onClose', type: '() => void', required: true, description: 'Callback ao fechar' },
        { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", description: 'Lado de onde o drawer abre' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Tamanho do drawer' },
        { name: 'title', type: 'string', description: 'Título do header' },
        { name: 'footer', type: 'ReactNode', description: 'Conteúdo do footer fixo' },
        { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Fechar ao clicar no backdrop' },
      ]} />
    </section>
  )
}

// ─── Chip Section ─────────────────────────────────────────────────────────────
function ChipSection() {
  return (
    <section id="chip" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Chip" description="Tags compactas com variantes de cor e botão de remoção opcional. Mesmo esquema de cores dos botões." />
      <StepTitle>Variantes</StepTitle>
      <DemoBox className="flex flex-wrap gap-2">
        {(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'] as const).map(v => (
          <Chip key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} />
        ))}
      </DemoBox>
      <StepTitle>Com remoção</StepTitle>
      <DemoBox className="flex flex-wrap gap-2">
        {(['primary', 'success', 'error'] as const).map(v => (
          <Chip key={v} label={`${v} removível`} variant={v} onRemove={() => {}} />
        ))}
      </DemoBox>
      <StepTitle>Tamanhos</StepTitle>
      <DemoBox className="flex items-center gap-3">
        <Chip label="Small" size="sm" variant="primary" />
        <Chip label="Medium" size="md" variant="primary" />
      </DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Chip } from '@single-ui/react'

<Chip label="Tag" variant="primary" />
<Chip label="Removível" variant="success" onRemove={() => removeTag(id)} />`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'label', type: 'string', required: true, description: 'Texto do chip' },
        { name: 'variant', type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'", default: "'default'", description: 'Variante de cor' },
        { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Tamanho' },
        { name: 'onRemove', type: '(e: MouseEvent) => void', description: 'Exibe botão × e chama ao clicar' },
      ]} />
    </section>
  )
}

// ─── Badge Section ────────────────────────────────────────────────────────────
function BadgeSection() {
  return (
    <section id="badge" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Badge" description="Etiquetas de status e categorias com variantes de cor." />

      <h3 id="variantes" className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-6 mb-2 [scroll-margin-top:76px]">Variantes</h3>
      <DemoBox>
        <div className="flex gap-2 flex-wrap items-center">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
        <div className="flex gap-2 flex-wrap items-center mt-3">
          <Badge variant="success" dot>Online</Badge>
          <Badge variant="warning" dot>Pendente</Badge>
          <Badge variant="error" dot>Offline</Badge>
          <Badge variant="info" dot>Sincronizando</Badge>
        </div>
      </DemoBox>

      <div id="uso-basico" className="scroll-mt-19" />
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Badge } from '@single-ui/react'

<Badge variant="primary">Primary</Badge>
<Badge variant="success" dot>Online</Badge>
<Badge variant="error">Erro</Badge>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'variant', type: "'default'|'primary'|'success'|'warning'|'error'|'info'", default: "'default'", description: 'Cor do badge' },
        { name: 'size', type: "'sm'|'md'", default: "'sm'", description: 'Tamanho' },
        { name: 'dot', type: 'boolean', default: 'false', description: 'Exibe ponto colorido à esquerda' },
        { name: 'children', type: 'ReactNode', required: true, description: 'Conteúdo do badge' },
      ]} />
    </section>
  )
}

// ─── Slider Section ───────────────────────────────────────────────────────────
function SliderSection() {
  const [val, setVal] = useState(40)
  const [range, setRange] = useState(200)
  return (
    <section id="slider" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Slider" description="Controle deslizante para seleção de valores numéricos." />

      <h3 id="demo" className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-6 mb-2 [scroll-margin-top:76px]">Demo</h3>
      <DemoBox>
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <Slider label="Volume" showValue value={val} onChange={setVal} />
          <Slider
            label="Faixa de preço"
            min={0} max={1000} step={10}
            showValue
            formatValue={v => `R$ ${v}`}
            value={range}
            onChange={setRange}
          />
          <Slider label="Desabilitado" value={60} disabled />
        </div>
      </DemoBox>

      <div id="uso-basico" className="scroll-mt-19" />
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Slider } from '@single-ui/react'

const [vol, setVol] = useState(40)

<Slider label="Volume" showValue value={vol} onChange={setVol} />
<Slider
  label="Preço"
  min={0} max={1000} step={10}
  formatValue={v => \`R$ \${v}\`}
  showValue
  value={price}
  onChange={setPrice}
/>`} />

      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'min', type: 'number', default: '0', description: 'Valor mínimo' },
        { name: 'max', type: 'number', default: '100', description: 'Valor máximo' },
        { name: 'step', type: 'number', default: '1', description: 'Incremento por passo' },
        { name: 'value', type: 'number', description: 'Valor controlado' },
        { name: 'defaultValue', type: 'number', description: 'Valor inicial (não controlado)' },
        { name: 'onChange', type: '(value: number) => void', description: 'Callback de mudança' },
        { name: 'label', type: 'string', description: 'Rótulo acima do slider' },
        { name: 'showValue', type: 'boolean', default: 'false', description: 'Exibe o valor atual' },
        { name: 'formatValue', type: '(v: number) => string', description: 'Formata o valor exibido' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Desabilita o slider' },
        { name: 'helperText', type: 'string', description: 'Texto auxiliar abaixo' },
      ]} />
    </section>
  )
}

// ─── Tabs Section ─────────────────────────────────────────────────────────────
function TabsSection() {
  const tabItems = [
    { id: 'integrations', label: 'Active integrations', badge: 16, content: <p className="text-stone-500 dark:text-stone-400 text-sm">Mostrando integrações ativas.</p> },
    { id: 'directory', label: 'Integration directory', content: <p className="text-stone-500 dark:text-stone-400 text-sm">Diretório de integrações disponíveis.</p> },
    { id: 'disabled', label: 'Desabilitado', disabled: true, content: null },
  ]
  return (
    <section id="tabs" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Tabs" description="Navegação em abas com variantes underline e pills, suporte a badge, estado desabilitado e modos controlado/não-controlado." />
      <StepTitle>Underline</StepTitle>
      <DemoBox>
        <Tabs items={tabItems} variant="underline" defaultTab="integrations" />
      </DemoBox>
      <StepTitle>Pills</StepTitle>
      <DemoBox>
        <Tabs items={tabItems} variant="pills" defaultTab="integrations" />
      </DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Tabs } from '@single-ui/react'
import type { TabItem } from '@single-ui/react'

const items: TabItem[] = [
  { id: 'tab1', label: 'Tab 1', content: <div>Conteúdo 1</div> },
  { id: 'tab2', label: 'Tab 2', badge: 3, content: <div>Conteúdo 2</div> },
  { id: 'tab3', label: 'Desabilitado', disabled: true, content: null },
]

// Não controlado
<Tabs items={items} defaultTab="tab1" variant="underline" />

// Controlado
<Tabs items={items} activeTab={active} onChange={setActive} />`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'items', type: 'TabItem[]', required: true, description: 'Lista de abas' },
        { name: 'variant', type: "'underline' | 'pills'", default: "'underline'", description: 'Estilo visual' },
        { name: 'defaultTab', type: 'string', description: 'ID da aba aberta por padrão (não controlado)' },
        { name: 'activeTab', type: 'string', description: 'ID da aba ativa (controlado)' },
        { name: 'onChange', type: '(id: string) => void', description: 'Callback ao trocar de aba' },
      ]} />
    </section>
  )
}

// ─── Accordion Section ────────────────────────────────────────────────────────
function AccordionSection() {
  const items = [
    { id: '1', title: 'O que é Single UI?', content: <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">Single UI é uma biblioteca de componentes React moderna, tipada em TypeScript, com suporte a dark mode e temas de cor via CSS custom properties.</p> },
    { id: '2', title: 'Como instalar?', content: <CodeBlock code="npm install @single-ui/react" /> },
    { id: '3', title: 'Suporta SSR?', content: <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">Sim. Todos os componentes são compatíveis com React Server Components e frameworks como Next.js.</p> },
    { id: '4', title: 'Item desabilitado', disabled: true, content: null },
  ]
  return (
    <section id="accordion" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Accordion" description="Lista de itens expansíveis com animação suave. Suporte a seleção múltipla e 3 variantes visuais." />
      <StepTitle>Demo</StepTitle>
      <DemoBox><Accordion items={items} defaultOpen="1" /></DemoBox>
      <StepTitle>Variante bordered</StepTitle>
      <DemoBox><Accordion items={items.slice(0, 3)} variant="bordered" multiple /></DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Accordion } from '@single-ui/react'
import type { AccordionItem } from '@single-ui/react'

const items: AccordionItem[] = [
  { id: '1', title: 'Pergunta 1', content: <p>Resposta 1</p> },
  { id: '2', title: 'Pergunta 2', content: <p>Resposta 2</p> },
]

<Accordion items={items} defaultOpen="1" />
<Accordion items={items} multiple variant="bordered" />`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'items', type: 'AccordionItem[]', required: true, description: 'Lista de itens' },
        { name: 'variant', type: "'default' | 'bordered' | 'separated'", default: "'default'", description: 'Estilo visual' },
        { name: 'multiple', type: 'boolean', default: 'false', description: 'Permite múltiplos itens abertos' },
        { name: 'defaultOpen', type: 'string | string[]', description: 'ID(s) abertos por padrão' },
        { name: 'open', type: 'string | string[]', description: 'ID(s) abertos (controlado)' },
        { name: 'onChange', type: '(id: string, isOpen: boolean) => void', description: 'Callback ao expandir/recolher' },
      ]} />
    </section>
  )
}

// ─── Avatar Section ───────────────────────────────────────────────────────────
function AvatarSection() {
  return (
    <section id="avatar" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Avatar" description="Exibe foto, iniciais geradas a partir do nome com cor determinística, ou ícone genérico. Suporte a status e grupo." />
      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-wrap items-center gap-4">
        <Avatar src="https://i.pravatar.cc/150?img=1" name="Ana Silva" size="xl" status="online" />
        <Avatar name="Bruno Costa" size="lg" status="busy" />
        <Avatar name="Carlos Lima" size="md" status="away" />
        <Avatar name="Daniela Mota" size="sm" status="offline" />
        <Avatar size="xs" />
      </DemoBox>
      <StepTitle>Avatar Group</StepTitle>
      <DemoBox>
        <AvatarGroup max={4}>
          <Avatar src="https://i.pravatar.cc/150?img=1" name="Ana" />
          <Avatar name="Bruno Costa" />
          <Avatar name="Carlos Lima" />
          <Avatar name="Daniela Mota" />
          <Avatar name="Eduardo Nogueira" />
          <Avatar name="Fernanda Souza" />
        </AvatarGroup>
      </DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Avatar, AvatarGroup } from '@single-ui/react'

<Avatar src="/foto.jpg" name="Ana Silva" size="md" status="online" />
<Avatar name="Bruno Costa" size="lg" />

<AvatarGroup max={4}>
  <Avatar name="Ana Silva" />
  <Avatar name="Bruno Costa" />
  <Avatar name="Carlos Lima" />
  {/* +N overflow automático */}
</AvatarGroup>`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'src', type: 'string', description: 'URL da imagem' },
        { name: 'name', type: 'string', description: 'Nome para gerar iniciais e cor' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Tamanho do avatar' },
        { name: 'status', type: "'online' | 'offline' | 'busy' | 'away'", description: 'Ponto de status' },
      ]} />
    </section>
  )
}

// ─── Skeleton Section ─────────────────────────────────────────────────────────
function SkeletonSection() {
  return (
    <section id="skeleton" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Skeleton" description="Placeholder de carregamento com animação shimmer. Variantes text, rect e circle." />
      <StepTitle>Variantes</StepTitle>
      <DemoBox className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" width={48} height={48} />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton variant="text" width="60%" height={14} />
            <Skeleton variant="text" width="40%" height={12} />
          </div>
        </div>
        <Skeleton variant="rect" width="100%" height={120} />
        <Skeleton variant="text" lines={4} />
      </DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Skeleton } from '@single-ui/react'

// Texto com múltiplas linhas
<Skeleton variant="text" lines={3} />

// Card placeholder
<Skeleton variant="rect" width="100%" height={200} />

// Avatar placeholder
<Skeleton variant="circle" width={40} height={40} />`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'variant', type: "'text' | 'rect' | 'circle'", default: "'rect'", description: 'Formato do skeleton' },
        { name: 'width', type: 'string | number', description: 'Largura (number = px)' },
        { name: 'height', type: 'string | number', description: 'Altura (number = px)' },
        { name: 'lines', type: 'number', description: 'Nº de linhas (variant=text). Última linha 60% de largura.' },
      ]} />
    </section>
  )
}

// ─── Tooltip Section ──────────────────────────────────────────────────────────
function TooltipSection() {
  return (
    <section id="tooltip" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Tooltip" description="Dica flutuante que aparece ao hover/focus. 4 posições, delay configurável." />
      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-wrap gap-4 justify-center py-6">
        <Tooltip content="Tooltip em cima" placement="top"><Button variant="secondary" size="sm">Top</Button></Tooltip>
        <Tooltip content="Tooltip em baixo" placement="bottom"><Button variant="secondary" size="sm">Bottom</Button></Tooltip>
        <Tooltip content="Tooltip à esquerda" placement="left"><Button variant="secondary" size="sm">Left</Button></Tooltip>
        <Tooltip content="Tooltip à direita" placement="right"><Button variant="secondary" size="sm">Right</Button></Tooltip>
      </DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Tooltip, Button } from '@single-ui/react'

<Tooltip content="Texto da dica" placement="top">
  <Button>Passe o mouse</Button>
</Tooltip>`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'content', type: 'ReactNode', required: true, description: 'Conteúdo do tooltip' },
        { name: 'children', type: 'ReactElement', required: true, description: 'Elemento que dispara o tooltip' },
        { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Posição do tooltip' },
        { name: 'delay', type: 'number', default: '300', description: 'Delay em ms antes de exibir' },
        { name: 'disabled', type: 'boolean', description: 'Desabilita o tooltip' },
      ]} />
    </section>
  )
}

// ─── Popover Section ──────────────────────────────────────────────────────────
function PopoverSection() {
  return (
    <section id="popover" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Popover" description="Painel flutuante ativado por clique. Suporte a título, 8 posições e modo controlado." />
      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-wrap gap-4 justify-center py-6">
        <Popover
          placement="bottom-start"
          title="Filtros"
          trigger={<Button variant="secondary" size="sm">Abrir popover</Button>}
          content={
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Input placeholder="Buscar..." />
              <Button size="sm">Aplicar</Button>
            </div>
          }
        />
        <Popover
          placement="bottom-end"
          trigger={<Button variant="secondary" size="sm">Sem título</Button>}
          content={<p className="text-sm text-stone-500 dark:text-stone-400">Conteúdo simples sem header.</p>}
        />
      </DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Popover, Button } from '@single-ui/react'

<Popover
  trigger={<Button>Abrir</Button>}
  title="Opções"
  placement="bottom-start"
  content={
    <div>
      <p>Conteúdo do popover</p>
    </div>
  }
/>`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'trigger', type: 'ReactElement', required: true, description: 'Elemento que abre o popover' },
        { name: 'content', type: 'ReactNode', required: true, description: 'Conteúdo do popover' },
        { name: 'title', type: 'string', description: 'Título do header (com botão fechar)' },
        { name: 'placement', type: "'top' | 'bottom' | 'bottom-start' | 'bottom-end' | ...", default: "'bottom-start'", description: 'Posição do painel' },
        { name: 'open', type: 'boolean', description: 'Controlado' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Callback de abertura/fechamento' },
      ]} />
    </section>
  )
}

// ─── Toast Section ────────────────────────────────────────────────────────────
function ToastDemo() {
  const { toast } = useToast()
  return (
    <DemoBox className="flex flex-wrap gap-2">
      <Button variant="success" size="sm" onClick={() => toast.success('Operação realizada com sucesso!', { title: 'Sucesso' })}>Success</Button>
      <Button variant="error" size="sm" onClick={() => toast.error('Algo deu errado. Tente novamente.', { title: 'Erro' })}>Error</Button>
      <Button variant="warning" size="sm" onClick={() => toast.warning('Atenção: verifique os dados.', { title: 'Aviso' })}>Warning</Button>
      <Button variant="info" size="sm" onClick={() => toast.info('Atualização disponível.', { title: 'Info' })}>Info</Button>
    </DemoBox>
  )
}

function ToastSection() {
  return (
    <section id="toast" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Toast" description="Notificações temporárias com auto-dismiss, barra de progresso e 4 variantes. Requer ToastProvider no root da aplicação." />
      <StepTitle>Demo</StepTitle>
      <ToastDemo />
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`// 1. Adicione ToastProvider no root (main.tsx ou App.tsx)
import { ToastProvider } from '@single-ui/react'

<ToastProvider>
  <App />
</ToastProvider>

// 2. Use o hook em qualquer componente
import { useToast } from '@single-ui/react'

function MyComponent() {
  const { toast } = useToast()

  return (
    <Button onClick={() => toast.success('Salvo!', { title: 'Sucesso' })}>
      Salvar
    </Button>
  )
}`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'toast.success(msg, opts?)', type: 'function', description: 'Exibe toast de sucesso' },
        { name: 'toast.error(msg, opts?)', type: 'function', description: 'Exibe toast de erro' },
        { name: 'toast.warning(msg, opts?)', type: 'function', description: 'Exibe toast de aviso' },
        { name: 'toast.info(msg, opts?)', type: 'function', description: 'Exibe toast informativo' },
        { name: 'opts.title', type: 'string', description: 'Título em negrito acima da mensagem' },
        { name: 'opts.duration', type: 'number', default: '4000', description: 'Duração em ms antes do auto-dismiss' },
      ]} />
    </section>
  )
}

// ─── Pagination Section ───────────────────────────────────────────────────────
function PaginationSection() {
  const [page, setPage] = useState(1)
  return (
    <section id="pagination" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="Pagination" description="Navegação entre páginas com ellipsis automático, primeiros/últimos e 3 tamanhos." />
      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-col gap-6 items-start">
        <div className="flex flex-col gap-2 w-full">
          <p className="text-sm text-stone-500 dark:text-stone-400">Página atual: <strong className="text-stone-800 dark:text-stone-200">{page}</strong></p>
          <Pagination totalPages={20} currentPage={page} onChange={setPage} />
        </div>
        <Pagination totalPages={10} currentPage={3} onChange={() => {}} size="sm" />
        <Pagination totalPages={10} currentPage={3} onChange={() => {}} size="lg" showFirstLast={false} />
      </DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { Pagination } from '@single-ui/react'

const [page, setPage] = useState(1)

<Pagination
  totalPages={20}
  currentPage={page}
  onChange={setPage}
  siblingCount={1}
/>`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'totalPages', type: 'number', required: true, description: 'Total de páginas' },
        { name: 'currentPage', type: 'number', required: true, description: 'Página atual' },
        { name: 'onChange', type: '(page: number) => void', required: true, description: 'Callback ao mudar de página' },
        { name: 'siblingCount', type: 'number', default: '1', description: 'Páginas exibidas ao redor da atual' },
        { name: 'showFirstLast', type: 'boolean', default: 'true', description: 'Exibe botões de primeira/última página' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Tamanho dos botões' },
      ]} />
    </section>
  )
}

// ─── InputOTP Section ─────────────────────────────────────────────────────────
function InputOTPSection() {
  const [otp, setOtp] = useState('')
  return (
    <section id="inputotp" className="py-[52px] border-b border-stone-200 dark:border-stone-800 [scroll-margin-top:76px]">
      <SectionHeader title="InputOTP" description="Campo de código de verificação com boxes individuais, auto-focus, paste inteligente e separadores configuráveis." />
      <StepTitle>Demo</StepTitle>
      <DemoBox className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-stone-500 dark:text-stone-400">Valor: <strong className="text-stone-800 dark:text-stone-200 font-mono">{otp || '—'}</strong></p>
          <InputOTP length={6} value={otp} onChange={setOtp} onComplete={(v) => console.log('OTP completo:', v)} separator={3} label="Código de verificação" helperText="Digite o código enviado por SMS." />
        </div>
        <InputOTP length={4} label="PIN (4 dígitos)" />
      </DemoBox>
      <StepTitle>Uso básico</StepTitle>
      <CodeBlock code={`import { InputOTP } from '@single-ui/react'

const [otp, setOtp] = useState('')

<InputOTP
  length={6}
  value={otp}
  onChange={setOtp}
  onComplete={(code) => verifyCode(code)}
  separator={3}
  label="Código de verificação"
/>`} />
      <StepTitle>Props</StepTitle>
      <PropsTable props={[
        { name: 'length', type: 'number', default: '6', description: 'Número de dígitos' },
        { name: 'value', type: 'string', description: 'Valor controlado' },
        { name: 'onChange', type: '(value: string) => void', description: 'Callback a cada dígito' },
        { name: 'onComplete', type: '(value: string) => void', description: 'Callback quando todos os dígitos são preenchidos' },
        { name: 'separator', type: 'number | number[]', description: 'Posição(ões) do separador visual' },
        { name: 'disabled', type: 'boolean', description: 'Desabilita todos os campos' },
        { name: 'error', type: 'string', description: 'Mensagem de erro' },
      ]} />
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
  textarea: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  drawer: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  chip: [
    { id: 'variantes', label: 'Variantes' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  tabs: [
    { id: 'underline', label: 'Underline' },
    { id: 'pills', label: 'Pills' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  accordion: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  avatar: [
    { id: 'demo', label: 'Demo' },
    { id: 'avatar-group', label: 'AvatarGroup' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  skeleton: [
    { id: 'variantes', label: 'Variantes' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  tooltip: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  popover: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  toast: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  pagination: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  inputotp: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  badge: [
    { id: 'variantes', label: 'Variantes' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
  slider: [
    { id: 'demo', label: 'Demo' },
    { id: 'uso-basico', label: 'Uso básico' },
    { id: 'props', label: 'Props' },
  ],
}

const GUIDE_ITEMS: Section[] = ['install', 'themes', 'form']
const COMPONENT_ITEMS: Section[] = [
  'button', 'input', 'textarea', 'card', 'modal', 'drawer',
  'table', 'select', 'switch', 'checkbox', 'chip', 'badge', 'slider', 'tabs', 'accordion',
  'avatar', 'skeleton', 'tooltip', 'popover', 'toast', 'pagination', 'inputotp',
  'datepicker', 'daterangepicker', 'datepickerinput', 'daterangepickerinput',
]

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

  const sections: Record<Section, () => React.ReactElement> = {
    install: InstallSection,
    themes: ThemesSection,
    form: FormSection,
    button: ButtonSection,
    input: InputSection,
    textarea: TextareaSection,
    card: CardSection,
    modal: ModalSection,
    drawer: DrawerSection,
    table: TableSection,
    select: SelectSection,
    switch: SwitchSection,
    checkbox: CheckboxSection,
    chip: ChipSection,
    badge: BadgeSection,
    slider: SliderSection,
    tabs: TabsSection,
    accordion: AccordionSection,
    avatar: AvatarSection,
    skeleton: SkeletonSection,
    tooltip: TooltipSection,
    popover: PopoverSection,
    toast: ToastSection,
    pagination: PaginationSection,
    inputotp: InputOTPSection,
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
          <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-12 pb-24 pt-2">
            <SectionNavContext.Provider value={navigate}>
              <ActiveSection />
            </SectionNavContext.Provider>
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

// ─── TasksPage ────────────────────────────────────────────────────────────────
interface Task {
  id: string
  title: string
  category: 'Bug' | 'Feature' | 'Documentation'
  status: 'Todo' | 'In Progress' | 'Done' | 'Backlog' | 'Canceled'
  priority: 'Low' | 'Medium' | 'High'
  checked: boolean
}

const INITIAL_TASKS: Task[] = [
  { id: 'TASK-8782', title: 'Corrigir crash no formulário de login', category: 'Bug', status: 'In Progress', priority: 'High', checked: false },
  { id: 'TASK-7890', title: 'Adicionar suporte a dark mode no dashboard', category: 'Feature', status: 'Todo', priority: 'Medium', checked: false },
  { id: 'TASK-7423', title: 'Documentar API de autenticação', category: 'Documentation', status: 'Done', priority: 'Low', checked: false },
  { id: 'TASK-6934', title: 'Validação de CPF no cadastro de usuários', category: 'Bug', status: 'Backlog', priority: 'High', checked: false },
  { id: 'TASK-6210', title: 'Implementar paginação na listagem de produtos', category: 'Feature', status: 'In Progress', priority: 'Medium', checked: false },
  { id: 'TASK-5891', title: 'Atualizar guia de instalação da biblioteca', category: 'Documentation', status: 'Todo', priority: 'Low', checked: false },
  { id: 'TASK-5540', title: 'Erro de layout no mobile em resoluções < 360px', category: 'Bug', status: 'Canceled', priority: 'Low', checked: false },
  { id: 'TASK-4812', title: 'Criar componente de upload de arquivos', category: 'Feature', status: 'Backlog', priority: 'Medium', checked: false },
  { id: 'TASK-4201', title: 'Documentar tokens de design do sistema', category: 'Documentation', status: 'Done', priority: 'Medium', checked: false },
  { id: 'TASK-3987', title: 'Select múltiplo não reseta ao limpar', category: 'Bug', status: 'In Progress', priority: 'High', checked: false },
  { id: 'TASK-3412', title: 'Adicionar skeleton na tela de carregamento', category: 'Feature', status: 'Done', priority: 'Low', checked: false },
  { id: 'TASK-2890', title: 'Revisar acessibilidade dos componentes de formulário', category: 'Documentation', status: 'Backlog', priority: 'Medium', checked: false },
]

function StatusIcon({ status }: { status: Task['status'] }) {
  if (status === 'In Progress') return <span className="text-blue-500" title="In Progress">◷</span>
  if (status === 'Done') return <span className="text-emerald-500" title="Done">✓</span>
  if (status === 'Canceled') return <span className="text-stone-400" title="Canceled">⊘</span>
  if (status === 'Backlog') return <span className="text-stone-400" title="Backlog">◎</span>
  return <span className="text-stone-400" title="Todo">○</span>
}

function PriorityIcon({ priority }: { priority: Task['priority'] }) {
  if (priority === 'High') return <span className="text-red-500" title="High">↑</span>
  if (priority === 'Low') return <span className="text-stone-400" title="Low">↓</span>
  return <span className="text-amber-500" title="Medium">→</span>
}

function categoryVariant(cat: Task['category']): 'error' | 'primary' | 'default' {
  if (cat === 'Bug') return 'error'
  if (cat === 'Feature') return 'primary'
  return 'default'
}

function statusVariant(s: Task['status']): 'info' | 'success' | 'default' {
  if (s === 'In Progress') return 'info'
  if (s === 'Done') return 'success'
  return 'default'
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [filter, setFilter] = useState('')
  const [selectAll, setSelectAll] = useState(false)

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(filter.toLowerCase()) ||
    t.id.toLowerCase().includes(filter.toLowerCase())
  )

  const toggleAll = (checked: boolean) => {
    setSelectAll(checked)
    setTasks(prev => prev.map(t => ({ ...t, checked })))
  }

  const toggleOne = (id: string, checked: boolean) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, checked } : t))
  }

  type TaskCol = { key: string; label: string; width?: string | number; align?: 'left' | 'center' | 'right'; render: (row: Task) => React.ReactNode; renderHeader?: () => React.ReactNode }
  const columns: TaskCol[] = [
    {
      key: 'check',
      label: '',
      width: 40,
      align: 'center' as const,
      renderHeader: () => (
        <Checkbox
          checked={selectAll}
          indeterminate={tasks.some(t => t.checked) && !tasks.every(t => t.checked)}
          onChange={e => toggleAll(e.target.checked)}
        />
      ),
      render: (row: Task) => (
        <Checkbox
          checked={row.checked}
          onChange={e => toggleOne(row.id, e.target.checked)}
        />
      ),
    },
    {
      key: 'id', label: 'Tarefa', width: 110,
      render: (row) => (
        <span className="font-mono text-xs text-stone-400 dark:text-stone-500">{row.id}</span>
      ),
    },
    {
      key: 'title', label: 'Título',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-800 dark:text-stone-200">{row.title}</span>
          <Badge variant={categoryVariant(row.category)} size="sm">{row.category}</Badge>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status', width: 140,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <StatusIcon status={row.status} />
          <Badge variant={statusVariant(row.status)} size="sm">{row.status}</Badge>
        </div>
      ),
    },
    {
      key: 'priority', label: 'Prioridade', width: 120,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <PriorityIcon priority={row.priority} />
          <span className="text-sm text-stone-600 dark:text-stone-400">{row.priority}</span>
        </div>
      ),
    },
    {
      key: 'actions', label: '', width: 40, align: 'center',
      render: () => (
        <button className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 bg-transparent border-0 cursor-pointer text-lg leading-none px-1">···</button>
      ),
    },
  ]

  const tableColumns = columns.map(col => ({
    key: col.key as keyof Task,
    label: col.label,
    width: col.width,
    align: col.align,
    render: (_v: Task[keyof Task], row: Task) => col.render(row),
    renderHeader: col.renderHeader,
  }))

  return (
    <main className="bg-stone-50 dark:bg-stone-950 min-h-screen pt-8 pb-24 px-4 sm:px-6">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              Bem-vindo de volta!
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
              Aqui está a lista de tarefas para este mês.
            </p>
          </div>
          <Avatar name="Eduardo Nogueira" size="md" status="online" />
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex-1 min-w-[200px] max-w-[320px]">
            <Input
              placeholder="Filtrar tarefas..."
              value={filter}
              onChange={v => setFilter(v)}
            />
          </div>
          <Button variant="secondary" size="sm" icon={<span>+</span>} iconPosition="left">Status</Button>
          <Button variant="secondary" size="sm" icon={<span>+</span>} iconPosition="left">Prioridade</Button>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="sm">Visualizar</Button>
            <Button size="sm">Adicionar Tarefa</Button>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={tableColumns}
          data={filtered}
          rowKey="id"
          emptyMessage="Nenhuma tarefa encontrada."
        />
      </div>
    </main>
  )
}

// ─── ExamplesPage ─────────────────────────────────────────────────────────────
function ExamplesPage() {
  const [cardNumber, setCardNumber] = useState('')
  const [cvv, setCvv] = useState('')
  const [month, setMonth] = useState<string | number | null>(null)
  const [year, setYear] = useState<string | number | null>(null)
  const [sameAsBilling, setSameAsBilling] = useState(false)
  const [twoFA, setTwoFA] = useState(true)
  const [syncing, setSyncing] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [logging, setLogging] = useState(true)
  const [compute, setCompute] = useState<'k8s' | 'vm'>('k8s')
  const [gpuCount, setGpuCount] = useState(2)
  const [hearAbout, setHearAbout] = useState<string | null>(null)

  const months = ['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => ({ value: m, label: m }))
  const years = Array.from({ length: 10 }, (_, i) => {
    const y = String(new Date().getFullYear() + i)
    return { value: y, label: y }
  })

  const hearOptions = ['Redes Sociais', 'Mecanismo de Busca', 'Indicação', 'Outro']

  return (
    <main className="bg-stone-50 dark:bg-stone-950 min-h-screen">
      <div className="pt-8 pb-24 px-4 sm:px-6 max-w-[1280px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-1">Exemplos</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mb-8">
          Padrões de UI do mundo real construídos com os componentes Single UI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* 1. Payment form */}
          <Card title="Pagamento" subtitle="Dados do cartão de crédito">
            <div className="flex flex-col gap-3">
              <Input
                label="Número do cartão"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={v => setCardNumber(v)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Mês" placeholder="MM" options={months} value={month} onChange={v => setMonth(v as string | number | null)} />
                <Select label="Ano" placeholder="AAAA" options={years} value={year} onChange={v => setYear(v as string | number | null)} />
              </div>
              <Input
                label="CVV"
                placeholder="000"
                value={cvv}
                onChange={v => setCvv(v)}
              />
              <Checkbox
                label="Mesmo endereço de cobrança"
                checked={sameAsBilling}
                onChange={e => setSameAsBilling(e.target.checked)}
              />
              <Textarea label="Observações" placeholder="Instruções especiais..." rows={2} />
              <div className="flex gap-2 mt-1">
                <Button variant="secondary" size="sm">Cancelar</Button>
                <Button size="sm">Confirmar pagamento</Button>
              </div>
            </div>
          </Card>

          {/* 2. Team members */}
          <Card title="Time" subtitle="Membros do projeto">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <AvatarGroup max={4}>
                  <Avatar src="https://i.pravatar.cc/150?img=1" name="Ana Silva" />
                  <Avatar name="Bruno Costa" />
                  <Avatar name="Carlos Lima" />
                  <Avatar name="Daniela Mota" />
                  <Avatar name="Eduardo Nogueira" />
                </AvatarGroup>
                <Button size="sm" variant="secondary" icon={<span>+</span>} iconPosition="left">Convidar</Button>
              </div>
              <div className="flex flex-col gap-2 mt-1">
                {[
                  { name: 'Ana Silva', role: 'Design Lead', badge: 'Admin' as const },
                  { name: 'Bruno Costa', role: 'Engenheiro Frontend', badge: 'Dev' as const },
                  { name: 'Carlos Lima', role: 'Engenheiro Backend', badge: 'Dev' as const },
                ].map(m => (
                  <div key={m.name} className="flex items-center gap-3">
                    <Avatar name={m.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{m.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{m.role}</p>
                    </div>
                    <Badge variant={m.badge === 'Admin' ? 'warning' : 'info'} size="sm">{m.badge}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 3. Status chips / switches */}
          <Card title="Integrações" subtitle="Status dos serviços">
            <div className="flex flex-col gap-3">
              {[
                { label: 'Sincronização de dados', badge: 'Sincronizando', variant: 'info' as const, checked: syncing, set: setSyncing },
                { label: 'Atualizações automáticas', badge: 'Atualizando', variant: 'warning' as const, checked: updating, set: setUpdating },
                { label: 'Logs de auditoria', badge: 'Ativo', variant: 'success' as const, checked: logging, set: setLogging },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-stone-800 dark:text-stone-200 truncate">{item.label}</span>
                    <Badge variant={item.checked ? item.variant : 'default'} dot size="sm">
                      {item.checked ? item.badge : 'Inativo'}
                    </Badge>
                  </div>
                  <Switch
                    checked={item.checked}
                    onChange={e => item.set(e.target.checked)}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* 4. Authentication */}
          <Card title="Segurança" subtitle="Configurações de autenticação">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-800 dark:text-stone-200">Autenticação em dois fatores</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Adicione uma camada extra de segurança</p>
                </div>
                <Switch checked={twoFA} onChange={e => setTwoFA(e.target.checked)} size="sm" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                <span className="text-emerald-500 text-lg">✓</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">E-mail verificado</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500">usuario@empresa.com</p>
                </div>
                <span className="text-emerald-500">→</span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">Sessões ativas</p>
                {[
                  { device: 'MacBook Pro', location: 'São Paulo, BR', active: true },
                  { device: 'iPhone 15', location: 'São Paulo, BR', active: false },
                ].map(s => (
                  <div key={s.device} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-stone-800 dark:text-stone-200">{s.device}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{s.location}</p>
                    </div>
                    <Badge variant={s.active ? 'success' : 'default'} dot size="sm">
                      {s.active ? 'Atual' : 'Inativa'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 5. Compute options */}
          <Card title="Infraestrutura" subtitle="Selecione o tipo de computação">
            <div className="flex flex-col gap-3">
              {([
                { id: 'k8s', label: 'Kubernetes', desc: 'Orquestração de contêineres escalável' },
                { id: 'vm', label: 'Máquina Virtual', desc: 'Instância de VM dedicada' },
              ] as { id: 'k8s' | 'vm'; label: string; desc: string }[]).map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setCompute(opt.id)}
                  className={clsx(
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    compute === opt.id
                      ? 'border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  )}
                >
                  <Checkbox
                    checked={compute === opt.id}
                    onChange={() => setCompute(opt.id)}
                  />
                  <div>
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{opt.label}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{opt.desc}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2">
                <Slider
                  label="GPUs"
                  min={1}
                  max={8}
                  step={1}
                  value={gpuCount}
                  onChange={setGpuCount}
                  showValue
                  formatValue={v => `${v} GPU${v > 1 ? 's' : ''}`}
                />
              </div>
            </div>
          </Card>

          {/* 6. How did you hear */}
          <Card title="Como nos encontrou?" subtitle="Selecione uma opção">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {hearOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setHearAbout(hearAbout === opt ? null : opt)}
                    className="bg-transparent border-0 cursor-pointer p-0"
                  >
                    <Chip
                      label={opt}
                      variant={hearAbout === opt ? 'primary' : 'default'}
                    />
                  </button>
                ))}
              </div>
              {hearAbout && (
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Selecionado: <strong className="text-stone-700 dark:text-stone-300">{hearAbout}</strong>
                </p>
              )}
              <div className="mt-2">
                <Textarea label="Conte-nos mais (opcional)" placeholder="Detalhes adicionais..." rows={2} />
              </div>
              <Button size="sm">Enviar resposta</Button>
            </div>
          </Card>

        </div>
      </div>
    </main>
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
        ) : page === 'examples' ? (
          <ExamplesPage />
        ) : page === 'tasks' ? (
          <TasksPage />
        ) : (
          <ComponentsPage key={initialSection} initialSection={initialSection} />
        )}
      </div>
    </div>
  )
}
