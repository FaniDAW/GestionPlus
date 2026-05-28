import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnimateOnScroll from '../components/AnimateOnScroll'

const sections = [
  {
    title: '1. Responsable del tratamiento',
    content: `Gestion+ SL (en adelante, "Gestion+" o "la empresa"), con domicilio en Calle Mayor 12, 28001 Madrid, España, es la entidad responsable del tratamiento de los datos personales recabados a través de esta plataforma.

Correo de contacto: privacidad@gestionplus.com`,
  },
  {
    title: '2. Datos que recabamos',
    content: `Recabamos los siguientes tipos de datos:

• Datos de identificación: nombre, apellidos, correo electrónico, teléfono.
• Datos de uso: actividad en la plataforma, transacciones, canjes de puntos.
• Datos del negocio: nombre del negocio, dirección, sector de actividad.
• Datos técnicos: dirección IP, tipo de navegador, páginas visitadas, cookies.

No recabamos datos sensibles (salud, ideología, religión, etc.).`,
  },
  {
    title: '3. Finalidad del tratamiento',
    content: `Tratamos tus datos para:

• Gestionar tu cuenta y el acceso a la plataforma.
• Ejecutar el programa de fidelización (puntos, recompensas, ofertas).
• Enviarte comunicaciones relacionadas con el servicio.
• Con tu consentimiento expreso, enviarte comunicaciones comerciales.
• Cumplir con obligaciones legales y contractuales.
• Mejorar la plataforma mediante análisis estadístico agregado y anónimo.`,
  },
  {
    title: '4. Base legal',
    content: `El tratamiento se basa en:

• Ejecución de un contrato: para la prestación del servicio (art. 6.1.b RGPD).
• Consentimiento: para comunicaciones comerciales opcionales (art. 6.1.a RGPD).
• Interés legítimo: para la seguridad, prevención de fraude y mejora del servicio (art. 6.1.f RGPD).
• Obligación legal: para cumplir con la normativa fiscal y mercantil vigente (art. 6.1.c RGPD).`,
  },
  {
    title: '5. Conservación de datos',
    content: `Conservamos tus datos mientras mantengas una cuenta activa en Gestion+. Tras la cancelación de la cuenta, los datos se conservan durante el período legalmente exigido (generalmente 5 años para datos contables y fiscales) y se eliminan de forma segura transcurrido dicho plazo.`,
  },
  {
    title: '6. Destinatarios',
    content: `No vendemos ni cedemos tus datos a terceros con fines comerciales. Podemos compartirlos con:

• Proveedores tecnológicos que nos prestan servicios (hosting, analytics, email) bajo contratos de encargado de tratamiento.
• Autoridades y organismos públicos cuando exista una obligación legal.
• En caso de fusión o adquisición, con la entidad resultante, previo aviso.`,
  },
  {
    title: '7. Transferencias internacionales',
    content: `Algunos de nuestros proveedores de servicios pueden estar ubicados fuera del Espacio Económico Europeo. En esos casos, nos aseguramos de que existan garantías adecuadas (cláusulas contractuales tipo aprobadas por la Comisión Europea u otras garantías equivalentes).`,
  },
  {
    title: '8. Tus derechos',
    content: `Tienes derecho a:

• Acceso: conocer qué datos tenemos sobre ti.
• Rectificación: corregir datos inexactos.
• Supresión: solicitar la eliminación de tus datos.
• Oposición: oponerte a determinados tratamientos.
• Limitación: solicitar que limitemos el tratamiento en ciertos casos.
• Portabilidad: recibir tus datos en un formato estructurado y legible.
• Retirar el consentimiento en cualquier momento, sin que afecte a la licitud del tratamiento previo.

Para ejercer estos derechos, escríbenos a privacidad@gestionplus.com. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).`,
  },
  {
    title: '9. Seguridad',
    content: `Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos: cifrado en tránsito (HTTPS/TLS), cifrado en reposo, acceso restringido por roles, auditorías periódicas y copias de seguridad.`,
  },
  {
    title: '10. Cambios en esta política',
    content: `Podemos actualizar esta política ocasionalmente. Te notificaremos los cambios relevantes por correo electrónico o mediante un aviso en la plataforma con al menos 15 días de antelación.

Última actualización: 1 de enero de 2026.`,
  },
]

export default function PrivacidadPage() {
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
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Política de privacidad</h1>
          <p className="text-slate-500">Última actualización: 1 de enero de 2026</p>
        </div>
      </section>

      {/* Content */}
      <AnimateOnScroll from="bottom">
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6 mb-10">
            <p className="text-sm text-violet-800 leading-relaxed">
              En Gestion+ nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política explica qué datos recabamos, por qué y cómo los protegemos, en cumplimiento del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos y garantía de los derechos digitales (LOPDGDD).
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
