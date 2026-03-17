# Minhas Finanças

> Um painel simples e bonito para controlar finanças pessoais com **Next.js**, **Supabase**, e **Tailwind CSS**.

---

## 📌 Visão geral

Este projeto é uma aplicação web de controle financeiro pessoal (finanças) com o objetivo de ajudar o usuário a:

- Registrar receitas (salário + investimentos)
- Cadastrar e acompanhar **gastos fixos** e **gastos variáveis**
- Visualizar gráficos de despesas (pizza / barra)
- Alternar entre tema claro/escuro
- Autenticar-se usando **Supabase Auth**

A aplicação usa Next.js (App Router), Supabase (Auth + Postgres), e Tailwind CSS + Radix UI para os componentes.

---

## 🚀 Tecnologias usadas

- **Next.js 16 (App Router)**
- **React 19**
- **Supabase** (Auth + Postgres + RLS)
- **Tailwind CSS v4**
- **Radix UI** (componentes acessíveis)
- **Recharts** (gráficos)
- **Zod** (validação, quando necessário)

---

## 🧱 Estrutura do projeto

Principais pastas e arquivos:

- `app/` – rota principal (Next.js App Router)
  - `app/page.tsx` – dashboard principal
  - `app/auth/` – páginas de login / cadastro / sucesso
- `components/` – componentes reutilizáveis (UI, formulários, gráficos, navegação)
- `lib/` – lógica compartilhada (contexto financeiro, Supabase client, utilitários)
- `scripts/` – SQL para criação das tabelas e políticas no Supabase

---

## ⚙️ Configuração (ambiente)

### 1) Clonar o repositório

```bash
git clone <repo-url>
cd "Minhas Finanças"
```

### 2) Instalar dependências

Este projeto usa **pnpm** (recomendado). Se não tiver, instale:

```bash
npm install -g pnpm
```

Depois:

```bash
pnpm install
```

### 3) Configurar Supabase

1. Crie um projeto em https://app.supabase.com
2. No painel do Supabase, copie:
   - `API URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` (API Key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. (Opcional) Configure o redirect:
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` → `http://localhost:3000/`

### 4) Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=<sua_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua_supabase_anon_key>
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/
```

---

## 🧩 Banco de dados (Supabase)

O projeto espera a existência dessas tabelas e políticas (Row Level Security) no banco:

- `profiles`
- `fixed_expenses`
- `variable_expenses`

> O SQL de criação está em `scripts/001_create_tables.sql` e `scripts/002_add_theme_column.sql`.

**Como aplicar**:

1. Acesse o editor SQL do Supabase.
2. Cole o conteúdo dos arquivos `.sql` (na ordem) e execute.

---

## ▶️ Rodar em desenvolvimento

```bash
pnpm dev
```

Acesse: http://localhost:3000

---

## ✅ Scripts úteis

| Script       | O que faz                                     |
| ------------ | --------------------------------------------- |
| `pnpm dev`   | Inicia o servidor de desenvolvimento          |
| `pnpm build` | Gera build para produção                      |
| `pnpm start` | Inicia servidor em modo produção (após build) |
| `pnpm lint`  | Roda ESLint                                   |

---

## 🧪 Funcionalidades implementadas

- Autenticação (login / cadastro) via Supabase
- Criação e edição de perfil (nome, salário, renda de investimento)
- Gastos fixos com marcação de pago / não pago
- Gastos variáveis com parcelas (installments)
- Gráficos de despesas por categoria e comparação renda vs gastos
- Tema claro/escuro persistido no perfil do usuário

---

## 🛠️ Personalizações fáceis

- Para alterar categorias de despesas: veja `lib/finance-context.tsx` → `CATEGORIES`
- Para customizar estilos: `app/globals.css` + componentes em `components/ui/`

---

## 💡 Próximas ideias (melhorias)

- Adicionar filtros por período (mês/ano)
- Exportar relatórios em CSV/PDF
- Permitir várias contas/usuários com multi-tenant
- Notificações e lembretes de pagamento

---

## 📄 Licença

Projeto sem licença definida (use conforme precisar).
