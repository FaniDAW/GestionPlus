export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              Plataforma de fidelización #1 para PYMEs
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
              Convierte clientes{' '}
              <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                ocasionales
              </span>{' '}
              en fans de tu marca
            </h1>

            <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Crea programas de puntos, recompensas y suscripciones personalizadas. Aumenta la retención y
              el ticket medio de tu negocio en semanas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#"
                className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-violet-200 transition-all text-center"
              >
                Empieza gratis — 14 días
              </a>
              <a
                href="#cómo-funciona"
                className="flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-8 py-4 rounded-2xl border border-slate-200 hover:border-violet-300 hover:text-violet-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ver demo
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {['bg-violet-400', 'bg-pink-400', 'bg-sky-400', 'bg-emerald-400'].map((color, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-700">+2.400</span> negocios confían en Gestion+
              </p>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl shadow-violet-100 p-6 border border-violet-50">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Panel de control</p>
                    <h3 className="text-sm font-bold text-slate-700">Café La Esquina</h3>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">F</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Clientes', value: '1.248', color: 'bg-violet-50 text-violet-700', icon: '👥' },
                    { label: 'Puntos entregados', value: '48.3K', color: 'bg-pink-50 text-pink-700', icon: '⭐' },
                    { label: 'Canjes hoy', value: '34', color: 'bg-emerald-50 text-emerald-700', icon: '🎁' },
                  ].map((stat) => (
                    <div key={stat.label} className={`${stat.color} rounded-2xl p-3`}>
                      <p className="text-lg mb-1">{stat.icon}</p>
                      <p className="text-sm font-bold">{stat.value}</p>
                      <p className="text-xs opacity-70 leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bars */}
                <div className="space-y-3 mb-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recompensas activas</p>
                  {[
                    { name: 'Café gratis', pct: 78, color: 'bg-violet-400' },
                    { name: 'Descuento 20%', pct: 54, color: 'bg-pink-400' },
                    { name: 'Postre gratis', pct: 31, color: 'bg-sky-400' },
                  ].map((r) => (
                    <div key={r.name}>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{r.name}</span>
                        <span>{r.pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Actividad reciente</p>
                  {[
                    { name: 'Ana García', action: '+50 puntos', time: 'hace 2 min', dot: 'bg-emerald-400' },
                    { name: 'Luis Pérez', action: 'Canjeo café', time: 'hace 8 min', dot: 'bg-pink-400' },
                    { name: 'María López', action: '+80 puntos', time: 'hace 15 min', dot: 'bg-violet-400' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3 text-xs">
                      <div className={`w-2 h-2 rounded-full ${item.dot} shrink-0`} />
                      <span className="font-medium text-slate-700 flex-1">{item.name}</span>
                      <span className="text-slate-500">{item.action}</span>
                      <span className="text-slate-400">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg shadow-pink-100 border border-pink-100 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-lg">🚀</div>
                <div>
                  <p className="text-xs font-bold text-slate-700">+23% retención</p>
                  <p className="text-xs text-slate-400">este mes</p>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg shadow-violet-100 border border-violet-100 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-lg">⭐</div>
                <div>
                  <p className="text-xs font-bold text-slate-700">4.9 / 5.0</p>
                  <p className="text-xs text-slate-400">satisfacción</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
