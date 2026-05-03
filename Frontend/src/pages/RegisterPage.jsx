import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '29',
    period: '/mes',
    description: 'Perfecto para empezar',
    color: 'border-slate-200',
    selectedColor: 'border-violet-400 bg-violet-50',
    badge: null,
    features: ['Hasta 500 clientes', 'Programa de puntos', '3 recompensas', 'Dashboard básico'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '79',
    period: '/mes',
    description: 'Para negocios en crecimiento',
    color: 'border-slate-200',
    selectedColor: 'border-violet-400 bg-violet-50',
    badge: 'Más popular',
    features: ['Clientes ilimitados', 'Puntos avanzados', 'Recompensas ilimitadas', 'Membresías', 'Analytics'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '199',
    period: '/mes',
    description: 'Para cadenas y franquicias',
    color: 'border-slate-200',
    selectedColor: 'border-violet-400 bg-violet-50',
    badge: null,
    features: ['Todo lo del Pro', 'Multi-negocio', 'API acceso', 'Manager dedicado'],
  },
]

const schema = z.object({
  name:             z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email:            z.string().min(1, 'El email es obligatorio').email('Email no válido'),
  phone:            z.string().regex(/^[+]?[\d\s\-().]{7,20}$/, 'Teléfono no válido').optional().or(z.literal('')),
  password:         z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  password_confirmation: z.string().min(1, 'Confirma tu contraseña'),
  terms:            z.boolean().refine((v) => v === true, 'Debes aceptar los términos'),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path:    ['password_confirmation'],
})

function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  )
}

function InputField({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      <FieldError message={error?.message} />
    </div>
  )
}

export default function RegisterPage() {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const [step, setStep]             = useState(1)
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [serverError, setServerError]   = useState('')
  const [loadingCheckout, setLoadingCheckout] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: 'onTouched' })

  const password = watch('password', '')

  const passwordStrength = () => {
    let score = 0
    if (password.length >= 8)         score++
    if (/[A-Z]/.test(password))       score++
    if (/[a-z]/.test(password))       score++
    if (/[0-9]/.test(password))       score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const strengthLabel = ['', 'Muy débil', 'Débil', 'Regular', 'Buena', 'Excelente']
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-500']

  const goToStep2 = async () => {
    const ok = await trigger(['name', 'email', 'phone', 'password', 'password_confirmation', 'terms'])
    if (ok) setStep(2)
  }

  const onSubmit = async (data) => {
    setServerError('')
    try {
      await authRegister({
        name:     data.name,
        email:    data.email,
        phone:    data.phone || undefined,
        password: data.password,
        password_confirmation: data.password_confirmation,
      })

      setLoadingCheckout(true)
      const res = await api.post('/stripe/checkout', { plan: selectedPlan })
      window.location.href = res.data.checkout_url
    } catch (err) {
      setServerError(err.response?.data?.message || 'Error al crear la cuenta. Inténtalo de nuevo.')
      setStep(1)
      setLoadingCheckout(false)
    }
  }

  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-violet-300 ${
      hasError
        ? 'border-red-300 bg-red-50 focus:ring-red-200'
        : 'border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white'
    }`

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-0 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-200">
              <span className="text-white font-black text-lg">G</span>
            </div>
            <span className="text-2xl font-black text-violet-800">Gestion+</span>
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-slate-800">Crea tu cuenta gratis</h1>
          <p className="text-slate-500 mt-1 text-sm">14 días de prueba. Sin tarjeta de crédito.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s
                  ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-md shadow-violet-200'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? 'text-violet-700' : 'text-slate-400'}`}>
                {s === 1 ? 'Tus datos' : 'Elige tu plan'}
              </span>
              {s < 2 && <div className={`w-12 h-0.5 ${step > s ? 'bg-violet-400' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-violet-100 border border-violet-50 p-8">
          {serverError && (
            <div className="mb-5 flex items-center gap-3 bg-red-50 text-red-700 border border-red-100 rounded-2xl px-4 py-3 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* ── STEP 1: datos personales ── */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="Nombre completo" error={errors.name}>
                    <input
                      type="text"
                      placeholder="Ana García"
                      autoComplete="name"
                      {...register('name')}
                      className={inputClass(errors.name)}
                    />
                  </InputField>

                  <InputField label="Teléfono (opcional)" error={errors.phone}>
                    <input
                      type="tel"
                      placeholder="+34 600 000 000"
                      autoComplete="tel"
                      {...register('phone')}
                      className={inputClass(errors.phone)}
                    />
                  </InputField>
                </div>

                <InputField label="Email" error={errors.email}>
                  <input
                    type="email"
                    placeholder="tu@negocio.com"
                    autoComplete="email"
                    {...register('email')}
                    className={inputClass(errors.email)}
                  />
                </InputField>

                <InputField label="Contraseña" error={errors.password}>
                  <input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    {...register('password')}
                    className={inputClass(errors.password)}
                  />
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              i <= passwordStrength() ? strengthColor[passwordStrength()] : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">
                        Seguridad: <span className="font-semibold">{strengthLabel[passwordStrength()]}</span>
                      </p>
                    </div>
                  )}
                </InputField>

                <InputField label="Confirmar contraseña" error={errors.password_confirmation}>
                  <input
                    type="password"
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    {...register('password_confirmation')}
                    className={inputClass(errors.password_confirmation)}
                  />
                </InputField>

                {/* Términos */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('terms')}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-400"
                    />
                    <span className="text-sm text-slate-600">
                      Acepto los{' '}
                      <a href="#" className="text-violet-600 hover:underline font-medium">términos de uso</a>
                      {' '}y la{' '}
                      <a href="#" className="text-violet-600 hover:underline font-medium">política de privacidad</a>
                    </span>
                  </label>
                  <FieldError message={errors.terms?.message} />
                </div>

                <button
                  type="button"
                  onClick={goToStep2}
                  className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all flex items-center justify-center gap-2"
                >
                  Continuar — elegir plan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* ── STEP 2: elige plan ── */}
            {step === 2 && (
              <div>
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative text-left rounded-2xl border-2 p-4 transition-all ${
                        selectedPlan === plan.id ? plan.selectedColor : plan.color + ' hover:border-violet-200'
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-slate-800">{plan.name}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedPlan === plan.id ? 'border-violet-500 bg-violet-500' : 'border-slate-300'
                        }`}>
                          {selectedPlan === plan.id && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className="mb-2">
                        <span className="text-2xl font-black text-slate-800">€{plan.price}</span>
                        <span className="text-xs text-slate-400">{plan.period}</span>
                      </div>

                      <p className="text-xs text-slate-500 mb-3">{plan.description}</p>

                      <ul className="space-y-1.5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                            <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-violet-300 hover:text-violet-600 transition-all"
                  >
                    ← Volver
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || loadingCheckout}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting || loadingCheckout ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      <>
                        Crear cuenta y pagar con Stripe
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-400 mt-4">
                  🔒 Pago seguro con Stripe · Cancela cuando quieras · 14 días de prueba gratis
                </p>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
