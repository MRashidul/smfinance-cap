// ─── AUTH STORE ──────────────────────────────────────────────────────────────
// Simple role-based auth with localStorage persistence.
// In production, replace with Supabase Auth (supabase.com/docs/guides/auth).
//
// ROLES:
//   admin   → full admin system access
//   partner → partner portal (read-only, their referrals only)
//   client  → client portal (read-only, their entries only)

const AUTH_KEY = 'smf_cap_auth'

// ─── DEMO CREDENTIALS ───────────────────────────────────────────────────────
// Change these before going live, or replace with Supabase Auth.
const ADMIN_CREDENTIALS = [
  { email: 'admin@smfinance.co.uk',   password: 'SMF@admin2026', role: 'admin', name: 'SM Finance Admin' },
  { email: 'selina@smfinance.co.uk',  password: 'SMF@selina2026', role: 'admin', name: 'Selina Manir' },
]

// Partners log in with their partner ID + email on file
// Client log in with their entry ref + client ID

export function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    // Expire after 8 hours
    if (Date.now() - session.createdAt > 8 * 60 * 60 * 1000) {
      localStorage.removeItem(AUTH_KEY)
      return null
    }
    return session
  } catch { return null }
}

export function setSession(session) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ ...session, createdAt: Date.now() }))
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY)
}

// ─── LOGIN FUNCTIONS ─────────────────────────────────────────────────────────

export function loginAdmin(email, password) {
  const match = ADMIN_CREDENTIALS.find(
    c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  )
  if (!match) return { success: false, error: 'Invalid email or password.' }
  const session = { role: 'admin', name: match.name, email: match.email }
  setSession(session)
  return { success: true, session }
}

export function loginPartner(partnerId, email, getPartnerById) {
  const partner = getPartnerById(partnerId.toUpperCase())
  if (!partner) return { success: false, error: 'Partner ID not found.' }
  if (partner.email.toLowerCase() !== email.toLowerCase())
    return { success: false, error: 'Email does not match our records for this partner ID.' }
  const session = { role: 'partner', partnerId: partner.id, name: partner.name, email: partner.email }
  setSession(session)
  return { success: true, session }
}

export function loginClient(entryRef, clientId, getEntryByRef) {
  const entry = getEntryByRef(entryRef.toUpperCase())
  if (!entry) return { success: false, error: 'Entry reference not found.' }
  if (entry.client_id.toUpperCase() !== clientId.toUpperCase())
    return { success: false, error: 'Client ID does not match this entry reference.' }
  const session = { role: 'client', entryRef: entry.ref, clientId: entry.client_id, name: entry.client_name }
  setSession(session)
  return { success: true, session }
}
