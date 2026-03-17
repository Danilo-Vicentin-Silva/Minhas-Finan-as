"use client"

import { useFinance } from "@/lib/finance-context"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatShort(value: number) {
  if (value >= 1000) return `R$${(value / 1000).toFixed(1)}k`
  return `R$${value.toFixed(0)}`
}

// ── Donut Chart ───────────────────────────────────────────────────────────────

export function DonutChart() {
  const { expensesByCategory, totalExpenses } = useFinance()

  if (expensesByCategory.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Nenhum dado disponível.
      </div>
    )
  }

  return (
    <div className="px-3 sm:px-4 pb-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Despesas por Categoria
      </h2>
      <div className="rounded-2xl bg-card border border-border p-3 sm:p-4">
        <div className="relative" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByCategory}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                strokeWidth={0}
              >
                {expensesByCategory.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Total"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-foreground">{formatShort(totalExpenses)}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
          {expensesByCategory.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground truncate">{item.label}</span>
              <span className="text-xs font-medium text-foreground ml-auto shrink-0">
                {Math.round((item.amount / totalExpenses) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Bar Chart: Income vs Expenses ─────────────────────────────────────────────

export function IncomeExpenseBarChart() {
  const { totalIncome, totalFixedExpenses, totalVariableExpenses, totalExpenses, balance, salary, investmentIncome } = useFinance()

  const barData = [
    {
      name: "Receitas",
      Salário: salary,
      Investimentos: investmentIncome,
    },
    {
      name: "Despesas",
      Fixas: totalFixedExpenses,
      Variáveis: totalVariableExpenses,
    },
  ]

  const comparisonData = [
    { name: "Receita", valor: totalIncome, fill: "#4ade80" },
    { name: "Despesas", valor: totalExpenses, fill: "#f87171" },
    { name: "Saldo", valor: Math.abs(balance), fill: balance >= 0 ? "#60a5fa" : "#fb923c" },
  ]

  return (
    <div className="px-3 sm:px-4 pb-4 space-y-4">
      {/* Comparison bar */}
      <div className="rounded-2xl bg-card border border-border p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Receita vs. Despesas</h3>
        <p className="text-xs text-muted-foreground mb-4">Comparativo do mês atual</p>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--foreground))", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatShort}
                tick={{ fontSize: 10, fill: "hsl(var(--foreground))", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value)]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stacked breakdown */}
      <div className="rounded-2xl bg-card border border-border p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Composição</h3>
        <p className="text-xs text-muted-foreground mb-4">Detalhamento por tipo</p>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barSize={44}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--foreground))", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatShort}
                tick={{ fontSize: 10, fill: "hsl(var(--foreground))", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value)]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", color: "hsl(var(--muted-foreground))" }}
              />
              {/* Receitas */}
              <Bar dataKey="Salário" stackId="receita" fill="#4ade80" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Investimentos" stackId="receita" fill="#34d399" radius={[6, 6, 0, 0]} />
              {/* Despesas */}
              <Bar dataKey="Fixas" stackId="despesa" fill="#f87171" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Variáveis" stackId="despesa" fill="#fb923c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Receita Total", value: totalIncome, color: "#4ade80" },
          { label: "Despesas", value: totalExpenses, color: "#f87171" },
          { label: balance >= 0 ? "Sobra" : "Déficit", value: Math.abs(balance), color: balance >= 0 ? "#60a5fa" : "#fb923c" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-card border border-border p-3 text-center">
            <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1.5" style={{ backgroundColor: item.color }} />
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-xs font-semibold text-foreground mt-0.5">{formatShort(item.value)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
