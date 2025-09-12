import { FactsListBlockT } from '@/payload-types'

export function FactsListBlock({ heading = 'Lo clave en 30s', items = [] }: FactsListBlockT) {
  if (!items?.length) return null
  return (
    <section className="my-8" aria-label="Claves rápidas">
      <h2 className="text-xl md:text-2xl font-semibold mb-3">{heading}</h2>
      <ul className="list-disc pl-6 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="leading-relaxed">
            {it.text}
          </li>
        ))}
      </ul>
    </section>
  )
}
