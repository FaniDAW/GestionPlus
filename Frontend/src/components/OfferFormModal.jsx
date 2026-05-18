import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const DISCOUNT_TYPES = [
  { value: 'percentage',        label: 'Porcentaje (%)' },
  { value: 'fixed',             label: 'Descuento fijo (€)' },
  { value: 'points_multiplier', label: 'Multiplicador de puntos' },
]

const roleToScope = {
  business_owner:    'individual',
  association_admin: 'group',
  admin:             'global',
}

export default function OfferFormModal({ offer, onSave, onClose }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    title:          '',
    description:    '',
    discount_type:  'percentage',
    discount_value: '',
    starts_at:      '',
    ends_at:        '',
    is_active:      true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (offer) {
      setForm({
        title:          offer.title          ?? '',
        description:    offer.description    ?? '',
        discount_type:  offer.discount_type  ?? 'percentage',
        discount_value: offer.discount_value ?? '',
        starts_at:      offer.starts_at      ?? '',
        ends_at:        offer.ends_at        ?? '',
        is_active:      offer.is_active      ?? true,
      })
    }
  }, [offer])

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const scope = roleToScope[user?.role] ?? 'individual'
    try {
      await onSave({ ...form, scope })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar la oferta.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-extrabold text-slate-800">
            {offer ? 'Editar oferta' : 'Nueva oferta'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Título</label>
            <input
              required
              value={form.title}
              onChange={set('title')}
              placeholder="Ej: 20% en toda la tienda"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Descripción</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={2}
              placeholder="Condiciones o detalles de la oferta..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo de descuento</label>
              <select
                value={form.discount_type}
                onChange={set('discount_type')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                {DISCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Valor {form.discount_type === 'percentage' ? '(%)' : form.discount_type === 'fixed' ? '(€)' : '(×)'}
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.discount_value}
                onChange={set('discount_value')}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fecha inicio</label>
              <input
                type="date"
                value={form.starts_at}
                onChange={set('starts_at')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fecha fin</label>
              <input
                type="date"
                value={form.ends_at}
                onChange={set('ends_at')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={set('is_active')}
              className="w-4 h-4 rounded accent-violet-500"
            />
            <span className="text-sm font-medium text-slate-700">Oferta activa</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-60"
            >
              {saving ? 'Guardando...' : offer ? 'Guardar cambios' : 'Crear oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
