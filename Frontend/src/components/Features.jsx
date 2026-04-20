const features = [
  {
    icon: '⭐',
    title: 'Puntos inteligentes',
    description: 'Configura reglas de acumulación personalizadas: por compra, importe, frecuencia o fechas especiales.',
    color: 'from-violet-100 to-violet-50',
    iconBg: 'bg-violet-100',
    tag: 'bg-violet-100 text-violet-700',
    tagText: 'Más popular',
  },
  {
    icon: '🎁',
    title: 'Recompensas automáticas',
    description: 'Define catálogos de premios y déjalo en piloto automático. Tus clientes canjean cuando quieran.',
    color: 'from-pink-100 to-pink-50',
    iconBg: 'bg-pink-100',
    tag: null,
  },
  {
    icon: '📊',
    title: 'Analytics en tiempo real',
    description: 'Visualiza quiénes son tus mejores clientes, qué recompensas funcionan y cuándo vienen más.',
    color: 'from-sky-100 to-sky-50',
    iconBg: 'bg-sky-100',
    tag: null,
  },
  {
    icon: '💳',
    title: 'Suscripciones y membresías',
    description: 'Crea planes VIP con beneficios exclusivos. Genera ingresos recurrentes y clientes más fieles.',
    color: 'from-emerald-100 to-emerald-50',
    iconBg: 'bg-emerald-100',
    tag: null,
  },
  {
    icon: '🔔',
    title: 'Notificaciones automáticas',
    description: 'Envía recordatorios de puntos, ofertas especiales y cumpleaños para que vuelvan siempre.',
    color: 'from-amber-100 to-amber-50',
    iconBg: 'bg-amber-100',
    tag: null,
  },
  {
    icon: '🏪',
    title: 'Multi-negocio',
    description: 'Gestiona varias sucursales o marcas desde un solo panel. Todo sincronizado en tiempo real.',
    color: 'from-rose-100 to-rose-50',
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
              <div className={`w-12 h-12 ${f.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
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
