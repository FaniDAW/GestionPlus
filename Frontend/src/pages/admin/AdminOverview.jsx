import { useEffect, useState } from 'react'
import api from '../../lib/api'

const statCards = [
  {
    key: 'businesses',
    label: 'Negocios',
    color: 'from-violet-500 to-violet-600',
    shadow: 'shadow-violet-200',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    key: 'users',
    label: 'Usuarios totales',
    color: 'from-pink-500 to-rose-500',
    shadow: 'shadow-pink-200',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'customers',
    label: 'Clientes',
    color: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-200',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function AdminOverview() {
  const [stats, setStats] = useState({ businesses: 0, users: 0, customers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/businesses'), api.get('/users')])
      .then(([bizRes, usersRes]) => {
        const users = usersRes.data
        setStats({
          businesses: bizRes.data.length,
          users: users.length,
          customers: users.filter((u) => u.role === 'customer').length,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general de la plataforma</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((card) => (
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
                <p className="text-3xl font-extrabold text-slate-800 leading-none">{stats[card.key]}</p>
              )}
              <p className="text-slate-500 text-sm mt-1 font-medium">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
