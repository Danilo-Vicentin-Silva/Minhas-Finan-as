-- Create profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Usuário',
  email text,
  salary numeric(12,2) not null default 0,
  investment_income numeric(12,2) not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create fixed_expenses table
create table if not exists public.fixed_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(12,2) not null,
  category text not null,
  paid boolean not null default false,
  due_day integer not null check (due_day >= 1 and due_day <= 31),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create variable_expenses table
create table if not exists public.variable_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(12,2) not null,
  category text not null,
  date date not null,
  description text,
  installment_total integer,
  installment_current integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.fixed_expenses enable row level security;
alter table public.variable_expenses enable row level security;

-- RLS Policies for profiles
create policy "profiles_select_own" on public.profiles 
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles 
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles 
  for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles 
  for delete using (auth.uid() = id);

-- RLS Policies for fixed_expenses
create policy "fixed_expenses_select_own" on public.fixed_expenses 
  for select using (auth.uid() = user_id);
create policy "fixed_expenses_insert_own" on public.fixed_expenses 
  for insert with check (auth.uid() = user_id);
create policy "fixed_expenses_update_own" on public.fixed_expenses 
  for update using (auth.uid() = user_id);
create policy "fixed_expenses_delete_own" on public.fixed_expenses 
  for delete using (auth.uid() = user_id);

-- RLS Policies for variable_expenses
create policy "variable_expenses_select_own" on public.variable_expenses 
  for select using (auth.uid() = user_id);
create policy "variable_expenses_insert_own" on public.variable_expenses 
  for insert with check (auth.uid() = user_id);
create policy "variable_expenses_update_own" on public.variable_expenses 
  for update using (auth.uid() = user_id);
create policy "variable_expenses_delete_own" on public.variable_expenses 
  for delete using (auth.uid() = user_id);

-- Trigger function to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, salary, investment_income)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'Usuário'),
    new.email,
    8500,
    420
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create indexes for better performance
create index if not exists idx_fixed_expenses_user_id on public.fixed_expenses(user_id);
create index if not exists idx_variable_expenses_user_id on public.variable_expenses(user_id);
create index if not exists idx_variable_expenses_date on public.variable_expenses(date);
