"use client"

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export type Category =
  | "alimentacao"
  | "moradia"
  | "transporte"
  | "saude"
  | "lazer"
  | "educacao"
  | "roupas"
  | "entretenimento"
  | "viagem"
  | "seguros"
  | "beleza"
  | "tecnologia"
  | "servicos"
  | "impostos"
  | "doacoes"
  | "investimentos"
  | "outros"

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
  alimentacao: { label: "Alimentação", color: "#4ade80" },
  moradia: { label: "Moradia", color: "#60a5fa" },
  transporte: { label: "Transporte", color: "#f59e0b" },
  saude: { label: "Saúde", color: "#f472b6" },
  lazer: { label: "Lazer", color: "#a78bfa" },
  educacao: { label: "Educação", color: "#34d399" },
  roupas: { label: "Roupas", color: "#fb923c" },
  entretenimento: { label: "Entretenimento", color: "#ec4899" },
  viagem: { label: "Viagem", color: "#8b5cf6" },
  seguros: { label: "Seguros", color: "#06b6d4" },
  beleza: { label: "Beleza", color: "#f97316" },
  tecnologia: { label: "Tecnologia", color: "#10b981" },
  servicos: { label: "Serviços", color: "#6366f1" },
  impostos: { label: "Impostos", color: "#ef4444" },
  doacoes: { label: "Doações", color: "#84cc16" },
  investimentos: { label: "Investimentos", color: "#fbbf24" },
  outros: { label: "Outros", color: "#94a3b8" },
}

export interface Installment {
  total: number
  current: number
}

export interface FixedExpense {
  id: string
  name: string
  amount: number
  category: Category
  paid: boolean
  dueDay: number
}

export interface VariableExpense {
  id: string
  name: string
  amount: number
  category: Category
  date: string
  description?: string
  installment?: Installment
}

export interface UserProfile {
  name: string
  email: string
  salary: number
  investment_income: number
  theme: "light" | "dark"
}

function getMonthKey(date: string | Date) {
  const d =
    typeof date === "string" ? new Date(`${date}T00:00:00`) : new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function addMonthsToDate(date: Date, months: number) {
  const baseDay = date.getDate()
  const targetYear = date.getFullYear()
  const targetMonth = date.getMonth() + months
  const adjustedDate = new Date(targetYear, targetMonth, 1)
  const daysInMonth = new Date(
    adjustedDate.getFullYear(),
    adjustedDate.getMonth() + 1,
    0,
  ).getDate()
  adjustedDate.setDate(Math.min(baseDay, daysInMonth))
  return adjustedDate
}

interface FinanceContextType {
  user: User | null
  profile: UserProfile | null
  fixedExpenses: FixedExpense[]
  variableExpenses: VariableExpense[]
  setSalary: (value: number) => void
  setInvestmentIncome: (value: number) => void
  addFixedExpense: (expense: Omit<FixedExpense, "id">) => void
  updateFixedExpense: (id: string, updates: Partial<FixedExpense>) => void
  removeFixedExpense: (id: string) => void
  toggleFixedExpensePaid: (id: string) => void
  addVariableExpense: (expense: Omit<VariableExpense, "id">) => void
  addVariableExpenseWithInstallments: (
    expense: Omit<VariableExpense, "id" | "installment">,
    installments: number,
  ) => void
  updateVariableExpense: (id: string, updates: Partial<VariableExpense>) => void
  removeVariableExpense: (id: string) => void
  setProfileName: (name: string) => void
  setTheme: (theme: "light" | "dark") => void
  signOut: () => Promise<void>
  totalIncome: number
  totalFixedExpenses: number
  totalVariableExpenses: number
  totalExpenses: number
  balance: number
  salary: number
  investmentIncome: number
  expensesByCategory: {
    category: Category
    label: string
    amount: number
    color: string
  }[]
  selectedMonth: Date
  setSelectedMonth: (date: Date) => void
  availableMonths: Date[]
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  filteredVariableExpenses: VariableExpense[]
  isHydrated: boolean
  isLoading: boolean
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([])
  const [variableExpenses, setVariableExpenses] = useState<VariableExpense[]>(
    [],
  )
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [isHydrated, setIsHydrated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  // Load user and data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Load profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileData) {
          setProfile({
            name: profileData.name || user.user_metadata?.name || "Usuário",
            email: user.email || "",
            salary: profileData.salary || 0,
            investment_income: profileData.investment_income || 0,
            theme: profileData.theme || "dark",
          })
        }

        // Load fixed expenses
        const { data: fixedData } = await supabase
          .from("fixed_expenses")
          .select("*")
          .eq("user_id", user.id)
          .order("due_day", { ascending: true })

        if (fixedData) {
          setFixedExpenses(
            fixedData.map((e) => ({
              id: e.id,
              name: e.name,
              amount: e.amount,
              category: e.category as Category,
              paid: e.paid,
              dueDay: e.due_day,
            })),
          )
        }

        // Load variable expenses
        const { data: variableData } = await supabase
          .from("variable_expenses")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false })

        if (variableData) {
          setVariableExpenses(
            variableData.map((e) => ({
              id: e.id,
              name: e.name,
              amount: e.amount,
              category: e.category as Category,
              date: e.date,
              description: e.description || undefined,
              installment: e.installment_total
                ? {
                    total: e.installment_total,
                    current: e.installment_current || 1,
                  }
                : undefined,
            })),
          )
        }
      }

      setIsHydrated(true)
      setIsLoading(false)
    }

    loadData()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setProfile(null)
        setFixedExpenses([])
        setVariableExpenses([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const setSalary = useCallback(
    async (value: number) => {
      if (!user) return
      setProfile((p) => (p ? { ...p, salary: value } : null))
      await supabase
        .from("profiles")
        .update({ salary: value })
        .eq("id", user.id)
    },
    [user, supabase],
  )

  const setInvestmentIncome = useCallback(
    async (value: number) => {
      if (!user) return
      setProfile((p) => (p ? { ...p, investment_income: value } : null))
      await supabase
        .from("profiles")
        .update({ investment_income: value })
        .eq("id", user.id)
    },
    [user, supabase],
  )

  const setProfileName = useCallback(
    async (name: string) => {
      if (!user) return
      setProfile((p) => (p ? { ...p, name } : null))
      await supabase.from("profiles").update({ name }).eq("id", user.id)
    },
    [user, supabase],
  )

  const setTheme = useCallback(
    async (theme: "light" | "dark") => {
      if (!user) return
      setProfile((p) => (p ? { ...p, theme } : null))
      await supabase.from("profiles").update({ theme }).eq("id", user.id)
    },
    [user, supabase],
  )

  const addFixedExpense = useCallback(
    async (expense: Omit<FixedExpense, "id">) => {
      if (!user) return
      const { data } = await supabase
        .from("fixed_expenses")
        .insert({
          user_id: user.id,
          name: expense.name,
          amount: expense.amount,
          category: expense.category,
          paid: expense.paid,
          due_day: expense.dueDay,
        })
        .select()
        .single()

      if (data) {
        setFixedExpenses((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.name,
            amount: data.amount,
            category: data.category as Category,
            paid: data.paid,
            dueDay: data.due_day,
          },
        ])
      }
    },
    [user, supabase],
  )

  const updateFixedExpense = useCallback(
    async (id: string, updates: Partial<FixedExpense>) => {
      if (!user) return
      setFixedExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      )

      const dbUpdates: Record<string, unknown> = {}
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.amount !== undefined) dbUpdates.amount = updates.amount
      if (updates.category !== undefined) dbUpdates.category = updates.category
      if (updates.paid !== undefined) dbUpdates.paid = updates.paid
      if (updates.dueDay !== undefined) dbUpdates.due_day = updates.dueDay

      await supabase
        .from("fixed_expenses")
        .update(dbUpdates)
        .eq("id", id)
        .eq("user_id", user.id)
    },
    [user, supabase],
  )

  const removeFixedExpense = useCallback(
    async (id: string) => {
      if (!user) return
      setFixedExpenses((prev) => prev.filter((e) => e.id !== id))
      await supabase
        .from("fixed_expenses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
    },
    [user, supabase],
  )

  const toggleFixedExpensePaid = useCallback(
    async (id: string) => {
      if (!user) return
      const expense = fixedExpenses.find((e) => e.id === id)
      if (!expense) return

      const newPaid = !expense.paid
      setFixedExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, paid: newPaid } : e)),
      )

      await supabase
        .from("fixed_expenses")
        .update({ paid: newPaid })
        .eq("id", id)
        .eq("user_id", user.id)
    },
    [user, fixedExpenses, supabase],
  )

  const addVariableExpense = useCallback(
    async (expense: Omit<VariableExpense, "id">) => {
      if (!user) return
      const { data } = await supabase
        .from("variable_expenses")
        .insert({
          user_id: user.id,
          name: expense.name,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          description: expense.description || null,
          installment_total: expense.installment?.total || null,
          installment_current: expense.installment?.current || null,
        })
        .select()
        .single()

      if (data) {
        setVariableExpenses((prev) => [
          {
            id: data.id,
            name: data.name,
            amount: data.amount,
            category: data.category as Category,
            date: data.date,
            description: data.description || undefined,
            installment: data.installment_total
              ? {
                  total: data.installment_total,
                  current: data.installment_current || 1,
                }
              : undefined,
          },
          ...prev,
        ])
      }
    },
    [user, supabase],
  )

  const addVariableExpenseWithInstallments = useCallback(
    async (
      expense: Omit<VariableExpense, "id" | "installment">,
      installments: number,
    ) => {
      if (!user) return
      const totalAmount = expense.amount
      const baseInstallmentAmount =
        Math.floor((totalAmount * 100) / installments) / 100
      const remainder = Number(
        (totalAmount - baseInstallmentAmount * installments).toFixed(2),
      )
      const baseDate = new Date(expense.date)

      const toInsert = []
      for (let i = 0; i < installments; i++) {
        const installmentDate = addMonthsToDate(baseDate, i)
        const amount =
          i === installments - 1
            ? Number((baseInstallmentAmount + remainder).toFixed(2))
            : baseInstallmentAmount

        toInsert.push({
          user_id: user.id,
          name: `${expense.name} (${i + 1}/${installments})`,
          amount,
          category: expense.category,
          date: installmentDate.toISOString().split("T")[0],
          description: expense.description || null,
          installment_total: installments,
          installment_current: i + 1,
        })
      }

      const { data } = await supabase
        .from("variable_expenses")
        .insert(toInsert)
        .select()

      if (data) {
        const newExpenses = data.map((e) => ({
          id: e.id,
          name: e.name,
          amount: e.amount,
          category: e.category as Category,
          date: e.date,
          description: e.description || undefined,
          installment: e.installment_total
            ? {
                total: e.installment_total,
                current: e.installment_current || 1,
              }
            : undefined,
        }))
        setVariableExpenses((prev) => [...newExpenses, ...prev])
      }
    },
    [user, supabase],
  )

  const updateVariableExpense = useCallback(
    async (id: string, updates: Partial<VariableExpense>) => {
      if (!user) return
      setVariableExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      )

      const dbUpdates: Record<string, unknown> = {}
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.amount !== undefined) dbUpdates.amount = updates.amount
      if (updates.category !== undefined) dbUpdates.category = updates.category
      if (updates.date !== undefined) dbUpdates.date = updates.date
      if (updates.description !== undefined)
        dbUpdates.description = updates.description

      await supabase
        .from("variable_expenses")
        .update(dbUpdates)
        .eq("id", id)
        .eq("user_id", user.id)
    },
    [user, supabase],
  )

  const removeVariableExpense = useCallback(
    async (id: string) => {
      if (!user) return
      setVariableExpenses((prev) => prev.filter((e) => e.id !== id))
      await supabase
        .from("variable_expenses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
    },
    [user, supabase],
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  const totalIncome = useMemo(
    () => (profile?.salary || 0) + (profile?.investment_income || 0),
    [profile],
  )

  const selectedMonthKey = getMonthKey(selectedMonth)

  const availableMonths = useMemo(() => {
    const set = new Set<string>()
    variableExpenses.forEach((e) => set.add(getMonthKey(e.date)))

    const sorted = Array.from(set).sort()

    return sorted.map((monthKey) => {
      const [year, month] = monthKey.split("-").map(Number)
      return new Date(year, month - 1, 1)
    })
  }, [variableExpenses, selectedMonthKey])

  useEffect(() => {
    if (availableMonths.length === 0) return

    const selectedIndex = availableMonths.findIndex(
      (m) =>
        m.getFullYear() === selectedMonth.getFullYear() &&
        m.getMonth() === selectedMonth.getMonth(),
    )

    if (selectedIndex === -1) {
      setSelectedMonth(availableMonths[availableMonths.length - 1])
    }
  }, [availableMonths, selectedMonth])

  const filteredVariableExpenses = useMemo(
    () =>
      variableExpenses.filter((e) => getMonthKey(e.date) === selectedMonthKey),
    [variableExpenses, selectedMonthKey],
  )

  const goToPreviousMonth = useCallback(() => {
    if (availableMonths.length === 0) return
    const currentIndex = availableMonths.findIndex(
      (m) => getMonthKey(m) === selectedMonthKey,
    )
    if (currentIndex > 0) {
      setSelectedMonth(availableMonths[currentIndex - 1])
    }
  }, [availableMonths, selectedMonthKey])

  const goToNextMonth = useCallback(() => {
    if (availableMonths.length === 0) return
    const currentIndex = availableMonths.findIndex(
      (m) => getMonthKey(m) === selectedMonthKey,
    )
    if (currentIndex >= 0 && currentIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentIndex + 1])
    }
  }, [availableMonths, selectedMonthKey])

  const totalFixedExpenses = useMemo(
    () => fixedExpenses.reduce((acc, e) => acc + e.amount, 0),
    [fixedExpenses],
  )

  const totalVariableExpenses = useMemo(
    () => filteredVariableExpenses.reduce((acc, e) => acc + e.amount, 0),
    [filteredVariableExpenses],
  )

  const totalExpenses = useMemo(
    () => totalFixedExpenses + totalVariableExpenses,
    [totalFixedExpenses, totalVariableExpenses],
  )

  const balance = useMemo(
    () => totalIncome - totalExpenses,
    [totalIncome, totalExpenses],
  )

  const expensesByCategory = useMemo(() => {
    const map = new Map<Category, number>()
    for (const e of fixedExpenses) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount)
    }
    for (const e of filteredVariableExpenses) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount)
    }

    return Array.from(map.entries())
      .map(([category, amount]) => ({
        category,
        label: CATEGORIES[category].label,
        amount,
        color: CATEGORIES[category].color,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [fixedExpenses, filteredVariableExpenses])

  return (
    <FinanceContext.Provider
      value={{
        user,
        profile,
        fixedExpenses,
        variableExpenses,
        setSalary,
        setInvestmentIncome,
        addFixedExpense,
        updateFixedExpense,
        removeFixedExpense,
        toggleFixedExpensePaid,
        addVariableExpense,
        addVariableExpenseWithInstallments,
        updateVariableExpense,
        removeVariableExpense,
        setProfileName,
        setTheme,
        signOut,
        selectedMonth,
        setSelectedMonth,
        availableMonths,
        goToPreviousMonth,
        goToNextMonth,
        filteredVariableExpenses,
        totalIncome,
        totalFixedExpenses,
        totalVariableExpenses,
        totalExpenses,
        balance,
        salary: profile?.salary || 0,
        investmentIncome: profile?.investment_income || 0,
        expensesByCategory,
        isHydrated,
        isLoading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider")
  return ctx
}
