'use client'
import { useId } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Item = { type: 'category'; label: string; href: string; count?: number; newTab?: never }

export default function CategoryMenuClient({ items }: { items: Item[] }) {
  const pathname = usePathname()
  const reactId = useId()
  const ulId = `menu-1-${reactId.replace(/[:]/g, '')}`

  const isActive = (href: string, type: Item['type']) => {
    if (!pathname) return false
    return pathname.startsWith(href)
  }

  return (
    <nav aria-label={'Menu'} className={'border-b-2 border-solid pb-2 w-full'}>
      <div id={ulId} className="flex justify-evenly">
        {items.map((it, idx) => {
          const active = isActive(it.href, it.type)
          const liTypeClass =
            it.type === 'category'
              ? 'menu-item-type-taxonomy menu-item-object-category'
              : 'menu-item-type-custom menu-item-object-custom'
          const linkClass = `elementor-item menu-link${active ? ' elementor-item-active' : ''}`

          return (
            <div
              key={idx}
              className={`menu-item ${liTypeClass} menu-item-${idx} hover:bg-blue-400/50`}
            >
              <Link
                href={it.href}
                className={linkClass}
                {...(it.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {it.label}
                {'count' in it && typeof it.count === 'number' ? (
                  <span className="ml-1 opacity-70">({it.count})</span>
                ) : null}
              </Link>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
