import { TimelineBlockT } from '@/payload-types'

export function TimelineBlock({ events = [] }: TimelineBlockT) {
  if (!events?.length) return null
  return (
    <section className="my-10" aria-label="Cronología de eventos">
      <ol className="relative border-s border-neutral-300 dark:border-neutral-700 ps-6 space-y-6">
        {events.map((ev, i) => (
          <li key={i} className="ms-2">
            <span className="absolute -start-1.5 mt-1 size-3 rounded-full bg-current" aria-hidden />
            <header className="mb-1">
              <time dateTime={ev.date} className="text-sm font-medium opacity-80">
                {new Date(ev.date).toLocaleDateString()}
              </time>
              <h3 className="text-lg font-semibold">{ev.title}</h3>
            </header>
            {ev.summary && <p className="text-base opacity-90">{ev.summary}</p>}
          </li>
        ))}
      </ol>
    </section>
  )
}
