"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Moon,
  Sun,
  Trash2,
  Info,
  Bell,
  Shield,
  ChevronRight,
  Pencil,
  Check,
  X,
  LogOut,
  AlertTriangle,
} from "lucide-react"
import { useFinance } from "@/lib/finance-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

interface SettingsSectionProps {
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function SettingsSection({
  darkMode,
  onToggleDarkMode,
}: SettingsSectionProps) {
  const router = useRouter()
  const {
    totalIncome,
    totalExpenses,
    balance,
    fixedExpenses,
    variableExpenses,
    profile,
    setProfileName,
    setTheme,
    setSalary,
    setInvestmentIncome,
    signOut,
    user,
    addFixedExpense,
    addVariableExpense,
    removeFixedExpense,
    removeVariableExpense,
  } = useFinance()
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("notifications_enabled") !== "false"
    }
    return true
  })
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(profile?.name || "")
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)

  const handleSaveName = () => {
    if (tempName.trim()) {
      setProfileName(tempName.trim())
      setEditingName(false)
    }
  }

  const handleCancelName = () => {
    setTempName(profile?.name || "")
    setEditingName(false)
  }

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled
    setNotificationsEnabled(newValue)
    localStorage.setItem("notifications_enabled", newValue.toString())
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const handleClearAllData = async () => {
    // Clear all fixed expenses
    for (const expense of fixedExpenses) {
      await removeFixedExpense(expense.id)
    }

    // Clear all variable expenses
    for (const expense of variableExpenses) {
      await removeVariableExpense(expense.id)
    }

    // Reset profile to defaults
    await setProfileName("Usuário")
    await setTheme("dark")
    await setSalary(0)
    await setInvestmentIncome(0)
  }

  if (!profile) return null

  const avatarUrl = user?.user_metadata?.avatar_url
  const userInitial = profile.name.charAt(0).toUpperCase()

  const items = [
    {
      icon: <Bell size={16} />,
      label: "Notificações",
      value: notificationsEnabled ? "Ativadas" : "Desativadas",
      action: () => {}, // Will be handled by switch
      hasSwitch: true,
    },
    {
      icon: <Shield size={16} />,
      label: "Privacidade",
      value: "Gerenciar",
      action: () => setShowPrivacyModal(true),
    },
    {
      icon: <Info size={16} />,
      label: "Sobre o App",
      value: "v1.0.0",
      action: () => setShowAboutModal(true),
    },
  ]

  return (
    <>
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 pt-6 pb-4 space-y-6">
        {/* Profile section with inline edit */}
        <div className="flex items-start gap-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={avatarUrl} alt={profile.name} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-2">
            {/* Name field */}
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 bg-secondary border border-border rounded-lg px-2 py-1 text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName()
                    if (e.key === "Escape") handleCancelName()
                  }}
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 text-primary hover:bg-primary/10 rounded"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancelName}
                  className="p-1 text-muted-foreground hover:bg-secondary rounded"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <p className="font-semibold text-foreground truncate">
                  {profile.name}
                </p>
                <button
                  onClick={() => {
                    setTempName(profile.name)
                    setEditingName(true)
                  }}
                  className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity"
                  aria-label="Editar nome"
                >
                  <Pencil size={12} />
                </button>
              </div>
            )}

            {/* Email field (read-only from Supabase) */}
            <p className="text-sm text-muted-foreground truncate">
              {profile.email}
            </p>
          </div>
        </div>

        {/* Monthly summary */}
        <div className="rounded-2xl bg-card border border-border p-3 sm:p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">Resumo do Mês</p>
          <div className="space-y-2">
            {[
              {
                label: "Receita total",
                value: formatCurrency(totalIncome),
                color: "text-primary",
              },
              {
                label: "Despesas",
                value: formatCurrency(totalExpenses),
                color: "text-destructive",
              },
              {
                label: "Saldo líquido",
                value: formatCurrency(balance),
                color: balance >= 0 ? "text-primary" : "text-destructive",
              },
              {
                label: "Gastos fixos cadastrados",
                value: `${fixedExpenses.length} itens`,
                color: "text-foreground",
              },
              {
                label: "Lançamentos variáveis",
                value: `${variableExpenses.length} itens`,
                color: "text-foreground",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-muted-foreground">
                  {row.label}
                </span>
                <span className={`text-sm font-medium ${row.color}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dark mode toggle */}
        <div className="rounded-2xl bg-card border border-border divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              </div>
              <span className="text-sm font-medium text-foreground">
                {darkMode ? "Modo Escuro" : "Modo Claro"}
              </span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                darkMode ? "bg-primary" : "bg-secondary border border-border"
              }`}
              role="switch"
              aria-checked={darkMode}
              aria-label="Alternar modo escuro"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  darkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                {item.hasSwitch ? (
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={handleToggleNotifications}
                    aria-label={`Alternar ${item.label.toLowerCase()}`}
                  />
                ) : (
                  <>
                    <span className="text-xs">{item.value}</span>
                    <button
                      onClick={item.action}
                      className="p-1 hover:bg-secondary rounded transition-colors"
                      aria-label={`Abrir ${item.label.toLowerCase()}`}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Logout button */}
        <button
          onClick={handleSignOut}
          className="w-full rounded-2xl bg-secondary border border-border p-4 flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
        >
          <LogOut size={16} />
          Sair da conta
        </button>

        {/* Danger zone */}
        <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4">
          <p className="text-sm font-semibold text-destructive mb-1">
            Zona de Perigo
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Estas ações não podem ser desfeitas.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 text-sm text-destructive font-medium hover:opacity-80 transition-opacity">
                <Trash2 size={14} />
                Limpar todos os dados
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Tem certeza?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá remover permanentemente todos os seus dados
                  financeiros, incluindo gastos fixos, variáveis e configurações
                  do perfil. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sim, limpar tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Privacy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacidade e Segurança
            </DialogTitle>
            <DialogDescription>
              Suas informações estão seguras conosco.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Dados Coletados</h4>
              <p className="text-sm text-muted-foreground">
                Coletamos apenas as informações necessárias para o funcionamento
                do app: nome, email, salário, rendas de investimento e dados de
                gastos.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Armazenamento</h4>
              <p className="text-sm text-muted-foreground">
                Todos os dados são armazenados de forma criptografada no
                Supabase, com políticas de segurança rigorosas (Row Level
                Security).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Compartilhamento</h4>
              <p className="text-sm text-muted-foreground">
                Seus dados financeiros nunca são compartilhados com terceiros.
                Apenas você tem acesso aos seus dados.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* About Modal */}
      <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Sobre o FinanceApp
            </DialogTitle>
            <DialogDescription>
              Controle suas finanças de forma simples e segura.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Versão</h4>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Tecnologias</h4>
              <p className="text-sm text-muted-foreground">
                Next.js, React, Supabase, Tailwind CSS, Radix UI
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Funcionalidades</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Controle de receitas e despesas</li>
                <li>• Gastos fixos e variáveis</li>
                <li>• Visualizações com gráficos</li>
                <li>• Autenticação segura</li>
                <li>• Tema claro/escuro</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Contato</h4>
              <p className="text-sm text-muted-foreground">
                Para suporte ou sugestões, entre em contato conosco.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
