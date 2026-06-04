import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'

const fmtEur = v => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(v) + ' €'
const fmtPct = v => `${Number(v).toFixed(1)}%`

const GOLD = '#C8A96E'
const GOLD2 = '#8B6340'
const RED = '#F87171'
const GREEN = '#4ADE80'
const AMBER = '#FBBF24'
const MUTED = '#3A3A42'

const tooltipStyle = { fontSize: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#1E1E24', color: '#F2F0E8' }

function ChartCard({ title, children }) {
  return (
    <div style={{ background:'#1E1E24', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:14 }}>
      <div style={{ fontSize:10, fontWeight:500, color:'#6B6A72', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:12 }}>{title}</div>
      {children}
    </div>
  )
}

export function CaChart({ data }) {
  if (!data?.length) return null
  return (
    <ChartCard title="Évolution CA HT">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top:4, right:4, left:0, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize:10, fill:'#6B6A72' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize:10, fill:'#6B6A72' }} axisLine={false} tickLine={false} width={32} />
          <Tooltip formatter={fmtEur} contentStyle={tooltipStyle} />
          <Bar dataKey="ca" radius={[4,4,0,0]} fill={GOLD} />
          {data[0]?.objectif != null && <Bar dataKey="objectif" radius={[4,4,0,0]} fill="rgba(200,169,110,0.15)" stroke="rgba(200,169,110,0.3)" strokeWidth={1} />}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function MargeWaterfall({ data }) {
  if (!data?.length) return null
  return (
    <ChartCard title="Décomposition des marges">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ top:0, right:8, left:0, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis type="number" tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize:10, fill:'#6B6A72' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" tick={{ fontSize:10, fill:'#9897A0' }} axisLine={false} tickLine={false} width={150} />
          <Tooltip formatter={fmtEur} contentStyle={tooltipStyle} />
          <Bar dataKey="value" radius={[0,4,4,0]}>
            {data.map((d, i) => <Cell key={i} fill={d.color==='green' ? GREEN : d.color==='red' ? RED : d.color==='amber' ? AMBER : GOLD} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function FoodPieChart({ food, noFood }) {
  if (food == null || noFood == null) return null
  const data = [{ name:'Food', value: food }, { name:'No Food', value: noFood }]
  const COLORS = [GOLD, GOLD2]
  return (
    <ChartCard title="Répartition Food / No Food">
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip formatter={fmtEur} contentStyle={tooltipStyle} />
          <Legend iconType="circle" iconSize={8} formatter={(v, e) => `${v} · ${fmtPct(e.payload.value / (food + noFood) * 100)}`} wrapperStyle={{ fontSize:11, color:'#9897A0' }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function HoraireChart({ data }) {
  if (!data?.length) return null
  return (
    <ChartCard title="CA par tranche horaire">
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top:4, right:4, left:0, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="heure" tick={{ fontSize:10, fill:'#6B6A72' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => `${v}`} tick={{ fontSize:10, fill:'#6B6A72' }} axisLine={false} tickLine={false} width={28} />
          <Tooltip formatter={fmtEur} contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="ca" stroke={GOLD} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
