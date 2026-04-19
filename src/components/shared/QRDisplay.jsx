import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function QRDisplay({ data, color = '#c9a227', bg = '#0a0a0a', size = 160, label }) {
  const canvasRef = useRef()

  useEffect(() => {
    if (!canvasRef.current || !data) return
    QRCode.toCanvas(canvasRef.current, data, {
      width: size,
      margin: 1,
      color: { dark: color, light: bg },
    }).catch(console.error)
  }, [data, color, bg, size])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        background: bg, borderRadius: 12, border: '1px solid #2a2010',
        padding: 12, display: 'inline-flex',
      }}>
        <canvas ref={canvasRef} width={size} height={size} />
      </div>
      {label && (
        <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4a3e1a' }}>
          {label}
        </div>
      )}
    </div>
  )
}
