create table if not exists public.daily_words (
  word text primary key,
  game_date date not null,
  position smallint not null,
  created_at timestamptz not null default now(),
  constraint daily_words_position_check check (position between 0 and 3),
  constraint daily_words_game_date_position_key unique (game_date, position)
);

create index if not exists daily_words_game_date_idx
  on public.daily_words (game_date);

alter table public.daily_words enable row level security;

revoke all on table public.daily_words from anon, authenticated;
grant all on table public.daily_words to service_role;
