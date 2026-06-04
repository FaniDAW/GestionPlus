import Button from './ui/Button'
import AnimateOnScroll from './AnimateOnScroll'
import dashboardImg from '../assets/dashboard_cliente.png'
import appMovilImg from '../assets/APPmovil.jpg'

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

          {/* Foto app móvil */}
          <AnimateOnScroll from="zoom" delay={0.2} className="flex-1 w-full flex justify-center">
            <div className="relative w-80 sm:w-96 lg:w-[28rem] rotate-2 hover:-translate-y-2 hover:rotate-0 transition-transform duration-300">
              <div className="rounded-3xl shadow-2xl shadow-violet-100 border border-violet-50 overflow-hidden">
                <img
                  src={appMovilImg}
                  alt="App Gestion+ en móvil"
                  className="w-full"
                />
              </div>

              {/* Badge recompensa */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg shadow-violet-100 border border-violet-100 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 text-violet-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Café gratis</p>
                  <p className="text-xs text-slate-400">¡canjeado!</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
