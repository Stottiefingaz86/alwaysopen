alter table public.client_payments
  add column if not exists invoice_sent_at timestamptz;
