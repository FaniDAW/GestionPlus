import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnimateOnScroll from '../components/AnimateOnScroll'

const cookieTypes = [
  {
    type: 'Técnicas / esenciales',
    required: true,
    bg: 'bg-violet-50 border-violet-100',
    badge: 'bg-violet-100 text-violet-700',
    desc: 'Necesarias para el funcionamiento básico de la plataforma. Sin ellas, el servicio no puede prestarse correctamente.',
    cookies: [
      { name: 'session_token', purpose: 'Mantiene tu sesión iniciada', duration: 'Sesión' },
      { name: 'csrf_token', purpose: 'Protección contra ataques CSRF', duration: 'Sesión' },
      { name: 'cookie_consent', purpose: 'Guarda tus preferencias de cookies', duration: '1 año' },
    ],
  },
  {
    type: 'Analíticas',
    required: false,
    bg: 'bg-pink-50 border-pink-100',
    badge: 'bg-pink-100 text-pink-700',
    desc: 'Nos permiten entender cómo se usa la plataforma para mejorarla. Los datos son agregados y anónimos.',
    cookies: [
      { name: '_ga', purpose: 'Google Analytics — identifica sesiones únicas', duration: '2 años' },
      { name: '_ga_*', purpose: 'Google Analytics — estado de sesión', duration: '1 año' },
    ],
  },
  {
    type: 'Preferencias',
    required: false,
    bg: 'bg-sky-50 border-sky-100',
    badge: 'bg-sky-100 text-sky-700',
    desc: 'Recuerdan tus preferencias para personalizar tu experiencia (idioma, tema, etc.).',
    cookies: [
      { name: 'ui_theme', purpose: 'Guarda el tema (claro / oscuro)', duration: '1 año' },
      { name: 'locale', purpose: 'Guarda el idioma preferido', duration: '1 año' },
    ],
  },
]

export default function CookiesPage() {
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
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Política de cookies</h1>
          <p className="text-slate-500">Última actualización: 1 de enero de 2026</p>
        </div>
      </section>

      {/* Content */}
      <AnimateOnScroll from="bottom">
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 space-y-10">

          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6">
            <p className="text-sm text-violet-800 leading-relaxed">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Gestion+ las usa para hacer funcionar la plataforma, recordar tus preferencias y mejorar el servicio.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3">¿Qué cookies usamos?</h2>
            <div className="space-y-6">
              {cookieTypes.map((ct) => (
                <div key={ct.type} className={`rounded-2xl border p-6 ${ct.bg}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ct.badge}`}>{ct.type}</span>
                    {ct.required && (
                      <span className="text-xs text-slate-400">Siempre activas</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{ct.desc}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-600">
                      <thead>
                        <tr className="text-slate-400 font-semibold text-left">
                          <th className="pb-2 pr-4">Cookie</th>
                          <th className="pb-2 pr-4">Finalidad</th>
                          <th className="pb-2">Duración</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60">
                        {ct.cookies.map((c) => (
                          <tr key={c.name}>
                            <td className="py-2 pr-4 font-mono text-violet-700">{c.name}</td>
                            <td className="py-2 pr-4">{c.purpose}</td>
                            <td className="py-2">{c.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3">¿Cómo gestionar las cookies?</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Puedes gestionar o desactivar las cookies no esenciales en cualquier momento desde el banner de cookies o desde la configuración de tu navegador:
            </p>
            <ul className="space-y-2 text-sm text-slate-500">
              {['Chrome', 'Firefox', 'Safari', 'Edge'].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  {b}: Configuración → Privacidad y seguridad → Cookies
                </li>
              ))}
            </ul>
            <p className="text-slate-400 text-xs mt-4 leading-relaxed">
              Ten en cuenta que desactivar las cookies técnicas puede afectar al funcionamiento de la plataforma.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-3">Contacto</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Si tienes preguntas sobre el uso de cookies, escríbenos a{' '}
              <span className="text-violet-600 font-medium">privacidad@gestionplus.com</span>.
            </p>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      <Footer />
    </div>
  )
}
