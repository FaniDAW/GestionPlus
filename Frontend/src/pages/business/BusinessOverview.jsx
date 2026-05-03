import { useEffect, useState } from 'react'
import api from '../../lib/api'

const statCards = [
  {
    key: 'total_customers',
    label: 'Clientes',
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
    key: 'total_points_issued',
    label: 'Puntos emitidos',
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
    key: 'total_points_redeemed',
    label: 'Puntos canjeados',
    color: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-200',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    key: 'active_rewards',
    label: 'Recompensas activas',
    color: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-200',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
]

export default function BusinessOverview() {
  const [business, setBusiness] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get('/my-business')
      .then((res) => setBusiness(res.data))
      .catch((err) => { if (err.response?.status === 404) setNotFound(true) })
      .finally(() => setLoading(false))
  }, [])

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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        {loading ? (
          <div className="h-7 bg-slate-100 rounded-lg animate-pulse w-48 mb-2" />
        ) : (
          <h1 className="text-2xl font-extrabold text-slate-800">{business?.name}</h1>
        )}
        <p className="text-slate-500 text-sm mt-1">Resumen de actividad de tu negocio</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.key} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg ${card.shadow} flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div>
              {loading ? (
                <div className="w-10 h-7 bg-slate-100 rounded-lg animate-pulse mb-1" />
              ) : (
                <p className="text-3xl font-extrabold text-slate-800 leading-none">
                  {business?.stats?.[card.key] ?? 0}
                </p>
              )}
              <p className="text-slate-500 text-sm mt-1 font-medium">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
