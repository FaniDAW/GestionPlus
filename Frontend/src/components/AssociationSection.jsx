export default function AssociationSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-violet-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Para asociaciones y ayuntamientos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">
            Une a tus comercios.{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Fideliza la zona.
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Gestion+ permite a asociaciones de empresarios y ayuntamientos crear un programa de
            fidelización compartido para todos los comercios del grupo. Un solo saldo de puntos,
            válido en toda la red.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
              color: 'from-violet-500 to-violet-600',
              shadow: 'shadow-violet-200',
              title: 'Puntos compartidos entre negocios',
              body: 'El cliente acumula puntos en cualquier comercio de la asociación y los canjea donde quiera. Un monedero único que fideliza a toda la zona, no solo a un negocio.',
            },
            {
              icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              color: 'from-emerald-500 to-teal-500',
              shadow: 'shadow-emerald-200',
              title: 'Panel propio para la asociación',
              body: 'La asociación tiene su propio dashboard: ve estadísticas del grupo, gestiona qué negocios pertenecen a la red y crea ofertas visibles para todos los clientes del grupo.',
            },
            {
              icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              color: 'from-pink-500 to-rose-500',
              shadow: 'shadow-pink-200',
              title: 'Precio por volumen, no por negocio',
              body: 'Una sola suscripción cubre a todos los negocios del grupo. Cuantos más comercios, menor es el coste por negocio. Los planes de asociación arrancan desde 149 €/mes para hasta 20 negocios.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 hover:-translate-y-1 transition-transform duration-300">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg ${item.shadow} flex items-center justify-center mb-6`}>
                {item.icon}
              </div>
              <h3 className="text-base font-extrabold text-slate-800 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* Comparison strip */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">

            {/* Individual */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="font-extrabold text-slate-800">Negocio individual</p>
                  <p className="text-xs text-slate-400">Un negocio, sus propios clientes</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {[
                  'Programa de puntos propio',
                  'Recompensas y ofertas individuales',
                  'Dashboard de actividad',
                  'Suscripción desde 29 €/mes',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-violet-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Asociación */}
            <div className="p-8 bg-gradient-to-br from-violet-50/50 to-pink-50/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-extrabold text-slate-800">Asociación o ayuntamiento</p>
                  <p className="text-xs text-slate-400">Toda la red de comercios, un solo plan</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {[
                  'Puntos compartidos entre todos los negocios',
                  'Panel de gestión para la asociación',
                  'Ofertas visibles a toda la red de clientes',
                  'Hasta ilimitados negocios según plan',
                  'Desde 149 €/mes para hasta 20 negocios',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
