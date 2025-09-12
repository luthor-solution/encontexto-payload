import { EmbedBlockT } from '@/payload-types'

export function EmbedBlock({ provider = 'youtube', url, title }: EmbedBlockT) {
  // Mejora: render específico por provider si quieres controles distintos
  return (
    <section className="my-8" aria-label="Contenido embebido">
      <div className="aspect-video w-full overflow-hidden rounded-xl">
        <iframe
          src={url}
          title={title || 'Contenido embebido'}
          loading="lazy"
          className="h-full w-full"
          referrerPolicy="no-referrer-when-downgrade"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      {title && <p className="sr-only">{title}</p>}
    </section>
  )
}
