"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FinanceProvider, useFinance } from "@/lib/finance-context"
import { DashboardHeader, IncomeSection } from "@/components/dashboard-header"
import {
  FixedExpensesSection,
  VariableExpensesSection,
  FABAddExpense,
} from "@/components/expenses-section"
import { DonutChart, IncomeExpenseBarChart } from "@/components/charts-section"
import { BottomNav, type TabId } from "@/components/bottom-nav"
import { SettingsSection } from "@/components/settings-section"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

function FinanceApp() {
  const router = useRouter()
  const { isHydrated, isLoading, user, profile, setTheme, selectedMonth } =
    useFinance()
  const [activeTab, setActiveTab] = useState<TabId>("inicio")

  // Get darkMode from profile (Supabase) with fallback
  const darkMode = profile?.theme !== "light"

  // Apply theme class to document when profile loads
  useEffect(() => {
    if (profile) {
      document.documentElement.classList.toggle(
        "dark",
        profile.theme !== "light",
      )
    }
  }, [profile?.theme])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isHydrated && !isLoading && !user) {
      router.push("/auth/login")
    }
  }, [isHydrated, isLoading, user, router])

  function handleToggleDarkMode() {
    const newTheme = darkMode ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  // Show loading state while loading
  if (!isHydrated || isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  return (
    <div className={cn("min-h-screen bg-background", darkMode ? "dark" : "")}>
      {/* Constrained container — feels like a phone shell on desktop */}
      <div className="relative max-w-lg mx-auto min-h-screen bg-background flex flex-col shadow-2xl">
        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
          {/* ── Início ──────────────────────────────────── */}
          {activeTab === "inicio" && (
            <div>
              <DashboardHeader />
              <IncomeSection />
            </div>
          )}

          {/* ── Gastos ──────────────────────────────────── */}
          {activeTab === "gastos" && (
            <div className="pt-6">
              <div className="px-3 sm:px-4 mb-4">
                <h1 className="text-lg font-semibold text-foreground">
                  Meus Gastos
                </h1>
                <p className="text-sm text-muted-foreground">
                  {selectedMonth.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <FixedExpensesSection />
              <div className="border-t border-border my-2" />
              <VariableExpensesSection />
            </div>
          )}

          {/* ── Gráficos ────────────────────────────────── */}
          {activeTab === "graficos" && (
            <div className="pt-6">
              <div className="px-3 sm:px-4 mb-4">
                <h1 className="text-lg font-semibold text-foreground">
                  Visualizações
                </h1>
                <p className="text-sm text-muted-foreground">
                  {selectedMonth.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <DonutChart />
              <div className="border-t border-border my-2" />
              <IncomeExpenseBarChart />
            </div>
          )}

          {/* ── Configurações ───────────────────────────── */}
          {activeTab === "configuracoes" && (
            <SettingsSection
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
            />
          )}
        </main>

        {/* Bottom navigation */}
        <BottomNav active={activeTab} onChange={setActiveTab} />

        {/* FAB — only visible on gastos and inicio tabs */}
        {(activeTab === "inicio" || activeTab === "gastos") && (
          <FABAddExpense />
        )}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <FinanceProvider>
      <FinanceApp />
    </FinanceProvider>
  )
}
