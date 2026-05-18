import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import QRCode from 'qrcode'

function discountLabel(offer) {
  if (offer.discount_type === 'percentage') return `${offer.discount_value}% dto.`
  if (offer.discount_type === 'fixed') return `-${offer.discount_value} €`
  return `×${offer.discount_value} puntos`
}

// Genera QR en canvas a partir de un string
function RedemptionQR({ code }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, code, {
      width:  220,
      margin: 2,
      color:  { dark: '#3b0764', light: '#fdf4ff' },
    }).catch(() => {})
  }, [code])

  return (
    <canvas
      ref={canvasRef}
      className="rounded-2xl shadow-md shadow-violet-100"
    />
  )
}

function RedeemModal({ result, onClose }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(result.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const expiresLabel = result.expires_at
    ? new Date(result.expires_at).toLocaleString('es-ES', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : null

  const isReward = Boolean(result.reward)
  const title    = isReward ? result.reward.name : result.offer.title
  const subtitle = isReward
    ? `${result.reward.points_required} pts descontados · válido 24 h`
    : (() => {
        const o = result.offer
        const label = o.discount_type === 'percentage' ? `${o.discount_value}% dto.`
          : o.discount_type === 'fixed' ? `-${o.discount_value} €`
          : `×${o.discount_value} puntos`
        return `${label} · válido 48 h`
      })()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 flex flex-col items-center gap-5">

        {/* Header */}
        <div className="text-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md mx-auto mb-3 ${
            isReward ? 'bg-gradient-to-br from-violet-500 to-pink-500 shadow-violet-200'
                     : 'bg-gradient-to-br from-pink-400 to-rose-400 shadow-pink-200'
          }`}>
            {isReward ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {/* QR para recompensas / código para ofertas */}
        {isReward ? (
          <div className="flex flex-col items-center gap-3">
            <RedemptionQR code={result.code} />
            {/* Fallback alfanumérico */}
            <div className="flex items-center gap-2 bg-violet-50 rounded-xl px-4 py-2">
              <span className="text-xs text-violet-500 font-medium">Código alternativo:</span>
              <span className="font-mono font-black text-violet-700 tracking-widest text-sm">{result.code}</span>
            </div>
            <p className="text-xs text-slate-400 text-center">
              El negocio escanea el QR, o introduce el código manual si falla el escáner.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-full bg-pink-50 border-2 border-dashed border-pink-200 rounded-2xl py-8 px-4 text-center">
              <p className="font-mono text-4xl font-black text-pink-600 tracking-[0.3em]">{result.code}</p>
            </div>
            <p className="text-xs text-slate-400 text-center">
              Muestra este código al comerciante para aplicar el descuento.
            </p>
          </div>
        )}

        {expiresLabel && (
          <p className="text-xs text-slate-400">Expira: {expiresLabel}</p>
        )}

        <div className="flex gap-3 w-full">
          <button
            onClick={copy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            {copied ? (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>¡Copiado!</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copiar código</>
            )}
          </button>
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:shadow-lg transition-all ${
              isReward ? 'bg-gradient-to-r from-violet-500 to-pink-500 hover:shadow-violet-200'
                       : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:shadow-pink-200'
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
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

const SCOPE_BADGE = {
  individual: { label: '⭐ Solo para ti',  cls: 'bg-violet-100 text-violet-700' },
  group:      { label: '🏘️ Red comercial', cls: 'bg-emerald-100 text-emerald-700' },
  global:     { label: '🌐 Plataforma',    cls: 'bg-blue-100 text-blue-700' },
}

function OfferCard({ offer, onRedeem }) {
  const badge    = SCOPE_BADGE[offer.scope] ?? SCOPE_BADGE.individual
  const [busy, setBusy] = useState(false)

  const handleUse = async () => {
    setBusy(true)
    try {
      await onRedeem(offer)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative bg-white rounded-2xl border border-pink-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-pink-200 transition-all">
      {/* Scope badge — esquina superior derecha */}
      <span className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge.cls}`}>
        {badge.label}
      </span>

      <div className="flex items-start gap-3 pr-28">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shrink-0 shadow-sm shadow-pink-100">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-600 shrink-0 self-center">
          {discountLabel(offer)}
        </span>
      </div>
      <div className="flex-1">
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
      <button
        onClick={handleUse}
        disabled={busy}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold hover:shadow-md hover:shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? 'Generando...' : 'Usar oferta'}
      </button>
    </div>
  )
}

function QrSection() {
  const [qrSvg, setQrSvg]     = useState(null)
  const [qrError, setQrError] = useState(false)

  useEffect(() => {
    api.get('/me/qr', { responseType: 'text', headers: { Accept: 'image/svg+xml' } })
      .then((res) => setQrSvg(res.data))
      .catch(() => setQrError(true))
  }, [])

  const handleDownload = () => {
    if (!qrSvg) return
    const blob = new Blob([qrSvg], { type: 'image/svg+xml' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'mi-qr-gestion.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section>
      <h2 className="text-base font-extrabold text-slate-700 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-gradient-to-b from-pink-500 to-rose-400 rounded-full inline-block" />
        Mi QR
      </h2>

      <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-8">
        {/* QR visual */}
        <div className="shrink-0 flex flex-col items-center gap-4">
          <div className="w-[180px] h-[180px] rounded-2xl border-4 border-pink-100 bg-pink-50/50 flex items-center justify-center shadow-sm shadow-pink-100">
            {qrError ? (
              <p className="text-xs text-slate-400 text-center px-4">No se pudo cargar el QR</p>
            ) : qrSvg ? (
              <div
                className="p-1"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-pink-100 animate-pulse" />
            )}
          </div>

          <button
            onClick={handleDownload}
            disabled={!qrSvg}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar QR
          </button>
        </div>

        {/* Texto explicativo */}
        <div className="flex-1 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center mb-4 mx-auto sm:mx-0 shadow-sm shadow-pink-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 mb-2">
            Muestra este código en el negocio para acumular puntos
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            El comerciante escaneará tu QR en cada compra y los puntos se añadirán automáticamente a tu saldo.
            No necesitas ninguna app extra.
          </p>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            {[
              { icon: '🏪', text: 'Válido en todos los negocios adheridos' },
              { icon: '⚡', text: 'Los puntos se añaden al instante' },
            ].map((item) => (
              <span key={item.text} className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-700 text-xs font-medium px-3 py-1.5 rounded-full">
                <span>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function RewardCard({ reward, balance, onRedeem }) {
  const canAfford = balance >= reward.points_required
  const [busy, setBusy] = useState(false)

  const handleClaim = async () => {
    setBusy(true)
    try {
      await onRedeem(reward)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3 transition-all ${
      canAfford
        ? 'border-violet-100 hover:shadow-md hover:border-violet-200'
        : 'border-slate-100 opacity-60'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          canAfford ? 'bg-gradient-to-br from-violet-500 to-pink-500 shadow-violet-100'
                    : 'bg-slate-200'
        }`}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
          canAfford ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-400'
        }`}>
          {reward.points_required} pts
        </span>
      </div>
      <div className="flex-1">
        <p className="font-bold text-slate-800 leading-snug">{reward.name}</p>
        {reward.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{reward.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-50">
        <span>{reward.business?.name ?? ''}</span>
        {reward.expires_at && (
          <span>Hasta {new Date(reward.expires_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
        )}
      </div>
      <button
        onClick={handleClaim}
        disabled={!canAfford || busy}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold hover:shadow-md hover:shadow-violet-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {busy ? 'Canjeando...' : canAfford ? 'Canjear' : 'Puntos insuficientes'}
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [points, setPoints]           = useState(null)
  const [offers, setOffers]           = useState([])
  const [rewards, setRewards]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [redeemResult, setRedeemResult] = useState(null)  // modal data

  useEffect(() => {
    Promise.all([api.get('/me'), api.get('/offers')])
      .then(([meRes, ofRes]) => {
        const pts = {
          points:        meRes.data.points        ?? [],
          total_balance: meRes.data.total_balance ?? 0,
        }
        setPoints(pts)
        setOffers(ofRes.data)
        // Filtrar recompensas por el grupo del cliente para evitar mostrar
        // recompensas de negocios fuera de su red
        const groupId = pts.points.find((p) => p.type === 'group')?.group_id ?? null
        return api.get('/rewards', groupId ? { params: { group_id: groupId } } : {})
      })
      .then((rwRes) => setRewards(rwRes.data))
      .finally(() => setLoading(false))
  }, [])

  const handleRedeemReward = useCallback(async (reward) => {
    try {
      const res = await api.post('/transactions/redeem', {
        redeemable_type: 'reward',
        redeemable_id:   reward.id,
      })
      setRedeemResult(res.data)
    } catch (err) {
      // 409 = ya existe código activo; mostrarlo igual
      if (err.response?.status === 409) {
        setRedeemResult(err.response.data)
      }
    }
  }, [])

  const handleRedeemOffer = useCallback(async (offer) => {
    const res = await api.post('/transactions/redeem', {
      redeemable_type: 'offer',
      redeemable_id:   offer.id,
    })
    setRedeemResult(res.data)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {redeemResult && (
        <RedeemModal result={redeemResult} onClose={() => setRedeemResult(null)} />
      )}
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
          <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-6 py-4 rounded-2xl shadow-lg shadow-pink-200 text-center sm:text-right shrink-0">
            {loading ? (
              <div className="w-16 h-8 bg-white/20 rounded-lg animate-pulse mx-auto" />
            ) : (
              <p className="text-3xl font-extrabold leading-none">{points?.total_balance ?? 0}</p>
            )}
            <p className="text-pink-100 text-sm font-medium mt-1">puntos totales</p>
          </div>
        </div>

        {/* Mi QR */}
        <QrSection />

        {/* Mis puntos */}
        <section>
          <h2 className="text-base font-extrabold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-pink-500 to-rose-400 rounded-full inline-block" />
            Mis puntos
          </h2>

          {/* Banner de asociación */}
          {!loading && points?.points?.some((p) => p.type === 'group') && (
            <div className="mb-4 flex items-center gap-3 bg-violet-50 border border-violet-100 rounded-2xl px-5 py-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-700">Perteneces a la asociación</p>
                <p className="text-sm font-bold text-violet-900">
                  {points.points.find((p) => p.type === 'group')?.name}
                </p>
              </div>
              <span className="ml-auto text-xs text-violet-500 font-medium">Puntos compartidos</span>
            </div>
          )}

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
          ) : points?.points?.length === 1 ? (
            <PointCard item={points.points[0]} />
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
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} onRedeem={handleRedeemOffer} />
              ))}
            </div>
          )}
        </section>

        {/* Recompensas disponibles */}
        <section>
          <h2 className="text-base font-extrabold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-violet-500 to-pink-500 rounded-full inline-block" />
            Recompensas disponibles
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-violet-100 p-5 h-36 animate-pulse" />
              ))}
            </div>
          ) : rewards.length === 0 ? (
            <div className="bg-white rounded-2xl border border-violet-100 p-10 text-center">
              <p className="text-slate-400 text-sm">No hay recompensas disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  balance={points?.total_balance ?? 0}
                  onRedeem={handleRedeemReward}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
