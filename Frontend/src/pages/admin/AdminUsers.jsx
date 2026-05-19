import { useEffect, useState } from 'react'
import api from '../../lib/api'
import ConfirmDialog from '../../components/ConfirmDialog'

const roleBadge = {
  admin:            'bg-violet-100 text-violet-700',
  business_owner:   'bg-blue-100 text-blue-700',
  customer:         'bg-emerald-100 text-emerald-700',
  association_admin:'bg-amber-100 text-amber-700',
}

const roleLabel = {
  admin:            'Admin',
  business_owner:   'Negocio',
  customer:         'Cliente',
  association_admin:'Asociación',
}

const FILTERS = [
  { value: 'all',             label: 'Todos' },
  { value: 'customer',        label: 'Solo clientes' },
  { value: 'business_owner',  label: 'Solo negocios' },
  { value: 'association_admin', label: 'Solo asociaciones' },
  { value: 'admin',           label: 'Solo admins' },
]

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function CreateAdminModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await api.post('/users/admin', form)
      onCreated(res.data)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al crear el administrador.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-800">Crear administrador</h2>
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
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre</label>
            <input required value={form.name} onChange={set('name')}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <input required type="email" value={form.email} onChange={set('email')}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contraseña</label>
            <input required type="password" minLength={8} value={form.password} onChange={set('password')}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-60">
              {saving ? 'Creando...' : 'Crear admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const [users, setUsers]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [filter, setFilter]             = useState('all')
  const [confirmToggle, setConfirmToggle] = useState(null) // { user }
  const [confirmDelete, setConfirmDelete] = useState(null) // { user }
  const [toggling, setToggling]         = useState(null)   // id
  const [deleting, setDeleting]         = useState(null)   // id
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)

  useEffect(() => {
    api.get('/users')
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter)

  const handleToggle = async () => {
    const u = confirmToggle.user
    setConfirmToggle(null)
    setToggling(u.id)
    try {
      const res = await api.patch(`/users/${u.id}`, { is_active: !u.is_active })
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, is_active: res.data.is_active } : x))
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async () => {
    const u = confirmDelete.user
    setConfirmDelete(null)
    setDeleting(u.id)
    try {
      await api.delete(`/users/${u.id}`)
      setUsers((prev) => prev.filter((x) => x.id !== u.id))
    } finally {
      setDeleting(null)
    }
  }

  const handleCreated = (newUser) => {
    setUsers((prev) => [newUser, ...prev])
    setShowCreateAdmin(false)
  }

  const ToggleIcon = ({ u }) => {
    if (toggling === u.id) return <Spinner />
    if (u.is_active === false) {
      return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">Listado de todos los usuarios registrados</p>
        </div>
        <button
          onClick={() => setShowCreateAdmin(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear admin
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        {filter !== 'all' && (
          <span className="text-xs text-slate-400">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rol</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 4 }).map((__, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded-lg animate-pulse w-28" /></td>
                  ))}
                  <td className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl animate-pulse w-20" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No hay usuarios que coincidan con el filtro
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className={`transition-colors ${u.is_active === false ? 'bg-slate-50/80' : 'hover:bg-violet-50/40'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        u.is_active === false ? 'bg-slate-200' : 'bg-gradient-to-br from-violet-400 to-pink-400'
                      }`}>
                        <span className={`font-bold text-xs ${u.is_active === false ? 'text-slate-400' : 'text-white'}`}>
                          {u.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className={`font-semibold ${u.is_active === false ? 'text-slate-400' : 'text-slate-800'}`}>{u.name}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${u.is_active === false ? 'text-slate-400' : 'text-slate-500'}`}>{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.is_active === false ? 'bg-slate-100 text-slate-400' : (roleBadge[u.role] ?? 'bg-slate-100 text-slate-500')
                    }`}>
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.is_active === false ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.is_active === false ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                      {u.is_active === false ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        disabled={toggling === u.id}
                        onClick={() => setConfirmToggle({ user: u })}
                        title={u.is_active === false ? 'Activar usuario' : 'Desactivar usuario'}
                        className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${
                          u.is_active === false
                            ? 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                            : 'text-emerald-500 hover:bg-red-50 hover:text-red-500'
                        }`}
                      >
                        <ToggleIcon u={u} />
                      </button>
                      <button
                        disabled={deleting === u.id}
                        onClick={() => setConfirmDelete({ user: u })}
                        title="Eliminar usuario"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40"
                      >
                        {deleting === u.id ? <Spinner /> : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-12 text-center">
            <p className="text-slate-400 text-sm">No hay usuarios que coincidan con el filtro</p>
          </div>
        ) : (
          filtered.map((u) => (
            <div key={u.id} className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 ${u.is_active === false ? 'opacity-70' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    u.is_active === false ? 'bg-slate-200' : 'bg-gradient-to-br from-violet-400 to-pink-400'
                  }`}>
                    <span className={`font-bold text-xs ${u.is_active === false ? 'text-slate-400' : 'text-white'}`}>
                      {u.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm truncate ${u.is_active === false ? 'text-slate-400' : 'text-slate-800'}`}>{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                  u.is_active === false ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${u.is_active === false ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                  {u.is_active === false ? 'Inactivo' : 'Activo'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                  u.is_active === false ? 'bg-slate-100 text-slate-400' : (roleBadge[u.role] ?? 'bg-slate-100 text-slate-500')
                }`}>
                  {roleLabel[u.role] ?? u.role}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={toggling === u.id}
                    onClick={() => setConfirmToggle({ user: u })}
                    title={u.is_active === false ? 'Activar' : 'Desactivar'}
                    className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${
                      u.is_active === false
                        ? 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                        : 'text-emerald-500 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <ToggleIcon u={u} />
                  </button>
                  <button
                    disabled={deleting === u.id}
                    onClick={() => setConfirmDelete({ user: u })}
                    title="Eliminar usuario"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40"
                  >
                    {deleting === u.id ? <Spinner /> : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showCreateAdmin && (
        <CreateAdminModal onClose={() => setShowCreateAdmin(false)} onCreated={handleCreated} />
      )}

      <ConfirmDialog
        open={!!confirmToggle}
        danger={confirmToggle?.user?.is_active !== false}
        title={confirmToggle?.user?.is_active === false ? 'Activar usuario' : 'Desactivar usuario'}
        message={
          confirmToggle?.user?.is_active === false
            ? `¿Activar la cuenta de "${confirmToggle?.user?.name}"?`
            : `¿Desactivar la cuenta de "${confirmToggle?.user?.name}"? No podrá acceder a la plataforma.`
        }
        confirmLabel={confirmToggle?.user?.is_active === false ? 'Activar' : 'Desactivar'}
        onConfirm={handleToggle}
        onCancel={() => setConfirmToggle(null)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        danger
        title="Eliminar usuario"
        message={`¿Eliminar la cuenta de "${confirmDelete?.user?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
