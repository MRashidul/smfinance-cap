import React from 'react'
import { format } from 'date-fns'
import { PARTNER_TYPES } from '../../lib/store'

export default function PartnerTokenCard({ partner }) {
  if (!partner) return null
  const dateStr = (() => {
    try { return format(new Date(partner.registration_date), 'd MMM yyyy') }
    catch { return partner.registration_date }
  })()

  return (
    <div style={{
      background: '#0a0a0a', border: '1px solid #666',
      borderRadius: 16, overflow: 'hidden',
      width: '100%', maxWidth: 380,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Top band */}
      <div style={{
        background: '#5a5a5a', padding: '10px 18px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', letterSpacing: '0.06em' }}>SM Finance</span>
        <span style={{ fontSize: 9, background: 'rgba(0,0,0,0.2)', color: '#1a1a1a', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Referral partner
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: 22, fontWeight: 500, color: '#c8c8c8', marginBottom: 2, fontFamily: "'Cormorant Garamond', serif" }}>
          {partner.id}
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a4a4a', marginBottom: 14 }}>
          Master referral token · CAP 2026
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            ['Partner name', partner.name],
            ['Partner type', PARTNER_TYPES[partner.type] || partner.type],
            partner.firm ? ['Firm', partner.firm] : null,
            ['Registered', dateStr],
            partner.city ? ['Location', partner.city] : null,
          ].filter(Boolean).map(([l, v]) => (
            <div key={l} style={l === 'Firm' ? { gridColumn: 'span 2' } : {}}>
              <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3a3a3a' }}>{l}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#a0a0a0' }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ height: '0.5px', background: '#1e1e1e', marginBottom: 10 }} />
        <div style={{ fontSize: 9, color: '#3a3a3a', lineHeight: 1.6 }}>
          Present this QR when referring a client to SM Finance.<br />
          Each completed transaction earns one draw entry.<br />
          smfinance.co.uk · Full terms & conditions on request
        </div>
      </div>
    </div>
  )
}
