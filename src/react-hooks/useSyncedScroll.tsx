import { useEffect, useRef } from 'react'

function clampScroll(el: HTMLElement, dy: number) {
  const max = el.scrollHeight - el.clientHeight
  if (max <= 0) return 0
  const before = el.scrollTop
  let next = before + dy
  if (next < 0) next = 0
  if (next > max) next = max
  el.scrollTop = next
  return next - before
}

export function useSyncedScroll() {
  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const left = leftRef.current
    const right = rightRef.current
    const container = containerRef.current
    if (!left || !right || !container) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const dy = e.deltaY
      clampScroll(left, dy)
      clampScroll(right, dy)
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', onWheel)
    }
  }, [])

  return { containerRef, leftRef, rightRef }
}
