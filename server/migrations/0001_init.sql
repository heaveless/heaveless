create extension if not exists pgcrypto;

create table supporters (
  id uuid primary key default gen_random_uuid(),
  tiktok_open_id text unique,
  name text not null,
  avatar text not null default '',
  created_at timestamptz not null default now()
);

create table sessions (
  id text primary key,
  supporter_id uuid not null references supporters (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index sessions_expires_at_idx on sessions (expires_at);
