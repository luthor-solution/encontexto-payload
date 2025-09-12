import { HeroBlockT, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { isObj } from '@/utilities/isObj'
import { mediaUrl } from '@/utilities/mediaUrl'
import clsx from 'clsx'

export function HeroBlock(props: HeroBlockT) {
  const {
    overline,
    title,
    subtitle,
    mediaType = 'image',
    image,
    video,
    videoUrl,
    align = 'left',
    darkOverlay,
  } = props

  return (
    <header
      className={clsx(
        'relative w-full mb-8 rounded-2xl overflow-hidden',
        mediaType === 'image' ? 'aspect-[16/9]' : '',
      )}
      aria-label="Cabecera de la nota"
    >
      {/* Fondo multimedia */}
      {mediaType === 'image' && (
        <figure className="h-full w-full">
          {/* Usa <img> por SEO de imágenes y compatibilidad sencilla */}
          <img
            src={isObj(image) ? mediaUrl(image as Media) : undefined}
            alt={isObj(image) ? (image as Media).alt || title : title}
            className="h-full w-full object-cover"
            loading="eager"
          />
          {subtitle && <meta itemProp="description" content={subtitle} />}
        </figure>
      )}

      {mediaType === 'video' && (
        <figure className="h-full w-full">
          <video
            className="h-full w-full object-cover"
            controls
            preload="metadata"
            aria-label={title}
          >
            <source src={isObj(video) ? mediaUrl(video as Media) : undefined} />
          </video>
        </figure>
      )}

      {mediaType === 'videoUrl' && videoUrl && (
        <figure className="h-full w-full">
          <iframe
            title={title}
            src={videoUrl}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </figure>
      )}

      {/* Overlay y texto */}
      <div
        className={clsx(
          'absolute inset-0 p-6 md:p-10 flex',
          align === 'center'
            ? 'items-center justify-center text-center'
            : 'items-end justify-start',
          darkOverlay
            ? 'bg-gradient-to-t from-black/60 via-black/20 to-transparent text-white'
            : '',
        )}
      >
        <div className="max-w-4xl w-full">
          {overline && (
            <p
              className="uppercase tracking-wider text-sm md:text-base opacity-90"
              aria-label="Sección"
            >
              {overline}
            </p>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{title}</h1>
          {subtitle && <p className="mt-3 text-base md:text-lg opacity-95">{subtitle}</p>}
        </div>
      </div>
    </header>
  )
}
