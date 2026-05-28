import Button from './ui/Button'
import AnimateOnScroll from './AnimateOnScroll'

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <AnimateOnScroll from="zoom" className="relative bg-linear-to-br from-violet-600 to-pink-500 rounded-3xl p-12 text-center overflow-hidden">
          {/* Decorative favicons */}
          <img src="/favicon.svg" className="absolute -top-8 -left-8 w-48 h-48 opacity-10 rotate-45 pointer-events-none select-none" />
          <img src="/favicon.svg" className="absolute top-1/2 right-8 w-24 h-24 opacity-10 -translate-y-1/2 -rotate-12 pointer-events-none select-none" />
          <img src="/favicon.svg" className="absolute bottom-0 right-0 w-56 h-56 opacity-15 translate-x-1/2 translate-y-1/2 pointer-events-none select-none" />
          <img src="/favicon.svg" className="absolute top-1/2 left-1/4 w-20 h-20 opacity-10 -translate-y-1/2 pointer-events-none select-none" />

          <div className="relative z-10">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              Te ayudamos a mejorar tu empresa
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Empieza a fidelizar hoy.
              <br />
              Los primeros 14 días son gratis.
            </h2>

            <p className="text-violet-100 text-lg max-w-xl mx-auto mb-10">
              Únete a la red de negocios que ya usan Gestion+ para retener clientes y aumentar sus ingresos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/register" variant="white">Registrar mi negocio</Button>
              <Button to="/register?plan=customer" variant="outline">Soy cliente, quiero puntos</Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              {[
                '✓ 14 días de prueba gratis',
                '✓ Cancela cuando quieras',
                '✓ Configuración en 30 min',
              ].map((item) => (
                <span key={item} className="text-violet-100 text-sm">{item}</span>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
