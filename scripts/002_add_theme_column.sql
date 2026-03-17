-- Add theme column to profiles table
alter table public.profiles 
add column if not exists theme text default 'dark';

-- Add comment for documentation
comment on column public.profiles.theme is 'User preferred theme: dark or light';
