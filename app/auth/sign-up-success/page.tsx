import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="Minhas Finanças"
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        {/* Success message */}
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Verifique seu email
          </h1>
          <p className="text-sm text-muted-foreground">
            Enviamos um link de confirmação para o seu email. Clique no link
            para ativar sua conta e começar a usar o FinanceApp.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Ir para Login
            <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-muted-foreground">
            Não recebeu o email? Verifique sua caixa de spam.
          </p>
        </div>
      </div>
    </div>
  )
}
