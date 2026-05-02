import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { getDashboardPath } from './lib/roles'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BusinessDashboard from './pages/BusinessDashboard'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import AdminBusinesses from './pages/admin/AdminBusinesses'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSubscriptions from './pages/admin/AdminSubscriptions'

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-violet-400 border-t-transparent animate-spin" />
    </div>
  )
}

function LandingPage() {
  return (
    <div className="font-sans antialiased text-slate-800">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

// Redirige a login si no autenticado
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? children : <Navigate to="/login" replace />
}

// Redirige al dashboard del rol si ya está autenticado
function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? <Navigate to={getDashboardPath(user.role)} replace /> : children
}

// Protege por rol: redirige al dashboard del rol si no tiene permiso
function RoleRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to={getDashboardPath(user.role)} replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Customer */}
      <Route path="/dashboard" element={
        <RoleRoute roles={['customer']}><DashboardPage /></RoleRoute>
      } />

      {/* Business owner */}
      <Route path="/business/dashboard" element={
        <RoleRoute roles={['business_owner']}><BusinessDashboard /></RoleRoute>
      } />

      {/* Admin — layout con sidebar, subrutas como Outlet */}
      <Route path="/admin" element={
        <RoleRoute roles={['admin']}><AdminLayout /></RoleRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"     element={<AdminOverview />} />
        <Route path="businesses"   element={<AdminBusinesses />} />
        <Route path="users"        element={<AdminUsers />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
