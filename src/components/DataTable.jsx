import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const fmtEur = v => v != null ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits:0 }).format(v) + ' €' : '—'
const fmtPct = v => v != null ? `${Number(v).toFixed(1)}%` : '—'

export function DataTable({ title, columns, rows, defaultSort, maxRows = 8 }) {
  const [sort, setSort] = useState(defaultSort || null)
  const [asc, setAsc] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const sorted = sort
    ? [...rows].sort((a,b) => asc ? (a[sort]>b[sort]?1:-1) : (a[sort]<b[sort]?1:-1))
    : rows
  const displayed = expanded ? sorted : sorted.slice(0, maxRows)

  function toggleSort(key) {
    if (sort === key) setAsc(a => !a)
    else { setSort(key); setAsc(false) }
  }

  return (
    <div style={{ background:'#1E1E24', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, overflow:'hidden', margin:'8px 0' }}>
      {title && <div style={{ padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:10, fontWeight:500, color:'#6B6A72', textTransform:'uppercase', letterSpacing:'.08em' }}>{title}</div>}
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              {columns.map(col => (
                <th key={col.key} onClick={() => col.sortable!==false && toggleSort(col.key)} style={{ padding:'7px 14px', textAlign:col.align||'left', fontWeight:500, color:'#6B6A72', fontSize:10, letterSpacing:'.06em', textTransform:'uppercase', whiteSpace:'nowrap', cursor:col.sortable!==false?'pointer':'default', userSelect:'none', background:'#18181C' }}>
                  {col.label}{sort===col.key && (asc ? <ChevronUp size={9} style={{marginLeft:3}} /> : <ChevronDown size={9} style={{marginLeft:3}} />)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((row, i) => (
              <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background: i%2===1 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding:'9px 14px', textAlign:col.align||'left', color:'rgba(242,240,232,0.8)', whiteSpace:'nowrap' }}>
                    {col.format ? col.format(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > maxRows && (
        <button onClick={() => setExpanded(e => !e)} style={{ width:'100%', padding:'8px', background:'none', border:'none', borderTop:'1px solid rgba(255,255,255,0.07)', color:'#6B6A72', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', gap:4, cursor:'pointer' }}>
          {expanded ? <><ChevronUp size={11} />Réduire</> : <><ChevronDown size={11} />Voir tout ({rows.length})</>}
        </button>
      )}
    </div>
  )
}
