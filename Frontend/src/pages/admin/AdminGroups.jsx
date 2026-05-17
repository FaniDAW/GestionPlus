import { useEffect, useState } from 'react'
import api from '../../lib/api'
import ConfirmDialog from '../../components/ConfirmDialog'

const TYPE_LABELS = {
  association: 'Asociación',
  municipal:   'Municipal',
}

function GroupFormModal({ group, onSave, onClose }) {
  const [form, setForm] = useState({
    name:          group?.name          ?? '',
    type:          group?.type          ?? 'association',
    description:   group?.description   ?? '',
    contact_email: group?.contact_email ?? '',
    contact_phone: group?.contact_phone ?? '',
    address:       group?.address       ?? '',
    is_active:     group?.is_active     ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-800">
            {group ? 'Editar asociación' : 'Nueva asociación'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre</label>
              <input required value={form.name} onChange={set('name')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo</label>
              <select value={form.type} onChange={set('type')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white">
                <option value="association">Asociación</option>
                <option value="municipal">Municipal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Teléfono</label>
              <input value={form.contact_phone} onChange={set('contact_phone')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email de contacto</label>
              <input type="email" value={form.contact_email} onChange={set('contact_email')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dirección</label>
              <input value={form.address} onChange={set('address')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Descripción</label>
              <textarea value={form.description} onChange={set('description')} rows={2}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={set('is_active')} className="w-4 h-4 rounded accent-violet-500" />
            <span className="text-sm font-medium text-slate-700">Asociación activa</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-60">
              {saving ? 'Guardando...' : group ? 'Guardar cambios' : 'Crear asociación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminGroups() {
  const [groups, setGroups]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [formGroup, setFormGroup]       = useState(undefined)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    api.get('/groups')
      .then((res) => setGroups(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (payload) => {
    if (formGroup?.id) {
      const res = await api.patch(`/groups/${formGroup.id}`, payload)
      setGroups((prev) => prev.map((g) => g.id === formGroup.id ? res.data : g))
    } else {
      const res = await api.post('/groups', payload)
      setGroups((prev) => [...prev, res.data])
    }
    setFormGroup(undefined)
  }

  const handleDelete = async () => {
    await api.delete(`/groups/${deleteTarget.id}`)
    setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Asociaciones</h1>
          <p className="text-slate-500 text-sm mt-1">Gestión de grupos, asociaciones y municipios</p>
        </div>
        <button
          onClick={() => setFormGroup(null)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva asociación
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Negocios</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded-lg animate-pulse w-24" /></td>
                  ))}
                  <td className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl animate-pulse w-20" /></td>
                </tr>
              ))
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <p className="text-slate-400 text-sm">No hay asociaciones registradas.</p>
                </td>
              </tr>
            ) : (
              groups.map((group) => (
                <tr key={group.id} className="hover:bg-violet-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{group.name}</p>
                    {group.address && <p className="text-xs text-slate-400 mt-0.5">{group.address}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      group.type === 'municipal' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {TYPE_LABELS[group.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {group.businesses?.length ?? 0}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {group.contact_email ?? '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      group.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${group.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {group.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setFormGroup(group)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => setDeleteTarget(group)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
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

      {formGroup !== undefined && (
        <GroupFormModal group={formGroup} onSave={handleSave} onClose={() => setFormGroup(undefined)} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        danger
        title="Eliminar asociación"
        message={`¿Eliminar "${deleteTarget?.name}"? Se eliminarán todos sus datos asociados.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
