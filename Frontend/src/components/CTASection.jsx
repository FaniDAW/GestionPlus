export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative bg-linear-to-br from-violet-600 to-pink-500 rounded-3xl p-12 text-center overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full" />

          <div className="relative z-10">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              Sin tarjeta de crédito
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Empieza a fidelizar hoy.
              <br />
              Los primeros 14 días son gratis.
            </h2>

            <p className="text-violet-100 text-lg max-w-xl mx-auto mb-10">
              Únete a más de 2.400 negocios que ya usan Gestion+ para retener clientes y aumentar sus ingresos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="bg-white text-violet-700 font-bold px-8 py-4 rounded-2xl hover:shadow-2xl transition-all"
              >
                Crear mi cuenta gratis
              </a>
              <a
                href="#"
                className="border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all"
              >
                Ver demo en vivo
              </a>
            </div>


            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              {[
                '✓ Sin tarjeta de crédito',
                '✓ Cancela cuando quieras',
                '✓ Configuración en 30 min',
              ].map((item) => (
                <span key={item} className="text-violet-100 text-sm">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
