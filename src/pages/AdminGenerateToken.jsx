import React, { useState, useEffect } from 'react'
import { createEntry, getPartners, PRODUCTS } from '../lib/store'
import { downloadClientToken } from '../lib/pdf'
import TokenCard from '../components/shared/TokenCard'
import QRDisplay from '../components/shared/QRDisplay'

const today = () => new Date().toISOString().split('T')[0]
const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin

export default function AdminGenerateToken() {
  const [form, setForm] = useState({ client_name: '', client_id: '', product: PRODUCTS[0], completion_date: today(), entry_type: 'direct', referrer_name: '', referrer_id: '' })
  const [partners, setPartners] = useState([])
  const [generated, setGenerated] = useState(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
  const load = async () => {
    const data = await getPartners()
    setPartners(data)
  }

  load()
}, [])
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleGenerate = () => {
    if (!form.client_name.trim() || !form.client_id.trim()) { alert('Please enter client name and client ID.'); return }
    const entry = createEntry(form)
    setGenerated(entry)
  }

  const handleDownload = async () => {
    if (!generated) return
    setDownloading(true)
    try { await downloadClientToken(generated, SITE_URL) }
    catch (e) { alert('Download failed: ' + e.message) }
    setDownloading(false)
  }

  const handleClear = () => {
    setForm({ client_name: '', client_id: '', product: PRODUCTS[0], completion_date: today(), entry_type: 'direct', referrer_name: '', referrer_id: '' })
    setGenerated(null)
  }

  const qrData = generated ? `${SITE_URL}/entry/${generated.ref}` : ''

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a3e1a', marginBottom: 4 }}>Admin</div>
        <h1 style={{ fontSize: 26, fontWeight: 400, color: '#e8c96b', fontFamily: "'Cormorant Garamond', serif" }}>Generate entry token</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div className="card">
          <div className="section-title">Client details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div><label className="label">Client name</label><input className="input" value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="e.g. Amir Hassan" /></div>
            <div><label className="label">Client ID</label><input className="input" value={form.client_id} onChange={e => set('client_id', e.target.value)} placeholder="e.g. SMF-10284" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="label">Product type</label>
              <select className="input" value={form.product} onChange={e => set('product', e.target.value)}>
                {PRODUCTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div><label className="label">Completion date</label><input className="input" type="date" value={form.completion_date} onChange={e => set('completion_date', e.target.value)} /></div>
            <div>
              <label className="label">Entry type</label>
              <select className="input" value={form.entry_type} onChange={e => set('entry_type', e.target.value)}>
                <option value="direct">Direct client</option>
                <option value="referral">Referral</option>
              </select>
            </div>
          </div>

          {form.entry_type === 'referral' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12, padding: 12, background: '#111', borderRadius: 8, border: '0.5px solid #1e1a0e' }}>
              <div>
                <label className="label">Select partner</label>
                <select className="input" value={form.referrer_id} onChange={e => { const p = partners.find(x => x.id === e.target.value); set('referrer_id', e.target.value); set('referrer_name', p ? p.name : '') }}>
                  <option value="">Select partner...</option>
                  {partners.map(p => <option key={p.id} value={p.id}>{p.name} — {p.id}</option>)}
                </select>
              </div>
              <div><label className="label">Or enter manually</label><input className="input" value={form.referrer_name} onChange={e => set('referrer_name', e.target.value)} placeholder="Referrer name" /></div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-gold" onClick={handleGenerate}>Generate token</button>
            <button className="btn-ghost" onClick={handleClear}>Clear</button>
          </div>
        </div>

        <div>
          {generated ? (
            <div className="fade-in">
              <div className="section-title">Token preview</div>
              <div style={{ marginBottom: '1.5rem' }}><TokenCard entry={generated} /></div>
              <div className="section-title">QR code</div>
              <div style={{ marginBottom: 12 }}><QRDisplay data={qrData} label={generated.ref} /></div>
              <div style={{ fontSize: 11, color: '#3a2e10', marginBottom: '1rem', lineHeight: 1.6 }}>
                Client portal: <span style={{ color: '#5a4e2a', fontFamily: 'monospace', fontSize: 10 }}>{qrData}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn-gold" onClick={handleDownload} disabled={downloading}>
                  {downloading ? 'Generating...' : 'Download token (PNG)'}
                </button>
                <button className="btn-ghost" onClick={() => alert('Email sending requires Resend API key — see README.')}>Email to client</button>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: '#3a2e10' }}>
                Download saves a print-ready PNG with tear-off stub.
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: 32, color: '#1e1a0e', marginBottom: 12, fontFamily: "'Cormorant Garamond', serif" }}>CAP-2026-—</div>
              <div style={{ fontSize: 13, color: '#3a2e10' }}>Fill in the form and click Generate token<br />to create a new entry</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
