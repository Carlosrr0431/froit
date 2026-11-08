-- =====================================================================
-- FroIT · módulo de tareas (/crm/tareas)
-- Se ejecuta en el SQL Editor del proyecto Supabase compartido con Multicarnes
-- (eehfvqzslrwytzdfbqrw). Todas las tablas llevan prefijo froit_ para no
-- mezclarse con las de Multicarnes. Es idempotente: se puede correr más de una vez.
-- =====================================================================

create extension if not exists pgcrypto;

-- Proyectos / clientes ------------------------------------------------
create table if not exists public.froit_projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  client      text not null default '',
  color       text not null default '#5b5bf0',
  deadline    date,
  created_at  timestamptz not null default now()
);

-- Tareas del checklist ------------------------------------------------
create table if not exists public.froit_tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.froit_projects(id) on delete cascade,
  title       text not null,
  due         date,
  daily       boolean not null default false,  -- se repite todos los días
  done        boolean not null default false,
  done_on     date,                            -- última fecha en que se tildó una tarea diaria
  created_at  timestamptz not null default now()
);
create index if not exists froit_tasks_project_idx on public.froit_tasks (project_id);

-- Configuración de avisos por WhatsApp (una sola fila) ------------------
create table if not exists public.froit_settings (
  id          int primary key default 1 check (id = 1),
  phone       text    not null default '3878630173',
  reminders   boolean not null default true,
  times       text[]  not null default array['09:00','18:00'],
  sent        jsonb   not null default '{}'::jsonb,  -- avisos ya enviados (evita duplicados)
  log         jsonb   not null default '[]'::jsonb,  -- últimos envíos
  updated_at  timestamptz not null default now()
);

-- Datos iniciales -------------------------------------------------------
insert into public.froit_settings (id) values (1) on conflict (id) do nothing;

insert into public.froit_projects (name, client, color)
select v.name, v.name, v.color
from (values
  ('Multicarnes',   '#ef4444'),
  ('Apass Seguros', '#3b82f6'),
  ('Marxel',        '#10b981')
) as v(name, color)
where not exists (select 1 from public.froit_projects);

-- Seguridad (RLS) -------------------------------------------------------
-- Solo accede el servidor del CRM con la service_role key (que ignora RLS).
-- Sin políticas para anon/authenticated = acceso denegado desde el navegador.
alter table public.froit_projects enable row level security;
alter table public.froit_tasks    enable row level security;
alter table public.froit_settings enable row level security;

revoke all on public.froit_projects from anon, authenticated;
revoke all on public.froit_tasks    from anon, authenticated;
revoke all on public.froit_settings from anon, authenticated;
