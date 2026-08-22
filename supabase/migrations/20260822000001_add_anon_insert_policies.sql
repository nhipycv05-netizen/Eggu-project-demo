-- Add policies to allow anonymous users (customers) to insert orders and order_items.
-- Direct SELECT, UPDATE, and DELETE remain strictly forbidden for non-admin users.

create policy "Allow public to insert orders" on public.orders
  for insert with check (true);

create policy "Allow public to insert order_items" on public.order_items
  for insert with check (true);
