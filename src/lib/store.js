// // ─── LOCAL DATA STORE ────────────────────────────────────────────────────────
// // In-memory store that mirrors the Supabase schema.
// // When VITE_SUPABASE_URL is set, swap these functions for the supabase.js calls.

// const STORAGE_KEY = 'smf_cap_data'

// function load() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY)
//     if (raw) return JSON.parse(raw)
//   } catch {}
//   return { entries: [], partners: [], referrals: [], meta: { lastEntrySeq: 0, lastPartnerSeq: 0 } }
// }

// function save(state) {
//   try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
// }

// let state = load()

// // Seed demo data on first run
// if (!state.entries.length && !state.partners.length) {
//   state.partners = [
//     { id: 'REF-2026-001', name: 'Sabbir Ahmed', firm: 'SWM Solicitors', type: 'solicitor', email: 'sabbir@swmsolicitors.co.uk', phone: '020 7000 0001', city: 'Ilford', registration_date: '2026-01-10', status: 'active' },
//     { id: 'REF-2026-002', name: 'Rania Malik', firm: 'Malik & Co Estate Agents', type: 'estate-agent', email: 'rania@malikco.co.uk', phone: '020 7000 0002', city: 'Stratford', registration_date: '2026-01-18', status: 'active' },
//     { id: 'REF-2026-003', name: 'David Chen', firm: 'Chen Accountancy Ltd', type: 'accountant', email: 'david@chenaccountancy.co.uk', phone: '020 7000 0003', city: 'Canary Wharf', registration_date: '2026-02-05', status: 'active' },
//   ]
//   state.entries = [
//     { ref: 'CAP-2026-00001', client_name: 'Amir Hassan', client_id: 'SMF-10001', product: 'Buy to let', completion_date: '2026-01-15', entry_type: 'direct', referrer_name: '', referrer_id: '', status: 'checked-in', checked_in: true, programme_year: '2026' },
//     { ref: 'CAP-2026-00002', client_name: 'Fatima Begum', client_id: 'SMF-10002', product: 'Residential mortgage', completion_date: '2026-02-03', entry_type: 'direct', referrer_name: '', referrer_id: '', status: 'active', checked_in: false, programme_year: '2026' },
//     { ref: 'CAP-2026-00003', client_name: 'Omar Shaikh', client_id: 'SMF-10003', product: 'Bridging loan', completion_date: '2026-02-28', entry_type: 'referral', referrer_name: 'Sabbir Ahmed', referrer_id: 'REF-2026-001', status: 'checked-in', checked_in: true, programme_year: '2026' },
//     { ref: 'CAP-2026-00004', client_name: 'Nadia Rahman', client_id: 'SMF-10004', product: 'Ltd company mortgage', completion_date: '2026-03-10', entry_type: 'direct', referrer_name: '', referrer_id: '', status: 'active', checked_in: false, programme_year: '2026' },
//     { ref: 'CAP-2026-00005', client_name: 'Imran Hussain', client_id: 'SMF-10001', product: 'Remortgage', completion_date: '2026-04-01', entry_type: 'referral', referrer_name: 'Rania Malik', referrer_id: 'REF-2026-002', status: 'active', checked_in: false, programme_year: '2026' },
//   ]
//   state.referrals = [
//     { id: 'r1', partner_id: 'REF-2026-001', entry_ref: 'CAP-2026-00003', client_name: 'Omar Shaikh', status: 'completed', referral_date: '2026-02-28' },
//     { id: 'r2', partner_id: 'REF-2026-002', entry_ref: 'CAP-2026-00005', client_name: 'Imran Hussain', status: 'completed', referral_date: '2026-04-01' },
//     { id: 'r3', partner_id: 'REF-2026-001', entry_ref: 'CAP-2026-00006', client_name: 'Yasmin Ali', status: 'completed', referral_date: '2026-04-08' },
//   ]
//   state.meta = { lastEntrySeq: 5, lastPartnerSeq: 3 }
//   save(state)
// }

// // ─── ENTRY OPERATIONS ────────────────────────────────────────────────────────
// export function getEntries() { return [...state.entries].reverse() }

// export function getEntryByRef(ref) { return state.entries.find(e => e.ref === ref) || null }

// export function getEntriesByClientId(clientId) {
//   return state.entries.filter(e => e.client_id === clientId).reverse()
// }

// export function createEntry(entry) {
//   state.meta.lastEntrySeq++
//   const seq = String(state.meta.lastEntrySeq).padStart(5, '0')
//   const ref = `CAP-2026-${seq}`
//   const newEntry = { ...entry, ref, programme_year: '2026', status: 'active', checked_in: false }
//   state.entries.push(newEntry)
//   save(state)
//   return newEntry
// }

// export function checkInEntry(ref) {
//   const e = state.entries.find(e => e.ref === ref)
//   if (!e) return null
//   e.checked_in = true
//   e.status = 'checked-in'
//   save(state)
//   return e
// }

// // ─── PARTNER OPERATIONS ──────────────────────────────────────────────────────
// export function getPartners() { return [...state.partners] }

// export function getPartnerById(id) { return state.partners.find(p => p.id === id) || null }

// export function createPartner(partner) {
//   state.meta.lastPartnerSeq++
//   const seq = String(state.meta.lastPartnerSeq).padStart(3, '0')
//   const id = `REF-2026-${seq}`
//   const newPartner = { ...partner, id, status: 'active' }
//   state.partners.push(newPartner)
//   save(state)
//   return newPartner
// }

// // ─── REFERRAL OPERATIONS ─────────────────────────────────────────────────────
// export function getReferrals() { return [...state.referrals].reverse() }

// export function getReferralsByPartner(partnerId) {
//   return state.referrals.filter(r => r.partner_id === partnerId)
// }

// export function createReferral(referral) {
//   const id = `ref_${Date.now()}`
//   const newRef = { ...referral, id }
//   state.referrals.push(newRef)
//   save(state)
//   return newRef
// }

// // ─── STATS ───────────────────────────────────────────────────────────────────
// export function getStats() {
//   const entries = state.entries
//   const partners = state.partners
//   const referrals = state.referrals
//   return {
//     totalEntries: entries.length,
//     checkedIn: entries.filter(e => e.checked_in).length,
//     referralEntries: entries.filter(e => e.entry_type === 'referral').length,
//     uniqueClients: new Set(entries.map(e => e.client_id)).size,
//     totalPartners: partners.length,
//     totalReferrals: referrals.length,
//     completedReferrals: referrals.filter(r => r.status === 'completed').length,
//   }
// }

// export function getLeaderboard() {
//   return state.partners.map(p => {
//     const refs = state.referrals.filter(r => r.partner_id === p.id)
//     const completed = refs.filter(r => r.status === 'completed').length
//     return { ...p, totalRefs: refs.length, completed, drawEntries: completed }
//   }).sort((a, b) => b.completed - a.completed)
// }

// export const PRODUCTS = [
//   'Residential mortgage', 'First time buyer', 'Buy to let', 'Remortgage',
//   'Ltd company mortgage', 'Commercial finance', 'Bridging loan',
//   'Development finance', 'Protection policy'
// ]

// export const PARTNER_TYPES = {
//   solicitor: 'Solicitor',
//   'estate-agent': 'Estate agent',
//   accountant: 'Accountant',
//   friend: 'Friend / personal',
//   partner: 'Professional partner'
// }

// ─── SUPABASE STORE ───────────────────────────────────────────────────────

import { supabase } from './supabase'

// ─── ENTRY ────────────────────────────────────────────────────────────────
export async function getEntries() {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getEntryByRef(ref) {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('ref', ref)
    .single()

  if (error) throw error
  return data
}

export async function getEntriesByClientId(clientId) {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('client_id', clientId)

  if (error) throw error
  return data
}

// export async function createEntry(entry) {
//   const { data, error } = await supabase
//     .from('entries')
//     .insert([entry])
//     .select()
//     .single()

//   if (error) throw error
//   return data
// }

export async function createEntry(entry) {
  // generate unique reference
  const ref = `CAP-2026-${Date.now()}`

  const payload = {
    ...entry,
    ref,
    status: 'active',
    checked_in: false,
    programme_year: '2026'
  }

  const { data, error } = await supabase
    .from('entries')
    .insert([payload])
    .select()
    .single()

  if (error) {
    console.error("INSERT ERROR:", error)
    alert(error.message)
    return null
  }

  return data
}

export async function checkInEntry(ref) {
  const { data, error } = await supabase
    .from('entries')
    .update({ checked_in: true, status: 'checked-in' })
    .eq('ref', ref)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── PARTNERS ─────────────────────────────────────────────────────────────
export async function getPartners() {
  const { data, error } = await supabase.from('partners').select('*')

  if (error) throw error
  return data
}

export async function getPartnerById(id) {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createPartner(partner) {
  const { data, error } = await supabase
    .from('partners')
    .insert([partner])
    .select()
    .single()

  if (error) {
    console.error("PARTNER INSERT ERROR:", error)
    alert(error.message)
    return null
  }

  return data
}

// ─── REFERRALS ────────────────────────────────────────────────────────────
export async function getReferrals() {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getReferralsByPartner(partnerId) {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('partner_id', partnerId)

  if (error) throw error
  return data
}

export async function createReferral(referral) {
  const { data, error } = await supabase
    .from('referrals')
    .insert([referral])
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── STATS ────────────────────────────────────────────────────────────────
export async function getStats() {
  const entries = await getEntries()
  const partners = await getPartners()
  const referrals = await getReferrals()

  return {
    totalEntries: entries.length,
    checkedIn: entries.filter(e => e.checked_in).length,
    referralEntries: entries.filter(e => e.entry_type === 'referral').length,
    uniqueClients: new Set(entries.map(e => e.client_id)).size,
    totalPartners: partners.length,
    totalReferrals: referrals.length,
    completedReferrals: referrals.filter(r => r.status === 'completed').length,
  }
}

export async function getLeaderboard() {
  const partners = await getPartners()
  const referrals = await getReferrals()

  return partners.map(p => {
    const refs = referrals.filter(r => r.partner_id === p.id)
    const completed = refs.filter(r => r.status === 'completed').length
    return { ...p, totalRefs: refs.length, completed, drawEntries: completed }
  }).sort((a, b) => b.completed - a.completed)
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────
export const PRODUCTS = [
  'Residential mortgage', 'First time buyer', 'Buy to let', 'Remortgage',
  'Ltd company mortgage', 'Commercial finance', 'Bridging loan',
  'Development finance', 'Protection policy'
]

export const PARTNER_TYPES = {
  solicitor: 'Solicitor',
  'estate-agent': 'Estate agent',
  accountant: 'Accountant',
  friend: 'Friend / personal',
  partner: 'Professional partner'
}