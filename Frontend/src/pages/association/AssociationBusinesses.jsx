import { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function AssociationBusinesses() {
  const [group, setGroup]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/my-group')
      .then((res) => setGroup(res.data))
      .finally(() => setLoading(false))
  }, [])

  const businesses = group?.businesses ?? []

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Negocios asociados</h1>
          <p className="text-slate-500 text-sm mt-1">Negocios que forman parte de {group?.name ?? 'tu asociación'}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Negocio</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Propietario</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teléfono</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-28" />
                    </td>
                  ))}
                </tr>
              ))
            ) : businesses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">No hay negocios en esta asociación todavía.</p>
                </td>
              </tr>
            ) : (
              businesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-violet-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{biz.name}</p>
                    {biz.address && <p className="text-xs text-slate-400 mt-0.5">{biz.address}</p>}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{biz.owner?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-500">{biz.email}</td>
                  <td className="px-6 py-4 text-slate-500">{biz.phone ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      biz.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${biz.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {biz.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
