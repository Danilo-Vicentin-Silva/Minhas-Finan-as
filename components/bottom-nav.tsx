"use client"

import { LayoutDashboard, Receipt, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export type TabId = "inicio" | "gastos" | "graficos" | "configuracoes"

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "inicio", label: "Início", icon: <LayoutDashboard size={20} /> },
  { id: "gastos", label: "Gastos", icon: <Receipt size={20} /> },
  { id: "graficos", label: "Gráficos", icon: <BarChart3 size={20} /> },
  { id: "configuracoes", label: "Config.", icon: <Settings size={20} /> },
]

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 bg-card border-t border-border max-w-lg mx-auto"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors",
              active === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={active === tab.id ? "page" : undefined}
          >
            <span
              className={cn(
                "transition-transform",
                active === tab.id && "scale-110"
              )}
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
      {/* Safe area spacer for iOS */}
      <div className="h-safe-bottom" />
    </nav>
  )
}
