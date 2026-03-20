"use client"

import { useState } from "react"
import {
  useFinance,
  CATEGORIES,
  type Category,
  type FixedExpense,
  type VariableExpense,
} from "@/lib/finance-context"
import {
  Utensils,
  Home,
  Car,
  Heart,
  Gamepad2,
  BookOpen,
  ShoppingBag,
  MoreHorizontal,
  Check,
  Trash2,
  Plus,
  X,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Pencil,
  CreditCard,
  Film,
  Plane,
  Shield,
  Sparkles,
  Monitor,
  Wrench,
  Receipt,
  HeartHandshake,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  alimentacao: <Utensils size={14} />,
  moradia: <Home size={14} />,
  transporte: <Car size={14} />,
  saude: <Heart size={14} />,
  lazer: <Gamepad2 size={14} />,
  educacao: <BookOpen size={14} />,
  roupas: <ShoppingBag size={14} />,
  entretenimento: <Film size={14} />,
  viagem: <Plane size={14} />,
  seguros: <Shield size={14} />,
  beleza: <Sparkles size={14} />,
  tecnologia: <Monitor size={14} />,
  servicos: <Wrench size={14} />,
  impostos: <Receipt size={14} />,
  doacoes: <HeartHandshake size={14} />,
  investimentos: <TrendingUp size={14} />,
  outros: <MoreHorizontal size={14} />,
}

// ── Fixed Expenses ────────────────────────────────────────────────────────────

interface AddFixedFormData {
  name: string
  amount: string
  category: Category
  dueDay: string
}

export function FixedExpensesSection() {
  const {
    fixedExpenses,
    totalFixedExpenses,
    addFixedExpense,
    removeFixedExpense,
    toggleFixedExpensePaid,
  } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all",
  )
  const [form, setForm] = useState<AddFixedFormData>({
    name: "",
    amount: "",
    category: "moradia",
    dueDay: "5",
  })

  // Filter expenses by category
  const filteredExpenses =
    selectedCategory === "all"
      ? fixedExpenses
      : fixedExpenses.filter((expense) => expense.category === selectedCategory)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(form.amount.replace(",", "."))
    const dueDay = parseInt(form.dueDay)
    if (!form.name || isNaN(amount) || amount <= 0) return
    addFixedExpense({
      name: form.name,
      amount,
      category: form.category,
      paid: false,
      dueDay: isNaN(dueDay) ? 1 : Math.max(1, Math.min(31, dueDay)),
    })
    setForm({ name: "", amount: "", category: "moradia", dueDay: "5" })
    setShowForm(false)
  }

  const paidCount = filteredExpenses.filter((e) => e.paid).length

  return (
    <div className="px-3 sm:px-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Gastos Fixos
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {paidCount}/{filteredExpenses.length} pagos ·{" "}
            {formatCurrency(
              filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
            )}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-1.5 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
          aria-label="Adicionar gasto fixo"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}{" "}
        </button>
      </div>

      {/* Category filter */}
      <div className="mb-3">
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value as Category | "all")
          }
          className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">Todas as categorias</option>
          {(Object.entries(CATEGORIES) as [Category, { label: string }][]).map(
            ([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ),
          )}
        </select>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-primary/30 bg-card p-4 mb-3 space-y-3"
        >
          <p className="text-sm font-medium text-foreground">Novo Gasto Fixo</p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nome (ex: Aluguel)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Valor (R$)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                min="0"
                step="0.01"
                required
              />
              <input
                type="number"
                placeholder="Vence dia"
                value={form.dueDay}
                onChange={(e) => setForm({ ...form, dueDay: e.target.value })}
                className="bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                min="1"
                max="31"
              />
            </div>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as Category })
              }
              className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            >
              {(
                Object.entries(CATEGORIES) as [Category, { label: string }][]
              ).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Adicionar
          </button>
        </form>
      )}

      <div className="space-y-2">
        {filteredExpenses.map((expense) => (
          <FixedExpenseItem
            key={expense.id}
            expense={expense}
            onTogglePaid={() => toggleFixedExpensePaid(expense.id)}
            onRemove={() => removeFixedExpense(expense.id)}
          />
        ))}
        {filteredExpenses.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            {selectedCategory === "all"
              ? "Nenhum gasto fixo cadastrado."
              : `Nenhum gasto encontrado na categoria ${CATEGORIES[selectedCategory].label.toLowerCase()}.`}
          </p>
        )}
      </div>
    </div>
  )
}

function FixedExpenseItem({
  expense,
  onTogglePaid,
  onRemove,
}: {
  expense: FixedExpense
  onTogglePaid: () => void
  onRemove: () => void
}) {
  const color = CATEGORIES[expense.category].color

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl bg-card border border-border p-3.5 transition-all",
        expense.paid && "opacity-60",
      )}
    >
      {/* Category badge */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {CATEGORY_ICONS[expense.category]}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium text-foreground truncate",
            expense.paid && "line-through",
          )}
        >
          {expense.name}
        </p>
        <p className="text-xs text-muted-foreground">
          Vence dia {expense.dueDay} · {CATEGORIES[expense.category].label}
        </p>
      </div>

      {/* Amount */}
      <p className="text-sm font-semibold text-foreground shrink-0">
        {formatCurrency(expense.amount)}
      </p>

      {/* Toggle paid */}
      <button
        onClick={onTogglePaid}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
          expense.paid
            ? "bg-primary border-primary"
            : "border-border hover:border-primary",
        )}
        aria-label={expense.paid ? "Marcar como não pago" : "Marcar como pago"}
      >
        {expense.paid && (
          <Check size={12} className="text-primary-foreground" />
        )}
      </button>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
        aria-label="Remover gasto"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

// ── Variable Expenses ─────────────────────────────────────────────────────────

export function VariableExpensesSection() {
  const {
    filteredVariableExpenses,
    totalVariableExpenses,
    removeVariableExpense,
    updateVariableExpense,
  } = useFinance()
  const [editingExpense, setEditingExpense] = useState<VariableExpense | null>(
    null,
  )
  const [expanded, setExpanded] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all",
  )

  // Filter expenses by category and month
  const filteredExpenses =
    selectedCategory === "all"
      ? filteredVariableExpenses
      : filteredVariableExpenses.filter(
          (expense) => expense.category === selectedCategory,
        )

  // Show only 5 most recent by default (from filtered expenses)
  const displayed = expanded ? filteredExpenses : filteredExpenses.slice(0, 5)

  return (
    <div className="px-3 sm:px-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Gastos Variáveis
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filteredExpenses.length} lançamentos ·{" "}
            {formatCurrency(
              filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
            )}
          </p>
        </div>
        {filteredExpenses.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp size={14} /> Ver menos
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Ver todos
              </>
            )}
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="mb-3">
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value as Category | "all")
          }
          className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">Todas as categorias</option>
          {(Object.entries(CATEGORIES) as [Category, { label: string }][]).map(
            ([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="space-y-2">
        {displayed.map((expense) => (
          <VariableExpenseItem
            key={expense.id}
            expense={expense}
            onRemove={() => removeVariableExpense(expense.id)}
            onEdit={() => setEditingExpense(expense)}
          />
        ))}
        {filteredExpenses.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            {selectedCategory === "all"
              ? "Nenhum gasto variável registrado."
              : `Nenhum gasto encontrado na categoria ${CATEGORIES[selectedCategory].label.toLowerCase()}.`}
          </p>
        )}
      </div>

      {/* Edit modal */}
      {editingExpense && (
        <EditVariableExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={(updates) => {
            updateVariableExpense(editingExpense.id, updates)
            setEditingExpense(null)
          }}
        />
      )}
    </div>
  )
}

function VariableExpenseItem({
  expense,
  onRemove,
  onEdit,
}: {
  expense: VariableExpense
  onRemove: () => void
  onEdit: () => void
}) {
  const color = CATEGORIES[expense.category].color
  const date = new Date(expense.date + "T00:00:00")
  const formatted = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })

  return (
    <div className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 sm:p-3.5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {CATEGORY_ICONS[expense.category]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-foreground truncate">
            {expense.name}
          </p>
          {expense.installment && (
            <span className="text-[10px] font-medium text-primary bg-primary/15 px-1.5 py-0.5 rounded">
              {expense.installment.current}/{expense.installment.total}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <CalendarDays size={10} />
          {formatted} · {CATEGORIES[expense.category].label}
        </p>
      </div>
      <p className="text-sm font-semibold text-foreground shrink-0">
        {formatCurrency(expense.amount)}
      </p>
      <button
        onClick={onEdit}
        className="text-muted-foreground hover:text-primary transition-colors shrink-0"
        aria-label="Editar gasto"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
        aria-label="Remover gasto"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

// ── Edit Variable Expense Modal ───────────────────────────────────────────────

function EditVariableExpenseModal({
  expense,
  onClose,
  onSave,
}: {
  expense: VariableExpense
  onClose: () => void
  onSave: (updates: Partial<VariableExpense>) => void
}) {
  const [form, setForm] = useState({
    name: expense.name,
    amount: expense.amount.toString(),
    category: expense.category,
    date: expense.date,
    description: expense.description || "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(form.amount.replace(",", "."))
    if (!form.name || isNaN(amount) || amount <= 0) return
    onSave({
      name: form.name,
      amount,
      category: form.category,
      date: form.date,
      description: form.description || undefined,
    })
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-2xl p-4 sm:p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">
            Editar Gasto
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nome do gasto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            required
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Valor (R$)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              min="0"
              step="0.01"
              required
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as Category })
            }
            className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          >
            {(
              Object.entries(CATEGORIES) as [Category, { label: string }][]
            ).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors mt-1"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </>
  )
}

// ── FAB (Floating Action Button) ─────────────────────────────────────────────

export function FABAddExpense() {
  const { addVariableExpense, addVariableExpenseWithInstallments } =
    useFinance()
  const [open, setOpen] = useState(false)
  const [isInstallment, setIsInstallment] = useState(false)
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "alimentacao" as Category,
    date: new Date().toISOString().split("T")[0],
    description: "",
    installments: "1",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(form.amount.replace(",", "."))
    if (!form.name || isNaN(amount) || amount <= 0) return

    const installments = parseInt(form.installments)
    if (isInstallment && installments > 1 && installments <= 12) {
      addVariableExpenseWithInstallments(
        {
          name: form.name,
          amount,
          category: form.category,
          date: form.date,
          description: form.description || undefined,
        },
        installments,
      )
    } else {
      addVariableExpense({
        name: form.name,
        amount,
        category: form.category,
        date: form.date,
        description: form.description || undefined,
      })
    }

    setForm({
      name: "",
      amount: "",
      category: "alimentacao",
      date: new Date().toISOString().split("T")[0],
      description: "",
      installments: "1",
    })
    setIsInstallment(false)
    setOpen(false)
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sheet / Modal */}
      {open && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-2xl p-4 sm:p-6 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-foreground">
              Registrar Gasto
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Nome do gasto"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              required
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Valor total (R$)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                min="0"
                step="0.01"
                required
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as Category })
              }
              className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            >
              {(
                Object.entries(CATEGORIES) as [Category, { label: string }][]
              ).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>

            {/* Installment toggle */}
            <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Parcelar</span>
              </div>
              <button
                type="button"
                onClick={() => setIsInstallment(!isInstallment)}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors duration-200",
                  isInstallment ? "bg-primary" : "bg-muted",
                )}
                role="switch"
                aria-checked={isInstallment}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
                    isInstallment && "translate-x-5",
                  )}
                />
              </button>
            </div>

            {isInstallment && (
              <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-primary/20 rounded-xl">
                <span className="text-sm text-muted-foreground">Parcelas:</span>
                <select
                  value={form.installments}
                  onChange={(e) =>
                    setForm({ ...form, installments: e.target.value })
                  }
                  className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}x{" "}
                      {form.amount &&
                        `de ${formatCurrency(parseFloat(form.amount.replace(",", ".")) / n)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <input
              type="text"
              placeholder="Descrição (opcional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors mt-1"
            >
              {isInstallment && parseInt(form.installments) > 1
                ? `Registrar em ${form.installments}x`
                : "Registrar Gasto"}
            </button>
          </form>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[4.5rem] right-4 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform md:bottom-8 md:right-8"
        aria-label="Adicionar gasto rápido"
      >
        <Plus size={24} />
      </button>
    </>
  )
}
