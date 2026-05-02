import { useEffect, useState } from 'react'
import api from '../../lib/api'

const statusConfig = {
  active:    { label: 'Activa',    classes: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  expired:   { label: 'Expirada',  classes: 'bg-red-100 text-red-600',         dot: 'bg-red-500' },
  cancelled: { label: 'Cancelada', classes: 'bg-slate-100 text-slate-500',     dot: 'bg-slate-400' },
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isExpired(sub) {
  return sub.status !== 'active' || (sub.ends_at && new Date(sub.ends_at) < new Date())
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/subscriptions')
      .then((res) => setSubscriptions(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Suscripciones</h1>
        <p className="text-slate-500 text-sm mt-1">Historial de todas las suscripciones de la plataforma</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Negocio</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Inicio</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vencimiento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No hay suscripciones registradas
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => {
                const expired = isExpired(sub)
                const status = expired && sub.status === 'active' ? 'expired' : sub.status
                const cfg = statusConfig[status] ?? statusConfig.expired

                return (
                  <tr
                    key={sub.id}
                    className={`transition-colors ${expired ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-violet-50/40'}`}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {sub.business?.name ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                        {sub.plan_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {Number(sub.price).toFixed(2)} €
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(sub.starts_at)}</td>
                    <td className={`px-6 py-4 font-medium ${expired ? 'text-red-500' : 'text-slate-500'}`}>
                      {formatDate(sub.ends_at)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
