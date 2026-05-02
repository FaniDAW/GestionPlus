import { useEffect, useState } from 'react'
import api from '../../lib/api'
import ConfirmDialog from '../../components/ConfirmDialog'

const roleBadge = {
  admin:          'bg-violet-100 text-violet-700',
  business_owner: 'bg-blue-100 text-blue-700',
  customer:       'bg-emerald-100 text-emerald-700',
}

const roleLabel = {
  admin:          'Admin',
  business_owner: 'Negocio',
  customer:       'Cliente',
}

export default function AdminUsers() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [confirm, setConfirm]   = useState(null) // { user }
  const [toggling, setToggling] = useState(null) // id

  useEffect(() => {
    api.get('/users')
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async () => {
    const u = confirm.user
    setConfirm(null)
    setToggling(u.id)
    try {
      const res = await api.patch(`/users/${u.id}`, { is_active: !u.is_active })
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, is_active: res.data.is_active } : x))
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Usuarios</h1>
        <p className="text-slate-500 text-sm mt-1">Listado de todos los usuarios registrados</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-28" />
                    </td>
                  ))}
                  <td className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl animate-pulse w-20" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className={`transition-colors ${u.is_active === false ? 'bg-slate-50/80' : 'hover:bg-violet-50/40'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        u.is_active === false
                          ? 'bg-slate-200'
                          : 'bg-gradient-to-br from-violet-400 to-pink-400'
                      }`}>
                        <span className={`font-bold text-xs ${u.is_active === false ? 'text-slate-400' : 'text-white'}`}>
                          {u.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className={`font-semibold ${u.is_active === false ? 'text-slate-400' : 'text-slate-800'}`}>
                        {u.name}
                      </span>
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
                      u.is_active === false
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.is_active === false ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                      {u.is_active === false ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      disabled={toggling === u.id}
                      onClick={() => setConfirm({ user: u })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 ${
                        u.is_active === false
                          ? 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      {toggling === u.id ? '...' : u.is_active === false ? 'Activar' : 'Desactivar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirm}
        danger={confirm?.user?.is_active !== false}
        title={confirm?.user?.is_active === false ? 'Activar usuario' : 'Desactivar usuario'}
        message={
          confirm?.user?.is_active === false
            ? `¿Activar la cuenta de "${confirm?.user?.name}"?`
            : `¿Desactivar la cuenta de "${confirm?.user?.name}"? No podrá acceder a la plataforma.`
        }
        confirmLabel={confirm?.user?.is_active === false ? 'Activar' : 'Desactivar'}
        onConfirm={handleToggle}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
