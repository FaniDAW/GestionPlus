import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

function useCountUp(target, duration, started) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!started) return
    let raf
    const startTime = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, target, duration])
  return value
}

function BusinessMockup() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const c1 = useCountUp(1248, 1400, started)
  const c2 = useCountUp(48,   1200, started)
  const c3 = useCountUp(34,   1000, started)

  const stats = [
    {
      label: 'Clientes',
      display: c1.toLocaleString('de-DE'),
      color: 'bg-violet-50 text-violet-600',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      label: 'Pts emitidos',
      display: `${c2}K`,
      color: 'bg-pink-50 text-pink-600',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    },
    {
      label: 'Canjes',
      display: `${c3}`,
      color: 'bg-emerald-50 text-emerald-600',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ]

  const bars = [
    { name: 'Café gratis',   pts: '100 pts', pct: 78, color: 'bg-violet-400' },
    { name: 'Descuento 20%', pts: '200 pts', pct: 54, color: 'bg-pink-400'   },
    { name: 'Postre gratis', pts: '150 pts', pct: 31, color: 'bg-emerald-400' },
  ]

  return (
    <div ref={ref} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">Café La Esquina</p>
            <p className="text-xs text-slate-400">Panel negocio</p>
          </div>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-600 font-semibold px-2.5 py-1 rounded-full">Activo</span>
      </div>

      {/* Stats animados */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-3`}>
            <span className="mb-1 block">{s.icon}</span>
            <p className="text-sm font-bold tabular-nums">{s.display}</p>
            <p className="text-xs opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Barras animadas */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Recompensas activas</p>
        {bars.map((r) => (
          <div key={r.name}>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className="font-medium">{r.name}</span>
              <span className="text-slate-400">{r.pts}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${r.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: started ? `${r.pct}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const individualPlans = [
  {
    id: 'individual',
    name: 'Individual',
    monthlyPrice: 29,
    annualPrice: 23,
    description: 'Para un negocio suelto que quiere fidelizar a sus clientes',
    badge: null,
    highlight: false,
    features: [
      'Un negocio',
      'Clientes ilimitados',
      'Programa de puntos propio',
      'Recompensas y ofertas individuales',
      'Dashboard de actividad',
      'Soporte por email',
    ],
  },
]

const groupPlans = [
  {
    id: 'association_s',
    name: 'Asociación S',
    monthlyPrice: 149,
    annualPrice: 119,
    description: 'Hasta 20 negocios',
    badge: null,
    highlight: false,
    features: [
      'Hasta 20 negocios',
      'Puntos compartidos entre negocios',
      'Panel de gestión para la asociación',
      'Ofertas de grupo para toda la red',
      'Estadísticas del grupo',
      'Soporte prioritario',
    ],
  },
  {
    id: 'association_m',
    name: 'Asociación M',
    monthlyPrice: 249,
    annualPrice: 199,
    description: 'Hasta 50 negocios',
    badge: 'Más popular',
    highlight: true,
    features: [
      'Hasta 50 negocios',
      'Todo lo del plan S',
      'Segmentación de clientes',
      'Campañas de puntos por temporada',
      'Exportación de datos',
      'Manager de cuenta dedicado',
    ],
  },
  {
    id: null,
    name: 'Municipal',
    monthlyPrice: 499,
    annualPrice: 399,
    description: 'Negocios ilimitados',
    badge: null,
    highlight: false,
    features: [
      'Negocios ilimitados',
      'Todo lo del plan M',
      'Integración con webs municipales',
      'Branding personalizado',
      'API acceso completo',
      'SLA garantizado',
    ],
  },
]

function PlanCard({ plan, annual, onCta, loading }) {
  const price = annual ? plan.annualPrice : plan.monthlyPrice

  return (
    <div className={`relative rounded-3xl border-2 p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
      plan.highlight
        ? 'border-violet-400 shadow-2xl shadow-violet-100 bg-white'
        : 'border-slate-200 bg-white'
    }`}>
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold px-5 py-1.5 rounded-full whitespace-nowrap">
          {plan.badge}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{plan.name}</h3>
        <p className="text-sm text-slate-500">{plan.description}</p>
      </div>

      <div className="mb-8">
        <span className="text-5xl font-black text-slate-800">€{price}</span>
        <span className="text-slate-400 text-sm ml-2">/mes</span>
        {annual && (
          <p className="text-xs text-emerald-600 font-medium mt-1">
            Facturado anualmente (€{price * 12}/año)
          </p>
        )}
      </div>

      <button
        onClick={() => onCta(plan)}
        disabled={loading}
        className={`w-full font-bold py-3 rounded-2xl transition-all mb-8 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          plan.highlight
            ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-lg hover:shadow-violet-200'
            : 'bg-slate-800 hover:bg-slate-700 text-white'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redirigiendo...
          </>
        ) : plan.id ? 'Empezar prueba gratis' : 'Hablar con ventas'}
      </button>

      <ul className="space-y-3 mt-auto">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
            <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Pricing() {
  const [annual, setAnnual]           = useState(false)
  const [loadingPlan, setLoadingPlan] = useState(null)
  const { user }  = useAuth()
  const navigate  = useNavigate()

  const handleCta = async (plan) => {
    if (!plan.id) { navigate('/contact'); return }
    if (!user)    { navigate('/register'); return }

    setLoadingPlan(plan.id)
    try {
      const res = await api.post('/stripe/checkout', { plan: plan.id })
      window.location.href = res.data.checkout_url
    } catch {
      setLoadingPlan(null)
    }
  }

  return (
    <section id="precios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Precios
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">
            Simple y{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              transparente
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg mb-8">
            Sin comisiones ocultas. Cancela cuando quieras.
          </p>

          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-2xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${!annual ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              Mensual
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${annual ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
            >
              Anual
              <span className="ml-2 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        {/* — Para negocios — */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Para negocios</span>
            </div>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Plan card */}
            <div>
              {individualPlans.map((plan) => (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  annual={annual}
                  onCta={handleCta}
                  loading={loadingPlan === plan.id}
                />
              ))}
            </div>

            {/* Mockup negocio animado */}
            <BusinessMockup />
          </div>
        </div>

        {/* — Para asociaciones y ayuntamientos — */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Para asociaciones y ayuntamientos</span>
            </div>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {groupPlans.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                annual={annual}
                onCta={handleCta}
                loading={loadingPlan === plan.id}
              />
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-12">
          Todos los planes incluyen 14 días de prueba gratuita. No se requiere tarjeta de crédito.
        </p>
      </div>
    </section>
  )
}
