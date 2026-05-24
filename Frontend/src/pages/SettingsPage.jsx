import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../lib/roles'
import api from '../lib/api'

const ROLE_LABEL = {
  customer:          'Cliente',
  business_owner:    'Propietario de negocio',
  association_admin: 'Administrador de asociación',
  admin:             'Administrador',
}

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmText, setConfirmText]         = useState('')
  const [deleting, setDeleting]               = useState(false)
  const [deleteError, setDeleteError]         = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const handleDelete = async () => {
    if (confirmText !== 'CONFIRMAR') return
    setDeleting(true)
    setDeleteError('')
    try {
      await api.delete('/user')
      // Clear local auth state and redirect home
      localStorage.removeItem('token')
      await logout()
      navigate('/', { replace: true })
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Error al eliminar la cuenta. Inténtalo de nuevo.')
      setDeleting(false)
    }
  }

  const dashboardPath = getDashboardPath(user?.role)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to={dashboardPath}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
            title="Volver al panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800">Configuración</h1>
            <p className="text-xs text-slate-400">Gestiona tu cuenta</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Perfil */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wide mb-4">Tu cuenta</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
              <span className="text-violet-600 font-black text-xl">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-bold text-slate-800 text-base">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <span className="inline-block mt-1.5 text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full">
                {ROLE_LABEL[user?.role] ?? user?.role}
              </span>
            </div>
          </div>
        </section>

        {/* Zona de peligro */}
        <section className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-sm font-extrabold text-red-600 uppercase tracking-wide">Zona de peligro</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Al eliminar tu cuenta se borrarán permanentemente todos tus datos
            {(user?.role === 'business_owner' || user?.role === 'association_admin') &&
              ' y se cancelará tu suscripción activa'}.
            Esta acción no se puede deshacer.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all border border-red-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar mi cuenta
          </button>
        </section>
      </main>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !deleting) setShowDeleteModal(false) }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-lg font-extrabold text-slate-800 text-center mb-2">
              ¿Eliminar tu cuenta?
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              Esta acción es <strong>irreversible</strong>. Se eliminarán todos tus datos
              {(user?.role === 'business_owner' || user?.role === 'association_admin') &&
                ' y se cancelará tu suscripción'}.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Escribe <span className="font-black text-red-600">CONFIRMAR</span> para continuar
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="CONFIRMAR"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all"
              />
            </div>

            {deleteError && (
              <p className="mb-4 text-xs text-red-500 font-medium text-center">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowDeleteModal(false); setConfirmText(''); setDeleteError('') }}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={confirmText !== 'CONFIRMAR' || deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Eliminando...
                  </>
                ) : 'Eliminar cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
