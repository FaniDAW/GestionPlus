import { useState } from 'react'

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 29,
    annualPrice: 23,
    description: 'Para negocios que empiezan a fidelizar',
    color: 'border-slate-200',
    button: 'bg-slate-800 hover:bg-slate-700 text-white',
    badge: null,
    features: [
      'Hasta 500 clientes',
      'Programa de puntos básico',
      '3 tipos de recompensas',
      'Dashboard básico',
      'Soporte por email',
    ],
    missing: ['Suscripciones y membresías', 'Multi-negocio', 'API acceso'],
  },
  {
    name: 'Pro',
    monthlyPrice: 79,
    annualPrice: 63,
    description: 'El favorito de las PYMEs en crecimiento',
    color: 'border-violet-400 shadow-2xl shadow-violet-100',
    button: 'bg-gradient-to-r from-violet-500 to-pink-500 hover:shadow-lg hover:shadow-violet-200 text-white',
    badge: 'Más popular',
    features: [
      'Clientes ilimitados',
      'Puntos + reglas avanzadas',
      'Recompensas ilimitadas',
      'Suscripciones y membresías',
      'Analytics avanzado',
      'Notificaciones automáticas',
      'Soporte prioritario',
    ],
    missing: ['Multi-negocio', 'API acceso'],
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    annualPrice: null,
    description: 'Para cadenas, franquicias y grandes marcas',
    color: 'border-slate-200',
    button: 'bg-slate-800 hover:bg-slate-700 text-white',
    badge: null,
    features: [
      'Todo lo del plan Pro',
      'Multi-negocio ilimitado',
      'API acceso completo',
      'Integración POS / eCommerce',
      'Manager dedicado',
      'SLA garantizado',
    ],
    missing: [],
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="precios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
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

          {/* Toggle */}
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

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border-2 ${plan.color} p-8 transition-all duration-300 hover:-translate-y-1`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold px-5 py-1.5 rounded-full">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-lg font-bold text-slate-800 mb-1">{plan.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{plan.description}</p>

              <div className="mb-8">
                {plan.monthlyPrice ? (
                  <>
                    <span className="text-5xl font-black text-slate-800">
                      €{annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-400 text-sm ml-2">/mes</span>
                    {annual && (
                      <p className="text-xs text-emerald-600 font-medium mt-1">
                        Facturado anualmente (€{plan.annualPrice * 12}/año)
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-3xl font-black text-slate-800">Contactar</span>
                )}
              </div>

              <a
                href="#"
                className={`block w-full text-center font-bold py-3 rounded-2xl transition-all mb-8 ${plan.button}`}
              >
                {plan.monthlyPrice ? 'Empezar prueba gratis' : 'Hablar con ventas'}
              </a>

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-400">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-10">
          Todos los planes incluyen 14 días de prueba gratuita. No se requiere tarjeta de crédito.
        </p>
      </div>
    </section>
  )
}
