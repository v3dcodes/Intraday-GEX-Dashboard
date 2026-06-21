import { useEffect, useState } from 'react'
import { getGex } from './api'
import StatCard from './components/StatCard'
import GexChart from './components/GexChart'

const fmt = (n) =>
  Math.abs(n) >= 1e9 ? (n / 1e9).toFixed(2) + 'B'
  : Math.abs(n) >= 1e6 ? (n / 1e6).toFixed(1) + 'M'
  : n.toFixed(0)

export default function App() {
  const [d, setD] = useState(null)

  useEffect(() => {
    const load = () => getGex().then(setD).catch((e) => console.error(e))
    load()
    const id = setInterval(load, 4000)
    return () => clearInterval(id)
  }, [])

  const net = d ? d.net_gex : 0
  return (
    <div className="wrap">
      <div className="sh"><h2>intraday gex</h2></div>
      <div className="eyebrow">SPX · NET DEALER GAMMA EXPOSURE</div>

      <div className="viz">
        <div className="stats">
          <StatCard label="spot" value={d ? d.spot.toFixed(2) : '—'} />
          <StatCard label="net gex"
            value={d ? (net >= 0 ? '+' : '') + fmt(net) : '—'}
            cls={d ? (net >= 0 ? 'pos' : 'neg') : ''} />
          <StatCard label="gamma flip" value={d ? d.flip.toFixed(0) : '—'} />
        </div>
        <div className="vh">
          <span>gamma exposure by strike</span>
          <span className="live"><i />live · 4s</span>
        </div>
        <div className="body">
          <GexChart data={d ? d.strikes : []} spot={d ? d.spot : 0} flip={d ? d.flip : 0} />
          <div className="legend">
            <span><span className="dot" style={{ background: '#64ffda' }} />positive gamma · pinning</span>
            <span><span className="dot" style={{ background: '#ff6b81' }} />negative gamma · accelerant</span>
          </div>
        </div>
      </div>
      <div className="foot">synthetic chain by default · set <code>SCHWAB_TOKEN</code> to stream a live chain</div>
    </div>
  )
}
