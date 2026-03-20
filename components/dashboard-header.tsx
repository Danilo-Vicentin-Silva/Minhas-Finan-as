"use client"

import { useFinance } from "@/lib/finance-context"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function DashboardHeader() {
  const {
    balance,
    totalIncome,
    totalExpenses,
    selectedMonth,
    availableMonths,
    goToPreviousMonth,
    goToNextMonth,
  } = useFinance()
  const [hideValues, setHideValues] = useState(false)

  const balancePositive = balance >= 0

  const monthIndex = availableMonths.findIndex(
    (m) =>
      m.getFullYear() === selectedMonth.getFullYear() &&
      m.getMonth() === selectedMonth.getMonth(),
  )
  const hasPrevious = monthIndex > 0
  const hasNext = monthIndex >= 0 && monthIndex < availableMonths.length - 1

  return (
    <div className="px-3 sm:px-4 pt-6 pb-4 space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={goToPreviousMonth}
              disabled={!hasPrevious}
              className="p-1 rounded-md border border-border text-muted-foreground disabled:opacity-40"
              aria-label="Mês anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="text-sm text-muted-foreground">
              {selectedMonth.toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <button
              onClick={goToNextMonth}
              disabled={!hasNext}
              className="p-1 rounded-md border border-border text-muted-foreground disabled:opacity-40"
              aria-label="Próximo mês"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <h1 className="text-lg font-semibold text-foreground">Visão Geral</h1>
        </div>
        <button
          onClick={() => setHideValues(!hideValues)}
          className="p-2 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label={hideValues ? "Mostrar valores" : "Ocultar valores"}
        >
          {hideValues ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Balance Card */}
      <div className="rounded-2xl bg-card border border-border p-5 space-y-1">
        <p className="text-sm text-muted-foreground">Saldo Disponível</p>
        <p
          className={cn(
            "text-4xl font-bold tracking-tight",
            balancePositive ? "text-primary" : "text-destructive",
          )}
        >
          {hideValues ? "R$ ••••••" : formatCurrency(balance)}
        </p>
        <p className="text-xs text-muted-foreground pt-1">
          {balancePositive
            ? "Você está no positivo este mês"
            : "Atenção: despesas acima da receita"}
        </p>
      </div>

      {/* Income / Expense Mini Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Receitas</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {hideValues ? "••••" : formatCurrency(totalIncome)}
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-destructive/15 flex items-center justify-center shrink-0">
            <TrendingDown size={16} className="text-destructive" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Despesas</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {hideValues ? "••••" : formatCurrency(totalExpenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Spending bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Comprometido</span>
          <span>
            {totalIncome > 0
              ? Math.min(100, Math.round((totalExpenses / totalIncome) * 100))
              : 0}
            %
          </span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              totalExpenses / totalIncome > 0.8
                ? "bg-destructive"
                : totalExpenses / totalIncome > 0.6
                  ? "bg-amber-500"
                  : "bg-primary",
            )}
            style={{
              width: `${Math.min(100, (totalExpenses / totalIncome) * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function IncomeSection() {
  const { profile, setSalary, setInvestmentIncome } = useFinance()
  const salary = profile?.salary || 0
  const investmentIncome = profile?.investment_income || 0
  const [editingSalary, setEditingSalary] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState(false)
  const [salaryInput, setSalaryInput] = useState(salary.toString())
  const [investmentInput, setInvestmentInput] = useState(
    investmentIncome.toString(),
  )

  function handleSalarySave() {
    const parsed = parseFloat(salaryInput.replace(",", "."))
    if (!isNaN(parsed) && parsed >= 0) setSalary(parsed)
    setEditingSalary(false)
  }

  function handleInvestmentSave() {
    const parsed = parseFloat(investmentInput.replace(",", "."))
    if (!isNaN(parsed) && parsed >= 0) setInvestmentIncome(parsed)
    setEditingInvestment(false)
  }

  return (
    <div className="px-3 sm:px-4 pb-4">
      <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        Entradas de Renda
      </h2>
      <div className="space-y-2">
        {/* Salary */}
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Wallet size={15} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Salário Mensal</p>
                {editingSalary ? (
                  <input
                    type="number"
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(e.target.value)}
                    onBlur={handleSalarySave}
                    onKeyDown={(e) => e.key === "Enter" && handleSalarySave()}
                    className="w-full bg-transparent text-sm font-semibold text-foreground outline-none border-b border-primary"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(salary)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setEditingSalary(true)
                setSalaryInput(salary.toString())
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              Editar
            </button>
          </div>
        </div>

        {/* Investment income */}
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-chart-2/15 flex items-center justify-center shrink-0">
                <TrendingUp size={15} className="text-chart-2" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Rendimento de Investimentos
                </p>
                {editingInvestment ? (
                  <input
                    type="number"
                    value={investmentInput}
                    onChange={(e) => setInvestmentInput(e.target.value)}
                    onBlur={handleInvestmentSave}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleInvestmentSave()
                    }
                    className="w-full bg-transparent text-sm font-semibold text-foreground outline-none border-b border-primary"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(investmentIncome)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setEditingInvestment(true)
                setInvestmentInput(investmentIncome.toString())
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
