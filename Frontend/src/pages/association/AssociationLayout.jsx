import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  {
    label: 'Dashboard',
    path: '/association/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Negocios',
    path: '/association/businesses',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: 'Ofertas',
    path: '/association/offers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
]

export default function AssociationLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-sm shadow-violet-200">
              <span className="text-white font-black text-base">G</span>
            </div>
            <div>
              <span className="font-extrabold text-lg leading-none text-slate-800">Gestion+</span>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Panel Asociación</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-emerald-600 font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-slate-800 text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 text-sm font-medium transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
