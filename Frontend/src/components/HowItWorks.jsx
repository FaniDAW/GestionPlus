import { Link } from 'react-router-dom'

const steps = [
  {
    number: '01',
    title: 'Crea tu programa',
    description: 'Registra tu negocio en minutos. Define tus reglas de puntos, recompensas y colores de marca.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    ringColor: 'border-violet-200',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    dotColor: 'bg-violet-500',
    light: 'bg-violet-50 border-violet-100',
  },
  {
    number: '02',
    title: 'Tus clientes participan',
    description: 'Comparten su número o escanean QR en cada compra. Acumulan puntos automáticamente, sin apps extra.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    ringColor: 'border-pink-200',
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-50',
    dotColor: 'bg-pink-500',
    light: 'bg-pink-50 border-pink-100',
  },
  {
    number: '03',
    title: 'Canjean y vuelven',
    description: 'Cuando acumulan suficientes puntos, canjean sus recompensas. Tú ves todo en tu dashboard.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    ringColor: 'border-emerald-200',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    dotColor: 'bg-emerald-500',
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

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-200 via-pink-200 to-emerald-200 mx-48" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className={`relative w-20 h-20 ${step.iconBg} ${step.ringColor} border-2 rounded-2xl flex items-center justify-center ${step.iconColor} mb-6 z-10`}>
                  {step.icon}
                  <span className={`absolute -top-2.5 -right-2.5 w-6 h-6 ${step.dotColor} rounded-full flex items-center justify-center text-xs font-black text-white`}>
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

        <div className="mt-16 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-violet-200 transition-all"
          >
            Empieza ahora gratis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
