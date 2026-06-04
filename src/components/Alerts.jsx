import React from 'react'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

const levels = {
  critique: { color: '#F87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.2)', Icon: AlertCircle },
  alerte:   { color: '#FBBF24', bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.2)', Icon: AlertTriangle },
  info:     { color: '#60A5FA', bg: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.2)', Icon: Info }
}

export function Alerts({ alerts }) {
  if (!alerts?.length) return null
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6, margin:'10px 0' }}>
      {alerts.map((a, i) => {
        const lvl = levels[a.level] || levels.info
        const { Icon } = lvl
        return (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px 12px', background:lvl.bg, border:`1px solid ${lvl.border}`, borderRadius:8, fontSize:13 }}>
            <Icon size={14} style={{ marginTop:1, flexShrink:0, color:lvl.color }} />
            <span style={{ color:'rgba(242,240,232,0.8)' }}>{a.message}</span>
          </div>
        )
      })}
    </div>
  )
}
