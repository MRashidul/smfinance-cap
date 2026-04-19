import React, { useState, useEffect } from 'react'
import { getEntries } from '../lib/store'
import { format } from 'date-fns'

export default function AdminEntries() {
  const [entries, setEntries] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
  const load = async () => {
    const data = await getEntries()
    setEntries(data)
  }

  load()
}, [])
  const fmtDate = d => { try { return format(new Date(d), 'd MMM yy') } catch { return d } }

  const filtered = entries.filter(e => {
    const s = search.toLowerCase()
    const matchS = !s || e.client_name.toLowerCase().includes(s) || e.client_id.toLowerCase().includes(s) || e.ref.toLowerCase().includes(s)
    const matchT = !typeFilter || e.entry_type === typeFilter
    const matchSt = !statusFilter || (statusFilter === 'checked-in' ? e.checked_in : !e.checked_in)
    return matchS && matchT && matchSt
  })

  const exportCSV = () => {
    const rows = [['Entry ref', 'Client name', 'Client ID', 'Product', 'Date', 'Type', 'Referrer', 'Status', 'Checked in']]
    filtered.forEach(e => rows.push([e.ref, e.client_name, e.client_id, e.product, e.completion_date, e.entry_type, e.referrer_name || '', e.status, e.checked_in ? 'Yes' : 'No']))
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'CAP-2026-entries.csv'
    a.click()
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a3e1a', marginBottom: 4 }}>Admin</div>
        <h1 style={{ fontSize: 26, fontWeight: 400, color: '#e8c96b', fontFamily: "'Cormorant Garamond', serif" }}>All entries</h1>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input" style={{ maxWidth: 280 }} placeholder="Search name, ID or entry ref..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input" style={{ width: 160 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="direct">Direct</option>
          <option value="referral">Referral</option>
        </select>
        <select className="input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="checked-in">Checked in</option>
        </select>
        <button className="btn-ghost" onClick={exportCSV}>Export CSV</button>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#4a3e1a' }}>{filtered.length} of {entries.length} entries</div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #1e1a0e' }}>
          <div className="trow trow-header" style={{ gridTemplateColumns: '145px 1fr 110px 85px 75px 90px', border: 'none', padding: 0 }}>
            <span>Entry ref</span><span>Client</span><span>Product</span><span>Date</span><span>Type</span><span>Status</span>
          </div>
        </div>
        <div style={{ maxHeight: 480, overflowY: 'auto', padding: '0 16px' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#3a2e10', fontSize: 13 }}>No entries match your filters</div>
          )}
          {filtered.map(e => (
            <div key={e.ref} className="trow" style={{ gridTemplateColumns: '145px 1fr 110px 85px 75px 90px' }}>
              <span style={{ fontWeight: 500, color: '#b8922a', fontFamily: 'monospace', fontSize: 12 }}>{e.ref}</span>
              <span style={{ color: '#c0b090' }}>
                {e.client_name}
                <span style={{ color: '#3a2e10', fontSize: 11, marginLeft: 6 }}>{e.client_id}</span>
              </span>
              <span style={{ color: '#7a6a3a', fontSize: 12 }}>{e.product}</span>
              <span style={{ color: '#5a4e2a', fontSize: 12 }}>{fmtDate(e.completion_date)}</span>
              <span><span className={`badge badge-${e.entry_type === 'referral' ? 'referral' : 'active'}`}>{e.entry_type === 'referral' ? 'Ref' : 'Direct'}</span></span>
              <span><span className={`badge badge-${e.checked_in ? 'checkedin' : 'active'}`}>{e.checked_in ? 'Checked in' : 'Active'}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
