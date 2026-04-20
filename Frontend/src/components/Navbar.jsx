import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-violet-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-xl font-bold text-violet-800">Gestion+</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {['Características', 'Cómo funciona', 'Precios', 'Testimonios'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm text-slate-600 hover:text-violet-600 transition-colors font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm text-slate-600 hover:text-violet-600 font-medium transition-colors">
            Iniciar sesión
          </a>
          <a
            href="#"
            className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all"
          >
            Empieza gratis
          </a>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-slate-600">
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-violet-100 px-6 py-4 flex flex-col gap-4">
          {['Características', 'Cómo funciona', 'Precios', 'Testimonios'].map((item) => (
            <a
              key={item}
              href="#"
              onClick={() => setOpen(false)}
              className="text-sm text-slate-600 hover:text-violet-600 font-medium"
            >
              {item}
            </a>
          ))}
          <a
            href="#"
            className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl text-center"
          >
            Empieza gratis
          </a>
        </div>
      )}
    </nav>
  )
}
