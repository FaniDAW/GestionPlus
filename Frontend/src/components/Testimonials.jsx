const testimonials = [
  {
    name: 'Sofía Martínez',
    role: 'Dueña, Pastelería Dulce & Co.',
    avatar: 'SM',
    color: 'bg-violet-400',
    text: 'Desde que uso Gestion+, mis clientes vuelven un 40% más. El programa de puntos fue un antes y un después. Mis clientas lo adoran y a mí me lleva 0 tiempo gestionarlo.',
    stars: 5,
  },
  {
    name: 'Carlos Ruiz',
    role: 'Director, Clínica Dental Ruiz',
    avatar: 'CR',
    color: 'bg-pink-400',
    text: 'Increíble herramienta. Creamos un plan de membresía VIP y en 3 meses ya teníamos 120 suscriptores. Los ingresos recurrentes han cambiado la estabilidad del negocio.',
    stars: 5,
  },
  {
    name: 'Marta Gómez',
    role: 'Gerente, Cafetería El Rincón',
    avatar: 'MG',
    color: 'bg-sky-400',
    text: 'La configuración tardó menos de una hora. El soporte es 10/10. Nuestros clientes habituales ahora traen amigos para que también acumulen puntos.',
    stars: 5,
  },
  {
    name: 'Andrés Torres',
    role: 'Propietario, Tienda Deportiva Running+',
    avatar: 'AT',
    color: 'bg-emerald-400',
    text: 'Tenemos 3 tiendas y el panel multi-negocio lo controlo todo desde el móvil. El analytics me dice exactamente qué producto recompensa mejor. Vale cada euro.',
    stars: 5,
  },
  {
    name: 'Laura Sánchez',
    role: 'CEO, Spa & Wellness Luna',
    avatar: 'LS',
    color: 'bg-rose-400',
    text: 'Las notificaciones automáticas de cumpleaños y puntos a punto de caducar son un golazo. Los clientes se sienten súper cuidados. Ha disparado nuestras reservas.',
    stars: 5,
  },
  {
    name: 'Pablo Fernández',
    role: 'Franquiciado, PizzaBox (5 locales)',
    avatar: 'PF',
    color: 'bg-amber-400',
    text: 'Buscaba algo que escalara con mis franquicias. Gestion+ es la única plataforma que me dio multi-negocio real con datos unificados. La recomiendo sin dudar.',
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-24 bg-gradient-to-br from-violet-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Testimonios
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">
            Negocios que ya{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              fidelizan con éxito
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Más de 2.400 negocios ya usan Gestion+ para retener y hacer crecer su base de clientes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-3xl p-6 border border-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">"{t.text}"</p>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos strip */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400 mb-6">Integra con tus herramientas favoritas</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {['Shopify', 'WooCommerce', 'Stripe', 'Mailchimp', 'WhatsApp', 'Google'].map((logo) => (
              <span key={logo} className="text-slate-300 font-bold text-sm tracking-wide">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
