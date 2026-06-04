import AnimateOnScroll from './AnimateOnScroll'

export default function AssociationSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-violet-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Encabezado */}
        <AnimateOnScroll from="bottom" className="text-center mb-16">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Para asociaciones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">
            Une a tus comercios.{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Fideliza la zona.
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Gestion+ permite a asociaciones de empresarios crear un programa de
            fidelización compartido para todos los comercios del grupo. Un solo saldo de puntos,
            válido en toda la red.
          </p>
        </AnimateOnScroll>

        {/* Feature cards */}
        <AnimateOnScroll from="zoom" className="grid md:grid-cols-3 gap-8">
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
              body: 'La asociación tiene su propio dashboard: ve un resumen de actividad del grupo, gestiona qué negocios pertenecen a la red y crea ofertas visibles para todos los clientes del grupo.',
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
              body: 'Una sola suscripción cubre todos los negocios del grupo. Cuantos más comercios, menor es el coste por negocio.',
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
        </AnimateOnScroll>


      </div>
    </section>
  )
}
