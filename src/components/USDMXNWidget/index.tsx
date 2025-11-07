'use client'
import { useEffect, useRef, memo } from 'react'

function USDMXNWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    // Evita dobles montajes (React 18 StrictMode en dev)
    if (initialized.current) return
    initialized.current = true

    const container = containerRef.current
    if (!container) return

    const widgetHost =
      (container.querySelector('.tradingview-widget-container__widget') as HTMLDivElement) ??
      container

    // Limpia por si el usuario navegó y volvió
    widgetHost.innerHTML = ''

    // Crea el script EXACTO que espera TradingView: con src + innerHTML JSON
    const script = document.createElement('script')
    script.id = 'tv-usdmxn-single-quote' // útil si inspeccionas duplicados
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js'
    script.innerHTML = JSON.stringify({
      symbol: 'FX:USDMXN',
      colorTheme: 'light',
      isTransparent: false,
      locale: 'en',
      largeChartUrl: '',
    })

    widgetHost.appendChild(script)

    // Limpieza al desmontar (opcional pero recomendable)
    return () => {
      widgetHost.innerHTML = ''
      initialized.current = false
    }
  }, [])

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
    </div>
  )
}

export default memo(USDMXNWidget)
