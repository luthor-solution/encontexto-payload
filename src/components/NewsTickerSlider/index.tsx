'use client'
import { useEffect, useMemo, useRef, useState, memo } from 'react'

export type NewsItem = { title: string; url: string }

type Props = {
  items: NewsItem[]
  autoplayMs?: number
  ariaLabel?: string
  pauseOnHover?: boolean
}

function clampIndex(i: number, len: number) {
  if (len === 0) return 0
  return ((i % len) + len) % len
}

function NewsTickerSlider({
  items,
  autoplayMs = 4000,
  ariaLabel = 'Últimas noticias',
  pauseOnHover = true,
}: Props) {
  const data = useMemo(() => items.slice(0, 12), [items])
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1) // 1: derecha, -1: izquierda
  const timerRef = useRef<number | null>(null)
  const hoverRef = useRef(false)
  const liveRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (data.length <= 1) return
    const tick = () => {
      if (!hoverRef.current) {
        setDir(1)
        setIndex((i) => clampIndex(i + 1, data.length))
      }
    }
    timerRef.current = window.setInterval(tick, autoplayMs)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [autoplayMs, data.length])

  useEffect(() => {
    if (liveRef.current) liveRef.current.textContent = data[index]?.title ?? ''
  }, [index, data])

  const goPrev = () => {
    setDir(-1)
    setIndex((i) => clampIndex(i - 1, data.length))
  }
  const goNext = () => {
    setDir(1)
    setIndex((i) => clampIndex(i + 1, data.length))
  }

  if (data.length === 0) return null

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => {
        if (pauseOnHover) hoverRef.current = true
      }}
      onMouseLeave={() => {
        if (pauseOnHover) hoverRef.current = false
      }}
      className="grid grid-cols-[auto,1fr,auto] items-center gap-x-3 gap-y-2 rounded-lg border border-black/10 bg-white p-3"
    >
      {/* Título */}
      <div className="hidden md:block col-start-1 row-start-1 font-bold text-sm whitespace-nowrap bg-red-500 text-white p-1">
        Últimas Noticias
      </div>

      {/* Viewport */}
      <div className="relative col-start-2 row-start-1 h-7 overflow-hidden">
        {data.map((item, i) => {
          const isActive = i === index
          const base =
            'absolute inset-0 flex items-center text-inherit no-underline transition-all duration-300 ease-out motion-reduce:transition-none'
          const active = 'opacity-100 translate-x-0 blur-0 pointer-events-auto z-10'
          const exitRight = 'opacity-0 -translate-x-4 blur-[2px] pointer-events-none'
          const exitLeft = 'opacity-0 translate-x-4 blur-[2px] pointer-events-none'

          return (
            <a
              key={i}
              href={item.url}
              title={item.title}
              tabIndex={isActive ? 0 : -1}
              aria-current={isActive ? 'true' : undefined}
              className={[
                base,
                isActive ? active : dir === 1 ? exitRight : exitLeft,
                // padding derecha para no tapar con botones
                'pr-16',
              ].join(' ')}
            >
              <h3
                className="m-0 text-base font-semibold leading-7 truncate whitespace-nowrap overflow-hidden text-ellipsis"
                title={item.title}
              >
                {item.title}
              </h3>
            </a>
          )
        })}
        {/* Desvanecido a la derecha */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-r from-transparent to-white dark:to-neutral-900"
        />
      </div>

      {/* Controles (lado derecho, vertical) */}
      <div
        className="col-start-3 row-start-1 flex h-full items-center justify-center gap-1"
        aria-label="Controles del carrusel"
      >
        <button
          type="button"
          onClick={goPrev}
          aria-label="Anterior"
          className="inline-grid h-7 w-7 place-items-center rounded-full bg-black/10 text-base hover:bg-black/20 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-500"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Siguiente"
          className="inline-grid h-7 w-7 place-items-center rounded-full bg-black/10 text-base hover:bg-black/20 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-500"
        >
          ›
        </button>
      </div>

      {/* Live region para lectores de pantalla */}
      <div ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
    </div>
  )
}

export default memo(NewsTickerSlider)
