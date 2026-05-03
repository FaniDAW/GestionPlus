import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../lib/roles'

const sections = ['Características', 'Cómo funciona', 'Precios', 'Testimonios']
const sectionHref = (label) => `#${label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')}`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-violet-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-xl font-bold text-violet-800">Gestion+</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {sections.map((item) => (
            <a
              key={item}
              href={sectionHref(item)}
              className="text-sm text-slate-600 hover:text-violet-600 transition-colors font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to={getDashboardPath(user.role)}
              className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all"
            >
              Mi panel
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-600 hover:text-violet-600 font-medium transition-colors">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all"
              >
                Empieza gratis
              </Link>
            </>
          )}
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
          {sections.map((item) => (
            <a
              key={item}
              href={sectionHref(item)}
              onClick={() => setOpen(false)}
              className="text-sm text-slate-600 hover:text-violet-600 font-medium"
            >
              {item}
            </a>
          ))}
          {user ? (
            <Link
              to={getDashboardPath(user.role)}
              onClick={() => setOpen(false)}
              className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl text-center"
            >
              Mi panel
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-sm text-slate-600 hover:text-violet-600 font-medium"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl text-center"
              >
                Empieza gratis
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
