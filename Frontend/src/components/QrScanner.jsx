import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { NotFoundException } from '@zxing/library'

export default function QrScanner({ onScan }) {
  const videoRef = useRef(null)
  const [camError, setCamError] = useState('')

  useEffect(() => {
    let stopped = false
    let stream = null   // referencia al MediaStream, nunca pierde scope
    let controls = null // controles del decoder zxing

    const stop = () => {
      stopped = true
      try { controls?.stop() } catch {}
      try {
        stream?.getTracks().forEach((t) => t.stop())
        stream = null
      } catch {}
    }

    const start = async () => {
      try {
        // Obtener el stream directamente — así tenemos referencia fiable desde el principio
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })

        if (stopped) { stop(); return }

        const reader = new BrowserMultiFormatReader()
        controls = await reader.decodeFromStream(stream, videoRef.current, (result, err) => {
          if (stopped) return
          if (result) {
            stop()
            onScan(result.getText())
          }
          if (err && !(err instanceof NotFoundException)) {
            setCamError('No se pudo acceder a la cámara. Comprueba los permisos del navegador.')
            stop()
          }
        })

        if (stopped) stop()
      } catch {
        setCamError('No se pudo acceder a la cámara. Comprueba los permisos del navegador.')
      }
    }

    const onVisibility = () => { if (document.hidden) stop() }
    document.addEventListener('visibilitychange', onVisibility)

    start()

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      stop()
    }
  }, [onScan])

  if (camError) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-100 p-8 text-center">
        <svg className="w-12 h-12 text-red-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-red-600 font-medium">{camError}</p>
      </div>
    )
  }

  return (
    <div>
      <video
        ref={videoRef}
        className="rounded-2xl w-full bg-black"
        style={{ minHeight: '300px' }}
        muted
        playsInline
      />
      <p className="text-xs text-slate-400 text-center mt-3 flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Apunta la cámara hacia el QR del cliente
      </p>
    </div>
  )
}
