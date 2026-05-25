import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import api from '../../lib/api'

const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function getLast6Months() {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: MONTHS_ES[d.getMonth()],
    }
  })
}

const STAT_CARDS = [
  {
    key: 'total_customers',
    label: 'Total clientes',
    source: 'business',
    color: 'from-violet-500 to-violet-600',
    shadow: 'shadow-violet-200',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'this_month_points',
    label: 'Puntos emitidos este mes',
    source: 'stats',
    color: 'from-pink-500 to-rose-500',
    shadow: 'shadow-pink-200',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    key: 'this_month_redemptions',
    label: 'Canjes este mes',
    source: 'stats',
    color: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-200',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
]

const RANK_STYLES = [
  { bar: 'from-amber-400 to-orange-400', label: '1°' },
  { bar: 'from-slate-400 to-slate-500',  label: '2°' },
  { bar: 'from-orange-300 to-amber-300', label: '3°' },
]

export default function BusinessOverview() {
  const [business, setBusiness]   = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)

  useEffect(() => {
    api.get('/my-business')
      .then(async (bizRes) => {
        setBusiness(bizRes.data)
        try {
          const statsRes = await api.get('/my-business/stats')
          setStatsData(statsRes.data)
        } catch { /* degraded gracefully — show zeros */ }
      })
      .catch((err) => { if (err.response?.status === 404) setNotFound(true) })
      .finally(() => setLoading(false))
  }, [])

  const months = getLast6Months()
  const chartData = months.map((m) => ({
    month: m.label,
    puntos: Number(statsData?.monthly_points?.find((mp) => mp.month === m.key)?.total_points ?? 0),
  }))

  const getStatValue = (card) => {
    const raw = card.source === 'business'
      ? business?.stats?.[card.key]
      : statsData?.[card.key]
    return Number(raw ?? 0)
  }

  if (!loading && notFound) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </div>
          <h2 className="text-lg font-extrabold text-slate-800 mb-2">Sin negocio registrado</h2>
          <p className="text-slate-500 text-sm">Completa tu registro para activar tu panel de negocio.</p>
        </div>
      </div>
    )
  }

  const topRewards = statsData?.top_rewards ?? []
  const maxCount   = topRewards[0]?.count ?? 1

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        {loading ? (
          <div className="h-7 bg-slate-100 rounded-lg animate-pulse w-48 mb-2" />
        ) : (
          <h1 className="text-2xl font-extrabold text-slate-800">{business?.name}</h1>
        )}
        <p className="text-slate-500 text-sm mt-1">Resumen de actividad de tu negocio</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg ${card.shadow} flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div>
              {loading ? (
                <div className="w-10 h-7 bg-slate-100 rounded-lg animate-pulse mb-1" />
              ) : (
                <p className="text-3xl font-extrabold text-slate-800 leading-none">
                  {getStatValue(card).toLocaleString()}
                </p>
              )}
              <p className="text-slate-500 text-sm mt-1 font-medium">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Top Rewards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-6">Puntos emitidos — últimos 6 meses</h2>
          {loading ? (
            <div className="h-52 bg-slate-100 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={208}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#c4b5fd" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                    padding: '10px 14px',
                  }}
                  labelStyle={{ color: '#1e293b', fontWeight: 700, marginBottom: 2 }}
                  itemStyle={{ color: '#7c3aed' }}
                  formatter={(value) => [`${Number(value).toLocaleString()} pts`, 'Puntos']}
                  cursor={{ fill: '#f5f3ff' }}
                />
                <Bar dataKey="puntos" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={52} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top rewards */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-6">Top recompensas canjeadas</h2>

          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : topRewards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">Sin canjes registrados</p>
            </div>
          ) : (
            <div className="space-y-5">
              {topRewards.map((reward, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${RANK_STYLES[i].bar} flex items-center justify-center shrink-0 shadow-sm`}>
                    <span className="text-xs font-extrabold text-white">{RANK_STYLES[i].label}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{reward.name}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${RANK_STYLES[i].bar} rounded-full transition-all duration-500`}
                          style={{ width: `${(reward.count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500 shrink-0 tabular-nums">
                        {reward.count}x
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
