// ─── PDF / IMAGE TOKEN DOWNLOAD ─────────────────────────────────────────────
// Generates a print-ready token card as a PNG download.
// Uses HTML Canvas — no external library needed.
// For a true PDF, swap the final step to use jsPDF (add to package.json).

import QRCode from 'qrcode'

const GOLD = '#b8922a'
const GOLD_LIGHT = '#e8c96b'
const GOLD_MID = '#c9a227'
const GOLD_MUTED = '#5a4e2a'
const GOLD_FAINT = '#4a3e1a'
const BLACK = '#0a0a0a'
const BLACK2 = '#111111'
const DARK_LINE = '#1e1a0e'

function fmtDate(d) {
  try {
    const dt = new Date(d)
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return d }
}

export async function downloadClientToken(entry, siteUrl = window.location.origin) {
  const W = 800, H = 520
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = BLACK
  ctx.roundRect(0, 0, W, H, 20)
  ctx.fill()

  // Border
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  ctx.roundRect(1, 1, W - 2, H - 2, 20)
  ctx.stroke()

  // Gold top band
  ctx.fillStyle = GOLD
  ctx.beginPath()
  ctx.roundRect(0, 0, W, 54, [20, 20, 0, 0])
  ctx.fill()

  // Band text — brand
  ctx.fillStyle = '#1a1000'
  ctx.font = '500 18px "DM Sans", sans-serif'
  ctx.fillText('SM Finance', 24, 34)

  // Band tag
  const tag = entry.entry_type === 'referral' ? 'Referral entry' : 'Client copy'
  ctx.font = '400 12px "DM Sans", sans-serif'
  const tagW = ctx.measureText(tag).width + 20
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.roundRect(W - tagW - 20, 16, tagW, 22, 4)
  ctx.fill()
  ctx.fillStyle = '#1a1000'
  ctx.fillText(tag, W - tagW - 10, 31)

  // Entry number
  ctx.fillStyle = GOLD_LIGHT
  ctx.font = '400 38px "Cormorant Garamond", Georgia, serif'
  ctx.fillText(entry.ref, 24, 110)

  // Sub label
  ctx.fillStyle = GOLD_MUTED
  ctx.font = '400 11px "DM Sans", sans-serif'
  ctx.fillText('ANNUAL PRIZE DRAW ENTRY · CAP 2026', 24, 132)

  // Fields grid
  const fields = [
    ['CLIENT NAME', entry.client_name],
    ['CLIENT ID', entry.client_id],
    ['PRODUCT', entry.product],
    ['COMPLETED', fmtDate(entry.completion_date)],
    ['PROGRAMME', 'CAP 2026'],
    ['DRAW DATE', 'January 2027'],
  ]
  if (entry.entry_type === 'referral' && entry.referrer_name) {
    fields.push(['REFERRED BY', entry.referrer_name])
  }

  const colW = (W - 48 - 200) / 2
  let fx = 24, fy = 160
  fields.forEach((([label, val], i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 24 + col * (colW + 20)
    const y = 160 + row * 56

    ctx.fillStyle = GOLD_FAINT
    ctx.font = '400 9px "DM Sans", sans-serif'
    ctx.fillText(label, x, y)

    ctx.fillStyle = GOLD_MID
    ctx.font = '500 14px "DM Sans", sans-serif'
    ctx.fillText(val, x, y + 18)
  }))

  // Divider line
  const divY = 310
  ctx.strokeStyle = DARK_LINE
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(24, divY)
  ctx.lineTo(W - 200, divY)
  ctx.stroke()

  // Footer text
  ctx.fillStyle = '#3a2e14'
  ctx.font = '400 10px "DM Sans", sans-serif'
  ctx.fillText('Programme period: Jan – Dec 2026 · Draw: January 2027', 24, divY + 18)
  ctx.fillText('smfinance.co.uk · Full terms & conditions on request', 24, divY + 34)
  ctx.fillText('SM Finance is a trading style of Selina Manir Finance Ltd', 24, divY + 50)

  // QR code
  const qrData = `${siteUrl}/entry/${entry.ref}`
  const qrCanvas = document.createElement('canvas')
  await QRCode.toCanvas(qrCanvas, qrData, {
    width: 160, margin: 1,
    color: { dark: GOLD_MID, light: BLACK },
  })
  ctx.drawImage(qrCanvas, W - 188, 68, 168, 168)

  // QR label
  ctx.fillStyle = GOLD_FAINT
  ctx.font = '400 9px "DM Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Scan to verify entry', W - 104, 248)
  ctx.fillText(entry.ref, W - 104, 262)
  ctx.textAlign = 'left'

  // Tear line
  const tearY = H - 110
  ctx.setLineDash([6, 4])
  ctx.strokeStyle = '#222'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, tearY)
  ctx.lineTo(W, tearY)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#2a2a2a'
  ctx.font = '400 9px "DM Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('SM FINANCE RETAINS STUB BELOW', W / 2, tearY - 6)
  ctx.textAlign = 'left'

  // Stub
  ctx.fillStyle = '#1a1000'
  ctx.font = '400 26px "Cormorant Garamond", serif'
  ctx.fillStyle = GOLD_MID
  ctx.fillText(entry.ref, 24, tearY + 36)

  ctx.fillStyle = GOLD_FAINT
  ctx.font = '400 9px "DM Sans", sans-serif'
  ctx.fillText('SM Finance Raffle Stub · Draw January 2027', 24, tearY + 52)

  const stubFields = [['CLIENT ID', entry.client_id], ['PRODUCT', entry.product], ['DATE', fmtDate(entry.completion_date)]]
  stubFields.forEach(([l, v], i) => {
    const x = 24 + i * 160
    ctx.fillStyle = '#3a2e10'
    ctx.font = '400 9px "DM Sans", sans-serif'
    ctx.fillText(l, x, tearY + 70)
    ctx.fillStyle = '#7a6a3a'
    ctx.font = '500 12px "DM Sans", sans-serif'
    ctx.fillText(v, x, tearY + 85)
  })

  // Download
  const link = document.createElement('a')
  link.download = `SMF-CAP-${entry.ref}.png`
  link.href = canvas.toDataURL('image/png', 1.0)
  link.click()
}

export async function downloadPartnerToken(partner, siteUrl = window.location.origin) {
  const W = 800, H = 340
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = BLACK
  ctx.roundRect(0, 0, W, H, 20)
  ctx.fill()

  ctx.strokeStyle = '#666'
  ctx.lineWidth = 2
  ctx.roundRect(1, 1, W - 2, H - 2, 20)
  ctx.stroke()

  // Silver band
  ctx.fillStyle = '#5a5a5a'
  ctx.beginPath()
  ctx.roundRect(0, 0, W, 54, [20, 20, 0, 0])
  ctx.fill()

  ctx.fillStyle = '#1a1a1a'
  ctx.font = '500 18px "DM Sans", sans-serif'
  ctx.fillText('SM Finance', 24, 34)

  ctx.font = '400 12px "DM Sans", sans-serif'
  const tag = 'Referral partner'
  const tagW = ctx.measureText(tag).width + 20
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.roundRect(W - tagW - 20, 16, tagW, 22, 4)
  ctx.fill()
  ctx.fillStyle = '#1a1a1a'
  ctx.fillText(tag, W - tagW - 10, 31)

  ctx.fillStyle = '#c8c8c8'
  ctx.font = '400 34px "Cormorant Garamond", serif'
  ctx.fillText(partner.id, 24, 108)

  ctx.fillStyle = '#4a4a4a'
  ctx.font = '400 11px "DM Sans", sans-serif'
  ctx.fillText('MASTER REFERRAL TOKEN · CAP 2026', 24, 128)

  const fields = [
    ['PARTNER NAME', partner.name],
    ['PARTNER TYPE', partner.type],
    ['FIRM', partner.firm || '—'],
    ['REGISTERED', fmtDate(partner.registration_date)],
    partner.city ? ['LOCATION', partner.city] : null,
    partner.email ? ['EMAIL', partner.email] : null,
  ].filter(Boolean)

  const colW = (W - 48 - 200) / 2
  fields.forEach(([label, val], i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const x = 24 + col * (colW + 20)
    const y = 156 + row * 50
    ctx.fillStyle = '#3a3a3a'
    ctx.font = '400 9px "DM Sans", sans-serif'
    ctx.fillText(label, x, y)
    ctx.fillStyle = '#a0a0a0'
    ctx.font = '500 13px "DM Sans", sans-serif'
    ctx.fillText(val, x, y + 16)
  })

  const qrData = `${siteUrl}/partner/${partner.id}`
  const qrCanvas = document.createElement('canvas')
  await QRCode.toCanvas(qrCanvas, qrData, {
    width: 160, margin: 1,
    color: { dark: '#c0c0c0', light: BLACK },
  })
  ctx.drawImage(qrCanvas, W - 188, 68, 168, 168)

  ctx.fillStyle = '#3a3a3a'
  ctx.font = '400 9px "DM Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Present when referring a client', W - 104, 248)
  ctx.fillText(partner.id, W - 104, 262)
  ctx.textAlign = 'left'

  ctx.fillStyle = '#2a2a2a'
  ctx.font = '400 10px "DM Sans", sans-serif'
  ctx.fillText('smfinance.co.uk · Full terms & conditions on request', 24, H - 20)

  const link = document.createElement('a')
  link.download = `SMF-Partner-${partner.id}.png`
  link.href = canvas.toDataURL('image/png', 1.0)
  link.click()
}
