// AdminPartners.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPartners, getReferrals, PARTNER_TYPES } from '../lib/store'

export function AdminPartners() {
  const [partners, setPartners] = useState([])
  const [referrals, setReferrals] = useState([])

  useEffect(() => {
  const load = async () => {
    const partnersData = await getPartners()
    const referralsData = await getReferrals()

    setPartners(partnersData)
    setReferrals(referralsData)
  }

  load()
}, [])

  const getCount = (pid) => referrals.filter(r => r.partner_id === pid && r.status === 'completed').length

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a3e1a', marginBottom: 4 }}>Partners</div>
          <h1 style={{ fontSize: 26, fontWeight: 400, color: '#e8c96b', fontFamily: "'Cormorant Garamond', serif" }}>Partner overview</h1>
        </div>
        <Link to="/admin/partners/register"><button className="btn-gold">Register partner</button></Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {partners.length === 0 && (
          <div style={{ color: '#3a2e10', fontSize: 13, padding: '1rem 0' }}>No partners registered yet</div>
        )}
        {partners.map(p => (
          <Link key={p.id} to={`/admin/leaderboard`}>
            <div className="card" style={{ cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4a3e1a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2010'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', background: '#1a1a2a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 500, color: '#8a8ac0', flexShrink: 0,
                }}>
                  {p.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#c0b090' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#4a3e1a' }}>{p.firm || PARTNER_TYPES[p.type]}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#5a5a5a' }}>{p.id}</span>
                <span className={`badge badge-${p.type}`}>{PARTNER_TYPES[p.type]}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <span style={{ color: '#4a3e1a' }}>Completed: <span style={{ color: '#c9a227', fontWeight: 500 }}>{getCount(p.id)}</span></span>
                <span style={{ color: '#4a3e1a' }}>Draw entries: <span style={{ color: '#b8922a', fontWeight: 500 }}>{getCount(p.id)}</span></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminPartners
