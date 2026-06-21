import { useEffect, useRef } from 'react'

const MONO = "10px 'JetBrains Mono',ui-monospace,monospace"

function draw(cv, data, spot, flip) {
  if (!cv) return
  const dpr = window.devicePixelRatio || 1
  const w = cv.clientWidth, h = cv.clientHeight
  cv.width = w * dpr; cv.height = h * dpr
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  if (!data.length) return
  const pad = { l: 46, r: 12, t: 14, b: 26 }
  const maxv = Math.max(...data.map((d) => Math.abs(d.net_gex))) || 1
  const ks = data.map((d) => d.strike)
  const kmin = Math.min(...ks), kmax = Math.max(...ks)
  const x = (k) => pad.l + ((k - kmin) / (kmax - kmin)) * (w - pad.l - pad.r)
  const y0 = pad.t + (h - pad.t - pad.b) / 2
  const bw = Math.max(2, (w - pad.l - pad.r) / data.length - 1)
  ctx.strokeStyle = '#151b28'
  ctx.beginPath(); ctx.moveTo(pad.l, y0); ctx.lineTo(w - pad.r, y0); ctx.stroke()
  data.forEach((d) => {
    const bh = (Math.abs(d.net_gex) / maxv) * ((h - pad.t - pad.b) / 2)
    ctx.fillStyle = d.net_gex >= 0 ? '#64ffda' : '#ff6b81'
    const xb = x(d.strike) - bw / 2
    if (d.net_gex >= 0) ctx.fillRect(xb, y0 - bh, bw, bh)
    else ctx.fillRect(xb, y0, bw, bh)
  })
  const mark = (k, c, lab) => {
    ctx.strokeStyle = c; ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(x(k), pad.t); ctx.lineTo(x(k), h - pad.b); ctx.stroke()
    ctx.setLineDash([]); ctx.fillStyle = c; ctx.font = MONO
    ctx.fillText(lab, x(k) + 4, pad.t + 10)
  }
  if (spot >= kmin && spot <= kmax) mark(spot, '#ccd6f6', 'spot ' + spot.toFixed(0))
  if (flip >= kmin && flip <= kmax) mark(flip, '#f7c948', 'flip ' + flip.toFixed(0))
  ctx.fillStyle = '#5b647f'; ctx.font = MONO
  ;[kmin, (kmin + kmax) / 2, kmax].forEach((k) => ctx.fillText(k.toFixed(0), x(k) - 12, h - 10))
}

export default function GexChart({ data, spot, flip }) {
  const ref = useRef(null)
  useEffect(() => { draw(ref.current, data, spot, flip) }, [data, spot, flip])
  useEffect(() => {
    const on = () => draw(ref.current, data, spot, flip)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [data, spot, flip])
  return <canvas ref={ref} className="chart" />
}
