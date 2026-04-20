const steps = [
  {
    number: '01',
    title: 'Crea tu programa',
    description: 'Registra tu negocio en minutos. Define tus reglas de puntos, recompensas y colores de marca.',
    icon: '🏗️',
    color: 'bg-violet-500',
    light: 'bg-violet-50 border-violet-100',
  },
  {
    number: '02',
    title: 'Tus clientes participan',
    description: 'Comparten su número o escanean QR en cada compra. Acumulan puntos automáticamente, sin apps extra.',
    icon: '📱',
    color: 'bg-pink-500',
    light: 'bg-pink-50 border-pink-100',
  },
  {
    number: '03',
    title: 'Canjean y vuelven',
    description: 'Cuando acumulan suficientes puntos, canjean sus recompensas. Tú ves todo en tu dashboard.',
    icon: '🎉',
    color: 'bg-emerald-500',
    light: 'bg-emerald-50 border-emerald-100',
  },
]

export default function HowItWorks() {
  return (
    <section id="cómo-funciona" className="py-24 bg-gradient-to-br from-slate-50 to-violet-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Cómo funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">
            En marcha en{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              menos de 30 minutos
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Sin instalaciones, sin complicaciones. Solo configura y empieza a fidelizar.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-200 via-pink-200 to-emerald-200 mx-48" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                {/* Number bubble */}
                <div className={`relative w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg mb-6 z-10`}>
                  {step.icon}
                  <span className={`absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border-2 ${step.color.replace('bg-', 'border-')} flex items-center justify-center text-xs font-black text-slate-600`}>
                    {i + 1}
                  </span>
                </div>

                <div className={`${step.light} border rounded-3xl p-6 w-full`}>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-violet-200 transition-all"
          >
            Empieza ahora gratis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
