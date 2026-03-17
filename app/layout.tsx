import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: 'FinanceApp - Gestão Financeira Pessoal',
  description: 'Gerencie suas finanças pessoais com facilidade. Controle gastos, receitas e investimentos em um só lugar.',
  generator: 'v0.app',
}

export const viewport = {
  themeColor: '#0f1117',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
