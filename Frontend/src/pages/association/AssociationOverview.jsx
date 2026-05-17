import { useEffect, useState } from 'react'
import api from '../../lib/api'

const statCards = [
  {
    key: 'total_businesses',
    label: 'Negocios asociados',
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
    key: 'total_customers',
    label: 'Clientes del grupo',
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
    key: 'total_points_issued',
    label: 'Puntos emitidos',
    color: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-200',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    key: 'active_offers',
    label: 'Ofertas activas',
    color: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-200',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
]

export default function AssociationOverview() {
  const [group, setGroup]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/my-group')
      .then((res) => setGroup(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        {loading ? (
          <div className="h-7 bg-slate-100 rounded-lg animate-pulse w-56 mb-2" />
        ) : (
          <h1 className="text-2xl font-extrabold text-slate-800">{group?.name}</h1>
        )}
        <p className="text-slate-500 text-sm mt-1">
          {group?.type === 'municipal' ? 'Asociación municipal' : 'Asociación de empresarios'}
        </p>
      </div>

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
                  {group?.stats?.[card.key] ?? 0}
                </p>
              )}
              <p className="text-slate-500 text-sm mt-1 font-medium">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info del grupo */}
      {!loading && group && (
        <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-4">Información del grupo</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {group.contact_email && (
              <div>
                <dt className="text-slate-400 font-medium mb-0.5">Email de contacto</dt>
                <dd className="text-slate-700 font-semibold">{group.contact_email}</dd>
              </div>
            )}
            {group.contact_phone && (
              <div>
                <dt className="text-slate-400 font-medium mb-0.5">Teléfono</dt>
                <dd className="text-slate-700 font-semibold">{group.contact_phone}</dd>
              </div>
            )}
            {group.address && (
              <div>
                <dt className="text-slate-400 font-medium mb-0.5">Dirección</dt>
                <dd className="text-slate-700 font-semibold">{group.address}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  )
}
