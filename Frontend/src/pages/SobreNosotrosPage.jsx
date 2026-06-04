import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnimateOnScroll from '../components/AnimateOnScroll'

const values = [
  {
    title: 'Cercanía',
    desc: 'Hablamos el idioma de los negocios locales. Sin tecnicismos, sin complejidad.',
    bg: 'bg-violet-50', iconBg: 'bg-violet-100', iconColor: 'text-violet-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Simplicidad',
    desc: 'Cada función existe porque resuelve un problema real. Sin relleno.',
    bg: 'bg-pink-50', iconBg: 'bg-pink-100', iconColor: 'text-pink-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: 'Impacto local',
    desc: 'Creemos en el comercio local como motor de comunidad y economía.',
    bg: 'bg-sky-50', iconBg: 'bg-sky-100', iconColor: 'text-sky-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Transparencia',
    desc: 'Sin letra pequeña, sin sorpresas. Lo que ves es lo que pagas.',
    bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

const stats = [
  { value: '+240', label: 'Negocios activos' },
  { value: '+10K', label: 'Clientes fidelizados' },
  { value: '4.9/5', label: 'Valoración media' },
]

export default function SobreNosotrosPage() {
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
            Nuestra historia
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight mb-4">
            Nacimos para{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              el comercio local
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Gestion+ nació con una idea simple: que cualquier negocio, por pequeño que sea, pueda fidelizar clientes con las mismas herramientas que las grandes cadenas.
          </p>
        </div>
      </section>

      {/* Stats */}
      <AnimateOnScroll from="bottom">
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
      </AnimateOnScroll>

      {/* Misión */}
      <AnimateOnScroll from="bottom" delay={0.05}>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-3 block">Nuestra misión</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-5 leading-tight">
              Democratizar la fidelización para PYMEs
            </h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              Las grandes cadenas llevan años usando programas de puntos sofisticados. Nosotros creemos que el bar de tu barrio, la librería familiar o la asociación de comerciantes merecen las mismas oportunidades.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Por eso construimos Gestion+: una plataforma potente, sencilla y asequible que funciona desde el primer día.
            </p>
          </div>
          <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-3xl p-8 text-white">
            <p className="text-4xl mb-4">💜</p>
            <h3 className="text-xl font-bold mb-3">Creemos en el comercio local</h3>
            <p className="text-violet-100 leading-relaxed text-sm">
              Cada negocio que crece con Gestion+ es una familia que prospera, un empleo que se mantiene y una comunidad que se fortalece. Ese es nuestro verdadero producto.
            </p>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* Valores */}
      <AnimateOnScroll from="bottom" delay={0.05}>
      <section className="py-20 bg-gradient-to-br from-slate-50 to-violet-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-3 block">Valores</span>
            <h2 className="text-3xl font-extrabold text-slate-800">Lo que nos guía cada día</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className={`${v.bg} rounded-2xl p-6`}>
                <div className={`w-12 h-12 ${v.iconBg} ${v.iconColor} rounded-2xl flex items-center justify-center mb-4`}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* CTA */}
      <AnimateOnScroll from="bottom" delay={0.05}>
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative bg-gradient-to-br from-violet-600 to-pink-500 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">¿Quieres unirte a nosotros?</h2>
              <p className="text-violet-100 mb-8">Empieza gratis hoy y forma parte de la comunidad Gestion+.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="bg-white text-violet-700 font-bold px-8 py-3 rounded-2xl hover:shadow-xl transition-all">
                  Empieza gratis
                </Link>
                <Link to="/contacto" className="border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-2xl hover:bg-white/10 transition-all">
                  Contáctanos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      <Footer />
    </div>
  )
}
