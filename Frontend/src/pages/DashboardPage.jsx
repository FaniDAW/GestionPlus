import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

function discountLabel(offer) {
  if (offer.discount_type === 'percentage') return `${offer.discount_value}% dto.`
  if (offer.discount_type === 'fixed') return `-${offer.discount_value} €`
  return `×${offer.discount_value} puntos`
}

function PointCard({ item }) {
  const isGroup = item.type === 'group'
  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          isGroup
            ? 'bg-gradient-to-br from-violet-500 to-pink-500'
            : 'bg-gradient-to-br from-pink-400 to-rose-400'
        }`}>
          {isGroup ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          )}
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isGroup ? 'bg-violet-100 text-violet-600' : 'bg-pink-100 text-pink-600'
        }`}>
          {isGroup ? 'Grupo' : 'Negocio'}
        </span>
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium truncate">{item.name}</p>
        <p className="text-3xl font-extrabold text-slate-800 leading-none mt-1">{item.balance}</p>
        <p className="text-xs text-slate-400 mt-1">puntos disponibles</p>
      </div>
      <div className="pt-2 border-t border-slate-50 flex justify-between text-xs text-slate-400">
        <span>Acumulados: <span className="font-semibold text-slate-600">{item.total_earned}</span></span>
        <span>Canjeados: <span className="font-semibold text-slate-600">{item.total_redeemed}</span></span>
      </div>
    </div>
  )
}

function OfferCard({ offer }) {
  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-pink-200 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shrink-0 shadow-sm shadow-pink-100">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-600 shrink-0">
          {discountLabel(offer)}
        </span>
      </div>
      <div>
        <p className="font-bold text-slate-800 leading-snug">{offer.title}</p>
        {offer.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{offer.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-50">
        <span>{offer.business?.name ?? offer.group?.name ?? 'Plataforma'}</span>
        {offer.ends_at && (
          <span>Hasta {new Date(offer.ends_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [points, setPoints]   = useState(null)
  const [offers, setOffers]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/my-points'),
      api.get('/offers'),
    ])
      .then(([ptRes, ofRes]) => {
        setPoints(ptRes.data)
        setOffers(ofRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Top bar */}
      <header className="bg-white border-b border-pink-100 shadow-sm shadow-pink-50/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center shadow-sm shadow-pink-200">
              <span className="text-white font-black text-sm">G</span>
            </div>
            <span className="font-extrabold text-slate-800 text-lg">Gestion+</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:bg-pink-50 hover:text-pink-600 text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Bienvenida + saldo total */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              ¡Hola, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-slate-500 text-sm mt-1">Aquí tienes tus puntos y las ofertas disponibles</p>
          </div>
          {!loading && points && (
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-6 py-4 rounded-2xl shadow-lg shadow-pink-200 text-center sm:text-right shrink-0">
              <p className="text-3xl font-extrabold leading-none">{points.total_balance}</p>
              <p className="text-pink-100 text-sm font-medium mt-1">puntos totales</p>
            </div>
          )}
        </div>

        {/* Mis puntos */}
        <section>
          <h2 className="text-base font-extrabold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-pink-500 to-rose-400 rounded-full inline-block" />
            Mis puntos
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-pink-100 p-5 h-36 animate-pulse" />
              ))}
            </div>
          ) : points?.points?.length === 0 ? (
            <div className="bg-white rounded-2xl border border-pink-100 p-10 text-center">
              <p className="text-slate-400 text-sm">Todavía no tienes puntos acumulados.</p>
              <p className="text-slate-400 text-xs mt-1">Visita los comercios asociados para empezar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {points?.points?.map((item, i) => <PointCard key={i} item={item} />)}
            </div>
          )}
        </section>

        {/* Ofertas activas */}
        <section>
          <h2 className="text-base font-extrabold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-pink-500 to-rose-400 rounded-full inline-block" />
            Ofertas disponibles
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-pink-100 p-5 h-36 animate-pulse" />
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-pink-100 p-10 text-center">
              <p className="text-slate-400 text-sm">No hay ofertas activas en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
