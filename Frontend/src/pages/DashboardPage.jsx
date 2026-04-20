import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
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
          <span className="text-3xl">🎉</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
          ¡Bienvenido, {user?.name}!
        </h1>
        <p className="text-slate-500 mb-8">Tu cuenta está activa. El dashboard completo estará aquí pronto.</p>
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
