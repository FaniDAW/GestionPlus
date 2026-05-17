import { useEffect, useState } from 'react'
import api from '../../lib/api'
import OfferFormModal from '../../components/OfferFormModal'
import ConfirmDialog from '../../components/ConfirmDialog'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function discountLabel(offer) {
  if (offer.discount_type === 'percentage') return `${offer.discount_value}%`
  if (offer.discount_type === 'fixed') return `${offer.discount_value} €`
  return `×${offer.discount_value}`
}

export default function BusinessOffers() {
  const [offers, setOffers]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [formOffer, setFormOffer]       = useState(undefined)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    api.get('/offers')
      .then((res) => setOffers(res.data.filter((o) => o.scope === 'individual')))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (payload) => {
    if (formOffer?.id) {
      const res = await api.patch(`/offers/${formOffer.id}`, payload)
      setOffers((prev) => prev.map((o) => o.id === formOffer.id ? res.data : o))
    } else {
      const res = await api.post('/offers', payload)
      setOffers((prev) => [...prev, res.data])
    }
    setFormOffer(undefined)
  }

  const handleDelete = async () => {
    await api.delete(`/offers/${deleteTarget.id}`)
    setOffers((prev) => prev.filter((o) => o.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Mis ofertas</h1>
          <p className="text-slate-500 text-sm mt-1">Ofertas individuales visibles para tus clientes</p>
        </div>
        <button
          onClick={() => setFormOffer(null)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva oferta
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Oferta</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descuento</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vigencia</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 4 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-24" />
                    </td>
                  ))}
                  <td className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-xl animate-pulse w-20" /></td>
                </tr>
              ))
            ) : offers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Aún no tienes ofertas. ¡Crea la primera!</p>
                </td>
              </tr>
            ) : (
              offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-violet-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{offer.title}</p>
                    {offer.description && (
                      <p className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{offer.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
                      {discountLabel(offer)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {formatDate(offer.starts_at)} → {formatDate(offer.ends_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      offer.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${offer.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {offer.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setFormOffer(offer)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(offer)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formOffer !== undefined && (
        <OfferFormModal offer={formOffer} onSave={handleSave} onClose={() => setFormOffer(undefined)} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        danger
        title="Eliminar oferta"
        message={`¿Eliminar "${deleteTarget?.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
