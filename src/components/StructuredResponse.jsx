import React from 'react'
import { KpiGrid } from './KpiGrid.jsx'
import { Alerts } from './Alerts.jsx'
import { CaChart, MargeWaterfall, FoodPieChart, HoraireChart } from './Charts.jsx'
import { DataTable } from './DataTable.jsx'

const fmtEur = v => v != null ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits:0 }).format(v) + ' €' : '—'
const fmtPct = v => v != null ? `${Number(v).toFixed(1)}%` : '—'

function Section({ title, children }) {
  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:10, fontWeight:500, color:'#C8A96E', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ display:'inline-block', width:16, height:1, background:'linear-gradient(90deg,#C8A96E,transparent)' }} />
        {title}
      </div>
      {children}
    </div>
  )
}

export function StructuredResponse({ data }) {
  if (!data) return null
  const { restaurant, periode, contexte, kpis, charts, alertes, tables, charges_exploitation } = data

  return (
    <div style={{ marginTop:6 }}>
      {(restaurant || periode) && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
          {restaurant && <span style={{ fontSize:12, fontWeight:500, padding:'3px 12px', borderRadius:20, background:'rgba(200,169,110,0.1)', color:'#C8A96E', border:'1px solid rgba(200,169,110,0.2)' }}>{restaurant}</span>}
          {periode && <span style={{ fontSize:12, padding:'3px 12px', borderRadius:20, color:'#6B6A72', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>{periode}</span>}
        </div>
      )}

      {contexte && <div style={{ fontSize:12, color:'#6B6A72', padding:'8px 12px', background:'rgba(255,255,255,0.03)', borderRadius:8, marginBottom:8, lineHeight:1.6, borderLeft:'2px solid rgba(200,169,110,0.2)' }}>{contexte}</div>}

      {alertes?.length > 0 && <Alerts alerts={alertes} />}

      {kpis?.length > 0 && <Section title="Indicateurs clés"><KpiGrid kpis={kpis} /></Section>}

      {charts && (
        <Section title="Graphiques">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))', gap:8 }}>
            {charts.ca && <CaChart data={charts.ca} />}
            {charts.marges && <MargeWaterfall data={charts.marges} />}
            {(charts.food != null && charts.no_food != null) && <FoodPieChart food={charts.food} noFood={charts.no_food} />}
            {charts.horaires && <HoraireChart data={charts.horaires} />}
          </div>
        </Section>
      )}

      {charges_exploitation?.rows?.length > 0 && (
        <Section title="Charges d'exploitation">
          <DataTable
            columns={[
              { key:'categorie', label:'Catégorie' },
              { key:'fournisseur', label:'Fournisseur' },
              { key:'nb_factures', label:'Fact.', align:'right' },
              { key:'total_ht', label:'Total HT', align:'right', format: fmtEur },
              { key:'pct', label:'% total', align:'right', format: fmtPct }
            ]}
            rows={charges_exploitation.rows}
            defaultSort="total_ht"
          />
          {charges_exploitation.total_ht != null && (
            <div style={{ fontSize:12, color:'#6B6A72', marginTop:4, textAlign:'right' }}>
              Total : <strong style={{ color:'#C8A96E' }}>{fmtEur(charges_exploitation.total_ht)}</strong>
              {charges_exploitation.pct_ca != null && ` · ${fmtPct(charges_exploitation.pct_ca)} du CA`}
            </div>
          )}
        </Section>
      )}

      {tables?.serveurs?.length > 0 && (
        <Section title="Détail par serveur">
          <DataTable
            columns={[
              { key:'nom', label:'Serveur' },
              { key:'ca', label:'CA HT', align:'right', format: fmtEur },
              { key:'tickets', label:'Tickets', align:'right' },
              { key:'couverts', label:'Couverts', align:'right' },
              { key:'panier', label:'Panier', align:'right', format: fmtEur },
              { key:'marge_pct', label:'Marge', align:'right', format: fmtPct }
            ]}
            rows={tables.serveurs}
            defaultSort="ca"
          />
        </Section>
      )}

      {tables?.articles?.length > 0 && (
        <Section title="Top articles">
          <DataTable
            columns={[
              { key:'nom', label:'Article' },
              { key:'famille', label:'Famille' },
              { key:'quantite', label:'Qté', align:'right' },
              { key:'ca', label:'CA HT', align:'right', format: fmtEur },
              { key:'marge_pct', label:'Marge', align:'right', format: fmtPct }
            ]}
            rows={tables.articles}
            defaultSort="ca"
          />
        </Section>
      )}

      {tables?.out?.length > 0 && (
        <Section title="Tickets out">
          <DataTable
            columns={[
              { key:'type', label:'Type' },
              { key:'montant', label:'Montant', align:'right', format: fmtEur },
              { key:'pct', label:'% out', align:'right', format: fmtPct }
            ]}
            rows={tables.out}
            defaultSort="montant"
          />
        </Section>
      )}
    </div>
  )
}
