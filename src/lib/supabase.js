import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── ENTRIES ────────────────────────────────────────────────────────────────
export const getEntries = async () => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const getEntryByRef = async (ref) => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('ref', ref)
    .single()
  if (error) throw error
  return data
}

export const getEntriesByClientId = async (clientId) => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createEntry = async (entry) => {
  const { data, error } = await supabase
    .from('entries')
    .insert([entry])
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateEntryCheckin = async (ref, checkedIn) => {
  const { data, error } = await supabase
    .from('entries')
    .update({ checked_in: checkedIn, status: checkedIn ? 'checked-in' : 'active' })
    .eq('ref', ref)
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── PARTNERS ────────────────────────────────────────────────────────────────
export const getPartners = async () => {
  const { data, error } = await supabase
    .from('partners')
    .select('*, referrals(count)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const getPartnerById = async (id) => {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export const createPartner = async (partner) => {
  const { data, error } = await supabase
    .from('partners')
    .insert([partner])
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── REFERRALS ───────────────────────────────────────────────────────────────
export const getReferrals = async () => {
  const { data, error } = await supabase
    .from('referrals')
    .select('*, partners(name, firm, type)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const getReferralsByPartner = async (partnerId) => {
  const { data, error } = await supabase
    .from('referrals')
    .select('*, entries(ref, client_name, product, completion_date)')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createReferral = async (referral) => {
  const { data, error } = await supabase
    .from('referrals')
    .insert([referral])
    .select()
    .single()
  if (error) throw error
  return data
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUPABASE SCHEMA — paste this into Supabase SQL Editor and click Run
   ═══════════════════════════════════════════════════════════════════════════

-- ENTRIES TABLE
create table if not exists entries (
  id uuid default gen_random_uuid() primary key,
  ref text unique not null,
  client_name text not null,
  client_id text not null,
  product text not null,
  completion_date date not null,
  entry_type text not null default 'direct',
  referrer_name text,
  referrer_id text,
  status text not null default 'active',
  checked_in boolean not null default false,
  programme_year text not null default '2026',
  created_at timestamptz default now()
);

-- PARTNERS TABLE
create table if not exists partners (
  id text unique not null primary key,
  name text not null,
  firm text,
  type text not null,
  email text,
  phone text,
  city text,
  registration_date date not null,
  status text not null default 'active',
  created_at timestamptz default now()
);

-- REFERRALS TABLE
create table if not exists referrals (
  id uuid default gen_random_uuid() primary key,
  partner_id text references partners(id),
  entry_ref text references entries(ref),
  client_name text,
  status text not null default 'completed',
  referral_date date not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) — allow all reads, restrict writes
alter table entries enable row level security;
alter table partners enable row level security;
alter table referrals enable row level security;

-- Public read access (client portal reads entries by ref)
create policy "Public read entries" on entries for select using (true);
create policy "Public read partners" on partners for select using (true);
create policy "Public read referrals" on referrals for select using (true);

-- Authenticated write access (admin only)
create policy "Auth insert entries" on entries for insert with check (true);
create policy "Auth update entries" on entries for update using (true);
create policy "Auth insert partners" on partners for insert with check (true);
create policy "Auth insert referrals" on referrals for insert with check (true);

   ═══════════════════════════════════════════════════════════════════════════ */
