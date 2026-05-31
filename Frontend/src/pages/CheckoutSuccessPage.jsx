import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../lib/roles'
import api from '../lib/api'

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const sessionId =
      searchParams.get('session_id') || localStorage.getItem('stripe_session_id')

    if (!sessionId) {
      navigate('/login', { replace: true })
      return
    }

    api.get(`/stripe/checkout/success?session_id=${encodeURIComponent(sessionId)}`)
      .then(async () => {
        localStorage.removeItem('stripe_session_id')
        const user = await refreshUser()
        navigate(getDashboardPath(user.role), { replace: true, state: { welcome: true } })
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al activar la suscripción.')
      })
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-violet-100 border border-violet-50 p-10 text-center max-w-md w-full">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 mb-2">Algo fue mal</h1>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-violet-600 font-semibold text-sm hover:underline"
          >
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-violet-100 border border-violet-50 p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-200">
          <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h1 className="text-xl font-extrabold text-slate-800 mb-2">Activando tu suscripción…</h1>
        <p className="text-slate-500 text-sm">Un momento, estamos configurando tu cuenta.</p>
      </div>
    </div>
  )
}
