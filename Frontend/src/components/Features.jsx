const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: 'Puntos inteligentes',
    description: 'Configura reglas de acumulación personalizadas: por compra, importe, frecuencia o fechas especiales.',
    color: 'from-violet-100 to-violet-50',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-100',
    tag: 'bg-violet-100 text-violet-700',
    tagText: 'Más popular',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    title: 'Recompensas automáticas',
    description: 'Define catálogos de premios y déjalo en piloto automático. Tus clientes canjean cuando quieran.',
    color: 'from-pink-100 to-pink-50',
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-100',
    tag: null,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Analytics en tiempo real',
    description: 'Visualiza quiénes son tus mejores clientes, qué recompensas funcionan y cuándo vienen más.',
    color: 'from-sky-100 to-sky-50',
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-100',
    tag: null,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Suscripciones y membresías',
    description: 'Crea planes VIP con beneficios exclusivos. Genera ingresos recurrentes y clientes más fieles.',
    color: 'from-emerald-100 to-emerald-50',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    tag: null,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: 'Notificaciones automáticas',
    description: 'Envía recordatorios de puntos, ofertas especiales y cumpleaños para que vuelvan siempre.',
    color: 'from-amber-100 to-amber-50',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    tag: null,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Multi-negocio',
    description: 'Gestiona varias sucursales o marcas desde un solo panel. Todo sincronizado en tiempo real.',
    color: 'from-rose-100 to-rose-50',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-100',
    tag: null,
  },
]

export default function Features() {
  return (
    <section id="características" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Características
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">
            Todo lo que necesitas para{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              fidelizar
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Herramientas potentes, configuradas en minutos. Sin conocimientos técnicos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`relative bg-gradient-to-br ${f.color} rounded-3xl p-6 border border-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
            >
              {f.tag && (
                <span className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${f.tag}`}>
                  {f.tagText}
                </span>
              )}
              <div className={`w-12 h-12 ${f.iconBg} ${f.iconColor} rounded-2xl flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
