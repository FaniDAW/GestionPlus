import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function BusinessDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-violet-100 border border-violet-50 p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-200">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
          ¡Bienvenido, {user?.name}!
        </h1>
        <p className="text-slate-500 mb-8">Tu panel de negocio estará disponible próximamente.</p>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
