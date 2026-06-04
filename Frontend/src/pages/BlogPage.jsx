import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnimateOnScroll from '../components/AnimateOnScroll'

const articles = [
  {
    id: 1,
    category: 'Fidelización',
    title: '5 estrategias de fidelización que funcionan para negocios locales',
    excerpt: 'Descubre cómo los negocios más exitosos de tu ciudad retienen a sus clientes sin gastar fortunas en publicidad.',
    date: '12 mayo 2026',
    readTime: '5 min',
    color: 'bg-violet-100 text-violet-700',
    dot: 'bg-violet-400',
  },
  {
    id: 2,
    category: 'Asociaciones',
    title: 'Cómo una asociación de comerciantes multiplicó sus socios en 6 meses',
    excerpt: 'El caso de la Asociación de Comerciantes del Casco Histórico de Zamora y cómo Gestion+ transformó su gestión.',
    date: '5 mayo 2026',
    readTime: '8 min',
    color: 'bg-pink-100 text-pink-700',
    dot: 'bg-pink-400',
  },
  {
    id: 3,
    category: 'Consejos',
    title: 'Programa de puntos: errores comunes y cómo evitarlos',
    excerpt: 'Muchos negocios lanzan un programa de puntos y lo abandonan al mes. Te contamos por qué y cómo hacerlo bien.',
    date: '28 abril 2026',
    readTime: '6 min',
    color: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-400',
  },
  {
    id: 4,
    category: 'Producto',
    title: 'Nueva función: ofertas exclusivas para miembros de una asociación',
    excerpt: 'Ya puedes crear ofertas que solo ven los clientes de un grupo de negocios. Así funciona y cómo sacarle partido.',
    date: '20 abril 2026',
    readTime: '4 min',
    color: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-400',
  },
  {
    id: 5,
    category: 'Fidelización',
    title: 'Por qué el 68% de los clientes no vuelven (y cómo cambiarlo)',
    excerpt: 'Un estudio reciente revela que el principal motivo de pérdida de clientes no es el precio. Te lo explicamos.',
    date: '14 abril 2026',
    readTime: '7 min',
    color: 'bg-violet-100 text-violet-700',
    dot: 'bg-violet-400',
  },
  {
    id: 6,
    category: 'Consejos',
    title: 'Cómo configurar tu primer programa de recompensas en 30 minutos',
    excerpt: 'Guía paso a paso para lanzar tu programa de puntos desde cero, aunque nunca hayas usado una plataforma de fidelización.',
    date: '7 abril 2026',
    readTime: '10 min',
    color: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400',
  },
]

const categories = ['Todos', 'Fidelización', 'Asociaciones', 'Consejos', 'Producto']

export default function BlogPage() {
  const [active, setActive] = useState('Todos')
  const filtered = active === 'Todos' ? articles : articles.filter((a) => a.category === active)

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
            Recursos y consejos
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight mb-4">
            El blog de{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Gestion+
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Estrategias, casos de éxito y novedades del producto para ayudarte a fidelizar más clientes.
          </p>
        </div>
      </section>

      {/* Content */}
      <AnimateOnScroll from="bottom">
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Filtro */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active === cat
                    ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((a) => (
              <article key={a.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-50 transition-all overflow-hidden group cursor-pointer">
                <div className={`h-2 w-full ${a.dot}`} />
                <div className="p-6">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${a.color} mb-4 inline-block`}>
                    {a.category}
                  </span>
                  <h2 className="font-bold text-slate-800 mb-3 leading-snug group-hover:text-violet-600 transition-colors">
                    {a.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{a.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{a.date}</span>
                    <span>{a.readTime} lectura</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      <Footer />
    </div>
  )
}
