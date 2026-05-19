import { useEffect, useState } from 'react'
import api from '../../lib/api'
import ConfirmDialog from '../../components/ConfirmDialog'

const subStatusConfig = {
  active:    { label: 'Activa',    classes: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  expired:   { label: 'Expirada',  classes: 'bg-red-100 text-red-600',         dot: 'bg-red-500' },
  cancelled: { label: 'Cancelada', classes: 'bg-slate-100 text-slate-500',     dot: 'bg-slate-400' },
}

function getSubStatus(sub) {
  if (!sub) return null
  if (sub.status !== 'active') return sub.status
  if (sub.ends_at && new Date(sub.ends_at) < new Date()) return 'expired'
  return 'active'
}

export default function AdminBusinesses() {
  const [businesses, setBusinesses]   = useState([])
  const [subsByBiz, setSubsByBiz]     = useState({})
  const [loading, setLoading]         = useState(true)
  const [confirm, setConfirm]         = useState(null) // { biz }
  const [toggling, setToggling]       = useState(null) // id

  useEffect(() => {
    Promise.all([api.get('/businesses'), api.get('/subscriptions')])
      .then(([bizRes, subRes]) => {
        setBusinesses(bizRes.data)
        // Indexar la suscripción más reciente por business_id
        const map = {}
        subRes.data.forEach((s) => {
          const prev = map[s.business_id]
          if (!prev || new Date(s.created_at) > new Date(prev.created_at)) {
            map[s.business_id] = s
          }
        })
        setSubsByBiz(map)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async () => {
    const biz = confirm.biz
    setConfirm(null)
    setToggling(biz.id)
    try {
      const res = await api.patch(`/businesses/${biz.id}`, { is_active: !biz.is_active })
      setBusinesses((prev) => prev.map((b) => b.id === biz.id ? { ...b, is_active: res.data.is_active } : b))
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Negocios</h1>
        <p className="text-slate-500 text-sm mt-1">Listado de todos los negocios registrados</p>
      </div>

      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Suscripción</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Negocio</th>
              <th className="px-6 py-4" />
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
                  <td className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl animate-pulse w-24" /></td>
                </tr>
              ))
            ) : businesses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No hay negocios registrados
                </td>
              </tr>
            ) : (
              businesses.map((biz) => {
                const sub = subsByBiz[biz.id] ?? null
                const subStatus = getSubStatus(sub)
                const cfg = subStatus ? subStatusConfig[subStatus] : null

                return (
                  <tr key={biz.id} className="hover:bg-violet-50/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{biz.name}</td>
                    <td className="px-6 py-4 text-slate-500">{biz.email}</td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      {sub ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                          {sub.plan_name}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Sin plan</span>
                      )}
                    </td>

                    {/* Estado suscripción */}
                    <td className="px-6 py-4">
                      {cfg ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* is_active del negocio */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        biz.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${biz.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {biz.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* Acción */}
                    <td className="px-6 py-4 text-right">
                      <button
                        disabled={toggling === biz.id}
                        onClick={() => setConfirm({ biz })}
                        title={biz.is_active ? 'Desactivar negocio' : 'Activar negocio'}
                        className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${
                          biz.is_active
                            ? 'text-emerald-500 hover:bg-red-50 hover:text-red-500'
                            : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      >
                        {toggling === biz.id ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : biz.is_active ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
              <div className="h-8 bg-slate-100 rounded-xl w-full" />
            </div>
          ))
        ) : businesses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-12 text-center">
            <p className="text-slate-400 text-sm">No hay negocios registrados</p>
          </div>
        ) : (
          businesses.map((biz) => {
            const sub = subsByBiz[biz.id] ?? null
            const subStatus = getSubStatus(sub)
            const cfg = subStatus ? subStatusConfig[subStatus] : null
            return (
              <div key={biz.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{biz.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{biz.email}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                    biz.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${biz.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {biz.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {sub ? (
                    <span className="inline-flex px-2.5 py-1 rounded-full font-semibold bg-violet-100 text-violet-700">
                      {sub.plan_name}
                    </span>
                  ) : (
                    <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-400">Sin plan</span>
                  )}
                  {cfg && (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold ${cfg.classes}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  )}
                </div>
                <div className="pt-1 border-t border-slate-100 flex justify-end">
                  <button
                    disabled={toggling === biz.id}
                    onClick={() => setConfirm({ biz })}
                    title={biz.is_active ? 'Desactivar negocio' : 'Activar negocio'}
                    className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${
                      biz.is_active
                        ? 'text-emerald-500 hover:bg-red-50 hover:text-red-500'
                        : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    {toggling === biz.id ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : biz.is_active ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <ConfirmDialog
        open={!!confirm}
        danger={confirm?.biz?.is_active}
        title={confirm?.biz?.is_active ? 'Desactivar negocio' : 'Activar negocio'}
        message={
          confirm?.biz?.is_active
            ? `¿Desactivar "${confirm?.biz?.name}"? El negocio dejará de estar operativo.`
            : `¿Activar "${confirm?.biz?.name}"? El negocio volverá a estar operativo.`
        }
        confirmLabel={confirm?.biz?.is_active ? 'Desactivar' : 'Activar'}
        onConfirm={handleToggle}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
