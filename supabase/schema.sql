create extension if not exists pgcrypto;

create table public.students (
  id uuid primary key default gen_random_uuid(),
  student_number text unique not null,
  full_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.rfid_cards (
  uid text primary key check (uid ~ '^[0-9A-F]{8,20}$'),
  student_id uuid not null references public.students(id) on delete restrict,
  active boolean not null default true,
  assigned_at timestamptz not null default now()
);

create table public.devices (
  id text primary key,
  label text not null,
  active boolean not null default true,
  last_seen_at timestamptz
);

create table public.attendance_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete restrict,
  card_uid text not null references public.rfid_cards(uid) on delete restrict,
  device_id text not null references public.devices(id) on delete restrict,
  tapped_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index attendance_events_tapped_at_idx on public.attendance_events (tapped_at desc);
create index attendance_events_card_time_idx on public.attendance_events (card_uid, tapped_at desc);

alter table public.students enable row level security;
alter table public.rfid_cards enable row level security;
alter table public.devices enable row level security;
alter table public.attendance_events enable row level security;
-- Access is intentionally only through the server using the service-role key.
