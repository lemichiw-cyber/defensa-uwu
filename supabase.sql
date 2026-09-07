-- ============================================================
-- SUPABASE SCHEMA — MiEvento v2.0 (con encriptación AES-256-GCM)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================
-- La encriptación se maneja desde el backend (Node.js crypto).
-- Supabase solo ve datos cifrados (bytea). La clave nunca toca
-- la base de datos.
-- ============================================================

-- ============================================================
-- TABLA: users
-- ============================================================
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  name_enc      bytea   not null,                    -- AES-256-GCM cifrado
  email_hash    text    not null unique,              -- sha256 para login/búsqueda
  email_enc     bytea   not null,                     -- AES-256-GCM cifrado
  password_hash text    not null,                     -- scrypt (ya hasheado)
  role          text    not null default 'usuario'
                  check (role in ('usuario', 'admin')),
  created_at    timestamptz not null default now()
);

create index if not exists idx_users_email_hash on public.users(email_hash);

-- ============================================================
-- TABLA: events
-- ============================================================
create table if not exists public.events (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid    not null references public.users(id) on delete cascade,
  title_enc       bytea   not null,                   -- cifrado
  description_enc bytea,                              -- cifrado
  date            date    not null,                   -- no cifrado (filtros/índices)
  time            text    not null,                   -- no cifrado
  location_enc    bytea,                              -- cifrado
  image_url       text    not null default '',        -- no cifrado
  status          text    not null default 'proximo'
                    check (status in ('proximo', 'finalizado', 'cancelado')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_events_user   on public.events(user_id);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_date   on public.events(date);

-- ============================================================
-- TABLA: guests
-- ============================================================
create table if not exists public.guests (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid    not null references public.events(id) on delete cascade,
  name_enc      bytea   not null,                     -- cifrado
  email_enc     bytea   not null,                     -- cifrado
  rsvp          text    not null default 'pendiente'
                  check (rsvp in ('pendiente', 'confirmado', 'rechazado')),
  created_at    timestamptz not null default now(),
  unique (event_id, email_enc)
);

create index if not exists idx_guests_event on public.guests(event_id);

-- ============================================================
-- TABLA: tasks
-- ============================================================
create table if not exists public.tasks (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid    not null references public.events(id) on delete cascade,
  title_enc     bytea   not null,                     -- cifrado
  done          boolean not null default false,
  due_date      date,
  created_at    timestamptz not null default now()
);

create index if not exists idx_tasks_event on public.tasks(event_id);

-- ============================================================
-- TABLA: reminders
-- ============================================================
create table if not exists public.reminders (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid    not null references public.events(id) on delete cascade,
  message_enc   bytea   not null,                     -- cifrado
  remind_at     timestamptz not null,
  sent          boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists idx_reminders_event on public.reminders(event_id);

-- ============================================================
-- FUNCIÓN: updated_at automático
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
  before update on public.events
  for each row execute function public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.users      enable row level security;
alter table public.events     enable row level security;
alter table public.guests     enable row level security;
alter table public.tasks      enable row level security;
alter table public.reminders enable row level security;

-- ============================================================
-- POLÍTICAS: users
-- ============================================================
create policy "Usuarios ven su propio perfil"
  on public.users for select
  using (auth.uid() = id);

create policy "Usuarios actualizan su propio perfil"
  on public.users for update
  using (auth.uid() = id);

create policy "Admins ven todos los usuarios"
  on public.users for select
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "Admins actualizan cualquier usuario"
  on public.users for update
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- POLÍTICAS: events
-- ============================================================
create policy "Usuarios ven sus propios eventos"
  on public.events for select
  using (user_id = auth.uid());

create policy "Usuarios crean sus eventos"
  on public.events for insert
  with check (user_id = auth.uid());

create policy "Usuarios actualizan sus eventos"
  on public.events for update
  using (user_id = auth.uid());

create policy "Usuarios eliminan sus eventos"
  on public.events for delete
  using (user_id = auth.uid());

create policy "Admins ven todos los eventos"
  on public.events for select
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "Admins eliminan cualquier evento"
  on public.events for delete
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- POLÍTICAS: guests
-- ============================================================
create policy "Usuarios ven invitados de sus eventos"
  on public.guests for select
  using (exists (
    select 1 from public.events where id = events.id and user_id = auth.uid()
  ));

create policy "Usuarios gestionan invitados de sus eventos"
  on public.guests for all
  using (exists (
    select 1 from public.events where id = events.id and user_id = auth.uid()
  ));

create policy "Admins gestionan todos los invitados"
  on public.guests for all
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- POLÍTICAS: tasks
-- ============================================================
create policy "Usuarios ven tareas de sus eventos"
  on public.tasks for select
  using (exists (
    select 1 from public.events where id = events.id and user_id = auth.uid()
  ));

create policy "Usuarios gestionan tareas de sus eventos"
  on public.tasks for all
  using (exists (
    select 1 from public.events where id = events.id and user_id = auth.uid()
  ));

create policy "Admins gestionan todas las tareas"
  on public.tasks for all
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- POLÍTICAS: reminders
-- ============================================================
create policy "Usuarios ven recordatorios de sus eventos"
  on public.reminders for select
  using (exists (
    select 1 from public.events where id = events.id and user_id = auth.uid()
  ));

create policy "Usuarios gestionan recordatorios de sus eventos"
  on public.reminders for all
  using (exists (
    select 1 from public.events where id = events.id and user_id = auth.uid()
  ));

create policy "Admins gestionan todos los recordatorios"
  on public.reminders for all
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- ============================================================
-- NOTA IMPORTANTE
-- ============================================================
-- Los INSERT/UPDATE/DELETE se hacen desde el backend (Node.js)
-- que cifra los datos con AES-256-GCM antes de enviarlos.
-- Los SELECT devuelven bytea que el backend descifra.
-- El email_hash es SHA-256 para permitir login sin descifrar.
