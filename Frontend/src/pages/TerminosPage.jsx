import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnimateOnScroll from '../components/AnimateOnScroll'

const sections = [
  {
    title: '1. Objeto y aceptación',
    content: `Los presentes Términos y Condiciones de Uso (en adelante, "Términos") regulan el acceso y uso de la plataforma Gestion+, operada por Gestion+ SL.

El uso de la plataforma implica la aceptación plena y sin reservas de estos Términos. Si no estás de acuerdo, debes abstenerte de usar el servicio.`,
  },
  {
    title: '2. Descripción del servicio',
    content: `Gestion+ es una plataforma SaaS de fidelización de clientes dirigida a negocios y asociaciones de comerciantes. Permite gestionar programas de puntos, recompensas, ofertas y análisis de clientes.

El servicio se presta en modalidad de suscripción, con diferentes planes disponibles en la página de precios.`,
  },
  {
    title: '3. Registro y cuenta',
    content: `Para usar Gestion+ es necesario crear una cuenta. Te comprometes a:

• Proporcionar información veraz, completa y actualizada.
• Mantener la confidencialidad de tus credenciales.
• Notificarnos de inmediato cualquier uso no autorizado de tu cuenta.
• Ser el único responsable de la actividad realizada desde tu cuenta.

Gestion+ se reserva el derecho a suspender o cancelar cuentas que incumplan estos Términos.`,
  },
  {
    title: '4. Uso permitido',
    content: `Puedes usar Gestion+ para gestionar tu programa de fidelización de forma legítima. Queda prohibido:

• Usar el servicio para actividades ilegales o fraudulentas.
• Intentar acceder a datos de otros usuarios o negocios.
• Realizar ingeniería inversa o intentar copiar el software.
• Enviar comunicaciones no solicitadas (spam) a clientes.
• Revender o sublicenciar el acceso a terceros sin autorización expresa.`,
  },
  {
    title: '5. Planes y facturación',
    content: `Los planes de suscripción se detallan en la página de precios. El pago se realiza por adelantado, mensual o anualmente según el plan elegido.

Ofrecemos un período de prueba gratuito de 14 días sin necesidad de tarjeta de crédito. Transcurrido ese período, el servicio se suspende salvo que actives un plan de pago.

Las tarifas pueden modificarse con un preaviso mínimo de 30 días.`,
  },
  {
    title: '6. Cancelación',
    content: `Puedes cancelar tu suscripción en cualquier momento desde los ajustes de tu cuenta. La cancelación surte efecto al final del período de facturación en curso.

No realizamos reembolsos por el período ya facturado, salvo en los casos legalmente exigibles.`,
  },
  {
    title: '7. Propiedad intelectual',
    content: `Todo el software, diseño, marca, logotipos y contenido de Gestion+ son propiedad de Gestion+ SL o sus licenciantes. No se concede ningún derecho de propiedad intelectual al usuario más allá del uso del servicio.

Los datos que introduzca el usuario en la plataforma (listados de clientes, recompensas, etc.) son propiedad del usuario.`,
  },
  {
    title: '8. Protección de datos',
    content: `El tratamiento de datos personales se rige por nuestra Política de Privacidad, que forma parte integrante de estos Términos. Gestion+ actúa como encargado del tratamiento respecto a los datos de los clientes finales introducidos por el negocio usuario.`,
  },
  {
    title: '9. Disponibilidad y SLA',
    content: `Nos comprometemos a ofrecer una disponibilidad del servicio del 99,5% mensual. En caso de interrupciones planificadas, avisaremos con al menos 48 horas de antelación.

No garantizamos disponibilidad ininterrumpida en caso de fuerza mayor, ataques externos o fallos de terceros proveedores.`,
  },
  {
    title: '10. Limitación de responsabilidad',
    content: `Gestion+ no será responsable de pérdidas de datos derivadas de un uso inadecuado por parte del usuario, ni de daños indirectos, pérdidas de beneficios o daños consecuentes.

La responsabilidad máxima de Gestion+ se limita al importe abonado en los últimos 3 meses de servicio.`,
  },
  {
    title: '11. Modificaciones',
    content: `Gestion+ puede modificar estos Términos en cualquier momento. Te notificaremos los cambios relevantes con al menos 15 días de antelación. El uso continuado del servicio tras esa fecha implica la aceptación de los nuevos términos.`,
  },
  {
    title: '12. Legislación aplicable',
    content: `Estos Términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Alicante, salvo que la normativa de protección del consumidor establezca otro fuero.

Última actualización: 1 de enero de 2026.`,
  },
]

export default function TerminosPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="font-sans antialiased text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            Legal
          </span>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Términos de uso</h1>
          <p className="text-slate-500">Última actualización: 1 de enero de 2026</p>
        </div>
      </section>

      {/* Content */}
      <AnimateOnScroll from="bottom">
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6 mb-10">
            <p className="text-sm text-violet-800 leading-relaxed">
              Lee atentamente estos términos antes de usar Gestion+. Regulan los derechos y obligaciones de todas las partes en el uso de nuestra plataforma.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-slate-800 mb-3">{s.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      <Footer />
    </div>
  )
}
