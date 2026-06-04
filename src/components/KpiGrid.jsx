import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function fmt(val, unit) {
  if (val == null) return '—'
  if (unit === '%') return `${Number(val).toFixed(1)}%`
  if (unit === '€') return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val) + ' €'
  if (unit === 'N') return Number(val).toLocaleString('fr-FR')
  return String(val)
}

function Trend({ value }) {
  if (value == null) return null
  const v = parseFloat(value)
  if (v > 0) return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11, fontWeight:500, color:'#4ADE80', background:'rgba(74,222,128,0.08)', padding:'2px 7px', borderRadius:6, marginTop:6 }}>
      <TrendingUp size={10} />{`+${v.toFixed(1)}%`}
    </span>
  )
  if (v < 0) return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11, fontWeight:500, color:'#F87171', background:'rgba(248,113,113,0.08)', padding:'2px 7px', borderRadius:6, marginTop:6 }}>
      <TrendingDown size={10} />{`${v.toFixed(1)}%`}
    </span>
  )
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11, color:'#6B6A72', background:'rgba(255,255,255,0.04)', padding:'2px 7px', borderRadius:6, marginTop:6 }}>
      <Minus size={10} />0%
    </span>
  )
}

export function KpiGrid({ kpis }) {
  if (!kpis?.length) return null
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:8, margin:'12px 0' }}>
      {kpis.map((k, i) => (
        <div key={i} style={{
          background: '#1E1E24',
          border: `1px solid ${k.alert ? 'rgba(248,113,113,0.25)' : k.warning ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 10,
          padding: '12px 14px',
          borderTop: k.alert ? '2px solid #F87171' : k.warning ? '2px solid #FBBF24' : '1px solid rgba(255,255,255,0.07)'
        }}>
          <div style={{ fontSize:10, fontWeight:500, color:'#6B6A72', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>{k.label}</div>
          <div style={{ fontSize:20, fontWeight:500, color:'#F2F0E8', fontVariantNumeric:'tabular-nums', lineHeight:1.2 }}>{fmt(k.value, k.unit)}</div>
          {k.sub && <div style={{ fontSize:11, color:'#6B6A72', marginTop:4 }}>{k.sub}</div>}
          {k.trend != null && <div><Trend value={k.trend} /></div>}
        </div>
      ))}
    </div>
  )
}
