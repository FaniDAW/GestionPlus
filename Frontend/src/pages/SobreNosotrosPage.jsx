import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnimateOnScroll from '../components/AnimateOnScroll'

const team = [
  { name: 'Carlos Romero', role: 'CEO & Cofundador', color: 'bg-violet-400', initial: 'C' },
  { name: 'Laura Martín', role: 'CTO & Cofundadora', color: 'bg-pink-400', initial: 'L' },
  { name: 'Sergio Vidal', role: 'Director de Producto', color: 'bg-sky-400', initial: 'S' },
  { name: 'Ana Torres', role: 'Directora de Clientes', color: 'bg-emerald-400', initial: 'A' },
  { name: 'Pablo Ruiz', role: 'Lead Engineer', color: 'bg-amber-400', initial: 'P' },
  { name: 'Marta Gil', role: 'Diseño & UX', color: 'bg-rose-400', initial: 'M' },
]

const values = [
  {
    title: 'Cercanía',
    desc: 'Hablamos el idioma de los negocios locales. Sin tecnicismos, sin complejidad.',
    bg: 'bg-violet-50', icon: '🤝',
  },
  {
    title: 'Simplicidad',
    desc: 'Cada función existe porque resuelve un problema real. Sin relleno.',
    bg: 'bg-pink-50', icon: '✦',
  },
  {
    title: 'Impacto local',
    desc: 'Creemos en el comercio local como motor de comunidad y economía.',
    bg: 'bg-sky-50', icon: '📍',
  },
  {
    title: 'Transparencia',
    desc: 'Sin letra pequeña, sin sorpresas. Lo que ves es lo que pagas.',
    bg: 'bg-emerald-50', icon: '🔍',
  },
]

const stats = [
  { value: '+2.400', label: 'Negocios activos' },
  { value: '+180K', label: 'Clientes fidelizados' },
  { value: '4.9/5', label: 'Valoración media' },
  { value: '12', label: 'Países' },
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
            Gestion+ nació en 2022 con una idea simple: que cualquier negocio, por pequeño que sea, pueda fidelizar clientes con las mismas herramientas que las grandes cadenas.
          </p>
        </div>
      </section>

      {/* Stats */}
      <AnimateOnScroll from="bottom">
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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
                <span className="text-2xl mb-3 block">{v.icon}</span>
                <h3 className="font-bold text-slate-800 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* Equipo */}
      <AnimateOnScroll from="bottom" delay={0.05}>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-3 block">Equipo</span>
            <h2 className="text-3xl font-extrabold text-slate-800">Las personas detrás de Gestion+</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {team.map((p) => (
              <div key={p.name} className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${p.color} flex items-center justify-center text-white text-xl font-extrabold mx-auto mb-3`}>
                  {p.initial}
                </div>
                <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{p.role}</p>
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
