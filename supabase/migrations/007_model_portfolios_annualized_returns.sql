alter table public.model_portfolios
add column if not exists annualized_3y numeric(6,2) not null default 0,
add column if not exists annualized_5y numeric(6,2) not null default 0;
