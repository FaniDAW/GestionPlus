import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnimateOnScroll from '../components/AnimateOnScroll'

const cases = [
  {
    name: 'Cafetería El Rincón',
    location: 'Salamanca',
    category: 'Hostelería',
    quote: 'Antes perdíamos el 40% de los clientes nuevos. Ahora el 70% repite en el primer mes.',
    person: 'Rocío Blanco, propietaria',
    stats: [
      { label: 'Retención', value: '+70%' },
      { label: 'Ticket medio', value: '+18%' },
      { label: 'Clientes activos', value: '340' },
    ],
    color: 'from-violet-500 to-purple-600',
    initial: 'R',
  },
  {
    name: 'Librería La Página',
    location: 'Bilbao',
    category: 'Retail',
    quote: 'Gestion+ nos dio lo que las grandes cadenas llevan años usando. Por fin podemos competir.',
    person: 'Mikel Arteaga, gerente',
    stats: [
      { label: 'Canjes al mes', value: '120+' },
      { label: 'Nuevos socios', value: '+85' },
      { label: 'Satisfacción', value: '4.8/5' },
    ],
    color: 'from-pink-500 to-rose-600',
    initial: 'M',
  },
  {
    name: 'Asoc. Comerciantes Casco Histórico',
    location: 'Zamora',
    category: 'Asociación',
    quote: 'Coordinar 35 negocios era un caos. Ahora tenemos una plataforma única y todos nuestros socios están encantados.',
    person: 'Pilar Sanz, presidenta',
    stats: [
      { label: 'Negocios activos', value: '35' },
      { label: 'Clientes únicos', value: '2.100+' },
      { label: 'Puntos canjeados', value: '48K' },
    ],
    color: 'from-sky-500 to-blue-600',
    initial: 'P',
  },
  {
    name: 'Panadería Artesana Mora',
    location: 'Valencia',
    category: 'Alimentación',
    quote: 'Mis clientes de siempre ahora traen a sus amigos. El boca a boca ha mejorado un montón.',
    person: 'Tomás Mora, panadero',
    stats: [
      { label: 'Clientes referidos', value: '+60' },
      { label: 'Ventas mensuales', value: '+22%' },
      { label: 'Recompensas activas', value: '5' },
    ],
    color: 'from-amber-500 to-orange-600',
    initial: 'T',
  },
]

const logos = [
  { name: 'El Rincón', color: 'bg-violet-100 text-violet-700' },
  { name: 'La Página', color: 'bg-pink-100 text-pink-700' },
  { name: 'Casco Histórico', color: 'bg-sky-100 text-sky-700' },
  { name: 'Panadería Mora', color: 'bg-amber-100 text-amber-700' },
  { name: 'Óptica Lux', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Peluquería Nova', color: 'bg-rose-100 text-rose-700' },
]

export default function ClientesPage() {
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
            Casos de éxito
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight mb-4">
            Negocios que{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              ya confían en nosotros
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Más de 2.400 negocios y asociaciones usan Gestion+ cada día para retener clientes y aumentar sus ingresos.
          </p>
        </div>
      </section>

      {/* Logos */}
      <AnimateOnScroll from="bottom">
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">Algunos de nuestros clientes</p>
          <div className="flex flex-wrap justify-center gap-4">
            {logos.map((l) => (
              <span key={l.name} className={`${l.color} font-bold text-sm px-5 py-2.5 rounded-xl`}>{l.name}</span>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* Cases */}
      <AnimateOnScroll from="bottom" delay={0.05}>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          {cases.map((c) => (
            <div key={c.name} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${c.color}`} />
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold shrink-0`}>
                      {c.initial}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.location} · {c.category}</p>
                    </div>
                  </div>
                  <blockquote className="text-slate-700 leading-relaxed mb-4 text-lg font-medium">
                    "{c.quote}"
                  </blockquote>
                  <p className="text-sm text-slate-400">— {c.person}</p>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                  {c.stats.map((s) => (
                    <div key={s.label} className="bg-slate-50 rounded-2xl p-4 text-center md:text-left">
                      <p className={`text-xl font-extrabold bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>{s.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </AnimateOnScroll>

      {/* CTA */}
      <AnimateOnScroll from="bottom" delay={0.05}>
      <section className="py-20 bg-gradient-to-br from-slate-50 to-violet-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative bg-gradient-to-br from-violet-600 to-pink-500 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Tu negocio puede ser el próximo</h2>
              <p className="text-violet-100 mb-8 text-sm">Empieza gratis hoy. Sin tarjeta de crédito, sin compromiso.</p>
              <Link to="/register" className="bg-white text-violet-700 font-bold px-8 py-3 rounded-2xl hover:shadow-xl transition-all inline-block">
                Empieza gratis — 14 días
              </Link>
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      <Footer />
    </div>
  )
}
