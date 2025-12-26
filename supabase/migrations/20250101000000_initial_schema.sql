-- Enable Row Level Security
alter table if exists public.render_jobs enable row level security;
alter table if exists public.scheduled_tasks enable row level security;
alter table if exists public.analytics_events enable row level security;
alter table if exists public.insights enable row level security;

-- Render Jobs Table
create table if not exists public.render_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb
);

-- RLS Policies for render_jobs
create policy "Users can view their own render jobs"
  on public.render_jobs for select
  using (auth.uid() = user_id);

create policy "Users can create their own render jobs"
  on public.render_jobs for insert
  with check (auth.uid() = user_id);

-- Scheduled Tasks Table
create table if not exists public.scheduled_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  task_type text not null,
  scheduled_at timestamp with time zone not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb
);

-- RLS Policies for scheduled_tasks
create policy "Users can view their own scheduled tasks"
  on public.scheduled_tasks for select
  using (auth.uid() = user_id);

create policy "Users can create their own scheduled tasks"
  on public.scheduled_tasks for insert
  with check (auth.uid() = user_id);

-- Analytics Events Table
create table if not exists public.analytics_events (
  id uuid default gen_random_uuid() primary key,
  event_type text not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{}'::jsonb
);

-- RLS Policies for analytics_events
create policy "Users can view their own analytics events"
  on public.analytics_events for select
  using (auth.uid() = user_id);

create policy "Users can create analytics events"
  on public.analytics_events for insert
  with check (true);

-- Insights Table
create table if not exists public.insights (
  id uuid default gen_random_uuid() primary key,
  type text not null,
  data jsonb not null,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for insights
create policy "Authenticated users can view insights"
  on public.insights for select
  using (auth.role() = 'authenticated');

-- Create indexes for performance
create index if not exists render_jobs_user_id_idx on public.render_jobs(user_id);
create index if not exists render_jobs_status_idx on public.render_jobs(status);
create index if not exists scheduled_tasks_user_id_idx on public.scheduled_tasks(user_id);
create index if not exists scheduled_tasks_scheduled_at_idx on public.scheduled_tasks(scheduled_at);
create index if not exists analytics_events_user_id_idx on public.analytics_events(user_id);
create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at);
