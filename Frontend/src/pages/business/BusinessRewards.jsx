import { useEffect, useState } from 'react'
import api from '../../lib/api'
import RewardFormModal from './RewardFormModal'
import ConfirmDialog from '../../components/ConfirmDialog'

function formatDate(dateStr) {
  if (!dateStr) return 'No expira'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function BusinessRewards() {
  const [rewards, setRewards]       = useState([])
  const [business, setBusiness]     = useState(null)
  const [loading, setLoading]       = useState(true)
  const [formReward, setFormReward] = useState(undefined) // undefined = closed, null = create, object = edit
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toggling, setToggling]     = useState(null)

  useEffect(() => {
    Promise.all([api.get('/rewards'), api.get('/my-business')])
      .then(([rwRes, bizRes]) => {
        setRewards(rwRes.data)
        setBusiness(bizRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (payload) => {
    if (formReward?.id) {
      const res = await api.patch(`/rewards/${formReward.id}`, payload)
      setRewards((prev) => prev.map((r) => r.id === formReward.id ? res.data : r))
    } else {
      const res = await api.post('/rewards', payload)
      setRewards((prev) => [...prev, res.data])
    }
    setFormReward(undefined)
  }

  const handleToggle = async (reward) => {
    setToggling(reward.id)
    try {
      const res = await api.patch(`/rewards/${reward.id}`, { is_active: !reward.is_active })
      setRewards((prev) => prev.map((r) => r.id === reward.id ? res.data : r))
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async () => {
    await api.delete(`/rewards/${deleteTarget.id}`)
    setRewards((prev) => prev.filter((r) => r.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Recompensas</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona las recompensas de tu programa de fidelización</p>
        </div>
        <button
          onClick={() => setFormReward(null)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva recompensa
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recompensa</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Puntos</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expira</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-24" />
                    </td>
                  ))}
                  <td className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl animate-pulse w-20" /></td>
                </tr>
              ))
            ) : rewards.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Aún no tienes recompensas. ¡Crea la primera!</p>
                </td>
              </tr>
            ) : (
              rewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-violet-50/40 transition-colors">
                  {/* Nombre + descripción */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{reward.name}</p>
                    {reward.description && (
                      <p className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{reward.description}</p>
                    )}
                  </td>

                  {/* Puntos */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
                      {reward.points_required} pts
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {reward.stock != null ? reward.stock : <span className="text-slate-400">∞</span>}
                  </td>

                  {/* Expira */}
                  <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(reward.expires_at)}</td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      reward.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${reward.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {reward.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={toggling === reward.id}
                        onClick={() => handleToggle(reward)}
                        title={reward.is_active ? 'Desactivar' : 'Activar'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all disabled:opacity-40"
                      >
                        {reward.is_active ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => setFormReward(reward)}
                        title="Editar"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(reward)}
                        title="Eliminar"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formReward !== undefined && (
        <RewardFormModal
          reward={formReward}
          businessId={business?.id}
          onSave={handleSave}
          onClose={() => setFormReward(undefined)}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        danger
        title="Eliminar recompensa"
        message={`¿Eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
