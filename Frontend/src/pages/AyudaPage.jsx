import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnimateOnScroll from '../components/AnimateOnScroll'

const categories = [
  {
    id: 'negocio',
    label: 'Negocio',
    icon: '🏪',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    activeColor: 'bg-violet-600 text-white border-violet-600',
    faqs: [
      {
        q: '¿Cómo configuro mi primer programa de puntos?',
        a: 'Desde tu panel de negocio, ve a "Recompensas" y pulsa "Nueva recompensa". Define el nombre, cuántos puntos necesita el cliente para canjearla y qué premio obtiene. En menos de 5 minutos estará activo.',
      },
      {
        q: '¿Cómo escaneo la tarjeta de un cliente?',
        a: 'Usa la sección "Escáner QR" de tu panel. Apunta la cámara al código QR del cliente (en la app o en la tarjeta digital) y el sistema sumará los puntos automáticamente.',
      },
      {
        q: '¿Puedo tener más de un tipo de recompensa?',
        a: 'Sí, puedes crear todas las recompensas que quieras. Cada una con sus propios requisitos de puntos y descripción. Los clientes verán todas las disponibles en su app.',
      },
      {
        q: '¿Cómo creo una oferta temporal?',
        a: 'Ve a "Ofertas" en tu panel y pulsa "Nueva oferta". Puedes definir el título, descripción, fechas de inicio y fin, y si es exclusiva para miembros de una asociación.',
      },
      {
        q: '¿Puedo exportar la lista de mis clientes?',
        a: 'Próximamente. Estamos trabajando en la exportación de datos en CSV. Si lo necesitas urgentemente, contáctanos y te ayudamos.',
      },
    ],
  },
  {
    id: 'cliente',
    label: 'Cliente / Usuario',
    icon: '👤',
    color: 'bg-pink-50 text-pink-700 border-pink-200',
    activeColor: 'bg-pink-500 text-white border-pink-500',
    faqs: [
      {
        q: '¿Cómo acumulo puntos?',
        a: 'Presenta tu código QR al negocio cuando hagas una compra. El comercio escaneará tu código y los puntos se añadirán automáticamente a tu saldo.',
      },
      {
        q: '¿Dónde veo mis puntos y recompensas?',
        a: 'En tu panel de cliente, en la sección "Mi saldo". Verás los puntos acumulados en cada negocio y las recompensas disponibles para canjear.',
      },
      {
        q: '¿Cómo canjeo una recompensa?',
        a: 'Ve a "Mis recompensas", elige la que quieras canjear y pulsa "Canjear". Se generará un código que debes mostrar al negocio para que lo valide.',
      },
      {
        q: '¿Puedo usar mis puntos en varios negocios?',
        a: 'Depende de si los negocios forman parte de una asociación. Si es así, los puntos se comparten entre todos los negocios del grupo. Si no, los puntos son específicos de cada negocio.',
      },
      {
        q: '¿Cómo cambio mi contraseña?',
        a: 'Ve a tu perfil (icono de usuario arriba a la derecha) y selecciona "Seguridad". Desde ahí puedes cambiar tu contraseña en cualquier momento.',
      },
    ],
  },
  {
    id: 'asociacion',
    label: 'Asociaciones',
    icon: '🤝',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    activeColor: 'bg-sky-600 text-white border-sky-600',
    faqs: [
      {
        q: '¿Cómo añado negocios a mi asociación?',
        a: 'Desde tu panel de asociación, ve a "Negocios" y pulsa "Invitar negocio". Introduce el email del propietario y le llegará una invitación para unirse a tu grupo.',
      },
      {
        q: '¿Pueden los negocios de la asociación crear sus propias recompensas?',
        a: 'Sí. Cada negocio gestiona sus propias recompensas. Además, como administrador de la asociación puedes crear ofertas globales que aparecen en todos los negocios del grupo.',
      },
      {
        q: '¿Los puntos se comparten entre todos los negocios?',
        a: 'Sí, cuando los negocios forman parte de una asociación, los clientes acumulan puntos en un saldo compartido y pueden canjear recompensas en cualquier negocio del grupo.',
      },
      {
        q: '¿Cómo gestiono las ofertas de la asociación?',
        a: 'Desde el panel de asociación, en la sección "Ofertas". Puedes crear ofertas que verán todos los clientes de los negocios de la asociación, con fechas de inicio y fin.',
      },
    ],
  },
  {
    id: 'tecnico',
    label: 'Técnico / Cuenta',
    icon: '⚙️',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    activeColor: 'bg-emerald-600 text-white border-emerald-600',
    faqs: [
      {
        q: '¿Cómo cancelo mi suscripción?',
        a: 'Ve a Configuración → Suscripción → Cancelar plan. La cancelación se hace efectiva al final del período de facturación actual. No se realizan reembolsos parciales.',
      },
      {
        q: '¿Qué pasa con mis datos si cancelo?',
        a: 'Tus datos se conservan durante 30 días tras la cancelación, período en el que puedes reactivar tu cuenta. Pasado ese plazo, se eliminan de forma segura.',
      },
      {
        q: '¿Gestion+ funciona en móvil?',
        a: 'Sí, la plataforma está completamente adaptada para móvil. Tanto el panel de negocio como el de cliente funcionan bien en cualquier dispositivo sin necesidad de instalar una app.',
      },
      {
        q: '¿Cómo contacto con soporte?',
        a: 'Puedes escribirnos a través del formulario de contacto o directamente a hola@gestionplus.com. Respondemos en menos de 24 horas en días laborables.',
      },
    ],
  },
]

function Accordion({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800 text-sm pr-4">{faq.q}</span>
        <span className={`shrink-0 w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center transition-transform ${open ? 'rotate-45' : ''}`}>
          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  )
}

export default function AyudaPage() {
  const [active, setActive] = useState('negocio')
  const current = categories.find((c) => c.id === active)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="font-sans antialiased text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            Soporte
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight mb-4">
            Centro de{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              ayuda
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Encuentra respuesta a las preguntas más frecuentes. Si no encuentras lo que buscas, escríbenos.
          </p>
        </div>
      </section>

      {/* Content */}
      <AnimateOnScroll from="bottom">
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  active === cat.id ? cat.activeColor : cat.color
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            {current.faqs.map((faq) => (
              <Accordion key={faq.q} faq={faq} />
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* Still need help */}
      <AnimateOnScroll from="bottom" delay={0.05}>
      <section className="py-16 bg-gradient-to-br from-slate-50 to-violet-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-3">¿No encuentras lo que buscas?</h2>
          <p className="text-slate-500 text-sm mb-8">Nuestro equipo responde en menos de 24 horas en días laborables.</p>
          <Link
            to="/contacto"
            className="inline-block bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold px-8 py-3 rounded-2xl hover:shadow-xl hover:shadow-violet-200 transition-all"
          >
            Contactar con soporte
          </Link>
        </div>
      </section>
      </AnimateOnScroll>

      <Footer />
    </div>
  )
}
