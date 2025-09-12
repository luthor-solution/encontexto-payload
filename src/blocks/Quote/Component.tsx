import { QuoteBlockT } from '@/payload-types'
import clsx from 'clsx'

export function QuoteBlock({ text, author, source, emphasis = true }: QuoteBlockT) {
  return (
    <aside className="my-8" aria-label="Cita destacada">
      <figure
        className={clsx('border-l-4 pl-4', emphasis ? 'border-current' : 'border-neutral-300')}
      >
        <blockquote className="text-xl md:text-2xl leading-relaxed font-medium">
          “{text}”
        </blockquote>
        {(author || source) && (
          <figcaption className="mt-2 text-sm opacity-80">
            {author && <cite className="not-italic font-semibold">{author}</cite>}
            {author && source && ' · '}
            {source && <span>{source}</span>}
          </figcaption>
        )}
      </figure>
    </aside>
  )
}
