import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

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
            Estamos aquí para ayudarte
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight mb-4">
            Ponte en{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              contacto
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            ¿Tienes alguna pregunta o quieres saber más sobre Gestion+? Escríbenos y te responderemos en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Info cards */}
            <div className="space-y-6">
              {[
                {
                  title: 'Email',
                  detail: 'hola@gestionplus.com',
                  sub: 'Respondemos en menos de 24 h',
                  bg: 'bg-violet-50',
                  iconBg: 'bg-violet-100 text-violet-600',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  title: 'Teléfono',
                  detail: '+34 900 123 456',
                  sub: 'Lun–Vie, 9:00 a 18:00',
                  bg: 'bg-pink-50',
                  iconBg: 'bg-pink-100 text-pink-600',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                },
                {
                  title: 'Oficina',
                  detail: 'Calle Mayor 12, Madrid',
                  sub: 'España, 28001',
                  bg: 'bg-sky-50',
                  iconBg: 'bg-sky-100 text-sky-600',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
              ].map((card) => (
                <div key={card.title} className={`${card.bg} rounded-2xl p-6 flex items-start gap-4`}>
                  <div className={`${card.iconBg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{card.title}</p>
                    <p className="font-bold text-slate-800 text-sm">{card.detail}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{card.sub}</p>
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl p-6 text-white">
                <p className="font-bold text-sm mb-1">¿Eres un negocio o asociación?</p>
                <p className="text-violet-100 text-xs leading-relaxed mb-4">
                  Prueba Gestion+ gratis durante 14 días sin tarjeta de crédito.
                </p>
                <Link
                  to="/register"
                  className="inline-block bg-white text-violet-700 font-bold text-xs px-5 py-2.5 rounded-xl hover:shadow-lg transition-all"
                >
                  Empieza gratis
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-violet-50 rounded-3xl border border-violet-100">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2">¡Mensaje enviado!</h3>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Te responderemos en menos de 24 horas. Revisa tu bandeja de entrada.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="mt-8 text-violet-600 font-semibold text-sm hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-violet-50 p-8 space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Asunto
                    </label>
                    <select
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition bg-white"
                    >
                      <option value="" disabled>Selecciona un asunto</option>
                      <option value="info">Información general</option>
                      <option value="demo">Solicitar demo</option>
                      <option value="pricing">Precios y planes</option>
                      <option value="support">Soporte técnico</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Mensaje
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-violet-200 transition-all"
                  >
                    Enviar mensaje
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Al enviar aceptas nuestra{' '}
                    <span className="text-violet-500 hover:underline cursor-pointer">política de privacidad</span>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
