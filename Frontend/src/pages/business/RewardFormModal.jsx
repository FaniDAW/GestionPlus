import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function RewardFormModal({ reward, businessId, onSave, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (reward) {
      reset({
        name:            reward.name,
        description:     reward.description ?? '',
        points_required: reward.points_required,
        stock:           reward.stock ?? '',
        is_active:       reward.is_active,
        expires_at:      reward.expires_at ? reward.expires_at.split('T')[0] : '',
      })
    } else {
      reset({ name: '', description: '', points_required: '', stock: '', is_active: true, expires_at: '' })
    }
  }, [reward, reset])

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      business_id:     businessId,
      points_required: Number(data.points_required),
      stock:           data.stock !== '' ? Number(data.stock) : null,
      expires_at:      data.expires_at || null,
      is_active:       Boolean(data.is_active),
    }
    await onSave(payload)
  }

  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-violet-300 ${
      hasError
        ? 'border-red-300 bg-red-50 focus:ring-red-200'
        : 'border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white'
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="text-base font-extrabold text-slate-800">
            {reward ? 'Editar recompensa' : 'Nueva recompensa'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre</label>
            <input
              {...register('name', { required: 'El nombre es obligatorio' })}
              placeholder="Ej: Café gratis"
              className={inputClass(errors.name)}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descripción</label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Descripción opcional..."
              className={`${inputClass(false)} resize-none`}
            />
          </div>

          {/* Puntos y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Puntos requeridos</label>
              <input
                type="number"
                min="1"
                {...register('points_required', {
                  required: 'Obligatorio',
                  min: { value: 1, message: 'Mínimo 1' },
                })}
                placeholder="100"
                className={inputClass(errors.points_required)}
              />
              {errors.points_required && <p className="mt-1 text-xs text-red-500">{errors.points_required.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stock <span className="text-slate-400 font-normal">(opcional)</span></label>
              <input
                type="number"
                min="0"
                {...register('stock')}
                placeholder="Ilimitado"
                className={inputClass(false)}
              />
            </div>
          </div>

          {/* Fecha expiración */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha expiración <span className="text-slate-400 font-normal">(opcional)</span></label>
            <input
              type="date"
              {...register('expires_at')}
              className={inputClass(false)}
            />
          </div>

          {/* Activa */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="w-4 h-4 rounded accent-violet-500"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-slate-700">
              Recompensa activa
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-60"
            >
              {isSubmitting ? 'Guardando...' : reward ? 'Guardar cambios' : 'Crear recompensa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
