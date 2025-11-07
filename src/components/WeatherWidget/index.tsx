'use client'
import { useEffect, useRef, memo } from 'react'

type Props = {
  widgetId?: string
}

function WeatherWidget({ widgetId = 'ww_2ef2679d7b745' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    // Evita doble montaje en React 18 (StrictMode en dev)
    if (initialized.current) return
    initialized.current = true

    const el = containerRef.current
    if (!el) return

    // 1) Inyecta el HTML EXACTO del widget
    const markup = `
      <div id="${widgetId}" v="1.3" loc="auto"
        a='{"t":"responsive","lang":"es","sl_lpl":1,"ids":[],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"image","cl_font":"#FFFFFF","cl_cloud":"#FFFFFF","cl_persp":"#81D4FA","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722"}'>
        Más previsiones:
        <a href="https://tiempolargo.com/madrid_tiempo_25_dias/" id="${widgetId}_u" target="_blank" rel="noopener nofollow">
          Tiempo en madrid en 25 días
        </a>
      </div>
    `
    el.innerHTML = markup

    // 2) Inserta el script con el ?id= correcto (lo más cerca posible del target)
    const s = document.createElement('script')
    s.async = true
    s.src = `https://app3.weatherwidget.org/js/?id=${encodeURIComponent(widgetId)}`
    // coloca el script justo DESPUÉS del div objetivo
    const target = el.querySelector<HTMLElement>(`#${CSS.escape(widgetId)}`)
    if (target?.parentNode) {
      target.parentNode.insertBefore(s, target.nextSibling)
    } else {
      el.appendChild(s)
    }
    scriptRef.current = s

    // 3) Limpieza al desmontar/navegar
    return () => {
      // quita el script y el contenido generado
      scriptRef.current?.remove()
      scriptRef.current = null
      el.innerHTML = ''
      initialized.current = false
    }
  }, [widgetId])

  return <div ref={containerRef} />
}

export default memo(WeatherWidget)
