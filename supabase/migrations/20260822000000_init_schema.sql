-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create categories table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name_vi text not null,
  name_en text not null,
  slug text not null unique,
  image_url text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name_vi text not null,
  name_en text not null,
  slug text not null unique,
  description_vi text,
  description_en text,
  price numeric(12, 2) not null check (price >= 0),
  image_url text,
  ingredients_vi text,
  ingredients_en text,
  nutrition jsonb,
  allergy_info_vi text,
  allergy_info_en text,
  is_new boolean default false,
  is_best_seller boolean default false,
  is_available boolean default true,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create product_options table
create table public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  name_vi text not null,
  name_en text not null,
  price numeric(12, 2) not null default 0 check (price >= 0),
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create stores table
create table public.stores (
  id uuid primary key default gen_random_uuid(),
  name_vi text not null,
  name_en text not null,
  address_vi text not null,
  address_en text not null,
  phone text,
  latitude double precision,
  longitude double precision,
  opening_hours_vi text,
  opening_hours_en text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  note text,
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  delivery_fee numeric(12, 2) not null default 0 check (delivery_fee >= 0),
  total numeric(12, 2) not null check (total >= 0),
  payment_method text not null default 'COD',
  payment_status text not null default 'UNPAID',
  order_status text not null default 'NEW',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create order_items table
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name_vi text not null,
  product_name_en text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  options jsonb, -- Array snapshot of selected options: [{ id, name_vi, name_en, price }]
  note text,
  created_at timestamptz default now() not null
);

-- Create promotions table
create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  title_vi text not null,
  title_en text not null,
  description_vi text,
  description_en text,
  image_url text,
  start_at timestamptz,
  end_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create faqs table
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question_vi text not null,
  question_en text not null,
  answer_vi text not null,
  answer_en text not null,
  category text not null,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create news table
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title_vi text not null,
  title_en text not null,
  slug text not null unique,
  summary_vi text,
  summary_en text,
  content_vi text,
  content_en text,
  thumbnail_url text,
  published_at timestamptz,
  status text not null default 'DRAFT',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes for performance
create index idx_products_category_id on public.products(category_id);
create index idx_products_slug on public.products(slug);
create index idx_orders_order_number on public.orders(order_number);
create index idx_orders_phone on public.orders(phone);
create index idx_orders_order_status on public.orders(order_status);
create index idx_orders_created_at on public.orders(created_at);
create index idx_news_slug on public.news(slug);

-- Enable updated_at trigger helper
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to tables
create trigger set_updated_at before update on public.categories for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.products for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.product_options for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.stores for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.orders for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.promotions for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.faqs for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.news for each row execute procedure public.handle_updated_at();

-- Enable Row Level Security (RLS) on all tables
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_options enable row level security;
alter table public.stores enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.promotions enable row level security;
alter table public.faqs enable row level security;
alter table public.news enable row level security;

-- Policies for public SELECT access (read-only)
create policy "Allow public read active categories" on public.categories
  for select using (is_active = true);

create policy "Allow public read active products" on public.products
  for select using (is_active = true);

create policy "Allow public read active product_options" on public.product_options
  for select using (is_active = true);

create policy "Allow public read active stores" on public.stores
  for select using (is_active = true);

create policy "Allow public read active promotions" on public.promotions
  for select using (is_active = true and (start_at is null or start_at <= now()) and (end_at is null or end_at >= now()));

create policy "Allow public read active faqs" on public.faqs
  for select using (is_active = true);

create policy "Allow public read published news" on public.news
  for select using (status = 'PUBLISHED' and (published_at is null or published_at <= now()));

-- Admin policies (authenticated users have full permission)
create policy "Allow admin full access to categories" on public.categories
  for all to authenticated using (true) with check (true);

create policy "Allow admin full access to products" on public.products
  for all to authenticated using (true) with check (true);

create policy "Allow admin full access to product_options" on public.product_options
  for all to authenticated using (true) with check (true);

create policy "Allow admin full access to stores" on public.stores
  for all to authenticated using (true) with check (true);

create policy "Allow admin full access to promotions" on public.promotions
  for all to authenticated using (true) with check (true);

create policy "Allow admin full access to faqs" on public.faqs
  for all to authenticated using (true) with check (true);

create policy "Allow admin full access to news" on public.news
  for all to authenticated using (true) with check (true);

create policy "Allow admin full access to orders" on public.orders
  for all to authenticated using (true) with check (true);

create policy "Allow admin full access to order_items" on public.order_items
  for all to authenticated using (true) with check (true);
