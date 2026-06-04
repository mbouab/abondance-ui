import React from 'react'
import { Check } from 'lucide-react'

const TOOL_LABELS = {
  kpis_globaux:        'KPIs globaux',
  detail_articles:     'Articles',
  detail_serveurs:     'Serveurs',
  kpis_par_tranche:    'Tranches horaires',
  kpis_out:            'Tickets out',
  detail_out:          'Détail out',
  autres_charges:      "Charges d'exploitation",
  contexte_meteo:      'Météo',
  contexte_calendrier: 'Calendrier',
}

export function ToolCallIndicator({ toolCalls }) {
  if (!toolCalls?.length) return null
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:5, margin:'6px 0 10px' }}>
      {toolCalls.map((t, i) => {
        const label = TOOL_LABELS[t.name] || t.name
        const done = t.status === 'done'
        return (
          <div key={i} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:20, fontSize:11, fontWeight:500, background: done ? 'rgba(74,222,128,0.06)' : 'rgba(200,169,110,0.06)', color: done ? '#4ADE80' : '#C8A96E', border:`1px solid ${done ? 'rgba(74,222,128,0.15)' : 'rgba(200,169,110,0.15)'}`, transition:'all .3s' }}>
            {done
              ? <Check size={9} />
              : <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:'#C8A96E', animation:'ping .8s ease-in-out infinite' }} />
            }
            {label}
          </div>
        )
      })}
      <style>{`@keyframes ping { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
    </div>
  )
}
