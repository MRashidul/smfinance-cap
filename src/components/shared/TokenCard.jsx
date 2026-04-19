import React from 'react'
import { format } from 'date-fns'

export default function TokenCard({ entry, size = 'full' }) {
  if (!entry) return null
  const dateStr = (() => {
    try { return format(new Date(entry.completion_date), 'd MMM yyyy') }
    catch { return entry.completion_date }
  })()

  const mini = size === 'mini'

  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid #b8922a',
      borderRadius: mini ? 12 : 16,
      overflow: 'hidden',
      width: mini ? 280 : '100%',
      maxWidth: 380,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Top band */}
      <div style={{
        background: '#b8922a',
        padding: mini ? '7px 14px' : '10px 18px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: mini ? 11 : 12, fontWeight: 500, color: '#1a1000', letterSpacing: '0.06em' }}>
          SM Finance
        </span>
        <span style={{
          fontSize: 9, background: 'rgba(0,0,0,0.18)', color: '#1a1000',
          borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {entry.entry_type === 'referral' ? 'Referral entry' : 'Client copy'}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: mini ? '12px 14px' : '16px 18px' }}>
        <div style={{ fontSize: mini ? 18 : 22, fontWeight: 500, color: '#e8c96b', marginBottom: 2, fontFamily: "'Cormorant Garamond', serif" }}>
          {entry.ref}
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a4e2a', marginBottom: mini ? 10 : 14 }}>
          Annual prize draw entry · CAP 2026
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: mini ? 8 : 10, marginBottom: mini ? 10 : 14 }}>
          {[
            ['Client name', entry.client_name],
            ['Client ID', entry.client_id],
            ['Product', entry.product],
            ['Completed', dateStr],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4a3e1a' }}>{l}</div>
              <div style={{ fontSize: mini ? 11 : 12, fontWeight: 500, color: '#c9a227' }}>{v}</div>
            </div>
          ))}
          {entry.entry_type === 'referral' && entry.referrer_name && (
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4a3e1a' }}>Referred by</div>
              <div style={{ fontSize: mini ? 11 : 12, fontWeight: 500, color: '#c9a227' }}>{entry.referrer_name}</div>
            </div>
          )}
        </div>

        <div style={{ height: '0.5px', background: '#1e1a0e', marginBottom: mini ? 8 : 12 }} />
        <div style={{ fontSize: 9, color: '#3a2e14', lineHeight: 1.6 }}>
          Programme period: Jan – Dec 2026 · Draw: January 2027<br />
          smfinance.co.uk · Full terms & conditions on request
        </div>
      </div>

      {/* SM Finance stub */}
      {!mini && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', padding: '0 12px', background: '#0a0a0a',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a', flexShrink: 0 }} />
            <div style={{ flex: 1, borderTop: '1.5px dashed #1e1e1e' }} />
            <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#222', padding: '0 8px', whiteSpace: 'nowrap' }}>SM Finance retains stub</div>
            <div style={{ flex: 1, borderTop: '1.5px dashed #1e1e1e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a', flexShrink: 0 }} />
          </div>
          <div style={{ background: '#0a0a0a', padding: '12px 18px', borderTop: '0.5px solid #141410' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3a2e10', marginBottom: 3 }}>SM Finance raffle stub</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#c9a227', fontFamily: "'Cormorant Garamond', serif" }}>{entry.ref}</div>
              </div>
              <div style={{ fontSize: 9, color: '#4a3e1a', background: '#0f0e08', border: '1px solid #1e1a0e', borderRadius: 4, padding: '3px 8px' }}>Draw Jan 2027</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[['Client ID', entry.client_id], ['Product', entry.product], ['Date', dateStr]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3a2e10' }}>{l}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#7a6a3a' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
