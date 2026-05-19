import { useEffect, useState } from 'react'
import api from '../../lib/api'
import ConfirmDialog from '../../components/ConfirmDialog'

// ─── Modal: añadir negocio existente ────────────────────────────────────────

function AddExistingModal({ group, onClose, onAdded }) {
  const [available, setAvailable]   = useState([])
  const [loadingAvail, setLoadingAvail] = useState(true)
  const [search, setSearch]         = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [adding, setAdding]         = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    api.get('/my-group/available-businesses')
      .then((res) => setAvailable(res.data))
      .finally(() => setLoadingAvail(false))
  }, [])

  const current = group?.businesses?.length ?? 0
  const max     = group?.max_businesses ?? null
  const atLimit = max !== null && current >= max
  const pct     = max ? Math.min(Math.round((current / max) * 100), 100) : 0
  const barColor = pct >= 100 ? 'bg-red-400' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-400'

  const filtered = available.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async () => {
    if (!selectedId || atLimit) return
    setAdding(true)
    setError('')
    try {
      await api.post('/my-group/businesses', { business_id: selectedId })
      onAdded()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al añadir el negocio.')
      setAdding(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">Añadir negocio existente</h2>
            <p className="text-xs text-slate-400 mt-0.5">Negocios registrados que aún no pertenecen a ningún grupo</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Limit bar */}
        <div className="px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-slate-600">Capacidad del plan</span>
            <span className={`font-bold tabular-nums ${atLimit ? 'text-red-500' : 'text-slate-700'}`}>
              {current} / {max ?? '∞'}
            </span>
          </div>
          {max !== null && (
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
          )}
          {atLimit && (
            <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Has alcanzado el límite de tu plan. Actualiza la suscripción para añadir más.
            </p>
          )}
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-slate-100 shrink-0">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={atLimit}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2 min-h-0">
          {loadingAvail ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-400 text-sm">
                {available.length === 0
                  ? 'No hay negocios sin grupo disponibles.'
                  : 'Ningún negocio coincide con la búsqueda.'}
              </p>
            </div>
          ) : (
            filtered.map((biz) => {
              const isSelected = selectedId === biz.id
              return (
                <button
                  key={biz.id}
                  type="button"
                  disabled={atLimit}
                  onClick={() => setSelectedId(isSelected ? null : biz.id)}
                  className={`w-full text-left rounded-2xl border-2 px-4 py-3.5 transition-all ${
                    isSelected ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                  } ${atLimit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{biz.name}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {[biz.email, biz.address].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pt-4 pb-6 border-t border-slate-100 shrink-0">
          {error && <p className="text-xs text-red-500 font-medium text-center mb-3">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedId || adding || atLimit}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {adding ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Vinculando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Añadir al grupo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sección invitación ──────────────────────────────────────────────────────

function InviteSection({ group, onTokenGenerated }) {
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied]         = useState(false)

  const inviteUrl = group?.invitation_token
    ? `${window.location.origin}/register?token=${group.invitation_token}`
    : null

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await api.post('/my-group/invitation')
      onTokenGenerated()
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!inviteUrl) return
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-800">Invitar negocio nuevo</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparte el enlace para que nuevos negocios se registren directamente en tu asociación
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-2 rounded-xl transition-all disabled:opacity-50"
        >
          {generating ? (
            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {inviteUrl ? 'Regenerar' : 'Generar enlace'}
        </button>
      </div>

      {inviteUrl ? (
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 font-mono truncate">
            {inviteUrl}
          </div>
          <button
            onClick={handleCopy}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                ¡Copiado!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar
              </>
            )}
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">
          Genera un enlace para invitar a nuevos negocios. El enlace se puede regenerar en cualquier momento.
        </p>
      )}
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function AssociationBusinesses() {
  const [group, setGroup]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleteBiz, setDeleteBiz] = useState(null)
  const [toggling, setToggling]   = useState(null)

  const loadGroup = () => {
    setLoading(true)
    api.get('/my-group')
      .then((res) => setGroup(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadGroup() }, [])

  const handleToggle = async (biz) => {
    setToggling(biz.id)
    try {
      const res = await api.patch(`/my-group/businesses/${biz.id}`)
      setGroup((prev) => ({
        ...prev,
        businesses: prev.businesses.map((b) => b.id === biz.id ? res.data : b),
      }))
    } finally {
      setToggling(null)
    }
  }

  const handleRemove = async () => {
    await api.delete(`/my-group/businesses/${deleteBiz.id}`)
    setGroup((prev) => ({
      ...prev,
      businesses: prev.businesses.filter((b) => b.id !== deleteBiz.id),
    }))
    setDeleteBiz(null)
  }

  const businesses = group?.businesses ?? []
  const max        = group?.max_businesses ?? null
  const atLimit    = max !== null && businesses.length >= max

  return (
    <div className="p-4 md:p-8 space-y-6">
      {showModal && (
        <AddExistingModal
          group={group}
          onClose={() => setShowModal(false)}
          onAdded={() => { setShowModal(false); loadGroup() }}
        />
      )}

      <ConfirmDialog
        open={!!deleteBiz}
        danger
        title="Eliminar negocio de la asociación"
        message={`¿Eliminar "${deleteBiz?.name}" de la asociación? El negocio no se eliminará del sistema, solo dejará de pertenecer a este grupo.`}
        confirmLabel="Eliminar"
        onConfirm={handleRemove}
        onCancel={() => setDeleteBiz(null)}
      />

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Negocios asociados</h1>
          <p className="text-slate-500 text-sm mt-1">
            {group?.name ?? 'Tu asociación'}
            {max !== null && !loading && (
              <span className={`ml-2 font-semibold ${atLimit ? 'text-red-500' : 'text-emerald-600'}`}>
                · {businesses.length}/{max} negocios
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Sección 1: Invitar negocio nuevo */}
      {loading ? (
        <div className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />
      ) : (
        <InviteSection group={group} onTokenGenerated={loadGroup} />
      )}

      {/* Sección 2: Negocios en la asociación */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-700">Añadir negocio existente</h2>
          <button
            onClick={() => setShowModal(true)}
            disabled={loading || atLimit}
            title={atLimit ? 'Límite de negocios alcanzado — actualiza tu plan' : ''}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Añadir negocio existente
          </button>
        </div>

        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Negocio</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Propietario</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teléfono</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3.5" />
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
                  <td className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl animate-pulse w-16" /></td>
                </tr>
              ))
            ) : businesses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">No hay negocios en esta asociación todavía.</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Genera un enlace de invitación o añade un negocio existente.
                  </p>
                </td>
              </tr>
            ) : (
              businesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-emerald-50/30 transition-colors">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(biz)}
                        disabled={toggling === biz.id}
                        title={biz.is_active ? 'Desactivar negocio' : 'Activar negocio'}
                        className={`p-1.5 rounded-lg transition-all ${
                          biz.is_active
                            ? 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        } disabled:opacity-40`}
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
                      <button
                        onClick={() => setDeleteBiz(biz)}
                        title="Eliminar de la asociación"
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

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 space-y-2 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
            ))
          ) : businesses.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-slate-400 text-sm">No hay negocios en esta asociación todavía.</p>
              <p className="text-slate-400 text-xs mt-1">Genera un enlace de invitación o añade un negocio existente.</p>
            </div>
          ) : (
            businesses.map((biz) => (
              <div key={biz.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{biz.name}</p>
                    {biz.address && <p className="text-xs text-slate-400 mt-0.5">{biz.address}</p>}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                    biz.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${biz.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {biz.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  {biz.owner?.name && <span>Propietario: {biz.owner.name}</span>}
                  {biz.email && <span>{biz.email}</span>}
                  {biz.phone && <span>{biz.phone}</span>}
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleToggle(biz)}
                    disabled={toggling === biz.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      biz.is_active
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    } disabled:opacity-40`}
                  >
                    {biz.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => setDeleteBiz(biz)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
