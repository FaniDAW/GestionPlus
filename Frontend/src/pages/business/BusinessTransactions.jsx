import { useEffect, useState } from 'react'
import api from '../../lib/api'

const typeConfig = {
  earn:   { label: 'Acumulación', classes: 'bg-emerald-100 text-emerald-700' },
  redeem: { label: 'Canje',       classes: 'bg-violet-100 text-violet-700' },
  refund: { label: 'Reembolso',   classes: 'bg-amber-100 text-amber-700' },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function BusinessTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    api.get('/transactions')
      .then((res) => setTransactions(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Transacciones</h1>
        <p className="text-slate-500 text-sm mt-1">Historial de movimientos de puntos de tu negocio</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Puntos</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Importe</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No hay transacciones registradas
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const cfg = typeConfig[tx.type] ?? { label: tx.type, classes: 'bg-slate-100 text-slate-500' }
                return (
                  <tr key={tx.id} className="hover:bg-violet-50/40 transition-colors">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatDate(tx.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center shrink-0">
                          <span className="text-white font-bold text-xs">{tx.user?.name?.[0]?.toUpperCase()}</span>
                        </div>
                        <span className="text-slate-700 font-medium">{tx.user?.name ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-800">
                      {tx.type === 'redeem' ? `-${tx.points}` : `+${tx.points}`}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">
                      {tx.amount != null ? `${Number(tx.amount).toFixed(2)} €` : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{tx.description ?? '—'}</td>
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
