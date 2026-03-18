# Minhas Finanças

> Um painel simples e intuitivo para controlar suas finanças pessoais com **Next.js**, **Supabase** e **Tailwind CSS**.

---

## 📋 Sobre o Projeto

**Minhas Finanças** é uma aplicação web moderna para gestão financeira pessoal. Com ela, você pode:

- 📊 **Registrar receitas**: Salário e rendimentos de investimentos
- 💳 **Controlar gastos**: Fixos (como aluguel, contas) e variáveis (compras do dia a dia)
- 📈 **Visualizar gráficos**: Distribuição de despesas por categoria e comparação receita vs. gastos
- 🌙 **Alternar temas**: Claro ou escuro, salvo no seu perfil
- 🔐 **Autenticação segura**: Login e cadastro via Supabase

Desenvolvido com tecnologias modernas: Next.js (App Router), Supabase (banco de dados e autenticação), Tailwind CSS e componentes acessíveis com Radix UI.

---

## 🚀 Tecnologias Utilizadas

- **Next.js 16** (App Router)
- **React 19**
- **Supabase** (Autenticação + PostgreSQL + RLS)
- **Tailwind CSS v4**
- **Radix UI** (Componentes acessíveis)
- **Recharts** (Gráficos interativos)
- **Zod** (Validação de dados)

---

## 🛠️ Como Usar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Conta no [Supabase](https://supabase.com) (gratuito para começar)

### Instalação e Configuração

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/Danilo-Vicentin-Silva/Minhas-Finan-as.git
   cd "Minhas Finanças"
   ```

2. **Instale as dependências** (usando pnpm, recomendado):

   ```bash
   npm install -g pnpm  # Se não tiver pnpm
   pnpm install
   ```

3. **Configure o Supabase**:
   - Crie um projeto gratuito em [supabase.com](https://app.supabase.com)
   - No painel do Supabase, vá em **Settings > API** e copie:
     - `Project URL` → será usado como `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → será usado como `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Execute os scripts SQL em `scripts/` no **SQL Editor** do Supabase (na ordem: `001_create_tables.sql` e `002_add_theme_column.sql`)

4. **Variáveis de ambiente**:
   Crie um arquivo `.env.local` na raiz:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/
   ```

5. **Execute o projeto**:
   ```bash
   pnpm dev
   ```
   Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploy

Para publicar o site, recomendamos o **Vercel** (integração nativa com Next.js):

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Adicione as variáveis de ambiente no painel do Vercel (mesmas do `.env.local`)
3. Deploy automático!

Certifique-se de que as tabelas do Supabase estão criadas antes do primeiro acesso.

---

## 📊 Funcionalidades

- ✅ **Autenticação completa**: Login, cadastro e recuperação de senha
- ✅ **Perfil personalizado**: Nome, salário e investimentos
- ✅ **Gastos fixos**: Cadastro, edição e marcação de pagamentos
- ✅ **Gastos variáveis**: Com suporte a parcelas
- ✅ **Gráficos dinâmicos**: Pizza e barras para análise visual
- ✅ **Tema adaptável**: Claro/escuro salvo automaticamente

---

## 🤝 Contribuição

Sinta-se à vontade para abrir issues ou pull requests para melhorias!

---

## 📄 Licença

Este projeto é open-source e pode ser usado livremente.
