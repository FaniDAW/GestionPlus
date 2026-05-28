import Button from './ui/Button'
import AnimateOnScroll from './AnimateOnScroll'
import dashboardImg from '../assets/dashboard_cliente.png'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-linear-to-br from-violet-50 via-white to-pink-50">
      {/* Manchas de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Texto */}
          <AnimateOnScroll from="left" className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              Para negocios individuales y asociaciones de comerciantes
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
              Fideliza clientes —{' '}
              <span className="bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                solo o en red
              </span>
            </h1>

            <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Tanto si tienes un negocio como si gestionas una asociación de comerciantes o un municipio,
              Gestion+ te da el programa de puntos, ofertas y recompensas que necesitas para retener
              clientes y dinamizar el comercio local.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button to="/register">Empieza gratis — 14 días</Button>

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
                <span className="font-bold text-slate-700">+2.400</span> negocios y asociaciones confían en Gestion+
              </p>
            </div>
          </AnimateOnScroll>

          {/* Maqueta del panel */}
          <AnimateOnScroll from="zoom" delay={0.2} className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              <div className="rounded-3xl shadow-2xl shadow-violet-100 border border-violet-50 overflow-hidden">
                <img
                  src={dashboardImg}
                  alt="Panel de cliente Gestion+"
                  className="w-full object-contain"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg shadow-pink-100 border border-pink-100 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">+23% retención</p>
                  <p className="text-xs text-slate-400">este mes</p>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg shadow-violet-100 border border-violet-100 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">4.9 / 5.0</p>
                  <p className="text-xs text-slate-400">satisfacción</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
