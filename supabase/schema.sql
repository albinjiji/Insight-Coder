-- =====================================================
-- InsightCoder Database Schema for Supabase
-- Run this in the Supabase Dashboard → SQL Editor
-- =====================================================

-- Chat sessions table
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  mode text not null default 'explain',
  model text not null default 'gemini',
  preview text default 'New Session',
  repo_url text default '',
  is_repo_connected boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Chat messages table
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  text text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- RLS Policies: users can only access their own data
-- Both USING (for reads/updates/deletes) and WITH CHECK (for inserts) are required
create policy "Users can manage own sessions"
  on public.chat_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own messages"
  on public.chat_messages for all
  using (session_id in (
    select id from public.chat_sessions where user_id = auth.uid()
  ))
  with check (session_id in (
    select id from public.chat_sessions where user_id = auth.uid()
  ));

-- Index for fast lookups
create index idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index idx_chat_messages_session_id on public.chat_messages(session_id);
