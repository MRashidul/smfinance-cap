import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { getSession, clearSession } from '../../lib/auth'

const nav = [
  { group: 'Programme', items: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/generate', label: 'Generate token' },
    { to: '/admin/scan', label: 'Scan & verify' },
    { to: '/admin/entries', label: 'All entries' },
    { to: '/admin/draw', label: 'Live draw' },
  ]},
  { group: 'Partners', items: [
    { to: '/admin/partners', label: 'Partner overview' },
    { to: '/admin/partners/register', label: 'Register partner' },
    { to: '/admin/referrals', label: 'Referral log' },
    { to: '/admin/leaderboard', label: 'Leaderboard' },
  ]},
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const session = getSession()

  const handleLogout = () => { clearSession(); navigate('/login') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <aside style={{
        width: collapsed ? 58 : 224, background: '#0d0c0a',
        borderRight: '0.5px solid #1e1a0e', display: 'flex', flexDirection: 'column',
        flexShrink: 0, transition: 'width 0.2s ease', overflow: 'hidden',
      }}>
        <div style={{ padding: collapsed ? '18px 12px' : '18px 18px', borderBottom: '0.5px solid #1e1a0e', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#b8922a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#1a1000', letterSpacing: '0.04em', flexShrink: 0 }}>SMF</div>
            {!collapsed && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#d4b050', letterSpacing: '0.06em' }}>SM Finance</div>
                <div style={{ fontSize: 10, color: '#4a3e1a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>CAP Admin</div>
              </div>
            )}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '6px 10px', overflowY: 'auto' }}>
          {nav.map(group => (
            <div key={group.group} style={{ marginBottom: 20 }}>
              {!collapsed && <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2e2510', marginBottom: 4, paddingLeft: 8 }}>{group.group}</div>}
              {group.items.map(item => (
                <NavLink key={item.to} to={item.to} end={item.end} style={({ isActive }) => ({
                  display: 'block', padding: collapsed ? '9px 8px' : '8px 10px', borderRadius: 8,
                  fontSize: 13, color: isActive ? '#e8c96b' : '#5a4a2a',
                  background: isActive ? '#1a1400' : 'transparent', marginBottom: 2,
                  transition: 'all 0.12s', whiteSpace: 'nowrap', overflow: 'hidden',
                  borderLeft: isActive ? '2px solid #b8922a' : '2px solid transparent',
                })}>
                  {!collapsed ? item.label : item.label[0].toUpperCase()}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {!collapsed && session && (
          <div style={{ padding: '12px 14px', borderTop: '0.5px solid #1e1a0e' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#7a6a3a', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.name}</div>
            <div style={{ fontSize: 10, color: '#3a2e10', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.email}</div>
            <button onClick={handleLogout} style={{ width: '100%', padding: '7px', borderRadius: 7, background: 'transparent', border: '0.5px solid #1e1a0e', color: '#3a2e10', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Sign out</button>
          </div>
        )}

        <button onClick={() => setCollapsed(c => !c)} style={{ padding: '10px', background: 'transparent', border: 'none', borderTop: '0.5px solid #1e1a0e', color: '#2e2510', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
          {collapsed ? '→' : '← Collapse'}
        </button>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 11, color: '#4a3e1a', background: '#1a1400', border: '0.5px solid #2a2010', borderRadius: 6, padding: '4px 12px' }}>CAP 2026 · Draw: Jan 2027</div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
