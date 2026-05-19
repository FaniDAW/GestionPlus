import { useCallback, useEffect, useState } from 'react'
import api from '../../lib/api'
import QrScanner from '../../components/QrScanner'

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 rounded-full border-4 border-violet-300 border-t-violet-600 animate-spin" />
    </div>
  )
}

function CustomerAvatar({ name }) {
  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-200 shrink-0">
      <span className="text-white font-black text-xl">{name?.[0]?.toUpperCase()}</span>
    </div>
  )
}

function ValidateCodeSection() {
  const [code, setCode]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)   // { type, customer, meta, points_redeemed }
  const [error, setError]       = useState('')

  const handleValidate = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await api.post('/transactions/validate-code', { code: code.trim() })
      setResult(res.data)
      setCode('')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al validar el código.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Validar código de canje
      </h3>

      <form onSubmit={handleValidate} className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); setResult(null) }}
          placeholder="XXXX-XXXX"
          maxLength={9}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono tracking-widest uppercase outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-md hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : 'Validar'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Código validado correctamente
          </div>
          <div className="text-sm text-slate-700 space-y-1">
            <p><span className="font-semibold text-slate-500">Cliente:</span> {result.customer.name}</p>
            {result.type === 'reward' && result.meta && (
              <>
                <p><span className="font-semibold text-slate-500">Recompensa:</span> {result.meta.name}</p>
                <p><span className="font-semibold text-slate-500">Puntos canjeados:</span> {result.points_redeemed}</p>
              </>
            )}
            {result.type === 'offer' && result.meta && (
              <p><span className="font-semibold text-slate-500">Oferta:</span> {result.meta.title}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Patrón de códigos de canje generados por el sistema (XXXX-XXXX, alfanumérico mayúsculas)
const REDEMPTION_RE = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/i

function ValidationResult({ result, onDismiss }) {
  const isReward = result.type === 'reward'
  const metaLine = isReward
    ? `${result.meta?.name ?? 'Recompensa'} · ${result.points_redeemed} pts`
    : result.meta?.title ?? 'Oferta'

  return (
    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-emerald-800 text-sm">Código validado</p>
          <p className="text-emerald-700 text-sm font-medium mt-0.5">{result.customer?.name}</p>
          <p className="text-emerald-600 text-xs mt-1 font-medium">
            {isReward ? '🎁' : '🎟️'} {metaLine}
          </p>
        </div>
        <button onClick={onDismiss} className="text-emerald-400 hover:text-emerald-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function BusinessScanner() {
  const [phase, setPhase]                 = useState('idle')   // idle | scanning | loading | found
  const [customer, setCustomer]           = useState(null)
  const [scanError, setScanError]         = useState('')
  const [assignPts, setAssignPts]         = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [successMsg, setSuccessMsg]       = useState('')
  const [actionError, setActionError]     = useState('')
  const [validationResult, setValidationResult] = useState(null)  // resultado de escanear QR de canje

  // Apagar cámara cuando el usuario cambia de pestaña
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPhase((p) => p === 'scanning' ? 'idle' : p)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const flash = (msg, isError = false) => {
    if (isError) { setActionError(msg); setTimeout(() => setActionError(''), 4000) }
    else         { setSuccessMsg(msg);  setTimeout(() => setSuccessMsg(''), 3500) }
  }

  const handleScan = useCallback(async (code) => {
    const normalized = code.trim().toUpperCase()

    // ── Código de canje (QR de recompensa o uso de oferta) ──
    if (REDEMPTION_RE.test(normalized)) {
      setPhase('loading')
      try {
        const res = await api.post('/transactions/validate-code', { code: normalized })
        setValidationResult(res.data)
        setPhase('idle')
      } catch (err) {
        setScanError(err.response?.data?.message || 'Código no válido o ya utilizado.')
        setPhase('idle')
      }
      return
    }

    // ── QR de cliente (UUID) ──
    setPhase('loading')
    setScanError('')
    try {
      const res = await api.get(`/qr/scan/${encodeURIComponent(code)}`)
      setCustomer(res.data)
      setPhase('found')
    } catch (err) {
      setScanError(err.response?.data?.message || 'Código QR no reconocido.')
      setPhase('idle')
    }
  }, [])

  const handleAssignPoints = async () => {
    const pts = parseInt(assignPts, 10)
    if (!pts || pts <= 0) return
    setActionLoading(true)
    try {
      await api.post('/points', {
        user_id:     customer.user.id,
        business_id: customer.business_id,
        points:      pts,
        type:        'earn',
      })
      setCustomer(prev => ({
        ...prev,
        points: { balance: prev.points.balance + pts },
      }))
      setAssignPts('')
      flash(`+${pts} puntos asignados a ${customer.user.name}.`)
    } catch (err) {
      flash(err.response?.data?.message || 'Error al asignar puntos.', true)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRedeem = async (reward) => {
    setActionLoading(true)
    try {
      await api.post('/points', {
        user_id:     customer.user.id,
        business_id: customer.business_id,
        points:      reward.points_required,
        type:        'redeem',
      })
      setCustomer(prev => ({
        ...prev,
        points: { balance: prev.points.balance - reward.points_required },
      }))
      flash(`"${reward.name}" canjeada correctamente.`)
    } catch (err) {
      flash(err.response?.data?.message || 'Saldo insuficiente.', true)
    } finally {
      setActionLoading(false)
    }
  }

  const reset = () => {
    setPhase('idle')
    setCustomer(null)
    setScanError('')
    setAssignPts('')
    setSuccessMsg('')
    setActionError('')
    setValidationResult(null)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Escanear cliente</h1>
        <p className="text-slate-400 text-sm mt-1">Lee el QR del cliente para gestionar sus puntos y recompensas.</p>
      </div>

      {/* Feedback messages */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-3.5 text-sm font-medium">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {successMsg}
        </div>
      )}
      {actionError && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-3.5 text-sm font-medium">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {actionError}
        </div>
      )}
      {scanError && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-3.5 text-sm font-medium">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {scanError}
        </div>
      )}

      {/* Resultado de validación tras escanear QR de canje */}
      {validationResult && (
        <div className="mb-6">
          <ValidationResult
            result={validationResult}
            onDismiss={() => setValidationResult(null)}
          />
        </div>
      )}

      {/* ── IDLE: prompt to start ── */}
      {phase === 'idle' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h2 className="text-lg font-extrabold text-slate-800 mb-2">Listo para escanear</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">
            Activa la cámara y acércala al código QR que el cliente tiene en su panel.
          </p>
          <button
            onClick={() => { setScanError(''); setPhase('scanning') }}
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold px-8 py-3.5 rounded-2xl hover:shadow-lg hover:shadow-violet-200 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Abrir escáner
          </button>
        </div>
      )}

      {/* ── SCANNING ── */}
      {phase === 'scanning' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-slate-700">Cámara activa</span>
            </div>
            <button
              onClick={reset}
              className="text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
          <QrScanner onScan={handleScan} />
        </div>
      )}

      {/* ── LOADING ── */}
      {phase === 'loading' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Spinner />
        </div>
      )}

      {/* ── Validar código manualmente ── */}
      {phase !== 'scanning' && (
        <div className="mt-6">
          <ValidateCodeSection />
        </div>
      )}

      {/* ── FOUND: customer info + actions ── */}
      {phase === 'found' && customer && (
        <div className="space-y-5">
          {/* Customer card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <CustomerAvatar name={customer.user.name} />
                <div>
                  <p className="font-extrabold text-slate-800 text-lg leading-tight">{customer.user.name}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{customer.user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-violet-600 tabular-nums">{customer.points.balance}</p>
                <p className="text-xs text-slate-400 font-medium">puntos</p>
              </div>
            </div>

            {/* Scan again */}
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-500 text-sm font-medium py-2.5 rounded-xl hover:border-violet-300 hover:text-violet-600 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Escanear otro cliente
            </button>
          </div>

          {/* Assign points */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Asignar puntos
            </h3>

            {/* Quick-add buttons */}
            <div className="flex gap-2 mb-4">
              {[10, 25, 50, 100].map((n) => (
                <button
                  key={n}
                  onClick={() => setAssignPts(String(n))}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    assignPts === String(n)
                      ? 'border-violet-400 bg-violet-50 text-violet-700'
                      : 'border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600'
                  }`}
                >
                  +{n}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="number"
                min="1"
                value={assignPts}
                onChange={(e) => setAssignPts(e.target.value)}
                placeholder="Cantidad personalizada"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 focus:bg-white transition-all"
              />
              <button
                onClick={handleAssignPoints}
                disabled={actionLoading || !assignPts || parseInt(assignPts) <= 0}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-md hover:shadow-violet-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {actionLoading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : 'Asignar'}
              </button>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Canjear recompensa
            </h3>

            {customer.rewards.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No hay recompensas activas para este negocio.</p>
            ) : (
              <div className="space-y-3">
                {customer.rewards.map((reward) => {
                  const canAfford = customer.points.balance >= reward.points_required
                  return (
                    <div
                      key={reward.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        canAfford ? 'border-slate-200 bg-slate-50' : 'border-slate-100 bg-slate-50 opacity-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{reward.name}</p>
                        {reward.description && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">{reward.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          canAfford ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {reward.points_required} pts
                        </span>
                        <button
                          onClick={() => handleRedeem(reward)}
                          disabled={!canAfford || actionLoading}
                          className="px-4 py-1.5 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold rounded-xl hover:shadow-md hover:shadow-violet-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Canjear
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
